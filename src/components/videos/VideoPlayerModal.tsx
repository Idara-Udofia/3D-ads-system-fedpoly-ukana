import React, { useRef, useState, useEffect } from 'react';
import { VideoItem } from '../../types';
import analytics from '../../services/analytics';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Compass,
  GraduationCap,
  FileCheck,
  Send,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

interface VideoPlayerModalProps {
  video: VideoItem | null;
  onClose: () => void;
  onExploreCampus?: () => void;
  onExploreProgrammes?: () => void;
  onExploreAdmission?: () => void;
  onOpenEnquiry?: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  video,
  onClose,
  onExploreCampus,
  onExploreProgrammes,
  onExploreAdmission,
  onOpenEnquiry,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [hasRecordedView, setHasRecordedView] = useState<boolean>(false);
  const [hasRecordedComplete, setHasRecordedComplete] = useState<boolean>(false);

  useEffect(() => {
    if (video) {
      setIsPlaying(false);
      setCurrentTime(0);
      setHasRecordedView(false);
      setHasRecordedComplete(false);
      // Auto-record play after 2 seconds
      const timer = setTimeout(() => {
        analytics.videoPlay(video.id);
        setHasRecordedView(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [video]);

  if (!video) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      if (!hasRecordedView) {
        analytics.videoPlay(video.id);
        setHasRecordedView(true);
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    const dur = videoRef.current.duration || video.duration_seconds;
    setDuration(dur);

    // Track 90% completion
    if (dur > 0 && videoRef.current.currentTime / dur > 0.9 && !hasRecordedComplete) {
      analytics.videoComplete(video.id);
      setHasRecordedComplete(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col text-white my-auto animate-in fade-in duration-200">
        {/* Video Player Container */}
        <div className="relative bg-black aspect-video flex items-center justify-center group overflow-hidden">
          <video
            ref={videoRef}
            src={video.video_url}
            poster={video.thumbnail_url}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => {
              setIsPlaying(false);
              if (!hasRecordedComplete) {
                analytics.videoComplete(video.id);
                setHasRecordedComplete(true);
              }
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            playsInline
            className="w-full h-full object-contain cursor-pointer"
            onClick={togglePlay}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white flex items-center justify-center border border-white/20 transition-all shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Center Play button when paused */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 z-10"
            >
              <Play className="w-8 h-8 fill-white ml-1" />
            </button>
          )}

          {/* Controls Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-6 flex flex-col gap-2 opacity-95 group-hover:opacity-100 transition-opacity">
            {/* Progress bar */}
            <input
              type="range"
              min="0"
              max={duration || video.duration_seconds || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-slate-700 accent-emerald-500 rounded-lg cursor-pointer"
            />

            <div className="flex items-center justify-between text-xs text-slate-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button
                  onClick={toggleMute}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <span className="font-mono text-[11px] text-slate-300">
                  {formatSeconds(currentTime)} / {formatSeconds(duration || video.duration_seconds)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {video.views} views
                </span>
                <button
                  onClick={toggleFullscreen}
                  className="hover:text-emerald-400 transition-colors"
                >
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Information & Interactive Next-Step CTAs */}
        <div className="p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                {video.category} Showcase
              </span>
              <h2 className="text-lg md:text-xl font-bold text-white mt-0.5">{video.title}</h2>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700 flex items-center gap-1.5 font-mono">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                {video.duration}
              </span>
            </div>
          </div>

          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            {video.description}
          </p>

          {/* Interactive Flow CTAs (Objective 2: Interactive Multimedia Modules) */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Connected Interactive Next Steps
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => {
                  onClose();
                  onExploreCampus?.();
                }}
                className="p-2.5 bg-slate-900 hover:bg-emerald-950 border border-slate-700 hover:border-emerald-500 rounded-xl text-left transition-all group"
              >
                <Compass className="w-4 h-4 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="block text-xs font-bold text-white">Explore Campus</span>
                <span className="block text-[10px] text-slate-400">Launch 3D virtual tour</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onExploreProgrammes?.();
                }}
                className="p-2.5 bg-slate-900 hover:bg-emerald-950 border border-slate-700 hover:border-emerald-500 rounded-xl text-left transition-all group"
              >
                <GraduationCap className="w-4 h-4 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="block text-xs font-bold text-white">Programmes</span>
                <span className="block text-[10px] text-slate-400">Review ND curricula</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onExploreAdmission?.();
                }}
                className="p-2.5 bg-slate-900 hover:bg-emerald-950 border border-slate-700 hover:border-emerald-500 rounded-xl text-left transition-all group"
              >
                <FileCheck className="w-4 h-4 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="block text-xs font-bold text-white">Admissions</span>
                <span className="block text-[10px] text-slate-400">UTME requirements</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenEnquiry?.();
                }}
                className="p-2.5 bg-slate-900 hover:bg-emerald-950 border border-slate-700 hover:border-emerald-500 rounded-xl text-left transition-all group"
              >
                <Send className="w-4 h-4 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="block text-xs font-bold text-white">Enquire Now</span>
                <span className="block text-[10px] text-slate-400">Contact admissions desk</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerModal;
