import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  GraduationCap, LayoutDashboard, Users, BookOpen, Video, Bell,
  MessageCircle, BarChart2, LogOut, Menu, X, ChevronRight,
  FileText, Award, ClipboardList, UserCheck, Sun, Moon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
}

const adminNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
  { icon: Users, label: 'Teachers', path: '/admin/teachers' },
  { icon: Users, label: 'Students', path: '/admin/students' },
  { icon: BookOpen, label: 'Classrooms', path: '/admin/classrooms' },
  { icon: BookOpen, label: 'Courses', path: '/admin/courses' },
  { icon: Bell, label: 'Announcements', path: '/admin/announcements' },
  { icon: Video, label: 'Live Classes', path: '/admin/live-classes' },
  { icon: BarChart2, label: 'Analytics', path: '/admin/analytics' },
];

const teacherNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'Overview', path: '/teacher' },
  { icon: Video, label: 'Live Classes', path: '/teacher/live-classes' },
  { icon: FileText, label: 'Assignments', path: '/teacher/assignments' },
  { icon: ClipboardList, label: 'Quizzes', path: '/teacher/quizzes' },
  { icon: UserCheck, label: 'Attendance', path: '/teacher/attendance' },
  { icon: BookOpen, label: 'Notes & Materials', path: '/teacher/notes' },
  { icon: MessageCircle, label: 'Messages', path: '/teacher/messages' },
  { icon: BarChart2, label: 'Student Progress', path: '/teacher/progress' },
];

const studentNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'Overview', path: '/student' },
  { icon: Video, label: 'Live Classes', path: '/student/live-classes' },
  { icon: BookOpen, label: 'My Courses', path: '/student/courses' },
  { icon: FileText, label: 'Assignments', path: '/student/assignments' },
  { icon: ClipboardList, label: 'Quizzes', path: '/student/quizzes' },
  { icon: UserCheck, label: 'Attendance', path: '/student/attendance' },
  { icon: Award, label: 'Certificates', path: '/student/certificates' },
  { icon: BarChart2, label: 'Progress', path: '/student/progress' },
  { icon: MessageCircle, label: 'Messages', path: '/student/messages' },
];

const roleConfig = {
  admin: {
    gradient: 'from-red-500 to-rose-600',
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-700 dark:text-red-300',
    label: 'Administrator',
    accent: '#ef4444',
  },
  teacher: {
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-700 dark:text-blue-300',
    label: 'Teacher',
    accent: '#3b82f6',
  },
  student: {
    gradient: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    text: 'text-emerald-700 dark:text-emerald-300',
    label: 'Student',
    accent: '#059669',
  },
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'admin' | 'teacher' | 'student';
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const { profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = role === 'admin' ? adminNav : role === 'teacher' ? teacherNav : studentNav;
  const rc = roleConfig[role];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isDark = theme === 'dark';

  const Sidebar = () => (
    <aside
      className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 ease-out flex-shrink-0`}
      style={{
        background: isDark
          ? 'linear-gradient(180deg, #0c1a2e 0%, #0f2040 100%)'
          : '#ffffff',
        borderRight: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #eef2f7',
        boxShadow: isDark ? '4px 0 24px rgba(0,0,0,0.3)' : '4px 0 16px rgba(0,0,0,0.04)',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-between px-5 h-16 flex-shrink-0"
        style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #eef2f7' }}
      >
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm tracking-tight">Hiraa</span>
            <span className="text-xs text-gray-400 dark:text-gray-500 block leading-none -mt-0.5">Moral School</span>
          </div>
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Profile */}
      <div className="px-4 pt-4 pb-2">
        <div
          className="flex items-center gap-3 p-3 rounded-xl"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(5,150,105,0.18) 0%, rgba(4,120,87,0.10) 100%)'
              : 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 60%, #ecfdf5 100%)',
            border: isDark ? '1px solid rgba(5,150,105,0.25)' : '1px solid #a7f3d0',
          }}
        >
          <div className={`relative w-9 h-9 bg-gradient-to-br ${rc.gradient} rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0`}>
            {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white text-sm truncate leading-tight">
              {profile?.full_name || 'User'}
            </p>
            <span className={`text-xs font-medium ${rc.text}`}>{rc.label}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        <p className="text-xs font-semibold uppercase tracking-wider px-3 mb-3"
          style={{ color: isDark ? 'rgba(255,255,255,0.2)' : '#94a3b8' }}>
          Menu
        </p>
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={isActive ? 'sidebar-item-active' : 'sidebar-item'}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : isDark
                    ? 'bg-white/6 text-gray-400'
                    : 'bg-gray-100 text-gray-500'
              }`}>
                <item.icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm flex-1 truncate">{item.label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-40 flex-shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div
        className="px-3 py-3 space-y-0.5"
        style={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #eef2f7' }}
      >
        <button onClick={toggleTheme} className="sidebar-item w-full">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isDark ? 'bg-white/6 text-amber-400' : 'bg-gray-100 text-gray-500'
          }`}>
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </div>
          <span className="text-sm">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
            <LogOut className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
          </div>
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: isDark ? '#060e1d' : '#f4f7fb' }}
    >
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header
          className="h-16 flex items-center justify-between px-4 lg:px-6 flex-shrink-0"
          style={{
            background: isDark ? 'rgba(10,18,34,0.85)' : 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #eef2f7',
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden lg:flex items-center gap-2">
              <span className="text-xs text-gray-400 dark:text-gray-600 font-semibold uppercase tracking-widest">
                {rc.label}
              </span>
              <ChevronRight className="w-3 h-3 text-gray-300 dark:text-gray-700" />
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {navItems.find(n => n.path === location.pathname)?.label || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button className="relative p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>

            <div
              className="flex items-center gap-2.5 pl-2.5 pr-3 py-1.5 rounded-xl cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-white/10"
            >
              <div className={`w-7 h-7 bg-gradient-to-br ${rc.gradient} rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
                {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-tight max-w-28 truncate">
                  {profile?.full_name?.split(' ')[0] || 'User'}
                </p>
                <p className={`text-xs font-medium ${rc.text} leading-none`}>{rc.label}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
