import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  GraduationCap, LayoutDashboard, Users, BookOpen, Video, Bell,
  MessageCircle, BarChart2, Settings, LogOut, Menu, X, ChevronRight,
  FileText, Award, ClipboardList, Calendar, UserCheck
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

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
  const roleColors = {
    admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    teacher: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    student: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const Sidebar = () => (
    <aside className={`${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-transform duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100 dark:border-gray-800">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">Hiraa School</span>
        </Link>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Profile */}
      <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
            {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{profile?.full_name}</p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleColors[role]}`}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={isActive ? 'sidebar-item-active' : 'sidebar-item'}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{item.label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800 space-y-1">
        <button
          onClick={toggleTheme}
          className="sidebar-item w-full"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          <span className="text-sm">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
        <button
          onClick={handleSignOut}
          className="sidebar-item w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden lg:block">
            <h1 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Link
              to={`/${role}`}
              className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Bell className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200 max-w-28 truncate">
                {profile?.full_name?.split(' ')[0]}
              </span>
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
