import React, { useEffect, useState } from 'react';
import { Award, Download, Calendar } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function StudentCertificates() {
  const { user, profile } = useAuth();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      supabase
        .from('certificates')
        .select('*, courses(title), issued_by_profile:profiles!certificates_issued_by_fkey(full_name)')
        .eq('student_id', user.id)
        .order('issued_at', { ascending: false })
        .then(({ data }) => {
          setCertificates(data ?? []);
          setLoading(false);
        });
    }
  }, [user]);

  const generateCertificatePDF = (cert: any) => {
    const content = `
CERTIFICATE OF COMPLETION

This certifies that

${profile?.full_name}

has successfully completed

${cert.title}

${cert.description}

Score: ${cert.score || 'N/A'}

Issued on: ${new Date(cert.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

Hiraa Moral School
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-${cert.title.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Certificates</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Your earned certificates and achievements.</p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {[1,2].map(i => <div key={i} className="h-40 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
          </div>
        ) : certificates.length === 0 ? (
          <div className="card p-16 text-center">
            <Award className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No Certificates Yet</h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">
              Complete your courses and pass your exams to earn certificates. Keep learning!
            </p>
            <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl inline-block">
              <p className="font-arabic text-xl text-emerald-700 dark:text-emerald-300">وَقُل رَّبِّ زِدْنِي عِلْمًا</p>
              <p className="text-emerald-600 dark:text-emerald-400 text-xs mt-1">"And say: My Lord, increase me in knowledge"</p>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {certificates.map(cert => (
              <div
                key={cert.id}
                className="card overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                <div className="gradient-hero pattern-overlay p-6 relative">
                  <div className="absolute top-4 right-4 opacity-20">
                    <Award className="w-20 h-20 text-gold-400" />
                  </div>
                  <div className="relative">
                    <p className="font-arabic text-lg text-gold-300 mb-2">شهادة</p>
                    <h3 className="text-xl font-bold text-white">{cert.title}</h3>
                    <p className="text-white/80 text-sm mt-1">Awarded to {profile?.full_name}</p>
                  </div>
                </div>
                <div className="p-5">
                  {cert.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{cert.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(cert.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      {cert.score > 0 && (
                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          Score: {cert.score}%
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => generateCertificatePDF(cert)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium rounded-lg transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
