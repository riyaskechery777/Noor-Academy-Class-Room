import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Video, FileText, ClipboardList, Users, BookOpen, ArrowUpRight,
  Calendar, Clock, CheckCircle, TrendingUp
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function TeacherDashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({ classrooms: 0, assignments: 0, students: 0, quizzes: 0 });
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);
  const [recentAssignments, setRecentAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    const [classroomsRes, assignmentsRes, quizzesRes, liveRes, assignListRes] = await Promise.all([
      supabase.from('classrooms').select('id', { count: 'exact' }).eq('teacher_id', user!.id),
      supabase.from('assignments').select('id', { count: 'exact' }).eq('teacher_id', user!.id),
      supabase.from('quizzes').select('id', { count: 'exact' }).eq('teacher_id', user!.id),
      supabase.from('live_classes').select('*').eq('teacher_id', user!.id).gte('scheduled_at', new Date().toISOString()).order('scheduled_at').limit(3),
      supabase.from('assignments').select('*').eq('teacher_id', user!.id).order('created_at', { ascending: false }).limit(5),
    ]);

    setStats({
      classrooms: classroomsRes.count ?? 0,
      assignments: assignmentsRes.count ?? 0,
      students: 0,
      quizzes: quizzesRes.count ?? 0,
    });
    setUpcomingClasses(liveRes.data ?? []);
    setRecentAssignments(assignListRes.data ?? []);
    setLoading(false);
  };

  const statCards = [
    { label: 'My Classrooms', value: stats.classrooms, icon: BookOpen, to: '/teacher/live-classes', color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' },
    { label: 'Assignments', value: stats.assignments, icon: FileText, to: '/teacher/assignments', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
    { label: 'Quizzes Created', value: stats.quizzes, icon: ClipboardList, to: '/teacher/quizzes', color: 'bg-gold-50 dark:bg-amber-900/20 text-gold-600 dark:text-amber-400' },
    { label: 'Live Classes', value: upcomingClasses.length, icon: Video, to: '/teacher/live-classes', color: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400' },
  ];

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome, {profile?.full_name?.split(' ')[0]}!
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          {!profile?.approved && (
            <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              <p className="text-amber-700 dark:text-amber-300 text-xs font-medium">Account pending approval</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <Link key={i} to={card.to} className="card p-5 hover:shadow-md transition-shadow group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {loading ? <span className="h-7 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse inline-block"></span> : card.value}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{card.label}</p>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Classes */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900 dark:text-white">Upcoming Live Classes</h2>
              <Link to="/teacher/live-classes" className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline">
                View all <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {upcomingClasses.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No upcoming classes</p>
                <Link to="/teacher/live-classes" className="text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:underline mt-1 block">
                  Schedule one
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingClasses.map(cls => (
                  <div key={cls.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Video className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{cls.title}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {new Date(cls.scheduled_at).toLocaleString()}
                      </p>
                    </div>
                    <span className={`badge text-xs flex-shrink-0 ${
                      cls.status === 'live' ? 'bg-red-500 text-white animate-pulse' :
                      cls.status === 'scheduled' ? 'badge-blue' : 'badge-gray'
                    }`}>
                      {cls.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Assignments */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900 dark:text-white">Recent Assignments</h2>
              <Link to="/teacher/assignments" className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline">
                View all <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {recentAssignments.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No assignments yet</p>
                <Link to="/teacher/assignments" className="text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:underline mt-1 block">
                  Create one
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAssignments.map(a => (
                  <div key={a.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="w-9 h-9 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{a.title}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                        Due: {a.due_date ? new Date(a.due_date).toLocaleDateString() : 'No deadline'}
                      </p>
                    </div>
                    <span className={`badge text-xs flex-shrink-0 ${
                      a.status === 'active' ? 'badge-green' :
                      a.status === 'closed' ? 'badge-gray' : 'badge-gold'
                    }`}>
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Video, label: 'Schedule Class', to: '/teacher/live-classes', color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40' },
              { icon: FileText, label: 'Create Assignment', to: '/teacher/assignments', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40' },
              { icon: ClipboardList, label: 'New Quiz', to: '/teacher/quizzes', color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40' },
              { icon: CheckCircle, label: 'Mark Attendance', to: '/teacher/attendance', color: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40' },
            ].map((a, i) => (
              <Link key={i} to={a.to} className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-colors ${a.color}`}>
                <a.icon className="w-6 h-6" />
                <span className="text-xs font-medium text-center">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
