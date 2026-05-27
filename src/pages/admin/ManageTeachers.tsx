import React, { useEffect, useState } from 'react';
import { UserCheck, UserX, Search, Mail, Phone, Clock, CheckCircle, X } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase, Profile } from '../../lib/supabase';

export default function ManageTeachers() {
  const [teachers, setTeachers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  useEffect(() => { loadTeachers(); }, []);

  const loadTeachers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'teacher')
      .order('created_at', { ascending: false });
    setTeachers(data ?? []);
    setLoading(false);
  };

  const approveTeacher = async (id: string) => {
    await supabase.from('profiles').update({ approved: true, status: 'active' }).eq('id', id);
    loadTeachers();
  };

  const revokeTeacher = async (id: string) => {
    await supabase.from('profiles').update({ approved: false, status: 'inactive' }).eq('id', id);
    loadTeachers();
  };

  const filtered = teachers.filter(t => {
    const matchSearch = t.full_name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'pending' && !t.approved) || (filter === 'approved' && t.approved);
    return matchSearch && matchFilter;
  });

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Teachers</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Approve, manage, and monitor teacher accounts.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search teachers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10 py-2.5"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'pending', 'approved'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === f
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-emerald-400'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <UserCheck className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No teachers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Teacher</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Contact</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Joined</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {filtered.map(teacher => (
                    <tr key={teacher.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {teacher.full_name?.charAt(0)?.toUpperCase() || 'T'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">{teacher.full_name}</p>
                            <p className="text-gray-500 dark:text-gray-400 text-xs sm:hidden">{teacher.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" />{teacher.email}
                        </p>
                        {teacher.phone && (
                          <p className="text-gray-500 dark:text-gray-400 text-xs flex items-center gap-1.5 mt-1">
                            <Phone className="w-3 h-3" />{teacher.phone}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {teacher.approved ? (
                          <span className="badge-green text-xs">Approved</span>
                        ) : (
                          <span className="badge-gold text-xs">Pending</span>
                        )}
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-gray-500 dark:text-gray-400 text-xs flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(teacher.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center gap-2 justify-end">
                          {!teacher.approved ? (
                            <button
                              onClick={() => approveTeacher(teacher.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Approve
                            </button>
                          ) : (
                            <button
                              onClick={() => revokeTeacher(teacher.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-medium rounded-lg transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                              Revoke
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
