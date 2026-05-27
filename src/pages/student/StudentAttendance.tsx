import React, { useEffect, useState } from 'react';
import { UserCheck, Calendar, CheckCircle, X, Clock } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function StudentAttendance() {
  const { user } = useAuth();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('attendance')
      .select('*, live_classes(title, scheduled_at)')
      .eq('student_id', user.id)
      .order('marked_at', { ascending: false })
      .then(({ data }) => {
        setRecords(data ?? []);
        setLoading(false);
      });
  }, [user]);

  const present = records.filter(r => r.status === 'present').length;
  const late = records.filter(r => r.status === 'late').length;
  const absent = records.filter(r => r.status === 'absent').length;
  const rate = records.length > 0 ? Math.round(((present + late) / records.length) * 100) : 0;

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Attendance</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Your attendance record across all classes.</p>
        </div>

        {!loading && records.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total Classes', value: records.length, color: 'text-gray-900 dark:text-white', bg: 'bg-gray-50 dark:bg-gray-800' },
              { label: 'Present', value: present, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
              { label: 'Late', value: late, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
              { label: 'Absent', value: absent, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
            ].map((s, i) => (
              <div key={i} className={`card p-4 ${s.bg}`}>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="card overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-white">Attendance Records</h2>
            {records.length > 0 && (
              <span className={`badge text-sm font-semibold ${rate >= 80 ? 'badge-green' : rate >= 60 ? 'badge-gold' : 'badge-red'}`}>
                {rate}% attendance rate
              </span>
            )}
          </div>
          {loading ? (
            <div className="p-5 space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-14 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-16">
              <UserCheck className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No attendance records yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {records.map(r => (
                <div key={r.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    r.status === 'present' ? 'bg-emerald-50 dark:bg-emerald-900/20' :
                    r.status === 'late' ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-red-50 dark:bg-red-900/20'
                  }`}>
                    {r.status === 'present' ? <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> :
                     r.status === 'late' ? <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" /> :
                     <X className="w-4 h-4 text-red-600 dark:text-red-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{r.live_classes?.title || 'Class Session'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {new Date(r.marked_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`badge text-xs ${
                    r.status === 'present' ? 'badge-green' :
                    r.status === 'late' ? 'badge-gold' : 'badge-red'
                  }`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
