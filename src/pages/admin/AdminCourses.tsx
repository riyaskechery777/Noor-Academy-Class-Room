import React, { useEffect, useState } from 'react';
import { Plus, BookOpen, Users, X } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', teacher_id: '', level: 'beginner', category: 'general', is_free: true, price: 0, duration_hours: 0 });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [cRes, tRes] = await Promise.all([
      supabase.from('courses').select('*, profiles!courses_teacher_id_fkey(full_name)').order('created_at', { ascending: false }),
      supabase.from('profiles').select('id, full_name').eq('role', 'teacher').eq('approved', true),
    ]);
    setCourses(cRes.data ?? []);
    setTeachers(tRes.data ?? []);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('courses').insert(form);
    setSaving(false);
    setShowModal(false);
    setForm({ title: '', description: '', teacher_id: '', level: 'beginner', category: 'general', is_free: true, price: 0, duration_hours: 0 });
    loadData();
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Courses</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{courses.length} courses in the catalog.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary gap-2 text-sm">
            <Plus className="w-4 h-4" /><span className="hidden sm:inline">Add Course</span>
          </button>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3].map(i => <div key={i} className="h-36 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
          </div>
        ) : courses.length === 0 ? (
          <div className="card p-16 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No courses created yet.</p>
            <button onClick={() => setShowModal(true)} className="btn-primary gap-2"><Plus className="w-4 h-4" />Add First Course</button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map(c => (
              <div key={c.id} className="card p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className={`badge text-xs ${c.is_free ? 'badge-green' : 'badge-gold'}`}>{c.is_free ? 'Free' : `$${c.price}`}</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{c.title}</h3>
                {c.description && <p className="text-gray-500 dark:text-gray-400 text-xs mb-3 line-clamp-2">{c.description}</p>}
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{c.enrolled_count}</span>
                  <span className="capitalize">{c.level}</span>
                  {c.profiles?.full_name && <span>by {c.profiles.full_name}</span>}
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Course</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="label">Course Title</label>
                <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field resize-none" rows={3} />
              </div>
              <div>
                <label className="label">Assign Teacher</label>
                <select value={form.teacher_id} onChange={e => setForm({ ...form, teacher_id: e.target.value })} className="input-field">
                  <option value="">Select teacher</option>
                  {teachers.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Level</label>
                  <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} className="input-field">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="label">Category</label>
                  <input type="text" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field" placeholder="e.g., Quran" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Duration (hours)</label>
                  <input type="number" value={form.duration_hours} onChange={e => setForm({ ...form, duration_hours: parseInt(e.target.value) })} className="input-field" min={0} />
                </div>
                <div>
                  {!form.is_free && (
                    <>
                      <label className="label">Price ($)</label>
                      <input type="number" value={form.price} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })} className="input-field" min={0} step={0.01} />
                    </>
                  )}
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <div onClick={() => setForm({ ...form, is_free: !form.is_free })}
                  className={`w-10 h-6 rounded-full transition-colors ${form.is_free ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'} relative cursor-pointer`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.is_free ? 'translate-x-4' : ''}`} />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Free Course</span>
              </label>
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
