import React, { useState } from 'react';
import {
  Video,
  Play,
  Eye,
  Clock,
  Sparkles,
  Compass,
  GraduationCap,
  FileCheck,
} from 'lucide-react';
import { VideoItem } from '../../types';

interface VideosPageProps {
  videos: VideoItem[];
  onSelectVideo: (videoId: string) => void;
}

export const VideosPage: React.FC<VideosPageProps> = ({
  videos,
  onSelectVideo,
}) => {
  const [selectedCat, setSelectedCat] = useState<string>('All');

  const categories = [
    'All',
    'Admission',
    'Academic Programmes',
    'Campus Tour',
    'Facilities',
    'Student Life',
    'Institutional',
  ];

  const filtered = selectedCat === 'All'
    ? videos
    : videos.filter((v) => v.category === selectedCat);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
          <Video className="w-4 h-4" />
          <span>Objective 2 · Multimedia Video Advertisement System</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
          Video Advertisements & Virtual Tours
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Immersive multimedia showcases communicating Federal Polytechnic, Ukana's academic excellence, state-of-the-art facilities, student achievements, and admission roadmaps.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1 border-b border-slate-100">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              selectedCat === cat
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((video) => (
          <div
            key={video.id}
            onClick={() => onSelectVideo(video.id)}
            className="group cursor-pointer bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden bg-slate-950">
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center group-hover:bg-slate-950/40 transition-colors">
                <div className="w-12 h-12 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-white ml-0.5" />
                </div>
              </div>

              {/* Badges */}
              <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-xs text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                {video.category}
              </span>
              <span className="absolute bottom-3 right-3 bg-slate-950/80 font-mono text-[11px] text-white px-2 py-0.5 rounded">
                {video.duration}
              </span>
            </div>

            {/* Video Meta */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-800 transition-colors font-serif mb-2 line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {video.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  {video.views} plays
                </span>
                <span className="text-emerald-700 font-sans font-bold flex items-center gap-1">
                  Watch Video &rarr;
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideosPage;
