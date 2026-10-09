import React, { useState } from 'react';
import { FileCheck, Plus, Pencil, Trash2, X, AlertCircle } from 'lucide-react';
import { AdmissionInfo } from '../../types';
import api from '../../services/api';

interface AdminAdmissionPageProps {
  admissionInfo: AdmissionInfo[];
  onRefresh: () => void;
}

export const AdminAdmissionPage: React.FC<AdminAdmissionPageProps> = ({
  admissionInfo,
  onRefresh,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdmissionInfo | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AdmissionInfo['category']>('Overview');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'active' | 'archived'>('active');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    setCategory('Overview');
    setContent('');
    setStatus('active');
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: AdmissionInfo) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setContent(item.content);
    setStatus(item.status);
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setError('Please provide title and content.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (editingItem) {
        await api.updateAdmissionInfo(editingItem.id, {
          title,
          category,
          content,
          status,
        });
      } else {
        await api.createAdmissionInfo({
          title,
          category,
          content,
          status,
        });
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save admission entry');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, titleName: string) => {
    if (!confirm(`Are you sure you want to delete "${titleName}"?`)) return;
    try {
      await api.deleteAdmissionInfo(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete admission entry');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white font-serif flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-teal-400" />
            Admission Content & Guidelines Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Maintain official screening requirements, cut-off guidelines, document clearance checklists, and FAQs.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors self-start shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Admission Entry</span>
        </button>
      </div>

      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3">Section Title</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Content Excerpt</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {admissionInfo.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-white">
                    {item.title}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 font-mono text-[11px]">
                    {item.category}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 max-w-sm truncate">
                    {item.content}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 text-slate-400 hover:text-emerald-400 rounded hover:bg-slate-800 transition-colors"
                      title="Edit Section"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                      title="Delete Section"
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
                {editingItem ? 'Edit Admission Section' : 'Add Admission Section'}
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
                  placeholder="e.g. UTME Eligibility & Cut-off Scores"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-emerald-500"
                >
                  <option value="Overview">Overview</option>
                  <option value="Eligibility">Eligibility</option>
                  <option value="Requirements">Requirements</option>
                  <option value="Application Process">Application Process</option>
                  <option value="Documents">Documents</option>
                  <option value="FAQ">FAQ</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Content *
                </label>
                <textarea
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Official instructions and details..."
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
                  {saving ? 'Saving...' : 'Save Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAdmissionPage;
