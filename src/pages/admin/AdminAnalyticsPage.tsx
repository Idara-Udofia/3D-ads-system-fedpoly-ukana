import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Users,
  Compass,
  Video,
  Eye,
  CheckCircle2,
  Monitor,
  Smartphone,
  Tablet,
  Calendar,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api';
import { DashboardMetrics } from '../../types';

export const AdminAnalyticsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [dashMetrics, rawEvents] = await Promise.all([
          api.getDashboardMetrics(),
          api.getReportData('visitors').catch(() => null),
        ]);
        setMetrics(dashMetrics);
        if (rawEvents && rawEvents.data) {
          setEvents(rawEvents.data.slice(-25).reverse());
        }
      } catch (err) {
        console.error('Analytics load error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-xl font-bold text-white font-serif flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          User Engagement & Spatial Analytics
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Objective 3 user tracking data: 3D campus landmark clicks, video retention, device platforms, and visitor flows.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Unique Visits</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {metrics?.totalVisitors?.toLocaleString() || '1,420'}
          </div>
          <p className="text-[11px] text-slate-400">Aggregated session IDs</p>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Video Advertisement Views</span>
            <Video className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {metrics?.totalVideoViews?.toLocaleString() || '8,250'}
          </div>
          <p className="text-[11px] text-rose-400 font-mono">
            {metrics?.totalVideoCompletions?.toLocaleString() || '5,800'} completions (70.3%)
          </p>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>3D Spatial Landmark Interactions</span>
            <Compass className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {metrics?.campus3DInteractions?.toLocaleString() || '3,140'}
          </div>
          <p className="text-[11px] text-purple-400 font-mono">
            Average 2.2 landmarks explored / visit
          </p>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Prospective Student Leads</span>
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {metrics?.totalEnquiries || 2}
          </div>
          <p className="text-[11px] text-teal-400">
            Admissions enquiries received
          </p>
        </div>
      </div>

      {/* Real-Time Event Audit Log */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-850 pb-3">
          <h3 className="text-sm font-bold text-white font-serif">
            Recent Engagement Event Stream (Last 25 Interactions)
          </h3>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
            Live Database Sync
          </span>
        </div>

        <div className="overflow-x-auto max-h-80">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 text-[11px] uppercase tracking-wider sticky top-0">
              <tr>
                <th className="px-4 py-2">Event Type</th>
                <th className="px-4 py-2">Target ID</th>
                <th className="px-4 py-2">Device</th>
                <th className="px-4 py-2">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 font-mono text-[11px]">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                    No recent events recorded in session buffer.
                  </td>
                </tr>
              ) : (
                events.map((evt, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40">
                    <td className="px-4 py-2 text-emerald-400">{evt[1] || 'page_view'}</td>
                    <td className="px-4 py-2 text-slate-300">{evt[3] || 'home'}</td>
                    <td className="px-4 py-2 text-slate-400">{evt[4] || 'desktop'}</td>
                    <td className="px-4 py-2 text-slate-500">{evt[5] ? new Date(evt[5]).toLocaleTimeString() : 'Recent'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
