import React, { useEffect, useState } from 'react';
import { Plus, FileText, Download, X } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function TeacherNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', classroom_id: '', file_url: '', file_type: 'pdf', is_downloadable: true });

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    const [notesRes, classroomsRes] = await Promise.all([
      supabase.from('notes').select('*').eq('teacher_id', user!.id).order('created_at', { ascending: false }),
      supabase.from('classrooms').select('id, name').eq('teacher_id', user!.id),
    ]);
    setNotes(notesRes.data ?? []);
    setClassrooms(classroomsRes.data ?? []);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('notes').insert({ ...form, teacher_id: user!.id });
    setSaving(false);
    setShowModal(false);
    setForm({ title: '', description: '', classroom_id: '', file_url: '', file_type: 'pdf', is_downloadable: true });
    loadData();
  };

  const fileTypeColors: Record<string, string> = {
    pdf: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    doc: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    ppt: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
    video: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  };

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notes & Materials</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Upload study materials for your students.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary gap-2 text-sm">
            <Plus className="w-4 h-4" /><span className="hidden sm:inline">Upload Notes</span>
          </button>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
          </div>
        ) : notes.length === 0 ? (
          <div className="card p-16 text-center">
            <FileText className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No notes uploaded yet.</p>
            <button onClick={() => setShowModal(true)} className="btn-primary gap-2"><Plus className="w-4 h-4" />Upload First Notes</button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map(note => (
              <div key={note.id} className="card p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${fileTypeColors[note.file_type] ?? 'bg-gray-50 dark:bg-gray-800 text-gray-500'}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{note.title}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">{note.file_type}</span>
                  </div>
                </div>
                {note.description && <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-2 mb-3">{note.description}</p>}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{new Date(note.created_at).toLocaleDateString()}</span>
                  {note.is_downloadable && note.file_url && (
                    <a href={note.file_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
                      <Download className="w-3.5 h-3.5" />Download
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-md p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upload Notes</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="label">Title</label>
                <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="e.g., Tajweed Rules - Chapter 3" />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field resize-none" rows={2} />
              </div>
              {classrooms.length > 0 && (
                <div>
                  <label className="label">Classroom</label>
                  <select value={form.classroom_id} onChange={e => setForm({ ...form, classroom_id: e.target.value })} className="input-field">
                    <option value="">Select classroom</option>
                    {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="label">File URL (Google Drive, Dropbox, etc.)</label>
                <input type="url" value={form.file_url} onChange={e => setForm({ ...form, file_url: e.target.value })} className="input-field" placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">File Type</label>
                  <select value={form.file_type} onChange={e => setForm({ ...form, file_type: e.target.value })} className="input-field">
                    <option value="pdf">PDF</option>
                    <option value="doc">DOC/Word</option>
                    <option value="ppt">PPT</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div onClick={() => setForm({ ...form, is_downloadable: !form.is_downloadable })}
                      className={`w-10 h-6 rounded-full transition-colors ${form.is_downloadable ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'} relative cursor-pointer`}>
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.is_downloadable ? 'translate-x-4' : ''}`} />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Downloadable</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 gap-2">
                  {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Uploading...</> : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
