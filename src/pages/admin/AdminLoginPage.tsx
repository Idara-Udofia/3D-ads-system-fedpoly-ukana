import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { INSTITUTION_ASSETS } from '../../assets/images';
import {
  Lock,
  Mail,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@fedpolyukana.edu.ng');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const setCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-block">
          <img
            src={INSTITUTION_ASSETS.logo}
            alt="Federal Polytechnic, Ukana Logo"
            className="w-16 h-16 mx-auto object-contain drop-shadow-md"
          />
        </Link>
        <h2 className="text-2xl font-extrabold text-white font-serif tracking-tight">
          Administrative Portal Access
        </h2>
        <p className="text-xs text-slate-400">
          Federal Polytechnic, Ukana · 3D Video Advertisement System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900 py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-800 space-y-6">
          {error && (
            <div className="p-3.5 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-xl flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Institutional Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@fedpolyukana.edu.ng"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Credentials */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
              One-Click Demo Test Accounts:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setCredentials('admin@fedpolyukana.edu.ng', 'admin123')}
                className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 rounded-lg text-left transition-colors"
              >
                <span className="block font-bold text-emerald-400">Admin</span>
                <span className="text-[10px] text-slate-400 font-mono">admin123</span>
              </button>
              <button
                type="button"
                onClick={() => setCredentials('editor@fedpolyukana.edu.ng', 'editor123')}
                className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 rounded-lg text-left transition-colors"
              >
                <span className="block font-bold text-amber-400">Editor</span>
                <span className="text-[10px] text-slate-400 font-mono">editor123</span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          <Link to="/" className="text-emerald-400 hover:underline">
            &larr; Back to Public Website
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
