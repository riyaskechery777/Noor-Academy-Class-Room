import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, BookOpen, Video, Bell, TrendingUp, UserCheck, AlertCircle,
  CheckCircle, Clock, BarChart2, ArrowUpRight, GraduationCap, Award
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../lib/supabase';

interface Stats {
  students: number;
  teachers: number;
  classrooms: number;
  pendingTeachers: number;
  liveClasses: number;
  courses: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ students: 0, teachers: 0, classrooms: 0, pendingTeachers: 0, liveClasses: 0, courses: 0 });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [studentsRes, teachersRes, classroomsRes, pendingRes, coursesRes, usersRes, announcementsRes] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'student'),
      supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'teacher').eq('approved', true),
      supabase.from('classrooms').select('id', { count: 'exact' }).eq('status', 'active'),
      supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'teacher').eq('approved', false),
      supabase.from('courses').select('id', { count: 'exact' }).eq('status', 'active'),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('announcements').select('*').eq('is_global', true).order('created_at', { ascending: false }).limit(3),
    ]);

    setStats({
      students: studentsRes.count ?? 0,
      teachers: teachersRes.count ?? 0,
      classrooms: classroomsRes.count ?? 0,
      pendingTeachers: pendingRes.count ?? 0,
      liveClasses: 0,
      courses: coursesRes.count ?? 0,
    });

    setRecentUsers(usersRes.data ?? []);
    setAnnouncements(announcementsRes.data ?? []);
    setLoading(false);
  };

  const statCards = [
    { label: 'Total Students', value: stats.students, icon: Users, color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400', change: '+12%', trend: 'up' },
    { label: 'Active Teachers', value: stats.teachers, icon: GraduationCap, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400', change: '+5%', trend: 'up' },
    { label: 'Classrooms', value: stats.classrooms, icon: BookOpen, color: 'bg-gold-50 dark:bg-amber-900/20 text-gold-600 dark:text-amber-400', change: '+8%', trend: 'up' },
    { label: 'Active Courses', value: stats.courses, icon: Video, color: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400', change: '+15%', trend: 'up' },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Welcome back! Here's what's happening at Hiraa School.</p>
          </div>
          <Link to="/admin/announcements" className="btn-primary text-sm gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">New Announcement</span>
          </Link>
        </div>

        {/* Pending Teachers Alert */}
        {stats.pendingTeachers > 0 && (
          <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <p className="text-amber-700 dark:text-amber-300 text-sm flex-1">
              <span className="font-semibold">{stats.pendingTeachers} teacher account{stats.pendingTeachers > 1 ? 's' : ''}</span> pending approval.
            </p>
            <Link to="/admin/teachers" className="btn-ghost text-amber-700 dark:text-amber-300 text-sm px-3 py-1.5">Review</Link>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <div key={i} className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  {card.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {loading ? <span className="h-7 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse inline-block"></span> : card.value}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{card.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Users */}
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900 dark:text-white">Recent Registrations</h2>
              <Link to="/admin/students" className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline">
                View all <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-14 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}
              </div>
            ) : recentUsers.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No users yet</p>
            ) : (
              <div className="space-y-3">
                {recentUsers.map(user => (
                  <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{user.full_name || 'Unknown'}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs truncate">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`badge text-xs ${
                        user.role === 'admin' ? 'badge-red' :
                        user.role === 'teacher' ? 'badge-blue' : 'badge-green'
                      }`}>
                        {user.role}
                      </span>
                      <span className={`badge text-xs ${user.approved || user.role === 'student' ? 'badge-green' : 'badge-gold'}`}>
                        {user.approved || user.role === 'student' ? 'Active' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions & Announcements */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card p-5">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { icon: Users, label: 'Manage Teachers', to: '/admin/teachers', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
                  { icon: BookOpen, label: 'Create Classroom', to: '/admin/classrooms', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
                  { icon: Video, label: 'Schedule Live Class', to: '/admin/live-classes', color: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20' },
                  { icon: BarChart2, label: 'View Analytics', to: '/admin/analytics', color: 'text-gold-600 bg-gold-50 dark:bg-amber-900/20' },
                ].map((action, i) => (
                  <Link
                    key={i}
                    to={action.to}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${action.color}`}>
                      <action.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">{action.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Announcements */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 dark:text-white">Recent Announcements</h2>
              </div>
              {announcements.length === 0 ? (
                <p className="text-gray-400 text-xs text-center py-4">No announcements yet</p>
              ) : (
                <div className="space-y-3">
                  {announcements.map(ann => (
                    <div key={ann.id} className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-800">
                      <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">{ann.title}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 line-clamp-2">{ann.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
