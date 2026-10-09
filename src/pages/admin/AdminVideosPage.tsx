import React, { useState } from 'react';
import {
  Video,
  Plus,
  Pencil,
  Trash2,
  X,
  Play,
  Eye,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { VideoItem } from '../../types';
import api from '../../services/api';

interface AdminVideosPageProps {
  videos: VideoItem[];
  onRefresh: () => void;
  onPreviewVideo: (videoId: string) => void;
}

export const AdminVideosPage: React.FC<AdminVideosPageProps> = ({
  videos,
  onRefresh,
  onPreviewVideo,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<VideoItem['category']>('Campus Tour');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [duration, setDuration] = useState('03:30');
  const [durationSeconds, setDurationSeconds] = useState(210);
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<'published' | 'draft'>('published');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingVideo(null);
    setTitle('');
    setDescription('');
    setCategory('Campus Tour');
    setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
    setThumbnailUrl('/images/campus_complex_ukana_1791453435263.jpg');
    setDuration('03:15');
    setDurationSeconds(195);
    setFeatured(false);
    setStatus('published');
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (vid: VideoItem) => {
    setEditingVideo(vid);
    setTitle(vid.title);
    setDescription(vid.description);
    setCategory(vid.category);
    setVideoUrl(vid.video_url);
    setThumbnailUrl(vid.thumbnail_url);
    setDuration(vid.duration);
    setDurationSeconds(vid.duration_seconds);
    setFeatured(vid.featured);
    setStatus(vid.status);
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !videoUrl) {
      setError('Please provide video title and URL.');
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      title,
      description,
      category,
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl || '/images/campus_complex_ukana_1791453435263.jpg',
      duration,
      duration_seconds: Number(durationSeconds),
      featured,
      status,
    };

    try {
      if (editingVideo) {
        await api.updateVideo(editingVideo.id, payload);
      } else {
        await api.createVideo(payload);
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save video record');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, vidTitle: string) => {
    if (!confirm(`Are you sure you want to delete video "${vidTitle}"?`)) return;
    try {
      await api.deleteVideo(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete video');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white font-serif flex items-center gap-2">
            <Video className="w-5 h-5 text-rose-400" />
            Video Advertisement System Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage promotional video tours, admission walk-throughs, and track video completion statistics.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors self-start shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Video</span>
        </button>
      </div>

      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3">Video Title</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Duration</th>
                <th className="px-5 py-3">Views / Completions</th>
                <th className="px-5 py-3">Featured</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {videos.map((vid) => (
                <tr key={vid.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-white">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => onPreviewVideo(vid.id)}
                        className="p-1 bg-slate-800 text-slate-300 hover:text-emerald-400 rounded transition-colors"
                        title="Preview Video"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                      <span className="truncate max-w-xs">{vid.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 font-mono text-[11px]">
                    {vid.category}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 font-mono text-[11px]">
                    {vid.duration}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-slate-300">
                    {vid.views} / {vid.completions}
                  </td>
                  <td className="px-5 py-3.5">
                    {vid.featured ? (
                      <span className="text-[10px] bg-rose-950 text-rose-400 border border-rose-800 px-2 py-0.5 rounded uppercase font-mono">
                        Featured
                      </span>
                    ) : (
                      <span className="text-slate-500 font-mono text-[11px]">No</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(vid)}
                      className="p-1.5 text-slate-400 hover:text-emerald-400 rounded hover:bg-slate-800 transition-colors"
                      title="Edit Video"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(vid.id, vid.title)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                      title="Delete Video"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold font-serif">
                {editingVideo ? 'Edit Video Advertisement' : 'Add New Video Advertisement'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Virtual Campus Tour: Welcome to Ukana"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value="Admission">Admission</option>
                    <option value="Academic Programmes">Academic Programmes</option>
                    <option value="Campus Tour">Campus Tour</option>
                    <option value="Facilities">Facilities</option>
                    <option value="Student Life">Student Life</option>
                    <option value="Institutional">Institutional</option>
                    <option value="Events">Events</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Duration (MM:SS)
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="03:30"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Video Stream URL *
                </label>
                <input
                  type="url"
                  required
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://...mp4"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-emerald-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Thumbnail URL
                </label>
                <input
                  type="text"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="/images/campus_complex_ukana_1791453435263.jpg"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-emerald-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Featured on Homepage</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold rounded-xl"
                >
                  {saving ? 'Saving...' : 'Save Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVideosPage;
