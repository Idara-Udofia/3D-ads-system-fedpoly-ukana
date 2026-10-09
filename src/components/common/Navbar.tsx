import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { INSTITUTION_ASSETS } from '../../assets/images';
import {
  Search,
  Compass,
  Menu,
  X,
  User,
  ShieldCheck,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenEnquiry: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, onOpenEnquiry }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, isAdmin } = useAuth();

  const navLinks = [
    { label: 'Virtual Campus', href: '/campus', badge: '3D' },
    { label: 'Programmes', href: '/programmes' },
    { label: 'Facilities', href: '/facilities' },
    { label: 'Videos', href: '/videos' },
    { label: 'Admission', href: '/admission' },
    { label: 'Student Life', href: '/student-life' },
    { label: 'About', href: '/about' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* ZONE 1: BRAND TITLE & OFFICIAL LOGO */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 group focus:outline-hidden"
          >
            <img
              src={INSTITUTION_ASSETS.logo}
              alt="Federal Polytechnic, Ukana Emblem"
              className="h-10 w-10 object-contain drop-shadow-xs transition-transform duration-200 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 tracking-tight text-sm sm:text-base leading-tight font-serif">
                Federal Polytechnic, Ukana
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold tracking-wider uppercase hidden sm:inline">
                Akwa Ibom State, Nigeria
              </span>
            </div>
          </Link>

          {/* ZONE 2: PRIMARY NAVIGATION LINKS */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative py-1 transition-colors hover:text-emerald-700 whitespace-nowrap ${
                    active ? 'text-emerald-800 font-semibold' : ''
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.label}
                    {link.badge && (
                      <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-sm border border-emerald-300">
                        {link.badge}
                      </span>
                    )}
                  </span>
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ZONE 3: ACTIONS & PORTAL ACCESS */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Search Button */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Search System (Cmd+K / Ctrl+K)"
              aria-label="Search System"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Quick 3D Campus Button for Mobile/Tablet */}
            <Link
              to="/campus"
              className="hidden sm:inline-flex lg:hidden items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors whitespace-nowrap"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>3D Tour</span>
            </Link>

            {/* Admin or Portal link */}
            {isAuthenticated ? (
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs whitespace-nowrap"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin Portal</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
              >
                <User className="w-3.5 h-3.5" />
                <span>Staff Login</span>
              </Link>
            )}

            {/* Apply / Enquiry Primary Button */}
            <button
              onClick={onOpenEnquiry}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs whitespace-nowrap"
            >
              Enquire / Apply
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE FLYOUT MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl space-y-2 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive(link.href)
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
            <Link
              to="/announcements"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Announcements & News
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Contact & Location
            </Link>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-3">
              <Link
                to={isAuthenticated ? '/admin/dashboard' : '/admin/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                {isAuthenticated ? 'Admin Dashboard' : 'Staff / Admin Login'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
