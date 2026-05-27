import React, { useEffect, useState } from 'react';
import { Video, Calendar, Clock } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../lib/supabase';

export default function AdminLiveClasses() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('live_classes')
      .select('*, teacher:profiles!live_classes_teacher_id_fkey(full_name), classrooms(name)')
      .order('scheduled_at', { ascending: false })
      .then(({ data }) => { setClasses(data ?? []); setLoading(false); });
  }, []);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Live Classes</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Monitor all scheduled and live sessions.</p>
        </div>
        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
          </div>
        ) : classes.length === 0 ? (
          <div className="card p-16 text-center">
            <Video className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No live classes scheduled yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {classes.map(cls => (
              <div key={cls.id} className="card p-5">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cls.status === 'live' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-emerald-50 dark:bg-emerald-900/20'}`}>
                    <Video className={`w-5 h-5 ${cls.status === 'live' ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{cls.title}</h3>
                      <span className={`badge text-xs ${cls.status === 'live' ? 'bg-red-500 text-white' : cls.status === 'scheduled' ? 'badge-blue' : 'badge-gray'}`}>{cls.status}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>By: {cls.teacher?.full_name || 'Unknown'}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(cls.scheduled_at).toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{cls.duration_minutes} min</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
