import React, { useEffect, useState } from 'react';
import { BarChart2, TrendingUp, CheckCircle, Clock, Award, BookOpen } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function StudentProgress() {
  const { user } = useAuth();
  const [data, setData] = useState({
    enrollments: 0,
    submissions: 0,
    gradedSubmissions: 0,
    avgScore: 0,
    certificates: 0,
    attendancePresent: 0,
    attendanceTotal: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [enrollRes, subRes, certRes, attendRes] = await Promise.all([
        supabase.from('classroom_enrollments').select('id', { count: 'exact' }).eq('student_id', user.id),
        supabase.from('assignment_submissions').select('*').eq('student_id', user.id),
        supabase.from('certificates').select('id', { count: 'exact' }).eq('student_id', user.id),
        supabase.from('attendance').select('status').eq('student_id', user.id),
      ]);

      const submissions = subRes.data ?? [];
      const graded = submissions.filter(s => s.score !== null);
      const avgScore = graded.length > 0
        ? Math.round(graded.reduce((sum, s) => sum + (s.score || 0), 0) / graded.length)
        : 0;

      const attendance = attendRes.data ?? [];
      const present = attendance.filter(a => a.status === 'present').length;

      setData({
        enrollments: enrollRes.count ?? 0,
        submissions: submissions.length,
        gradedSubmissions: graded.length,
        avgScore,
        certificates: certRes.count ?? 0,
        attendancePresent: present,
        attendanceTotal: attendance.length,
      });
      setLoading(false);
    };
    load();
  }, [user]);

  const attendanceRate = data.attendanceTotal > 0
    ? Math.round((data.attendancePresent / data.attendanceTotal) * 100)
    : 0;

  const metrics = [
    { label: 'Enrolled Classrooms', value: data.enrollments, icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Assignments Submitted', value: data.submissions, icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Average Score', value: data.avgScore > 0 ? `${data.avgScore}%` : 'N/A', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Certificates Earned', value: data.certificates, icon: Award, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20' },
  ];

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Progress</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Track your learning journey and achievements.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-28 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((m, i) => (
                <div key={i} className="card p-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${m.bg}`}>
                    <m.icon className={`w-5 h-5 ${m.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{m.value}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{m.label}</p>
                </div>
              ))}
            </div>

            {/* Attendance Card */}
            <div className="card p-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Attendance Rate
              </h2>
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" className="text-gray-100 dark:text-gray-800" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15.9"
                      fill="none"
                      stroke="currentColor"
                      className="text-emerald-500"
                      strokeWidth="3"
                      strokeDasharray={`${attendanceRate} ${100 - attendanceRate}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{attendanceRate}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-bold text-2xl text-emerald-600 dark:text-emerald-400">{data.attendancePresent}</span> present
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">out of {data.attendanceTotal} classes</p>
                  {data.attendanceTotal === 0 && (
                    <p className="text-gray-400 text-xs mt-1">No attendance records yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Motivational */}
            <div className="card p-6 bg-gradient-to-br from-emerald-700 to-emerald-900 text-white">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-7 h-7 text-gold-300" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Keep Going!</h3>
                  <p className="text-white/80 text-sm">
                    {data.submissions === 0
                      ? 'Start submitting assignments to track your progress.'
                      : data.avgScore >= 80
                        ? 'Excellent performance! You are doing great, mashAllah!'
                        : data.avgScore >= 60
                          ? 'Good work! Keep studying to improve your scores.'
                          : 'You are making progress. Consistency is key!'}
                  </p>
                  <p className="font-arabic text-gold-300 mt-2 text-lg">إِنَّ مَعَ الْعُسْرِ يُسْرًا</p>
                  <p className="text-white/60 text-xs">"Indeed, with hardship comes ease" — Quran 94:6</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
