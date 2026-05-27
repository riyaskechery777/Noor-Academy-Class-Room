import React, { useEffect, useState } from 'react';
import { Send, MessageCircle, Search } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function TeacherMessages() {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    const [msgsRes, studentsRes] = await Promise.all([
      supabase.from('messages').select('*, sender:profiles!messages_sender_id_fkey(full_name), receiver:profiles!messages_receiver_id_fkey(full_name)').or(`sender_id.eq.${user!.id},receiver_id.eq.${user!.id}`).order('created_at'),
      supabase.from('profiles').select('id, full_name, email').eq('role', 'student').limit(30),
    ]);
    setMessages(msgsRes.data ?? []);
    setStudents(studentsRes.data ?? []);
    setLoading(false);
  };

  const getConversation = (otherId: string) =>
    messages.filter(m => (m.sender_id === user!.id && m.receiver_id === otherId) || (m.sender_id === otherId && m.receiver_id === user!.id));

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim() || !selected) return;
    setSending(true);
    await supabase.from('messages').insert({
      sender_id: user!.id,
      receiver_id: selected.id,
      content: newMsg.trim(),
    });
    setSending(false);
    setNewMsg('');
    loadData();
  };

  const filteredStudents = students.filter(s =>
    s.full_name.toLowerCase().includes(search.toLowerCase())
  );

  const conversation = selected ? getConversation(selected.id) : [];

  return (
    <DashboardLayout role="teacher">
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Chat with your students.</p>
        </div>
        <div className="flex-1 flex gap-4 min-h-0">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0 card p-3 flex flex-col">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input type="text" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 py-2 text-sm" />
            </div>
            <div className="flex-1 overflow-y-auto space-y-1">
              {filteredStudents.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-colors ${selected?.id === s.id ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                >
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {s.full_name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${selected?.id === s.id ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-900 dark:text-white'}`}>
                      {s.full_name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 card flex flex-col min-w-0">
            {!selected ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">Select a student to start chatting</p>
                </div>
              </div>
            ) : (
              <>
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                  <div className="w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {selected.full_name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{selected.full_name}</p>
                    <p className="text-gray-400 text-xs">Student</p>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {conversation.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-8">No messages yet. Start the conversation!</p>
                  ) : (
                    conversation.map(m => (
                      <div key={m.id} className={`flex ${m.sender_id === user!.id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-sm px-4 py-2.5 rounded-2xl text-sm ${
                          m.sender_id === user!.id
                            ? 'bg-emerald-600 text-white rounded-br-sm'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm'
                        }`}>
                          {m.content}
                          <p className={`text-xs mt-1 ${m.sender_id === user!.id ? 'text-emerald-200' : 'text-gray-400'}`}>
                            {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <form onSubmit={sendMessage} className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
                  <input
                    type="text"
                    value={newMsg}
                    onChange={e => setNewMsg(e.target.value)}
                    placeholder="Type a message..."
                    className="input-field flex-1 py-2.5"
                  />
                  <button type="submit" disabled={sending || !newMsg.trim()} className="btn-primary px-4 py-2.5">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
