import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

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

        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();

        if (!existingProfile) {
          // Get role from localStorage (set during signup) or default to student
          const storedRole = localStorage.getItem('hiraa-google-role') || 'student';
          localStorage.removeItem('hiraa-google-role');

          const { error: profileError } = await supabase.from('profiles').insert({
            id: user.id,
            email,
            full_name: fullName,
            role: storedRole,
            avatar_url: metadata?.avatar_url || metadata?.picture || '',
            approved: storedRole === 'student',
            status: storedRole === 'teacher' ? 'pending' : 'active',
          });

          if (profileError) {
            console.error('Profile creation error:', profileError);
            setStatus('error');
            setMessage('Failed to create profile. Please contact support.');
            return;
          }
        }

        setStatus('success');
        setMessage('Successfully signed in!');

        // Redirect based on role
        setTimeout(() => {
          navigate('/');
        }, 1500);
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
              Completing Sign In...
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
