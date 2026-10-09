import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  X,
  AlertCircle,
  MapPin,
} from 'lucide-react';
import { Facility } from '../../types';
import api from '../../services/api';

interface AdminFacilitiesPageProps {
  facilities: Facility[];
  onRefresh: () => void;
}

export const AdminFacilitiesPage: React.FC<AdminFacilitiesPageProps> = ({
  facilities,
  onRefresh,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFac, setEditingFac] = useState<Facility | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<Facility['category']>('Academic');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Main Campus, Ukana');
  const [status, setStatus] = useState<'active' | 'maintenance'>('active');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingFac(null);
    setName('');
    setCategory('Academic');
    setDescription('');
    setLocation('Central Boulevard, Ukana');
    setStatus('active');
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (fac: Facility) => {
    setEditingFac(fac);
    setName(fac.name);
    setCategory(fac.category);
    setDescription(fac.description);
    setLocation(fac.location);
    setStatus(fac.status);
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category || !description) {
      setError('Please provide facility name, category, and description.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (editingFac) {
        await api.updateFacility(editingFac.id, {
          name,
          category,
          description,
          location,
          status,
        });
      } else {
        await api.createFacility({
          name,
          category,
          description,
          location,
          status,
          image_url: '/images/campus_complex_ukana_1791453435263.jpg',
          video_id: 'vid_tour',
        });
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save facility');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, facName: string) => {
    if (!confirm(`Are you sure you want to delete "${facName}"?`)) return;
    try {
      await api.deleteFacility(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete facility');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white font-serif flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            Campus Facilities Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Add and maintain institutional buildings, laboratories, lecture theatres, and sports pavilions.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors self-start shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Facility</span>
        </button>
      </div>

      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3">Facility Name</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Location</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {facilities.map((fac) => (
                <tr key={fac.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-white">
                    {fac.name}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">
                    <span className="font-mono text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      {fac.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">
                    {fac.location}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                        fac.status === 'active'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {fac.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(fac)}
                      className="p-1.5 text-slate-400 hover:text-emerald-400 rounded hover:bg-slate-800 transition-colors"
                      title="Edit Facility"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(fac.id, fac.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                      title="Delete Facility"
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
                {editingFac ? 'Edit Campus Facility' : 'Add New Campus Facility'}
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
                  Facility Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Science Laboratory Technology Complex"
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
                    <option value="Academic">Academic</option>
                    <option value="Laboratory">Laboratory</option>
                    <option value="Library">Library</option>
                    <option value="ICT">ICT</option>
                    <option value="Administration">Administration</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Sports">Sports</option>
                    <option value="Recreation">Recreation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Location Description
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Main Campus, East Quad"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe facility capacity, equipment, and purposes..."
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
                  {saving ? 'Saving...' : 'Save Facility'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFacilitiesPage;
