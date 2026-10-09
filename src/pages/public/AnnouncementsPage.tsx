import React, { useState } from 'react';
import { Bell, Search, Calendar, ArrowRight, Tag } from 'lucide-react';
import { Announcement } from '../../types';

interface AnnouncementsPageProps {
  announcements: Announcement[];
}

export const AnnouncementsPage: React.FC<AnnouncementsPageProps> = ({
  announcements,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const categories = ['All', ...Array.from(new Set(announcements.map((a) => a.category)))];

  const filtered = announcements.filter((a) => {
    const matchesCat = selectedCat === 'All' || a.category === selectedCat;
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
          <Bell className="w-4 h-4" />
          <span>Information & Communications Unit</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
          Campus Announcements & Official Bulletins
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Stay updated with admission screening schedules, matriculation dates, academic calendar notices, and campus developments.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search bulletins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedCat === cat
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedAnnouncement(item)}
            className="group cursor-pointer bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between p-6"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  {item.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.published_date}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-800 transition-colors font-serif mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                {item.content}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-800 font-semibold">
              <span>Read Full Notice</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Reader Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                {selectedAnnouncement.category}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {selectedAnnouncement.published_date}
              </span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 font-serif leading-snug">
              {selectedAnnouncement.title}
            </h2>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100 max-h-96 overflow-y-auto">
              {selectedAnnouncement.content}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsPage;
