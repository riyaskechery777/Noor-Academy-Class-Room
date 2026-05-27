import React, { useEffect, useState } from 'react';
import { BarChart2, Users, FileText, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function TeacherProgress() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('assignment_submissions')
      .select('*, assignments(title, max_score, teacher_id), student:profiles!assignment_submissions_student_id_fkey(full_name)')
      .then(async res => {
        const myAssignments = (res.data ?? []).filter(s => s.assignments?.teacher_id === user.id);
        setSubmissions(myAssignments);
        setLoading(false);
      });
  }, [user]);

  const graded = submissions.filter(s => s.score !== null);
  const avgScore = graded.length > 0
    ? Math.round(graded.reduce((sum, s) => sum + (s.score || 0), 0) / graded.length)
    : 0;

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Progress</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Track your students' performance and submissions.</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Submissions', value: submissions.length, icon: FileText, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' },
            { label: 'Graded', value: graded.length, icon: CheckCircle, color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' },
            { label: 'Average Score', value: avgScore > 0 ? `${avgScore}%` : 'N/A', icon: BarChart2, color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' },
          ].map((m, i) => (
            <div key={i} className="card p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${m.color}`}>
                <m.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? '...' : m.value}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="card overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white">Recent Submissions</h2>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-14 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No submissions yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {submissions.slice(0, 20).map(sub => (
                <div key={sub.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {sub.student?.full_name?.charAt(0)?.toUpperCase() || 'S'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{sub.student?.full_name}</p>
                    <p className="text-gray-500 text-xs truncate">{sub.assignments?.title}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {sub.score !== null ? (
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm">
                        {sub.score}/{sub.assignments?.max_score}
                      </span>
                    ) : (
                      <span className="badge-gold text-xs">Pending</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
