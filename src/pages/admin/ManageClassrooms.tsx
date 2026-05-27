import React, { useEffect, useState } from 'react';
import { Plus, BookOpen, Edit, Search, Users } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function ManageClassrooms() {
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', teacher_id: '', max_students: 30 });
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [classroomsRes, teachersRes] = await Promise.all([
      supabase.from('classrooms').select('*, profiles!classrooms_teacher_id_fkey(full_name)').order('created_at', { ascending: false }),
      supabase.from('profiles').select('id, full_name').eq('role', 'teacher').eq('approved', true),
    ]);
    setClassrooms(classroomsRes.data ?? []);
    setTeachers(teachersRes.data ?? []);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('classrooms').insert({
      ...form,
      created_by: user?.id,
    });
    setSaving(false);
    setShowModal(false);
    setForm({ name: '', description: '', teacher_id: '', max_students: 30 });
    loadData();
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Classrooms</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{classrooms.length} classrooms created.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary gap-2 text-sm">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Classroom</span>
          </button>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3].map(i => <div key={i} className="h-36 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
          </div>
        ) : classrooms.length === 0 ? (
          <div className="card p-16 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No classrooms created yet.</p>
            <button onClick={() => setShowModal(true)} className="btn-primary gap-2">
              <Plus className="w-4 h-4" />Create Your First Classroom
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {classrooms.map(room => (
              <div key={room.id} className="card p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className={`badge text-xs ${room.status === 'active' ? 'badge-green' : 'badge-gray'}`}>
                    {room.status}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{room.name}</h3>
                {room.description && <p className="text-gray-500 dark:text-gray-400 text-xs mb-3 line-clamp-2">{room.description}</p>}
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />Max {room.max_students}</span>
                  {room.profiles?.full_name && <span>by {room.profiles.full_name}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-md p-6 animate-scale-in">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Create Classroom</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="label">Classroom Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Quran Studies - Level 1"
                />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="input-field resize-none"
                  rows={3}
                  placeholder="Classroom description..."
                />
              </div>
              <div>
                <label className="label">Assign Teacher</label>
                <select
                  value={form.teacher_id}
                  onChange={e => setForm({ ...form, teacher_id: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select a teacher</option>
                  {teachers.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Max Students</label>
                <input
                  type="number"
                  value={form.max_students}
                  onChange={e => setForm({ ...form, max_students: parseInt(e.target.value) })}
                  className="input-field"
                  min={1}
                  max={100}
                />
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
