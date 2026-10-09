import React from 'react';
import { Link } from 'react-router-dom';
import { Video, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const EditorDashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <section className="max-w-5xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">Editor workspace</p>
        <h1 className="mt-2 text-2xl md:text-3xl font-bold text-white">
          Welcome, {user?.name || 'Editor'}
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Manage 3D video advertisement content and keep media details up to date.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Link
          to="/admin/videos"
          className="group rounded-2xl border border-slate-700 bg-slate-900 p-6 transition-colors hover:border-emerald-500/60 hover:bg-slate-900/80"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-950 text-emerald-400">
            <Video aria-hidden="true" className="h-5 w-5" />
          </span>
          <h2 className="mt-5 text-lg font-semibold text-white">Video advertisements</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Add and update video media, descriptions, categories, thumbnails, and draft status.
          </p>
          <span className="mt-5 inline-block text-sm font-semibold text-emerald-400 group-hover:text-emerald-300">
            Manage video content &rarr;
          </span>
        </Link>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-slate-400">
            <ShieldCheck aria-hidden="true" className="h-5 w-5" />
          </span>
          <h2 className="mt-5 text-lg font-semibold text-white">Editor permissions</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Your account can manage video advertisement content. User accounts, institutional settings, and other
            administrative records remain restricted to administrators.
          </p>
        </div>
      </div>
    </section>
  );
};

export default EditorDashboardPage;
