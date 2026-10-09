import React, { useState } from 'react';
import { Bell, Plus, Pencil, Trash2, X, AlertCircle } from 'lucide-react';
import { Announcement } from '../../types';
import api from '../../services/api';

interface AdminAnnouncementsPageProps {
  announcements: Announcement[];
  onRefresh: () => void;
}

export const AdminAnnouncementsPage: React.FC<AdminAnnouncementsPageProps> = ({
  announcements,
  onRefresh,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [content, setContent] = useState('');
  const [publishedDate, setPublishedDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<'published' | 'draft'>('published');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingAnn(null);
    setTitle('');
    setCategory('Admissions');
    setContent('');
    setPublishedDate(new Date().toISOString().slice(0, 10));
    setStatus('published');
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (ann: Announcement) => {
    setEditingAnn(ann);
    setTitle(ann.title);
    setCategory(ann.category);
    setContent(ann.content);
    setPublishedDate(ann.published_date);
    setStatus(ann.status);
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setError('Please provide announcement title and content.');
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      title,
      category,
      content,
      published_date: publishedDate,
      status,
      image_url: '/images/gate_ukana_monument_1791453421074.jpg',
    };

    try {
      if (editingAnn) {
        await api.updateAnnouncement(editingAnn.id, payload);
      } else {
        await api.createAnnouncement(payload);
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save announcement');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, annTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${annTitle}"?`)) return;
    try {
      await api.deleteAnnouncement(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete announcement');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white font-serif flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-400" />
            Campus Announcements & Bulletins Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Publish academic calendar notices, screening dates, matriculation advisories, and administrative releases.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors self-start shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Notice</span>
        </button>
      </div>

      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3">Notice Title</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {announcements.map((ann) => (
                <tr key={ann.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-white">
                    {ann.title}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 font-mono text-[11px]">
                    {ann.category}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-slate-400">
                    {ann.published_date}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {ann.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(ann)}
                      className="p-1.5 text-slate-400 hover:text-emerald-400 rounded hover:bg-slate-800 transition-colors"
                      title="Edit Notice"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(ann.id, ann.title)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                      title="Delete Notice"
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
                {editingAnn ? 'Edit Campus Notice' : 'Draft New Campus Notice'}
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
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Schedule of 2026/2027 Matriculation Ceremony"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Admissions / Events / Academic"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Published Date
                  </label>
                  <input
                    type="date"
                    value={publishedDate}
                    onChange={(e) => setPublishedDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Announcement Body *
                </label>
                <textarea
                  required
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Notice details and instructions for students..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-emerald-500 resize-none"
                />
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
                  {saving ? 'Saving...' : 'Publish Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncementsPage;
