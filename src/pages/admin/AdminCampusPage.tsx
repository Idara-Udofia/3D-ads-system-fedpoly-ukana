import React, { useState } from 'react';
import {
  Compass,
  Plus,
  Pencil,
  Trash2,
  X,
  AlertCircle,
  ExternalLink,
  Sliders,
} from 'lucide-react';
import { CampusLocation, Programme, Facility, VideoItem } from '../../types';
import api from '../../services/api';

interface AdminCampusPageProps {
  locations: CampusLocation[];
  programmes: Programme[];
  facilities: Facility[];
  videos: VideoItem[];
  onRefresh: () => void;
}

export const AdminCampusPage: React.FC<AdminCampusPageProps> = ({
  locations,
  programmes,
  facilities,
  videos,
  onRefresh,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLoc, setEditingLoc] = useState<CampusLocation | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Academic Buildings');
  const [description, setDescription] = useState('');
  const [buildingType, setBuildingType] = useState('academic');
  const [posX, setPosX] = useState<number>(0);
  const [posY, setPosY] = useState<number>(0);
  const [posZ, setPosZ] = useState<number>(0);
  const [rotationY, setRotationY] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.0);
  const [color, setColor] = useState('#d97706');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [relatedFacilityId, setRelatedFacilityId] = useState<string>('');
  const [relatedProgrammeId, setRelatedProgrammeId] = useState<string>('');
  const [relatedVideoId, setRelatedVideoId] = useState<string>('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingLoc(null);
    setName('');
    setCategory('Academic Buildings');
    setDescription('Prototype architectural location at Federal Polytechnic, Ukana.');
    setBuildingType('academic');
    setPosX(0);
    setPosY(0);
    setPosZ(0);
    setRotationY(0);
    setScale(1.0);
    setColor('#d97706');
    setStatus('active');
    setRelatedFacilityId('');
    setRelatedProgrammeId('');
    setRelatedVideoId('');
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (loc: CampusLocation) => {
    setEditingLoc(loc);
    setName(loc.name);
    setCategory(loc.category);
    setDescription(loc.description);
    setBuildingType(loc.building_type);
    setPosX(loc.position_x);
    setPosY(loc.position_y);
    setPosZ(loc.position_z);
    setRotationY(loc.rotation_y);
    setScale(loc.scale);
    setColor(loc.color);
    setStatus(loc.status);
    setRelatedFacilityId(loc.related_facility_id || '');
    setRelatedProgrammeId(loc.related_programme_id || '');
    setRelatedVideoId(loc.related_video_id || '');
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category) {
      setError('Please provide location name and category.');
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      name,
      category,
      description,
      building_type: buildingType,
      position_x: Number(posX),
      position_y: Number(posY),
      position_z: Number(posZ),
      rotation_x: 0,
      rotation_y: Number(rotationY),
      rotation_z: 0,
      scale: Number(scale),
      color,
      status,
      related_facility_id: relatedFacilityId || undefined,
      related_programme_id: relatedProgrammeId || undefined,
      related_video_id: relatedVideoId || undefined,
    };

    try {
      if (editingLoc) {
        await api.updateCampusLocation(editingLoc.id, payload);
      } else {
        await api.createCampusLocation(payload);
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save 3D campus location');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, locName: string) => {
    if (!confirm(`Are you sure you want to delete 3D location "${locName}"?`)) return;
    try {
      await api.deleteCampusLocation(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete location');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white font-serif flex items-center gap-2">
            <Compass className="w-5 h-5 text-purple-400" />
            3D Virtual Campus Landmark Administration
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Dynamically adjust spatial XYZ coordinates, building models, rotation, and links. Changes update the 3D scene in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <a
            href="/campus"
            target="_blank"
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <span>Live 3D View</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Landmark</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3">Landmark Name</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">3D Coordinates (X, Y, Z)</th>
                <th className="px-5 py-3">Scale</th>
                <th className="px-5 py-3">Color</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {locations.map((loc) => (
                <tr key={loc.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-white">
                    {loc.name}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 font-mono text-[11px]">
                    {loc.building_type}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-slate-300">
                    ({loc.position_x}, {loc.position_y}, {loc.position_z})
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-slate-400">
                    {loc.scale}x
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="inline-block w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: loc.color }}
                      title={loc.color}
                    />
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                        loc.status === 'active'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {loc.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(loc)}
                      className="p-1.5 text-slate-400 hover:text-emerald-400 rounded hover:bg-slate-800 transition-colors"
                      title="Edit 3D Coordinates"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(loc.id, loc.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                      title="Delete Location"
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

      {/* 3D Location Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl p-6 text-white max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold font-serif flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                {editingLoc ? 'Configure 3D Spatial Landmark' : 'Add New 3D Spatial Landmark'}
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
                  Landmark Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Science Laboratory Technology Centre"
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
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Academic Buildings"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Building Architecture Model
                  </label>
                  <select
                    value={buildingType}
                    onChange={(e) => setBuildingType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value="gate">Ceremonial Entrance Gate</option>
                    <option value="admin">Administrative Rectorate</option>
                    <option value="library">Central Academic Library</option>
                    <option value="ict">ICT Innovation Centre</option>
                    <option value="lecture_hall">TETFUND Twin Lecture Pavilion</option>
                    <option value="lab">Engineering Workshops</option>
                    <option value="slt_lab">Science Laboratory Tech (SLT)</option>
                    <option value="sports">Sports Arena & Pavilion</option>
                    <option value="hostel">Student Residential Halls</option>
                    <option value="medical">Medical Health Centre</option>
                  </select>
                </div>
              </div>

              {/* Spatial Coordinates XYZ */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <span className="font-semibold text-emerald-400 block text-[11px] uppercase tracking-wider">
                  3D Spatial Coordinates (Meters)
                </span>
                <div className="grid grid-cols-3 gap-2 font-mono">
                  <div>
                    <label className="block text-slate-400 text-[10px]">Position X</label>
                    <input
                      type="number"
                      step="0.5"
                      value={posX}
                      onChange={(e) => setPosX(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px]">Position Y (Elevation)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={posY}
                      onChange={(e) => setPosY(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px]">Position Z</label>
                    <input
                      type="number"
                      step="0.5"
                      value={posZ}
                      onChange={(e) => setPosZ(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 font-mono pt-2">
                  <div>
                    <label className="block text-slate-400 text-[10px]">Rotation Y (Rad)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={rotationY}
                      onChange={(e) => setRotationY(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px]">Scale</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.2"
                      max="4.0"
                      value={scale}
                      onChange={(e) => setScale(parseFloat(e.target.value) || 1)}
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px]">Marker Accent Color</label>
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full h-7 bg-slate-900 border border-slate-700 rounded cursor-pointer p-0.5"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Description & Spatial Notes
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-emerald-500 resize-none"
                />
              </div>

              {/* Linking to other system modules */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">Link Facility</label>
                  <select
                    value={relatedFacilityId}
                    onChange={(e) => setRelatedFacilityId(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="">None</option>
                    {facilities.map((f) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">Link Academic Programme</label>
                  <select
                    value={relatedProgrammeId}
                    onChange={(e) => setRelatedProgrammeId(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="">None</option>
                    {programmes.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">Link Video Advertisement</label>
                  <select
                    value={relatedVideoId}
                    onChange={(e) => setRelatedVideoId(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="">None</option>
                    {videos.map((v) => (
                      <option key={v.id} value={v.id}>{v.title}</option>
                    ))}
                  </select>
                </div>
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
                  {saving ? 'Saving Coordinates...' : 'Save 3D Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCampusPage;
