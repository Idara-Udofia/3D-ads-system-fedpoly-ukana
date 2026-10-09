import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Compass,
  MapPin,
  ExternalLink,
  Info,
  Building2,
  GraduationCap,
  Play,
  RotateCcw,
} from 'lucide-react';
import {
  CampusLocation,
  Programme,
  Facility,
  VideoItem,
} from '../../types';
import VirtualCampus from '../../three/VirtualCampus';

interface CampusPageProps {
  locations: CampusLocation[];
  programmes: Programme[];
  facilities: Facility[];
  videos: VideoItem[];
  onSelectVideo: (videoId: string) => void;
}

export const CampusPage: React.FC<CampusPageProps> = ({
  locations,
  programmes,
  facilities,
  videos,
  onSelectVideo,
}) => {
  const [searchParams] = useSearchParams();
  const initialLocId = searchParams.get('loc') || undefined;
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(locations.map((l) => l.category)))];

  const filteredLocations = filterCategory === 'All'
    ? locations
    : locations.filter((l) => l.category === filterCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>Interactive Virtual Spatial System</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-serif tracking-tight">
            3D Virtual Campus Exploration Studio
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Federal Polytechnic, Ukana virtual environment. Orbit the camera, zoom into academic departments, toggle daylight or night illumination, and select structures to inspect facilities and video tours.
          </p>
        </div>

        {/* Prototype Notice Banner */}
        <div className="bg-amber-50 border border-amber-300 text-amber-900 px-3.5 py-2 rounded-xl text-xs max-w-xs self-start md:self-auto">
          <p className="font-semibold flex items-center gap-1.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            Prototype Architectural Model
          </p>
          <p className="text-[11px] text-amber-800 mt-0.5">
            Representative model for research evaluation. Verified CAD models can be replaced via the Admin Dashboard.
          </p>
        </div>
      </div>

      {/* 3D Virtual Canvas Studio */}
      <VirtualCampus
        locations={locations}
        programmes={programmes}
        facilities={facilities}
        videos={videos}
        initialSelectedId={initialLocId}
        onSelectVideo={onSelectVideo}
        isCompact={false}
      />

      {/* Location Landmark Directory Grid */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-slate-900 font-serif">
            Campus Landmark Directory ({filteredLocations.length})
          </h2>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filterCategory === cat
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLocations.map((loc) => {
            const fac = facilities.find((f) => f.id === loc.related_facility_id);
            const prog = programmes.find((p) => p.id === loc.related_programme_id);
            const vid = videos.find((v) => v.id === loc.related_video_id);

            return (
              <div
                key={loc.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: loc.color || '#10b981' }}
                    />
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase">
                      {loc.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 mb-1">
                    {loc.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {loc.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    {fac && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="truncate">{fac.name}</span>
                      </div>
                    )}
                    {prog && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="truncate">{prog.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                  <span className="text-[10px] font-mono text-slate-400">
                    Pos ({loc.position_x}, {loc.position_z})
                  </span>
                  {vid && (
                    <button
                      onClick={() => onSelectVideo(vid.id)}
                      className="text-xs text-emerald-800 font-semibold hover:underline flex items-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-emerald-800" />
                      Watch Tour
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CampusPage;
