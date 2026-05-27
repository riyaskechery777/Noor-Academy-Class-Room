import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Video, FileText, ClipboardList, Award, BookOpen, ArrowUpRight,
  Calendar, Clock, CheckCircle, Bell, BarChart2
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function StudentDashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({ enrollments: 0, assignments: 0, submissions: 0, certificates: 0 });
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);
  const [pendingAssignments, setPendingAssignments] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    const [enrollRes, submissionsRes, certsRes, announcementsRes] = await Promise.all([
      supabase.from('classroom_enrollments').select('id', { count: 'exact' }).eq('student_id', user!.id),
      supabase.from('assignment_submissions').select('id', { count: 'exact' }).eq('student_id', user!.id),
      supabase.from('certificates').select('id', { count: 'exact' }).eq('student_id', user!.id),
      supabase.from('announcements').select('*').eq('is_global', true).order('created_at', { ascending: false }).limit(4),
    ]);

    setStats({
      enrollments: enrollRes.count ?? 0,
      assignments: 0,
      submissions: submissionsRes.count ?? 0,
      certificates: certsRes.count ?? 0,
    });
    setAnnouncements(announcementsRes.data ?? []);
    setLoading(false);
  };

  const statCards = [
    { label: 'Enrolled Classrooms', value: stats.enrollments, icon: BookOpen, to: '/student/courses', color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' },
    { label: 'Submissions', value: stats.submissions, icon: FileText, to: '/student/assignments', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
    { label: 'Certificates', value: stats.certificates, icon: Award, to: '/student/certificates', color: 'bg-gold-50 dark:bg-amber-900/20 text-gold-600 dark:text-amber-400' },
    { label: 'Attendance', value: '—', icon: CheckCircle, to: '/student/attendance', color: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' },
  ];

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Assalamu Alaikum, {profile?.full_name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <Link key={i} to={card.to} className="card p-5 hover:shadow-md transition-shadow group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {loading ? <span className="h-7 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse inline-block"></span> : card.value}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{card.label}</p>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Access */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Schedule (placeholder) */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-gray-900 dark:text-white">Upcoming Live Classes</h2>
                <Link to="/student/live-classes" className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline">
                  View all <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="text-center py-10">
                <Calendar className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No upcoming classes scheduled</p>
                <p className="text-gray-400 text-xs mt-1">Check back with your teacher</p>
              </div>
            </div>

            {/* Pending Assignments (placeholder) */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-gray-900 dark:text-white">Pending Assignments</h2>
                <Link to="/student/assignments" className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline">
                  View all <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="text-center py-10">
                <FileText className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No pending assignments</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            {/* Announcements */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h2 className="font-semibold text-gray-900 dark:text-white">Announcements</h2>
              </div>
              {announcements.length === 0 ? (
                <p className="text-gray-400 text-xs text-center py-4">No announcements</p>
              ) : (
                <div className="space-y-3">
                  {announcements.map(ann => (
                    <div key={ann.id} className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-800">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          ann.priority === 'urgent' ? 'bg-red-500' :
                          ann.priority === 'high' ? 'bg-gold-500' : 'bg-emerald-500'
                        }`}></span>
                        <p className="font-medium text-gray-900 dark:text-white text-xs">{ann.title}</p>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-2">{ann.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="card p-5">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Access</h2>
              <div className="space-y-2">
                {[
                  { icon: Video, label: 'Live Classes', to: '/student/live-classes', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
                  { icon: ClipboardList, label: 'My Quizzes', to: '/student/quizzes', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
                  { icon: BarChart2, label: 'My Progress', to: '/student/progress', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
                  { icon: Award, label: 'Certificates', to: '/student/certificates', color: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20' },
                ].map((item, i) => (
                  <Link key={i} to={item.to} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}>
                      <item.icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">{item.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Islamic Reminder */}
            <div className="card p-5 gradient-card text-white">
              <p className="font-arabic text-2xl text-gold-200 mb-2">رَبِّ زِدْنِي عِلْمًا</p>
              <p className="text-white/80 text-xs">"My Lord, increase me in knowledge"</p>
              <p className="text-white/60 text-xs mt-1">— Quran 20:114</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
