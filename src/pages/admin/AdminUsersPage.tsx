import React, { useState, useEffect } from 'react';
import { Users, Shield, UserCheck, Mail, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import { User } from '../../types';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const list = await api.getUsers();
        setUsers(list);
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-xl font-bold text-white font-serif flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" />
          Administrative Role-Based Authorization
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          System user accounts with administrative, editorial, and visitor role permissions.
        </p>
      </div>

      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/80 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-5 py-3">Staff Name</th>
              <th className="px-5 py-3">Institutional Email</th>
              <th className="px-5 py-3">Assigned Role</th>
              <th className="px-5 py-3">Account Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-900/40">
                <td className="px-5 py-3.5 font-semibold text-white">
                  {u.name}
                </td>
                <td className="px-5 py-3.5 text-slate-400 font-mono text-[11px]">
                  {u.email}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                      u.role === 'admin'
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : u.role === 'editor'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-[10px] font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded">
                    {u.status || 'active'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
