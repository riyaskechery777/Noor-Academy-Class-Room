import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function GoogleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signInWithGoogle, profile } = useAuth();
  const navigate = useNavigate();
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      setError(error.message || 'Invalid email or password');
      return;
    }

    // Wait briefly for profile to load then redirect
    setTimeout(() => {
      const storedProfile = JSON.parse(localStorage.getItem('hiraa-profile') || '{}');
      navigate('/');
    }, 100);
  };

  const getDashboardHint = (role: string) => {
    const hints = { admin: '/admin', teacher: '/teacher', student: '/student' };
    return hints[role as keyof typeof hints] || '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero pattern-overlay relative">
        <div className="relative flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Hiraa Moral School</span>
          </Link>

          <div>
            <div className="font-arabic text-4xl text-gold-300 mb-4">عِلْمٌ نَافِعٌ</div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Welcome Back to Your Learning Journey
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              Access your courses, track your progress, and continue building knowledge with Islamic values.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-10">
              {[
                { value: '2,500+', label: 'Active Students' },
                { value: '120+', label: 'Available Courses' },
                { value: '80+', label: 'Expert Teachers' },
                { value: '5K+', label: 'Certificates Issued' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                  <p className="text-white font-bold text-2xl">{stat.value}</p>
                  <p className="text-white/60 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/50 text-sm">&copy; {new Date().getFullYear()} Hiraa Moral School</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400">Hiraa School</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sign In</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Enter your credentials to access your account.</p>
          </div>

          {error && (
            <div className="mb-5 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-field pl-11"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">Password</label>
                <button type="button" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field pl-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full gap-2 py-3.5"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-50 dark:bg-gray-950 text-gray-500 dark:text-gray-400">or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={async () => {
              setGoogleLoading(true);
              setError('');
              const { error } = await signInWithGoogle();
              if (error) {
                setError(error.message || 'Google sign-in failed');
                setGoogleLoading(false);
              }
            }}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-500 border-t-gray-600 dark:border-t-gray-300 rounded-full animate-spin"></div>
            ) : (
              <GoogleIcon />
            )}
            <span>{googleLoading ? 'Signing in...' : 'Sign in with Google'}</span>
          </button>

          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
              Create one
            </Link>
          </p>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl">
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-2">Demo Accounts</p>
            <div className="space-y-1.5">
              {[
                { role: 'Admin', email: 'admin@hiraa.edu', pass: 'admin123' },
                { role: 'Teacher', email: 'teacher@hiraa.edu', pass: 'teacher123' },
                { role: 'Student', email: 'student@hiraa.edu', pass: 'student123' },
              ].map(demo => (
                <button
                  key={demo.role}
                  onClick={() => { setEmail(demo.email); setPassword(demo.pass); }}
                  className="w-full flex items-center justify-between text-xs px-3 py-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-gray-600 dark:text-gray-300 transition-colors"
                >
                  <span className="font-medium text-emerald-700 dark:text-emerald-300">{demo.role}</span>
                  <span className="text-gray-400">{demo.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
