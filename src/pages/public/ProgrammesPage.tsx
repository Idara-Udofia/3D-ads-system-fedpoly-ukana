import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Search,
  ArrowRight,
  Clock,
  Play,
  Briefcase,
  CheckCircle,
  FileText,
} from 'lucide-react';
import { Programme } from '../../types';

interface ProgrammesPageProps {
  programmes: Programme[];
  onSelectVideo: (videoId: string) => void;
}

export const ProgrammesPage: React.FC<ProgrammesPageProps> = ({
  programmes,
  onSelectVideo,
}) => {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const departments = ['All', ...Array.from(new Set(programmes.map((p) => p.department)))];

  const filtered = programmes.filter((p) => {
    const matchesDept = selectedDept === 'All' || p.department === selectedDept;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.department.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
          <GraduationCap className="w-4 h-4" />
          <span>Academic Directory · National Diploma (ND)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
          Academic Programmes & Curricula
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Federal Polytechnic, Ukana offers rigorous, practical-oriented National Diploma programmes accredited by the National Board for Technical Education (NBTE).
        </p>
      </div>

      {/* Search & Department Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by programme name or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Department Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedDept === dept
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Programmes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((prog) => (
          <div
            key={prog.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between"
          >
            {/* Header Image */}
            <div className="relative h-44 overflow-hidden bg-slate-100">
              <img
                src={prog.image_url}
                alt={prog.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 right-3 bg-slate-900/80 text-white text-[11px] font-mono px-2.5 py-0.5 rounded-md backdrop-blur-xs">
                {prog.duration}
              </span>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide block mb-1">
                  {prog.department}
                </span>
                <h3 className="font-bold text-lg text-slate-900 font-serif mb-2">
                  {prog.name}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {prog.description}
                </p>

                {/* Career Prospects */}
                <div className="mb-4 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Career Opportunities:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {prog.career_prospects.slice(0, 3).map((career, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded"
                      >
                        {career}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/programmes/${prog.id}`}
                  className="px-3.5 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {prog.video_id && (
                  <button
                    onClick={() => onSelectVideo(prog.video_id)}
                    className="text-xs font-medium text-slate-600 hover:text-emerald-700 flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-600" />
                    <span>Watch Video</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgrammesPage;
