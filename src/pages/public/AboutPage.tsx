import React from 'react';
import {
  Building2,
  Target,
  Sparkles,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import { INSTITUTION_ASSETS } from '../../assets/images';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
          <Building2 className="w-4 h-4" />
          <span>Institutional Profile</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
          About Federal Polytechnic, Ukana
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          A citadel of technological innovation, practical technical education, and vocational self-reliance situated in Akwa Ibom State, Nigeria.
        </p>
      </div>

      {/* Main Grid: History and Emblem */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-900 font-serif">
            Background & Institutional Mandate
          </h2>
          <p>
            Federal Polytechnic, Ukana was established by the Federal Government of Nigeria to bridge critical technical manpower deficiencies, empower youths with self-sustaining industrial skills, and catalyze technological progress in Akwa Ibom State and the nation at large.
          </p>
          <p>
            Operating in full compliance with National Board for Technical Education (NBTE) benchmarks, the Polytechnic offers National Diploma programmes across the School of Applied Sciences, School of Engineering, and School of Business Studies.
          </p>
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 font-medium">
            <span className="font-bold text-emerald-900 block mb-1">Institutional Motto:</span>
            "Skills for Excellence and Self Reliance"
          </div>
        </div>

        {/* Logo Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs text-center space-y-4">
          <img
            src={INSTITUTION_ASSETS.logo}
            alt="Official Emblem of Federal Polytechnic, Ukana"
            className="w-40 h-40 mx-auto object-contain"
          />
          <div>
            <h3 className="font-bold text-slate-900 font-serif text-base">
              The Official Crest
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Symbolizing the cogwheel of technological industry, the antenna of digital communication, the open book of academic research, and engineering tools.
            </p>
          </div>
        </div>
      </div>

      {/* Vision, Mission, & Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 font-serif">Our Vision</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            To be a leading world-class polytechnic recognized for academic excellence, innovative research, and technical ingenuity that produces self-reliant graduates.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 font-serif">Our Mission</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            To provide practical and qualitative technical training, cultivate innovative mindsets, and foster entrepreneurial capacity that meets the socio-economic demands of the nation.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 font-serif">Core Values</h3>
          <ul className="text-xs text-slate-600 space-y-1">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Excellence in Craft
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Innovation & Self-Reliance
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Moral Integrity & Equity
            </li>
          </ul>
        </div>
      </div>

      {/* Academic Research Implementation Note */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 space-y-3 shadow-xl">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>Academic Software Project Overview</span>
        </div>
        <h3 className="text-xl font-bold font-serif">
          A Web-Based 3D Video Animation Advertisement System: A Case Study of Federal Polytechnic, Ukana
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          This system was developed to solve the information dissemination and spatial visualization challenges faced by prospective candidates seeking tertiary admission in Nigeria. By synthesizing 3D WebGL spatial exploration, interactive multimedia video advertisements, and administrative content management, the system creates an engaging admissions experience.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
