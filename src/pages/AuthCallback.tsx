import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

function getRoleRedirect(role: string): string {
  if (role === 'admin') return '/admin';
  if (role === 'teacher') return '/teacher';
  return '/student';
}

export default function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          setStatus('error');
          setMessage('Authentication failed. Please try again.');
          return;
        }

        const user = session.user;
        const metadata = user.user_metadata;
        const fullName = metadata?.full_name || metadata?.name || '';
        const email = user.email || '';
        const avatarUrl = metadata?.avatar_url || metadata?.picture || '';

        // Check if profile already exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('id', user.id)
          .maybeSingle();

        let role = 'student';

        if (!existingProfile) {
          // New user — get role from localStorage (set during signup flow) or default student
          const storedRole = localStorage.getItem('hiraa-google-role') || 'student';
          localStorage.removeItem('hiraa-google-role');

          // Admin email always gets admin role
          const assignedRole = email === 'riyaskechery777@gmail.com' ? 'admin' : storedRole;

          const { error: profileError } = await supabase.from('profiles').insert({
            id: user.id,
            email,
            full_name: fullName,
            role: assignedRole,
            avatar_url: avatarUrl,
            phone: assignedRole === 'admin' ? '+99 9961814096' : '',
            approved: assignedRole === 'student' || assignedRole === 'admin',
            status: assignedRole === 'teacher' ? 'pending' : 'active',
          });

          if (profileError) {
            console.error('Profile creation error:', profileError);
            setStatus('error');
            setMessage('Failed to create profile. Please contact support.');
            return;
          }

          role = assignedRole;
        } else {
          // Existing user — update avatar in case it changed, force admin if email matches
          role = existingProfile.role;
          const updates: Record<string, unknown> = { avatar_url: avatarUrl, updated_at: new Date().toISOString() };
          if (email === 'riyaskechery777@gmail.com') {
            updates.role = 'admin';
            updates.status = 'active';
            updates.approved = true;
            updates.phone = '+99 9961814096';
            role = 'admin';
          }
          await supabase.from('profiles').update(updates).eq('id', user.id);
        }

        setStatus('success');
        setMessage('Welcome! Redirecting to your dashboard…');

        setTimeout(() => {
          navigate(getRoleRedirect(role), { replace: true });
        }, 1200);
      } catch (err) {
        console.error('Auth callback error:', err);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Completing Sign In…
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Please wait while we set up your account.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Welcome!
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Authentication Error
            </h2>
            <p className="text-red-600 dark:text-red-400 mb-6">{message}</p>
            <button
              onClick={() => navigate('/login')}
              className="btn-primary px-6 py-3"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
