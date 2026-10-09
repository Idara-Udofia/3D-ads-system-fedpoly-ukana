import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  GraduationCap,
  Clock,
  Briefcase,
  CheckCircle2,
  Play,
  Building2,
  ArrowLeft,
  Send,
  Info,
} from 'lucide-react';
import { Programme, Facility, VideoItem } from '../../types';

interface ProgrammeDetailPageProps {
  programmes: Programme[];
  facilities: Facility[];
  videos: VideoItem[];
  onSelectVideo: (videoId: string) => void;
  onOpenEnquiry: () => void;
}

export const ProgrammeDetailPage: React.FC<ProgrammeDetailPageProps> = ({
  programmes,
  facilities,
  videos,
  onSelectVideo,
  onOpenEnquiry,
}) => {
  const { id } = useParams<{ id: string }>();
  const programme = programmes.find((p) => p.id === id);

  if (!programme) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Programme Not Found</h2>
        <p className="text-xs text-slate-500">The requested academic programme record could not be found.</p>
        <Link
          to="/programmes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-4 py-2 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Programmes Directory</span>
        </Link>
      </div>
    );
  }

  const relatedVideo = videos.find((v) => v.id === programme.video_id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-emerald-800">Home</Link>
        <span>/</span>
        <Link to="/programmes" className="hover:text-emerald-800">Programmes</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">{programme.name}</span>
      </div>

      {/* Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-4">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
            {programme.department}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif leading-tight">
            {programme.name}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {programme.description}
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-700">
            <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg">
              <Clock className="w-4 h-4 text-emerald-700" />
              Duration: {programme.duration}
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-900 px-3 py-1.5 rounded-lg font-medium">
              <GraduationCap className="w-4 h-4 text-emerald-700" />
              Award: National Diploma (ND)
            </span>
          </div>
        </div>

        {/* Hero Image / Video Trigger Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="relative h-48 group">
            <img
              src={programme.image_url}
              alt={programme.name}
              className="w-full h-full object-cover"
            />
            {relatedVideo && (
              <button
                onClick={() => onSelectVideo(relatedVideo.id)}
                className="absolute inset-0 bg-slate-950/40 flex items-center justify-center group-hover:bg-slate-950/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-white ml-0.5" />
                </div>
              </button>
            )}
          </div>
          <div className="p-4 space-y-2.5">
            <button
              onClick={onOpenEnquiry}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enquire About Admission</span>
            </button>
            <Link
              to="/campus"
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View Department on 3D Campus</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Admission Requirements & Career Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-200">
        {/* Requirements */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 font-serif flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            Admission & Entry Requirements
          </h2>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            {programme.requirements.map((req, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Career Opportunities */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 font-serif flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-700" />
            Career Prospects & Industry Pathways
          </h2>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2.5">
            {programme.career_prospects.map((career, idx) => (
              <div
                key={idx}
                className="bg-white p-3 rounded-xl border border-slate-200/80 text-xs text-slate-800 font-medium flex items-center gap-2.5 shadow-2xs"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                <span>{career}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p>
          <span className="font-semibold">Demonstration Academic Data:</span> Curriculum requirements and prospects are illustrative for the Federal Polytechnic, Ukana research prototype. Authorized academic administrators can update requirements in the Admin Portal.
        </p>
      </div>
    </div>
  );
};

export default ProgrammeDetailPage;
