import React, { useEffect, useState } from 'react';
import { Plus, Bell, Trash2, Globe } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function ManageAnnouncements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', is_global: true, priority: 'normal' });
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => { loadAnnouncements(); }, []);

  const loadAnnouncements = async () => {
    const { data } = await supabase
      .from('announcements')
      .select('*, profiles!announcements_author_id_fkey(full_name)')
      .order('created_at', { ascending: false });
    setAnnouncements(data ?? []);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('announcements').insert({ ...form, author_id: user?.id });
    setSaving(false);
    setShowModal(false);
    setForm({ title: '', content: '', is_global: true, priority: 'normal' });
    loadAnnouncements();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('announcements').delete().eq('id', id);
    loadAnnouncements();
  };

  const priorityColors: Record<string, string> = {
    low: 'badge-gray',
    normal: 'badge-blue',
    high: 'badge-gold',
    urgent: 'badge-red',
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Announcements</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Post announcements for the school community.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary gap-2 text-sm">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Announcement</span>
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
          </div>
        ) : announcements.length === 0 ? (
          <div className="card p-16 text-center">
            <Bell className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No announcements yet.</p>
            <button onClick={() => setShowModal(true)} className="btn-primary gap-2">
              <Plus className="w-4 h-4" />Post First Announcement
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map(ann => (
              <div key={ann.id} className="card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{ann.title}</h3>
                      <span className={`badge text-xs ${priorityColors[ann.priority]}`}>{ann.priority}</span>
                      {ann.is_global && (
                        <span className="badge badge-green text-xs flex items-center gap-1">
                          <Globe className="w-2.5 h-2.5" />Global
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{ann.content}</p>
                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
                      By {ann.profiles?.full_name} • {new Date(ann.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(ann.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-md p-6 animate-scale-in">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">New Announcement</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="label">Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="input-field"
                  placeholder="Announcement title"
                />
              </div>
              <div>
                <label className="label">Content</label>
                <textarea
                  required
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  className="input-field resize-none"
                  rows={4}
                  placeholder="Write the announcement..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Priority</label>
                  <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="input-field">
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => setForm({ ...form, is_global: !form.is_global })}
                      className={`w-10 h-5.5 h-6 rounded-full transition-colors ${form.is_global ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'} relative cursor-pointer`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.is_global ? 'translate-x-4' : ''}`} />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Global</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 gap-2">
                  {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Posting...</> : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
