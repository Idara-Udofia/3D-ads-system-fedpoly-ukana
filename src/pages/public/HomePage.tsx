import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  GraduationCap,
  Building2,
  Play,
  FileCheck,
  ArrowRight,
  Sparkles,
  Users,
  ShieldCheck,
  CheckCircle,
  Clock,
  Eye,
  Bell,
  MapPin,
} from 'lucide-react';
import { INSTITUTION_ASSETS } from '../../assets/images';
import {
  Programme,
  Facility,
  CampusLocation,
  VideoItem,
  Announcement,
  AdmissionInfo,
} from '../../types';
import VirtualCampus from '../../three/VirtualCampus';

interface HomePageProps {
  programmes: Programme[];
  facilities: Facility[];
  campusLocations: CampusLocation[];
  videos: VideoItem[];
  announcements: Announcement[];
  admissionInfo: AdmissionInfo[];
  onSelectVideo: (videoId: string) => void;
  onOpenEnquiry: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  programmes,
  facilities,
  campusLocations,
  videos,
  announcements,
  admissionInfo,
  onSelectVideo,
  onOpenEnquiry,
}) => {
  const featuredVideo = videos.find((v) => v.featured) || videos[0];
  const admissionVideo = videos.find((v) => v.category === 'Admission') || videos[0];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* =========================================================================
          HERO SECTION (Complies with Research Brief & Guidelines)
         ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-12 pb-20 lg:pt-16 lg:pb-28">
        {/* Subtle background ambient mesh */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading, Supporting Text, and Primary Action Buttons */}
            <div className="lg:col-span-7 space-y-6">
              {/* Institution Emblem Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                <img
                  src={INSTITUTION_ASSETS.logo}
                  alt="FedPUka Crest"
                  className="w-5 h-5 object-contain"
                />
                <span>Federal Polytechnic, Ukana · Akwa Ibom State</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-serif text-balance">
                Explore. Discover. Learn.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                  Begin Your Journey.
                </span>
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Welcome to the official 3D Video Animation Advertisement System and interactive virtual gateway for Federal Polytechnic, Ukana. Explore our modern campus architecture in real-time 3D, inspect specialized engineering laboratories, watch multimedia programme showcases, and start your admission process.
              </p>

              {/* Main Four Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/campus"
                  className="px-5 py-3 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg hover:shadow-emerald-900/30 transition-all flex items-center gap-2 group"
                >
                  <Compass className="w-4 h-4 text-emerald-200 group-hover:rotate-45 transition-transform" />
                  <span>Explore Virtual Campus</span>
                </Link>

                <Link
                  to="/programmes"
                  className="px-5 py-3 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  <span>Explore Programmes</span>
                </Link>

                <Link
                  to="/admission"
                  className="px-5 py-3 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all flex items-center gap-2"
                >
                  <FileCheck className="w-4 h-4 text-amber-400" />
                  <span>Admission Information</span>
                </Link>

                {admissionVideo && (
                  <button
                    onClick={() => onSelectVideo(admissionVideo.id)}
                    className="px-5 py-3 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-600/40 rounded-xl transition-all flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                    <span>Watch Admission Video</span>
                  </button>
                )}
              </div>

              {/* Institutional Values & Trust Markers */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-xs text-slate-400">
                <div>
                  <div className="text-emerald-400 font-bold text-base sm:text-xl font-mono">100%</div>
                  <div>NBTE Accredited</div>
                </div>
                <div>
                  <div className="text-amber-400 font-bold text-base sm:text-xl font-mono">Hands-on</div>
                  <div>Technical Training</div>
                </div>
                <div>
                  <div className="text-sky-400 font-bold text-base sm:text-xl font-mono">Interactive</div>
                  <div>3D Digital Campus</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive 3D Preview Frame */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-emerald-500/30 shadow-2xl bg-slate-950 group">
                <img
                  src={INSTITUTION_ASSETS.gateHero}
                  alt="Federal Polytechnic Ukana Main Gate Monument"
                  className="w-full h-80 sm:h-96 object-cover brightness-95 group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Floating 3D Badge Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent flex flex-col justify-end p-6">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
                    <Compass className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>Real-time Spatial Tour</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                    Monumental Main Gate & Central Boulevard
                  </h3>
                  <p className="text-xs text-slate-300 mb-4 line-clamp-2">
                    Experience the architectural landscape of Ukana in immersive 3D with interactive landmark inspection.
                  </p>
                  <Link
                    to="/campus"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
                  >
                    <span>Launch Full 3D Campus Experience</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          OBJECTIVE 1: 3D VIRTUAL CAMPUS EMBEDDED EXPLORER
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-1.5">
              <Compass className="w-4 h-4" />
              <span>Research Objective 1: 3D Virtual Campus</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
              Explore Major Campus Locations in 3D
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Navigate through Federal Polytechnic Ukana's grounds. Click any building to reveal facility specs, linked academic curricula, and virtual tours.
            </p>
          </div>
          <Link
            to="/campus"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg border border-emerald-300 transition-colors shrink-0"
          >
            <span>Full-Screen 3D Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3D Canvas Box */}
        <VirtualCampus
          locations={campusLocations}
          programmes={programmes}
          facilities={facilities}
          videos={videos}
          onSelectVideo={onSelectVideo}
          isCompact={false}
        />
      </section>

      {/* =========================================================================
          OBJECTIVE 2: INTERACTIVE VIDEO ADVERTISEMENT SHOWCASE
         ========================================================================= */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Research Objective 2: Multimedia Video Modules
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1 font-serif">
                Polytechnic Video Advertisement System
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                High-definition promotional tours, admission guidance, academic workshop walkthroughs, and student life stories.
              </p>
            </div>
            <Link
              to="/videos"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              <span>View All Video Advertisements</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.slice(0, 6).map((vid) => (
              <div
                key={vid.id}
                onClick={() => onSelectVideo(vid.id)}
                className="group cursor-pointer bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden hover:border-emerald-500/60 transition-all duration-300 hover:shadow-xl flex flex-col"
              >
                {/* Thumbnail with Overlay */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={vid.thumbnail_url}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {vid.category}
                  </span>
                  <span className="absolute bottom-2.5 right-2.5 bg-black/80 font-mono text-[11px] text-white px-1.5 py-0.5 rounded">
                    {vid.duration}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {vid.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                      {vid.description}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      {vid.views} views
                    </span>
                    <span className="text-emerald-400 font-sans font-semibold">
                      Watch Video &rarr;
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURED ACADEMIC PROGRAMMES DIRECTORY
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              National Diploma (ND) Curricula
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif mt-0.5">
              Accredited Academic Programmes
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Equipping prospective candidates with high-demand technical competence, technological innovation, and self-reliance skills.
            </p>
          </div>
          <Link
            to="/programmes"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 shrink-0"
          >
            <span>Explore All Programmes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programmes.slice(0, 6).map((prog) => (
            <div
              key={prog.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-emerald-800">{prog.department}</span>
                  <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded">
                    {prog.duration}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-2 font-serif">
                  {prog.name}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {prog.description}
                </p>

                {/* Key Requirements Snippet */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs text-slate-700 mb-4 space-y-1">
                  <span className="font-semibold text-slate-900 block text-[11px] uppercase tracking-wide">
                    Admission Requirement:
                  </span>
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    {prog.requirements[0] || '5 O\'Level Credit passes in relevant subjects.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <Link
                  to={`/programmes/${prog.id}`}
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                >
                  <span>Full Curriculum</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                {prog.video_id && (
                  <button
                    onClick={() => onSelectVideo(prog.video_id)}
                    className="text-xs text-slate-500 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-slate-500" />
                    <span>Promo Video</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          CAMPUS FACILITIES HIGHLIGHT (Tetfund, ICT Centre, Laboratories)
         ========================================================================= */}
      <section className="bg-slate-50 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Infrastructural Facilities
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif mt-0.5">
                Modern Campus Facilities & Laboratories
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                State-of-the-art learning environments, TETFUND lecture auditoriums, digital computer centres, and sports arenas.
              </p>
            </div>
            <Link
              to="/facilities"
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 shrink-0"
            >
              <span>View All Facilities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {facilities.slice(0, 4).map((fac) => (
              <div
                key={fac.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                <img
                  src={fac.image_url}
                  alt={fac.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                      {fac.category}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-1 mb-1.5">
                      {fac.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                      {fac.description}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      {fac.location.split(',')[0]}
                    </span>
                    <Link
                      to={`/facilities/${fac.id}`}
                      className="font-semibold text-emerald-800 hover:underline"
                    >
                      Details &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          LATEST ANNOUNCEMENTS & ADMISSIONS CALL TO ACTION
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Announcements (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-700" />
                <h3 className="text-lg font-bold text-slate-900 font-serif">
                  Latest Campus Bulletins & Notices
                </h3>
              </div>
              <Link
                to="/announcements"
                className="text-xs font-semibold text-emerald-800 hover:underline"
              >
                View Archive
              </Link>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 3).map((ann) => (
                <div
                  key={ann.id}
                  className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-emerald-500/40 transition-colors"
                >
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1">
                    <span className="font-bold text-emerald-800">{ann.category}</span>
                    <span>·</span>
                    <span>Published {ann.published_date}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1">
                    {ann.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {ann.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Admission Call to Action Box (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <FileCheck className="w-4 h-4" />
              <span>2026/2027 Admissions Open</span>
            </div>

            <h3 className="text-2xl font-bold font-serif leading-snug">
              Begin Your Polytechnic Career at Ukana
            </h3>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Review admission eligibility guidelines, UTME screening procedures, accredited departments, and submit your enquiries directly to the Admissions Desk.
            </p>

            <div className="space-y-2.5 pt-2">
              <Link
                to="/admission"
                className="w-full py-3 bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <span>Read Admission Guidelines</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={onOpenEnquiry}
                className="w-full py-3 bg-emerald-950/60 hover:bg-emerald-950 border border-emerald-400/40 text-emerald-200 hover:text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors"
              >
                Submit Direct Student Enquiry
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
