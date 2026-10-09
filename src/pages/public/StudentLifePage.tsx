import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Compass,
  Trophy,
  Home,
  Laptop,
  HeartHandshake,
  ArrowRight,
} from 'lucide-react';
import { INSTITUTION_ASSETS } from '../../assets/images';

export const StudentLifePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
          <Users className="w-4 h-4" />
          <span>Collegiate Experience & Community</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
          Student Life at Federal Polytechnic, Ukana
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Beyond technical lectures, experience a vibrant campus community centered around innovation, leadership, collegiate sports, student welfare, and mutual camaraderie.
        </p>
      </div>

      {/* Hero Showcase with Convocation Photo */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 group">
        <img
          src={INSTITUTION_ASSETS.convocation}
          alt="Convocation Academic Procession at Federal Polytechnic Ukana"
          className="w-full h-80 sm:h-96 object-cover brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white">
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            Academic Excellence & Convocation
          </span>
          <h2 className="text-xl sm:text-3xl font-bold font-serif mb-2 max-w-2xl">
            "Skills for Excellence and Self Reliance"
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Our students graduate with recognized National Diplomas, certified hands-on vocational skills, and the confidence to establish technological enterprises or pursue Higher National Diploma (HND) and degree pathways.
          </p>
        </div>
      </div>

      {/* Pillars of Student Life */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Accommodation & Hostels */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Home className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 font-serif">
            Student Residential Halls
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Comfortable, solar-backed on-campus accommodation for male and female students with 24/7 security, steady water supply, study common rooms, and convenient proximity to lecture pavilions.
          </p>
          <Link
            to="/campus"
            className="text-xs font-semibold text-emerald-800 hover:underline inline-flex items-center gap-1"
          >
            Locate Hostels in 3D &rarr;
          </Link>
        </div>

        {/* Sports & Athletics */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 font-serif">
            Sports & Inter-School Athletics
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Participate in inter-departmental football tournaments, track and field championships, volleyball, and basketball on the Polytechnic sports arena, promoting fitness and discipline.
          </p>
          <Link
            to="/facilities"
            className="text-xs font-semibold text-emerald-800 hover:underline inline-flex items-center gap-1"
          >
            View Sports Complex &rarr;
          </Link>
        </div>

        {/* Tech Clubs & Innovation */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
            <Laptop className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 font-serif">
            ICT Hubs & Student Coding Clubs
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Join the developer circles, hardware prototyping hackathons, and design clubs hosted inside the modern 250-seat computer centre.
          </p>
          <Link
            to="/programmes"
            className="text-xs font-semibold text-emerald-800 hover:underline inline-flex items-center gap-1"
          >
            Computer Science Studies &rarr;
          </Link>
        </div>
      </div>

      {/* Visual Photo Gallery */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 font-serif">
          Campus Life Photo Archive
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-xl overflow-hidden border border-slate-200 h-52 group">
            <img
              src={INSTITUTION_ASSETS.gateHero}
              alt="Main Gate Entrance"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="rounded-xl overflow-hidden border border-slate-200 h-52 group">
            <img
              src={INSTITUTION_ASSETS.campusComplex}
              alt="Lecture Hall Complex"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="rounded-xl overflow-hidden border border-slate-200 h-52 group">
            <img
              src={INSTITUTION_ASSETS.engineeringLab}
              alt="Engineering & ICT Laboratory"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLifePage;
