import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  GraduationCap,
  Building2,
  Video,
  Compass,
  Bell,
  FileCheck,
  ArrowRight,
} from 'lucide-react';
import {
  Programme,
  Facility,
  CampusLocation,
  VideoItem,
  Announcement,
  AdmissionInfo,
  SearchResultItem,
} from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  programmes: Programme[];
  facilities: Facility[];
  campusLocations: CampusLocation[];
  videos: VideoItem[];
  announcements: Announcement[];
  admissionInfo: AdmissionInfo[];
  onSelectVideo?: (videoId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  programmes,
  facilities,
  campusLocations,
  videos,
  announcements,
  admissionInfo,
  onSelectVideo,
}) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Programmes' | 'Facilities' | 'Campus' | 'Videos' | 'Announcements'>('All');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const results: SearchResultItem[] = [];

  if (q.length > 0) {
    // Programmes
    if (activeCategory === 'All' || activeCategory === 'Programmes') {
      programmes.forEach((p) => {
        if (
          p.name.toLowerCase().includes(q) ||
          p.department.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        ) {
          results.push({
            id: p.id,
            title: p.name,
            category: 'Academic Programme',
            description: p.department,
            url: `/programmes/${p.id}`,
            type: 'programme',
          });
        }
      });
    }

    // Facilities
    if (activeCategory === 'All' || activeCategory === 'Facilities') {
      facilities.forEach((f) => {
        if (
          f.name.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q)
        ) {
          results.push({
            id: f.id,
            title: f.name,
            category: `Facility (${f.category})`,
            description: f.location,
            url: `/facilities/${f.id}`,
            type: 'facility',
          });
        }
      });
    }

    // 3D Campus Locations
    if (activeCategory === 'All' || activeCategory === 'Campus') {
      campusLocations.forEach((c) => {
        if (
          c.name.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
        ) {
          results.push({
            id: c.id,
            title: c.name,
            category: '3D Campus Landmark',
            description: c.description,
            url: `/campus?loc=${c.id}`,
            type: 'campus',
          });
        }
      });
    }

    // Videos
    if (activeCategory === 'All' || activeCategory === 'Videos') {
      videos.forEach((v) => {
        if (
          v.title.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q)
        ) {
          results.push({
            id: v.id,
            title: v.title,
            category: `Video (${v.category})`,
            description: `${v.duration} · ${v.views} views`,
            url: `/videos/${v.id}`,
            type: 'video',
          });
        }
      });
    }

    // Announcements
    if (activeCategory === 'All' || activeCategory === 'Announcements') {
      announcements.forEach((a) => {
        if (
          a.title.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q)
        ) {
          results.push({
            id: a.id,
            title: a.title,
            category: 'Announcement',
            description: a.published_date,
            url: `/announcements/${a.id}`,
            type: 'announcement',
          });
        }
      });
    }

    // Admission
    admissionInfo.forEach((adm) => {
      if (
        adm.title.toLowerCase().includes(q) ||
        adm.content.toLowerCase().includes(q)
      ) {
        results.push({
          id: adm.id,
          title: adm.title,
          category: 'Admission Guide',
          description: adm.category,
          url: '/admission',
          type: 'admission',
        });
      }
    });
  }

  const handleSelectResult = (item: SearchResultItem) => {
    onClose();
    if (item.type === 'video' && onSelectVideo) {
      onSelectVideo(item.id);
    } else {
      navigate(item.url);
    }
  };

  const getIcon = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'programme':
        return <GraduationCap className="w-4 h-4 text-emerald-600" />;
      case 'facility':
        return <Building2 className="w-4 h-4 text-amber-600" />;
      case 'campus':
        return <Compass className="w-4 h-4 text-sky-600" />;
      case 'video':
        return <Video className="w-4 h-4 text-rose-600" />;
      case 'announcement':
        return <Bell className="w-4 h-4 text-purple-600" />;
      case 'admission':
        return <FileCheck className="w-4 h-4 text-teal-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-start justify-center p-4 pt-16 sm:pt-24 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search programmes, 3D buildings, videos, admissions, facilities..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-2 py-1 rounded bg-slate-100"
          >
            ESC
          </button>
        </div>

        {/* Categories Tab Bar */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-1 overflow-x-auto text-xs">
          {(['All', 'Programmes', 'Facilities', 'Campus', 'Videos', 'Announcements'] as const).map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {query.trim() === '' ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <Search className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p>Type keywords to search Federal Polytechnic, Ukana's system.</p>
              <p className="mt-1 text-[11px] text-slate-400">
                Try: "Computer Science", "Library", "Hostel", "Admission", "Engineering"
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              <p>No matching records found for "{query}".</p>
              <p className="mt-1 text-[11px] text-slate-400">
                Check spelling or try a broader search term.
              </p>
            </div>
          ) : (
            results.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                onClick={() => handleSelectResult(item)}
                className="group p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 flex items-center justify-between cursor-pointer transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-white transition-colors">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
