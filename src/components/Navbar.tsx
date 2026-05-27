import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, Sun, Moon, Bell, LogOut,
  ChevronDown, LayoutDashboard, GraduationCap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const profileRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) {
      supabase
        .from('notifications')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('is_read', false)
        .then(({ count }) => setUnreadCount(count ?? 0));
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    setProfileOpen(false);
    navigate('/');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/courses', label: 'Courses' },
    { href: '/contact', label: 'Contact' },
  ];

  const getDashboardPath = () => {
    if (!profile) return '/login';
    if (profile.role === 'admin') return '/admin';
    if (profile.role === 'teacher') return '/teacher';
    return '/student';
  };

  const isDashboardRoute = location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/teacher') ||
    location.pathname.startsWith('/student');

  const isAtTop = !scrolled && !isDashboardRoute;
  const isDark = theme === 'dark';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        isAtTop ? 'border-transparent' : isDark ? 'border-white/8' : 'border-gray-100'
      }`}
      style={{
        background: isAtTop ? 'transparent' : isDark ? 'rgba(9,14,26,0.92)' : 'rgba(255,255,255,0.94)',
        backdropFilter: isAtTop ? 'none' : 'blur(20px)',
        WebkitBackdropFilter: isAtTop ? 'none' : 'blur(20px)',
        boxShadow: isAtTop ? 'none' : isDark
          ? '0 4px 24px rgba(0,0,0,0.3)'
          : '0 4px 24px rgba(0,0,0,0.06)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-emerald-500/40 group-hover:scale-105">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className={`text-lg font-bold tracking-tight transition-colors duration-300 ${
                isAtTop ? 'text-white' : 'text-emerald-700 dark:text-emerald-400'
              }`}>Hiraa</span>
              <span className={`text-xs block leading-none -mt-0.5 transition-colors duration-300 ${
                isAtTop ? 'text-white/55' : 'text-gray-500 dark:text-gray-400'
              }`}>Moral School</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? isAtTop
                        ? 'text-white bg-white/15'
                        : 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30'
                      : isAtTop
                        ? 'text-white/80 hover:text-white hover:bg-white/10'
                        : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                      isAtTop ? 'bg-white' : 'bg-emerald-500'
                    }`} />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-all duration-200 ${
                isAtTop
                  ? 'text-white/75 hover:text-white hover:bg-white/10'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'light'
                ? <Moon className="w-5 h-5" />
                : <Sun className="w-5 h-5 text-amber-400" />}
            </button>

            {user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  className={`relative p-2.5 rounded-xl transition-all duration-200 ${
                    isAtTop
                      ? 'text-white/75 hover:text-white hover:bg-white/10'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-1 ring-white dark:ring-gray-900" />
                  )}
                </Link>

                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all duration-200 ${
                      isAtTop
                        ? 'hover:bg-white/10'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className={`hidden md:block text-sm font-semibold max-w-24 truncate transition-colors duration-300 ${
                      isAtTop ? 'text-white' : 'text-gray-700 dark:text-gray-200'
                    }`}>
                      {profile?.full_name?.split(' ')[0] || 'User'}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''} ${
                      isAtTop ? 'text-white/60' : 'text-gray-400'
                    }`} />
                  </button>

                  {profileOpen && (
                    <div
                      className="absolute right-0 mt-2 w-60 rounded-2xl overflow-hidden animate-scale-in z-50"
                      style={{
                        background: isDark ? '#111827' : '#ffffff',
                        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
                        boxShadow: isDark
                          ? '0 20px 40px rgba(0,0,0,0.5)'
                          : '0 20px 40px rgba(0,0,0,0.12)',
                      }}
                    >
                      <div className="p-4"
                        style={{
                          background: isDark
                            ? 'linear-gradient(135deg, rgba(5,150,105,0.15), rgba(4,120,87,0.08))'
                            : 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
                          borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #a7f3d0',
                        }}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
                            {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{profile?.full_name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-36">{profile?.email}</p>
                            <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                              profile?.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                              profile?.role === 'teacher' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                              'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                            }`}>
                              {profile?.role}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <Link
                          to={getDashboardPath()}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all"
                        >
                          <div className="w-7 h-7 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                            <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          Dashboard
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                        >
                          <div className="w-7 h-7 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                            <LogOut className="w-3.5 h-3.5 text-red-500" />
                          </div>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2 ml-1">
                <Link
                  to="/login"
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isAtTop
                      ? 'text-white/90 hover:text-white hover:bg-white/10'
                      : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  Log In
                </Link>
                <Link to="/signup" className="btn-primary text-sm px-5 py-2.5">
                  Sign Up
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2.5 rounded-xl transition-all duration-200 ${
                isAtTop
                  ? 'text-white/80 hover:text-white hover:bg-white/10'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            className="lg:hidden py-3 pb-4 animate-slide-down"
            style={{
              borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
              background: isDark ? 'rgba(10,18,34,0.99)' : 'rgba(255,255,255,0.99)',
            }}
          >
            <div className="space-y-0.5 px-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                    location.pathname === link.href
                      ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            {!user && (
              <div className="px-1 pt-3 mt-2 flex flex-col gap-2"
                style={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #f1f5f9' }}>
                <Link to="/login" onClick={() => setIsOpen(false)} className="btn-outline text-sm text-center">Log In</Link>
                <Link to="/signup" onClick={() => setIsOpen(false)} className="btn-primary text-sm text-center">Sign Up</Link>
              </div>
            )}
            {user && (
              <div className="px-1 pt-2 mt-2"
                style={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #f1f5f9' }}>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={() => { setIsOpen(false); handleSignOut(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
