import React, { useEffect, useState } from 'react';
import { Plus, ClipboardList, Clock, X } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function TeacherQuizzes() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', classroom_id: '', time_limit_minutes: 30, total_marks: 100, passing_marks: 50, status: 'draft' });

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    const [qRes, cRes] = await Promise.all([
      supabase.from('quizzes').select('*').eq('teacher_id', user!.id).order('created_at', { ascending: false }),
      supabase.from('classrooms').select('id, name').eq('teacher_id', user!.id),
    ]);
    setQuizzes(qRes.data ?? []);
    setClassrooms(cRes.data ?? []);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('quizzes').insert({ ...form, teacher_id: user!.id });
    setSaving(false);
    setShowModal(false);
    setForm({ title: '', description: '', classroom_id: '', time_limit_minutes: 30, total_marks: 100, passing_marks: 50, status: 'draft' });
    loadData();
  };

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quizzes</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Create and manage quizzes for your students.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary gap-2 text-sm">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Quiz</span>
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
          </div>
        ) : quizzes.length === 0 ? (
          <div className="card p-16 text-center">
            <ClipboardList className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No quizzes yet. Create your first quiz!</p>
            <button onClick={() => setShowModal(true)} className="btn-primary gap-2">
              <Plus className="w-4 h-4" />Create Quiz
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {quizzes.map(q => (
              <div key={q.id} className="card p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className={`badge text-xs ${q.status === 'active' ? 'badge-green' : q.status === 'closed' ? 'badge-gray' : 'badge-gold'}`}>
                    {q.status}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{q.title}</h3>
                {q.description && <p className="text-gray-500 dark:text-gray-400 text-xs mb-3 line-clamp-2">{q.description}</p>}
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{q.time_limit_minutes} min</span>
                  <span>{q.total_marks} marks</span>
                  <span>Pass: {q.passing_marks}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-md p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">New Quiz</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="label">Quiz Title</label>
                <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="e.g., Islamic Studies Quiz 1" />
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
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label">Time Limit (min)</label>
                  <input type="number" value={form.time_limit_minutes} onChange={e => setForm({ ...form, time_limit_minutes: parseInt(e.target.value) })} className="input-field" min={5} />
                </div>
                <div>
                  <label className="label">Total Marks</label>
                  <input type="number" value={form.total_marks} onChange={e => setForm({ ...form, total_marks: parseInt(e.target.value) })} className="input-field" min={1} />
                </div>
                <div>
                  <label className="label">Pass Marks</label>
                  <input type="number" value={form.passing_marks} onChange={e => setForm({ ...form, passing_marks: parseInt(e.target.value) })} className="input-field" min={1} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 gap-2">
                  {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Creating...</> : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
