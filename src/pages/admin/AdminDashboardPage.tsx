import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { DashboardMetrics } from '../../types';
import {
  Users,
  Video,
  GraduationCap,
  Building2,
  Compass,
  Mail,
  TrendingUp,
  Monitor,
  Smartphone,
  Tablet,
  ArrowRight,
  ExternalLink,
  Plus,
  Info,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const data = await api.getDashboardMetrics();
        setMetrics(data);
      } catch (err) {
        console.error('Failed to load metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  const totalDevices = metrics
    ? (metrics.devices.desktop || 1) + (metrics.devices.mobile || 1) + (metrics.devices.tablet || 1)
    : 100;

  const desktopPct = metrics ? Math.round((metrics.devices.desktop / totalDevices) * 100) : 54;
  const mobilePct = metrics ? Math.round((metrics.devices.mobile / totalDevices) * 100) : 38;
  const tabletPct = 100 - desktopPct - mobilePct;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
            Administrative Management & Engagement Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Federal Polytechnic, Ukana 3D Video Advertisement System · Central Operations
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link
            to="/admin/reports"
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            Export Reports (CSV)
          </Link>
          <Link
            to="/campus"
            target="_blank"
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>Launch 3D Campus</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Demo Analytics Banner */}
      <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs text-slate-300 flex items-start gap-3">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white">Demonstration Analytics Data:</span> Historical traffic indicators and user event aggregations include baseline research data combined with real-time browser session events recorded during application runtime.
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Total Visitors</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {metrics?.totalVisitors?.toLocaleString() || '1,420'}
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14.2% this month
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Video Views</span>
            <Video className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {metrics?.totalVideoViews?.toLocaleString() || '8,250'}
          </div>
          <div className="text-[10px] text-rose-400 flex items-center gap-1">
            <span>{metrics?.totalVideoCompletions || '5,800'} completed</span>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Programmes</span>
            <GraduationCap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {metrics?.totalProgrammes || 6}
          </div>
          <div className="text-[10px] text-slate-400">
            Active ND departments
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Facilities</span>
            <Building2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {metrics?.totalFacilities || 8}
          </div>
          <div className="text-[10px] text-slate-400">
            Mapped infrastructure
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase tracking-wider font-semibold">3D Interactions</span>
            <Compass className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {metrics?.campus3DInteractions?.toLocaleString() || '3,140'}
          </div>
          <div className="text-[10px] text-purple-400">
            Landmark clicks & tours
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Enquiries</span>
            <Mail className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {metrics?.totalEnquiries || 2}
          </div>
          <div className="text-[10px] text-amber-400">
            {metrics?.pendingEnquiries || 1} pending response
          </div>
        </div>
      </div>

      {/* Analytics Engagement Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Engagement Trend Chart (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-serif">
              Weekly Virtual Engagement & Video View Volume
            </h3>
            <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
              Demo Traffic Trends
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="space-y-3 pt-2">
            {[
              { day: 'Mon', visits: 180, videos: 290, pct: 60 },
              { day: 'Tue', visits: 240, videos: 380, pct: 80 },
              { day: 'Wed', visits: 310, videos: 460, pct: 95 },
              { day: 'Thu', visits: 290, videos: 410, pct: 88 },
              { day: 'Fri', visits: 350, videos: 520, pct: 100 },
              { day: 'Sat', visits: 210, videos: 330, pct: 70 },
              { day: 'Sun', visits: 160, videos: 260, pct: 55 },
            ].map((bar) => (
              <div key={bar.day} className="flex items-center gap-4 text-xs font-mono">
                <span className="w-8 text-slate-400">{bar.day}</span>
                <div className="flex-1 bg-slate-900 h-5 rounded-md overflow-hidden flex">
                  <div
                    style={{ width: `${bar.pct * 0.55}%` }}
                    className="bg-emerald-600 h-full transition-all duration-500"
                    title={`Visits: ${bar.visits}`}
                  />
                  <div
                    style={{ width: `${bar.pct * 0.45}%` }}
                    className="bg-rose-600 h-full transition-all duration-500"
                    title={`Video Plays: ${bar.videos}`}
                  />
                </div>
                <span className="w-16 text-right text-slate-300 font-mono">
                  {bar.visits + bar.videos}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-6 text-xs text-slate-400 border-t border-slate-900 pt-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-600" /> 3D Virtual Visits
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-rose-600" /> Video Advertisement Plays
            </span>
          </div>
        </div>

        {/* Device Breakdown (4 cols) */}
        <div className="lg:col-span-4 bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-serif mb-1">
              Device Platform Distribution
            </h3>
            <p className="text-xs text-slate-400">
              User environment rendering modes
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Monitor className="w-4 h-4 text-sky-400" /> Desktop Web (High-res 3D)
                </span>
                <span className="font-mono font-bold text-white">{desktopPct}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div style={{ width: `${desktopPct}%` }} className="bg-sky-500 h-full" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Smartphone className="w-4 h-4 text-emerald-400" /> Mobile Phones (Touch Controls)
                </span>
                <span className="font-mono font-bold text-white">{mobilePct}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div style={{ width: `${mobilePct}%` }} className="bg-emerald-500 h-full" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Tablet className="w-4 h-4 text-amber-400" /> Tablets & iPads
                </span>
                <span className="font-mono font-bold text-white">{tabletPct}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div style={{ width: `${tabletPct}%` }} className="bg-amber-500 h-full" />
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
            WebGL 3D environment auto-adapts viewport aspect ratio and provides touch controls for mobile devices.
          </div>
        </div>
      </div>

      {/* Content Management Quick Access Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white font-serif">
          Administrative Content Management Modules
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/programmes"
            className="p-4 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl transition-all group"
          >
            <GraduationCap className="w-6 h-6 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-sm text-white">Academic Programmes</h4>
            <p className="text-xs text-slate-400 mt-1">Manage ND courses, requirements, and careers.</p>
          </Link>

          <Link
            to="/admin/campus"
            className="p-4 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl transition-all group"
          >
            <Compass className="w-6 h-6 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-sm text-white">3D Campus Coordinates</h4>
            <p className="text-xs text-slate-400 mt-1">Configure X, Y, Z coordinates, models, and colors.</p>
          </Link>

          <Link
            to="/admin/videos"
            className="p-4 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl transition-all group"
          >
            <Video className="w-6 h-6 text-rose-400 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-sm text-white">Video Advertisements</h4>
            <p className="text-xs text-slate-400 mt-1">Upload promo tours, track views and completions.</p>
          </Link>

          <Link
            to="/admin/enquiries"
            className="p-4 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl transition-all group"
          >
            <Mail className="w-6 h-6 text-teal-400 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-sm text-white">Candidate Enquiries</h4>
            <p className="text-xs text-slate-400 mt-1">Review student questions and update resolution status.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
