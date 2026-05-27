import React, { useEffect, useState } from 'react';
import { Video, ExternalLink, Clock, Calendar } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function StudentLiveClasses() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const enrollRes = await supabase
        .from('classroom_enrollments')
        .select('classroom_id')
        .eq('student_id', user.id);

      const ids = enrollRes.data?.map(e => e.classroom_id) ?? [];
      if (ids.length > 0) {
        const { data } = await supabase
          .from('live_classes')
          .select('*, profiles!live_classes_teacher_id_fkey(full_name)')
          .in('classroom_id', ids)
          .order('scheduled_at');
        setClasses(data ?? []);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const upcoming = classes.filter(c => c.status !== 'ended' && c.status !== 'cancelled');
  const past = classes.filter(c => c.status === 'ended' || c.status === 'cancelled');

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Live Classes</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Join your scheduled live sessions.</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
          </div>
        ) : classes.length === 0 ? (
          <div className="card p-16 text-center">
            <Video className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No live classes scheduled.</p>
            <p className="text-gray-400 text-sm mt-1">Your teacher will schedule classes soon.</p>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <div>
                <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Upcoming</h2>
                <div className="space-y-4">
                  {upcoming.map(cls => (
                    <div key={cls.id} className="card p-5">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${cls.status === 'live' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-emerald-50 dark:bg-emerald-900/20'}`}>
                          <Video className={`w-6 h-6 ${cls.status === 'live' ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{cls.title}</h3>
                            {cls.status === 'live' && <span className="badge bg-red-500 text-white text-xs animate-pulse">LIVE</span>}
                            {cls.status === 'scheduled' && <span className="badge-blue text-xs">Scheduled</span>}
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(cls.scheduled_at).toLocaleString()}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{cls.duration_minutes} min</span>
                            {cls.profiles?.full_name && <span>by {cls.profiles.full_name}</span>}
                          </div>
                        </div>
                        {cls.meet_link && (
                          <a href={cls.meet_link} target="_blank" rel="noopener noreferrer"
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex-shrink-0 ${
                              cls.status === 'live'
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            }`}>
                            <ExternalLink className="w-3.5 h-3.5" />
                            {cls.status === 'live' ? 'Join Now' : 'Join'}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {past.length > 0 && (
              <div>
                <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Past Classes</h2>
                <div className="space-y-3">
                  {past.map(cls => (
                    <div key={cls.id} className="card p-4 opacity-75">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                          <Video className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-700 dark:text-gray-300 text-sm">{cls.title}</p>
                          <p className="text-gray-400 text-xs">{new Date(cls.scheduled_at).toLocaleDateString()}</p>
                        </div>
                        {cls.recording_url && (
                          <a href={cls.recording_url} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 hover:underline">
                            Watch Recording
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
