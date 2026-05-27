import React, { useEffect, useState } from 'react';
import { FileText, Send, Clock, CheckCircle, X } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function StudentAssignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    const enrollRes = await supabase
      .from('classroom_enrollments')
      .select('classroom_id')
      .eq('student_id', user!.id);

    const classroomIds = enrollRes.data?.map(e => e.classroom_id) ?? [];

    if (classroomIds.length > 0) {
      const { data: assignData } = await supabase
        .from('assignments')
        .select('*')
        .in('classroom_id', classroomIds)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      setAssignments(assignData ?? []);

      if (assignData && assignData.length > 0) {
        const subMap: Record<string, any> = {};
        for (const a of assignData) {
          const { data } = await supabase
            .from('assignment_submissions')
            .select('*')
            .eq('assignment_id', a.id)
            .eq('student_id', user!.id)
            .maybeSingle();
          if (data) subMap[a.id] = data;
        }
        setSubmissions(subMap);
      }
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    await supabase.from('assignment_submissions').upsert({
      assignment_id: selected.id,
      student_id: user!.id,
      submission_text: submissionText,
      status: 'submitted',
    });
    setSubmitting(false);
    setShowModal(false);
    setSubmissionText('');
    loadData();
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Assignments</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">View and submit your assignments.</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
          </div>
        ) : assignments.length === 0 ? (
          <div className="card p-16 text-center">
            <FileText className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No assignments available yet.</p>
            <p className="text-gray-400 text-sm mt-1">Enroll in a classroom to see your assignments.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map(a => {
              const sub = submissions[a.id];
              const isOverdue = a.due_date && new Date(a.due_date) < new Date();
              return (
                <div key={a.id} className="card p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      sub ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-blue-50 dark:bg-blue-900/20'
                    }`}>
                      {sub ? <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> : <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{a.title}</h3>
                      {a.description && <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 line-clamp-2">{a.description}</p>}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                        <span className={`flex items-center gap-1 ${isOverdue && !sub ? 'text-red-500' : ''}`}>
                          <Clock className="w-3 h-3" />
                          {a.due_date ? `Due: ${new Date(a.due_date).toLocaleDateString()}` : 'No deadline'}
                        </span>
                        <span>Max: {a.max_score} pts</span>
                        {sub?.score !== null && sub?.score !== undefined && (
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            Score: {sub.score}/{a.max_score}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {sub ? (
                        <span className={`badge text-xs ${sub.status === 'graded' ? 'badge-green' : 'badge-gold'}`}>
                          {sub.status === 'graded' ? 'Graded' : 'Submitted'}
                        </span>
                      ) : (
                        <button
                          onClick={() => { setSelected(a); setShowModal(true); }}
                          disabled={isOverdue}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                            isOverdue
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          <Send className="w-3.5 h-3.5" />
                          {isOverdue ? 'Overdue' : 'Submit'}
                        </button>
                      )}
                    </div>
                  </div>
                  {sub?.feedback && (
                    <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-800">
                      <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300 mb-1">Teacher Feedback:</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{sub.feedback}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-md p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Submit Assignment</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{selected.title}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Your Submission</label>
                <textarea
                  required
                  rows={5}
                  value={submissionText}
                  onChange={e => setSubmissionText(e.target.value)}
                  className="input-field resize-none"
                  placeholder="Write your answer or response here..."
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1 gap-2">
                  {submitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Submitting...</> : <><Send className="w-4 h-4" />Submit</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
