import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { INSTITUTION_ASSETS } from '../../assets/images';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login({ email, password });
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/editor/dashboard', { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-block" aria-label="Federal Polytechnic, Ukana home">
          <img
            src={INSTITUTION_ASSETS.logo}
            alt="Federal Polytechnic, Ukana Logo"
            className="w-16 h-16 mx-auto object-contain drop-shadow-md"
          />
        </Link>
        <h1 className="text-2xl font-extrabold text-white font-serif tracking-tight">
          Staff Portal Sign In
        </h1>
        <p className="text-xs text-slate-400">
          Federal Polytechnic, Ukana · 3D Video Advertisement System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <section className="bg-slate-900 py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-800">
          {error && (
            <div
              id="login-error"
              role="alert"
              className="mb-5 p-3.5 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-xl flex items-center gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="staff-email" className="block text-xs font-semibold text-slate-300 mb-1">
                Institutional email address
              </label>
              <div className="relative">
                <Mail aria-hidden="true" className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  id="staff-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  maxLength={254}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@fedpolyukana.edu.ng"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="staff-password" className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock aria-hidden="true" className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  id="staff-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  maxLength={128}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              <ArrowRight aria-hidden="true" className="w-4 h-4" />
            </button>
          </form>
          <p className="mt-5 text-center text-[11px] leading-relaxed text-slate-500">
            Access is restricted to authorized institutional administrators and content editors.
          </p>
        </section>

        <p className="text-center text-xs text-slate-500 mt-6">
          <Link to="/" className="text-emerald-400 hover:underline">
            &larr; Back to Public Website
          </Link>
        </p>
      </div>
    </main>
  );
};

export default AdminLoginPage;
