import React, { useState, useEffect } from 'react';
import { Users, Shield, UserCheck, Mail, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import { User } from '../../types';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'editor'>('editor');

  const loadUsers = async () => {
    setLoading(true);
    try {
      setUsers(await api.getUsers());
    } catch (err) {
      console.error('Failed to load users:', err);
      setError(err instanceof Error ? err.message : 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      const created = await api.createUser({ name, email, password, role });
      setUsers((currentUsers) => [...currentUsers, created]);
      setName('');
      setEmail('');
      setPassword('');
      setRole('editor');
      setSuccess(`${created.role.toUpperCase()} account created successfully.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create the account.');
    } finally {
      setSaving(false);
    }
  };

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

      <form onSubmit={handleCreateUser} className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Create staff account</h2>
          <p className="mt-1 text-xs text-slate-400">Use a unique password of at least 12 characters.</p>
        </div>
        {error && <p role="alert" className="text-xs text-rose-300">{error}</p>}
        {success && <p role="status" className="text-xs text-emerald-300">{success}</p>}
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs text-slate-300">
            Staff name
            <input
              required
              maxLength={100}
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs text-slate-300">
            Institutional email
            <input
              type="email"
              required
              maxLength={254}
              autoComplete="off"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs text-slate-300">
            Temporary password
            <input
              type="password"
              required
              minLength={12}
              maxLength={128}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs text-slate-300">
            Role
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as 'admin' | 'editor')}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
            >
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </label>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {saving ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <p className="p-5 text-xs text-slate-400">Loading staff accounts...</p>
        ) : users.length === 0 ? (
          <p className="p-5 text-xs text-slate-400">No staff accounts have been created.</p>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
