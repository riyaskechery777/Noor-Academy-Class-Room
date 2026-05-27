import React, { useEffect, useState } from 'react';
import { BarChart2, Users, BookOpen, TrendingUp, Award, Video, GraduationCap } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../lib/supabase';

export default function AdminAnalytics() {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classrooms: 0,
    courses: 0,
    assignments: 0,
    certificates: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [s, t, c, co, a, cert] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'student'),
        supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'teacher'),
        supabase.from('classrooms').select('id', { count: 'exact' }),
        supabase.from('courses').select('id', { count: 'exact' }),
        supabase.from('assignments').select('id', { count: 'exact' }),
        supabase.from('certificates').select('id', { count: 'exact' }),
      ]);
      setStats({
        students: s.count ?? 0,
        teachers: t.count ?? 0,
        classrooms: c.count ?? 0,
        courses: co.count ?? 0,
        assignments: a.count ?? 0,
        certificates: cert.count ?? 0,
      });
      setLoading(false);
    };
    load();
  }, []);

  const metrics = [
    { label: 'Total Students', value: stats.students, icon: Users, color: 'from-emerald-500 to-emerald-600', change: '+12%' },
    { label: 'Active Teachers', value: stats.teachers, icon: GraduationCap, color: 'from-blue-500 to-blue-600', change: '+5%' },
    { label: 'Classrooms', value: stats.classrooms, icon: BookOpen, color: 'from-amber-500 to-amber-600', change: '+8%' },
    { label: 'Courses', value: stats.courses, icon: Video, color: 'from-rose-500 to-rose-600', change: '+15%' },
    { label: 'Assignments', value: stats.assignments, icon: TrendingUp, color: 'from-teal-500 to-teal-600', change: '+3%' },
    { label: 'Certificates', value: stats.certificates, icon: Award, color: 'from-violet-500 to-violet-600', change: '+20%' },
  ];

  const monthlyGrowth = [
    { month: 'Jan', students: 45, teachers: 3 },
    { month: 'Feb', students: 62, teachers: 4 },
    { month: 'Mar', students: 78, teachers: 5 },
    { month: 'Apr', students: 91, teachers: 6 },
    { month: 'May', students: 110, teachers: 8 },
    { month: 'Jun', students: 125, teachers: 9 },
  ];

  const maxStudents = Math.max(...monthlyGrowth.map(m => m.students));

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">School-wide performance metrics and insights.</p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((m, i) => (
            <div key={i} className={`rounded-2xl bg-gradient-to-br ${m.color} p-5 text-white shadow-lg`}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                  <m.icon className="w-4.5 h-4.5 w-5 h-5" />
                </div>
                <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">{m.change}</span>
              </div>
              <p className="text-3xl font-bold">{loading ? '...' : m.value}</p>
              <p className="text-white/80 text-sm mt-1">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Growth Chart */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-6">Monthly Student Growth</h2>
          <div className="flex items-end gap-4 h-40">
            {monthlyGrowth.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center justify-end h-32 relative">
                  <div
                    className="w-full bg-emerald-500 dark:bg-emerald-600 rounded-t-lg transition-all duration-700 hover:bg-emerald-600 dark:hover:bg-emerald-500 cursor-pointer relative group"
                    style={{ height: `${(m.students / maxStudents) * 100}%` }}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {m.students} students
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Monthly Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left py-3 text-gray-500 dark:text-gray-400 font-medium">Month</th>
                  <th className="text-right py-3 text-gray-500 dark:text-gray-400 font-medium">New Students</th>
                  <th className="text-right py-3 text-gray-500 dark:text-gray-400 font-medium">New Teachers</th>
                  <th className="text-right py-3 text-gray-500 dark:text-gray-400 font-medium">Growth Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {monthlyGrowth.map((m, i) => {
                  const prevStudents = i > 0 ? monthlyGrowth[i-1].students : m.students;
                  const rate = (((m.students - prevStudents) / prevStudents) * 100).toFixed(1);
                  return (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 font-medium text-gray-900 dark:text-white">{m.month} 2024</td>
                      <td className="py-3 text-right text-gray-700 dark:text-gray-300">{m.students}</td>
                      <td className="py-3 text-right text-gray-700 dark:text-gray-300">{m.teachers}</td>
                      <td className="py-3 text-right">
                        <span className={`badge text-xs ${i > 0 && m.students > prevStudents ? 'badge-green' : 'badge-gray'}`}>
                          {i > 0 ? `+${rate}%` : '--'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
