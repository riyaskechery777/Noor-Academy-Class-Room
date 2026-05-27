import React, { useEffect, useState } from 'react';
import { Plus, Video, ExternalLink, Clock, Calendar, Edit2, X } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function TeacherLiveClasses() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', classroom_id: '', meet_link: '',
    scheduled_at: '', duration_minutes: 60,
  });

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    const [classesRes, classroomsRes] = await Promise.all([
      supabase.from('live_classes').select('*').eq('teacher_id', user!.id).order('scheduled_at', { ascending: false }),
      supabase.from('classrooms').select('id, name').eq('teacher_id', user!.id),
    ]);
    setClasses(classesRes.data ?? []);
    setClassrooms(classroomsRes.data ?? []);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('live_classes').insert({ ...form, teacher_id: user!.id });
    setSaving(false);
    setShowModal(false);
    setForm({ title: '', description: '', classroom_id: '', meet_link: '', scheduled_at: '', duration_minutes: 60 });
    loadData();
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('live_classes').update({ status }).eq('id', id);
    loadData();
  };

  const statusConfig: Record<string, { color: string; label: string }> = {
    scheduled: { color: 'badge-blue', label: 'Scheduled' },
    live: { color: 'bg-red-500 text-white animate-pulse', label: 'LIVE' },
    ended: { color: 'badge-gray', label: 'Ended' },
    cancelled: { color: 'badge-red', label: 'Cancelled' },
  };

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Live Classes</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Schedule and manage your live sessions.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary gap-2 text-sm">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Schedule Class</span>
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-28 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
          </div>
        ) : classes.length === 0 ? (
          <div className="card p-16 text-center">
            <Video className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No live classes scheduled yet.</p>
            <button onClick={() => setShowModal(true)} className="btn-primary gap-2">
              <Plus className="w-4 h-4" />Schedule Your First Class
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {classes.map(cls => {
              const sc = statusConfig[cls.status] ?? statusConfig.scheduled;
              return (
                <div key={cls.id} className="card p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      cls.status === 'live' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-emerald-50 dark:bg-emerald-900/20'
                    }`}>
                      <Video className={`w-6 h-6 ${cls.status === 'live' ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{cls.title}</h3>
                        <span className={`badge text-xs ${sc.color}`}>{sc.label}</span>
                      </div>
                      {cls.description && <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{cls.description}</p>}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(cls.scheduled_at).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {cls.duration_minutes} min
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {cls.meet_link && (
                        <a
                          href={cls.meet_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />Join
                        </a>
                      )}
                      {cls.status === 'scheduled' && (
                        <button
                          onClick={() => updateStatus(cls.id, 'live')}
                          className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-colors"
                        >
                          Go Live
                        </button>
                      )}
                      {cls.status === 'live' && (
                        <button
                          onClick={() => updateStatus(cls.id, 'ended')}
                          className="px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white text-xs font-medium rounded-lg transition-colors"
                        >
                          End
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-md p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Schedule Live Class</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="label">Class Title</label>
                <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="e.g., Quran Recitation - Session 5" />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field resize-none" rows={3} />
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
                <label className="label">Google Meet Link</label>
                <input type="url" value={form.meet_link} onChange={e => setForm({ ...form, meet_link: e.target.value })} className="input-field" placeholder="https://meet.google.com/..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Scheduled Date & Time</label>
                  <input type="datetime-local" required value={form.scheduled_at} onChange={e => setForm({ ...form, scheduled_at: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="label">Duration (minutes)</label>
                  <input type="number" value={form.duration_minutes} onChange={e => setForm({ ...form, duration_minutes: parseInt(e.target.value) })} className="input-field" min={15} max={240} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 gap-2">
                  {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Saving...</> : 'Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
