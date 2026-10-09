import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { INSTITUTION_ASSETS } from '../../assets/images';
import {
  LayoutDashboard,
  GraduationCap,
  Building2,
  Compass,
  Video,
  FileCheck,
  Bell,
  Mail,
  BarChart3,
  FileText,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Unable to end the server session:', error);
      window.alert('Sign out could not be completed. Check your connection and try again.');
    }
  };

  const navItems = [
    { label: 'Overview Dashboard', href: isAdmin ? '/admin/dashboard' : '/editor/dashboard', icon: LayoutDashboard, adminOnly: isAdmin },
    { label: 'Academic Programmes', href: '/admin/programmes', icon: GraduationCap, adminOnly: true },
    { label: 'Campus Facilities', href: '/admin/facilities', icon: Building2, adminOnly: true },
    { label: '3D Campus Locations', href: '/admin/campus', icon: Compass, adminOnly: true },
    { label: 'Video Advertisements', href: '/admin/videos', icon: Video },
    { label: 'Admission Information', href: '/admin/admission', icon: FileCheck, adminOnly: true },
    { label: 'Announcements', href: '/admin/announcements', icon: Bell, adminOnly: true },
    { label: 'Student Enquiries', href: '/admin/enquiries', icon: Mail, adminOnly: true },
    { label: 'Engagement Analytics', href: '/admin/analytics', icon: BarChart3, adminOnly: true },
    { label: 'Generate Reports', href: '/admin/reports', icon: FileText, adminOnly: true },
    { label: 'User Management', href: '/admin/users', icon: Users, adminOnly: true },
    { label: 'System Settings', href: '/admin/settings', icon: Settings, adminOnly: true },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src={INSTITUTION_ASSETS.logo}
              alt="FedPUka Crest"
              className="w-8 h-8 object-contain"
            />
            <div className="flex flex-col">
              <span className="font-bold text-xs text-white uppercase tracking-wider">
                {isAdmin ? 'Admin Console' : 'Editor Workspace'}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">
                FedPoly Ukana
              </span>
            </div>
          </Link>
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
            title="Open Public Site in New Tab"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* User Info Card */}
        <div className="p-3 bg-slate-900/60 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
            {user?.name?.slice(0, 2).toUpperCase() || 'AD'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.name || 'Administrator'}</p>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              {user?.role || 'admin'}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto text-xs">
          {navItems.map((item) => {
            if (item.adminOnly && !isAdmin) return null;
            const active = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all ${
                  active
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-14 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Management Console</span>
            <span>/</span>
            <span className="text-emerald-400 font-medium capitalize">
              {location.pathname.replace('/admin/', '').replace('-', ' ') || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400">
              Academic System: Online
            </span>
          </div>
        </header>

        <div className="p-6 md:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
