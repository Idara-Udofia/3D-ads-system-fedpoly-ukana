import React, { useState } from 'react';
import { Settings, Shield, Database, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [showDemoNotices, setShowDemoNotices] = useState(true);
  const [cacheCleared, setCacheCleared] = useState(false);

  const handleClearCache = () => {
    sessionStorage.clear();
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-xl font-bold text-white font-serif flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-400" />
          System Settings & Research Configuration
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure demonstration content banners, review database persistence status, and clear local caches.
        </p>
      </div>

      <div className="space-y-6">
        {/* Demonstration Content Policy Section */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-white font-serif flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Demonstration Content Policy Compliance
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                As an academic software prototype for Federal Polytechnic, Ukana, all architectural 3D coordinates, demo admissions dates, and sample statistics are marked as DEMO CONTENT until replaced with official gazetted institution records.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-900 flex items-center justify-between">
            <span className="text-xs text-slate-300">
              Display "Prototype Campus Model" and "Demo Content" warning badges on public views:
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showDemoNotices}
                onChange={(e) => setShowDemoNotices(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

        {/* Database & Architecture Status */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white font-serif flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            Backend Database & Storage Architecture
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Storage Engine</span>
              <span className="text-emerald-400 font-bold">Atomic JSON Store / PostgreSQL Schema Ready</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Authentication</span>
              <span className="text-white font-bold">HMAC-SHA256 Signed Bearer Tokens</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">3D Graphics Engine</span>
              <span className="text-purple-400 font-bold">Three.js WebGL with PCF Soft Shadows</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Client Fallback</span>
              <span className="text-sky-400 font-bold">2D Vector Spatial Map Mode Active</span>
            </div>
          </div>
        </div>

        {/* Cache Reset */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-white">Client Session Cache</h4>
            <p className="text-[11px] text-slate-400">Clear temporary session IDs and analytics buffer in browser.</p>
          </div>
          <button
            onClick={handleClearCache}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{cacheCleared ? 'Cache Cleared!' : 'Clear Browser Cache'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
