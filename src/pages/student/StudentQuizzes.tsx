import React, { useEffect, useState } from 'react';
import { ClipboardList, Clock, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function StudentQuizzes() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const enrollRes = await supabase.from('classroom_enrollments').select('classroom_id').eq('student_id', user.id);
      const ids = enrollRes.data?.map(e => e.classroom_id) ?? [];
      if (ids.length > 0) {
        const { data } = await supabase.from('quizzes').select('*').in('classroom_id', ids).eq('status', 'active').order('created_at', { ascending: false });
        setQuizzes(data ?? []);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Quizzes</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Active quizzes from your enrolled classrooms.</p>
        </div>
        {loading ? (
          <div className="space-y-4">
            {[1,2].map(i => <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
          </div>
        ) : quizzes.length === 0 ? (
          <div className="card p-16 text-center">
            <ClipboardList className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No active quizzes available.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {quizzes.map(q => (
              <div key={q.id} className="card p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ClipboardList className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{q.title}</h3>
                    {q.description && <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{q.description}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{q.time_limit_minutes} min</span>
                  <span>{q.total_marks} marks</span>
                  <span>Pass: {q.passing_marks}</span>
                </div>
                <button className="btn-primary w-full text-sm py-2.5 gap-2">
                  <CheckCircle className="w-4 h-4" />Start Quiz
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
