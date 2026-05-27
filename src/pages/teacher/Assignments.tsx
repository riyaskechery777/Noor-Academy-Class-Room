import React, { useEffect, useState } from 'react';
import { Plus, FileText, Clock, X, ChevronDown } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function TeacherAssignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', classroom_id: '', due_date: '', max_score: 100, status: 'active' });

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    const [assignRes, classroomsRes] = await Promise.all([
      supabase.from('assignments').select('*').eq('teacher_id', user!.id).order('created_at', { ascending: false }),
      supabase.from('classrooms').select('id, name').eq('teacher_id', user!.id),
    ]);
    setAssignments(assignRes.data ?? []);
    setClassrooms(classroomsRes.data ?? []);

    if (assignRes.data && assignRes.data.length > 0) {
      const counts: Record<string, number> = {};
      await Promise.all(assignRes.data.map(async a => {
        const { count } = await supabase
          .from('assignment_submissions')
          .select('id', { count: 'exact' })
          .eq('assignment_id', a.id);
        counts[a.id] = count ?? 0;
      }));
      setSubmissions(counts);
    }
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('assignments').insert({ ...form, teacher_id: user!.id });
    setSaving(false);
    setShowModal(false);
    setForm({ title: '', description: '', classroom_id: '', due_date: '', max_score: 100, status: 'active' });
    loadData();
  };

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assignments</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Create and manage student assignments.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary gap-2 text-sm">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Assignment</span>
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
          </div>
        ) : assignments.length === 0 ? (
          <div className="card p-16 text-center">
            <FileText className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No assignments created yet.</p>
            <button onClick={() => setShowModal(true)} className="btn-primary gap-2">
              <Plus className="w-4 h-4" />Create First Assignment
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map(a => (
              <div key={a.id} className="card p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{a.title}</h3>
                      <span className={`badge text-xs ${a.status === 'active' ? 'badge-green' : a.status === 'closed' ? 'badge-gray' : 'badge-gold'}`}>
                        {a.status}
                      </span>
                    </div>
                    {a.description && <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 line-clamp-2">{a.description}</p>}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Due: {a.due_date ? new Date(a.due_date).toLocaleDateString() : 'No deadline'}
                      </span>
                      <span>Max Score: {a.max_score}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        {submissions[a.id] ?? 0} submissions
                      </span>
                    </div>
                  </div>
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">New Assignment</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="label">Assignment Title</label>
                <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="e.g., Quran Memorization - Surah Al-Baqarah" />
              </div>
              <div>
                <label className="label">Instructions</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field resize-none" rows={3} placeholder="Describe the assignment requirements..." />
              </div>
              {classrooms.length > 0 && (
                <div>
                  <label className="label">Classroom</label>
                  <select value={form.classroom_id} onChange={e => setForm({ ...form, classroom_id: e.target.value })} className="input-field">
                    <option value="">Select classroom (optional)</option>
                    {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Due Date</label>
                  <input type="datetime-local" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="label">Max Score</label>
                  <input type="number" value={form.max_score} onChange={e => setForm({ ...form, max_score: parseInt(e.target.value) })} className="input-field" min={1} max={1000} />
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
