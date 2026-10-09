import React from 'react';
import { Link } from 'react-router-dom';
import { INSTITUTION_ASSETS } from '../../assets/images';
import {
  Compass,
  GraduationCap,
  Building2,
  Video,
  FileCheck,
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  ExternalLink,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 text-sm">
      {/* Upper Footer: Main Navigation & Contact */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1 & 2: Institutional Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={INSTITUTION_ASSETS.logo}
                alt="Federal Polytechnic, Ukana Crest"
                className="h-12 w-12 object-contain"
              />
              <div>
                <h3 className="text-base font-bold text-white tracking-tight font-serif">
                  Federal Polytechnic, Ukana
                </h3>
                <p className="text-xs text-emerald-400 font-semibold tracking-wider uppercase">
                  Skills for Excellence and Self Reliance
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Established by the Federal Government of Nigeria to foster cutting-edge technological innovations, practical engineering mastery, scientific research, and entrepreneurial leadership.
            </p>

            <div className="pt-2 space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Main Campus, Ukana, Essien Udim LGA, Akwa Ibom State, Nigeria</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>info@fedpolyukana.edu.ng</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+234 (0) 803 000 0000 / Admissions Helpdesk</span>
              </div>
            </div>
          </div>

          {/* Col 3: Academic & 3D Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Digital Exploration
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/campus"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  3D Virtual Campus
                </Link>
              </li>
              <li>
                <Link
                  to="/videos"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5 text-emerald-400" />
                  Video Advertisements
                </Link>
              </li>
              <li>
                <Link
                  to="/programmes"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                  Academic Programmes
                </Link>
              </li>
              <li>
                <Link
                  to="/facilities"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  Campus Facilities
                </Link>
              </li>
              <li>
                <Link
                  to="/student-life"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Campus Life & Hostels
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Admissions & Notices */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Admissions & Portal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/admission"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Admission Guidelines
                </Link>
              </li>
              <li>
                <Link
                  to="/admission"
                  className="hover:text-emerald-400 transition-colors"
                >
                  UTME Cut-off Benchmarks
                </Link>
              </li>
              <li>
                <Link
                  to="/announcements"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Announcements & News
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Enquiries & Admissions Desk
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-emerald-400 transition-colors"
                >
                  About the Polytechnic
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Research & Administration */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Administrative & System
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/admin/login"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Staff Administrator Login
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/dashboard"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Content Management (CMS)
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/analytics"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Engagement Analytics
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/reports"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Exportable Reports (CSV)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Research Scope & Demonstration Banner */}
        <div className="mt-12 pt-8 border-t border-slate-900 bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            <strong className="text-slate-200">ACADEMIC RESEARCH IMPLEMENTATION:</strong> A Web-Based 3D Video Animation Advertisement System: A Case Study of Federal Polytechnic, Ukana. Direct implementation of research objectives covering 3D virtual campus exploration, interactive multimedia modules, administrative content management, and user engagement metrics.
          </p>
          <p className="text-[10px] text-amber-400/90 mt-1">
            * Demonstration Content Policy: Institutional statistics, sample fees, and prototype architectural CAD coordinates are demonstration content editable through the Administrative Dashboard.
          </p>
        </div>

        {/* Lower Row: Copyright */}
        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} Federal Polytechnic, Ukana. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Accredited by NBTE</span>
            <span>·</span>
            <span>Federal Ministry of Education</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
