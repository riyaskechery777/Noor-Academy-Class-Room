import React, { useEffect, useState } from 'react';
import { UserCheck, CheckCircle, X, Clock } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function TeacherAttendance() {
  const { user } = useAuth();
  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    const [classesRes] = await Promise.all([
      supabase.from('live_classes').select('*, classrooms(name)').eq('teacher_id', user!.id).in('status', ['live', 'ended']).order('scheduled_at', { ascending: false }).limit(10),
    ]);
    setLiveClasses(classesRes.data ?? []);
    setLoading(false);
  };

  const loadStudents = async (classroomId: string) => {
    const { data } = await supabase
      .from('classroom_enrollments')
      .select('*, profiles!classroom_enrollments_student_id_fkey(id, full_name)')
      .eq('classroom_id', classroomId);
    const studentList = data?.map(e => e.profiles).filter(Boolean) ?? [];
    setStudents(studentList);
    const initialAtt: Record<string, string> = {};
    studentList.forEach((s: any) => { initialAtt[s.id] = 'present'; });
    setAttendance(initialAtt);
  };

  const handleSelectClass = (cls: any) => {
    setSelected(cls);
    if (cls.classroom_id) loadStudents(cls.classroom_id);
  };

  const saveAttendance = async () => {
    if (!selected) return;
    setSaving(true);
    const records = Object.entries(attendance).map(([studentId, status]) => ({
      live_class_id: selected.id,
      student_id: studentId,
      classroom_id: selected.classroom_id,
      teacher_id: user!.id,
      status,
      date: new Date().toISOString().split('T')[0],
    }));
    await supabase.from('attendance').upsert(records);
    setSaving(false);
    alert('Attendance saved successfully!');
  };

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Mark attendance for your live classes.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Class List */}
          <div className="card p-4">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm">Select Class</h2>
            {loading ? (
              <div className="space-y-2">
                {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}
              </div>
            ) : liveClasses.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No classes available</p>
            ) : (
              <div className="space-y-2">
                {liveClasses.map(cls => (
                  <button
                    key={cls.id}
                    onClick={() => handleSelectClass(cls)}
                    className={`w-full text-left p-3 rounded-xl transition-colors ${selected?.id === cls.id ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                  >
                    <p className={`text-sm font-medium ${selected?.id === cls.id ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-900 dark:text-white'}`}>{cls.title}</p>
                    <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />{new Date(cls.scheduled_at).toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Attendance Sheet */}
          <div className="lg:col-span-2 card p-5">
            {!selected ? (
              <div className="text-center py-16">
                <UserCheck className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">Select a class to mark attendance</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">{selected.title}</h2>
                    <p className="text-gray-400 text-xs">{students.length} students enrolled</p>
                  </div>
                  <button onClick={saveAttendance} disabled={saving || students.length === 0} className="btn-primary text-sm gap-2">
                    {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Saving...</> : <><CheckCircle className="w-4 h-4" />Save</>}
                  </button>
                </div>
                {students.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-8">No students enrolled in this class</p>
                ) : (
                  <div className="space-y-2">
                    {students.map((s: any) => (
                      <div key={s.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {s.full_name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white">{s.full_name}</span>
                        <div className="flex gap-2">
                          {['present', 'late', 'absent'].map(status => (
                            <button
                              key={status}
                              onClick={() => setAttendance({ ...attendance, [s.id]: status })}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                                attendance[s.id] === status
                                  ? status === 'present' ? 'bg-emerald-500 text-white' :
                                    status === 'late' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
                                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600'
                              }`}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
