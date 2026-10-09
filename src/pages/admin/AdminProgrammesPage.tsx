import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Programme } from '../../types';
import api from '../../services/api';

interface AdminProgrammesPageProps {
  programmes: Programme[];
  onRefresh: () => void;
}

export const AdminProgrammesPage: React.FC<AdminProgrammesPageProps> = ({
  programmes,
  onRefresh,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProg, setEditingProg] = useState<Programme | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [duration, setDuration] = useState('2 Years Full-Time');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [careerProspects, setCareerProspects] = useState('');
  const [status, setStatus] = useState<'active' | 'archived'>('active');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingProg(null);
    setName('');
    setDepartment('Department of Computer Science');
    setDuration('2 Years Full-Time');
    setDescription('');
    setRequirements('5 Credit passes in SSCE/WASSCE/NECO including English, Mathematics, and Physics.');
    setCareerProspects('Software Technologist\nSystems Administrator');
    setStatus('active');
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (prog: Programme) => {
    setEditingProg(prog);
    setName(prog.name);
    setDepartment(prog.department);
    setDuration(prog.duration);
    setDescription(prog.description);
    setRequirements(prog.requirements.join('\n'));
    setCareerProspects(prog.career_prospects.join('\n'));
    setStatus(prog.status);
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !department || !description) {
      setError('Please provide programme name, department, and description.');
      return;
    }

    setSaving(true);
    setError(null);

    const reqList = requirements.split('\n').map((r) => r.trim()).filter(Boolean);
    const careerList = careerProspects.split('\n').map((c) => c.trim()).filter(Boolean);

    try {
      if (editingProg) {
        await api.updateProgramme(editingProg.id, {
          name,
          department,
          duration,
          description,
          requirements: reqList,
          career_prospects: careerList,
          status,
        });
      } else {
        await api.createProgramme({
          name,
          department,
          duration,
          description,
          requirements: reqList,
          career_prospects: careerList,
          status,
          image_url: '/images/campus_complex_ukana_1791453435263.jpg',
          video_id: 'vid_tour',
        });
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save programme');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, progName: string) => {
    if (!confirm(`Are you sure you want to delete "${progName}"?`)) return;
    try {
      await api.deleteProgramme(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete programme');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white font-serif flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            Academic Programmes Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Create, edit, and organize National Diploma courses, entry requirements, and career prospects.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors self-start shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Programme</span>
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3">Programme Title</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Duration</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {programmes.map((prog) => (
                <tr key={prog.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-white">
                    {prog.name}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">
                    {prog.department}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-slate-400">
                    {prog.duration}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                        prog.status === 'active'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {prog.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(prog)}
                      className="p-1.5 text-slate-400 hover:text-emerald-400 rounded hover:bg-slate-800 transition-colors"
                      title="Edit Programme"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(prog.id, prog.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                      title="Delete Programme"
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

      {/* CRUD Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl p-6 text-white max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold font-serif">
                {editingProg ? 'Edit Academic Programme' : 'Add New Academic Programme'}
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
                  Programme Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. National Diploma in Computer Engineering"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Department *
                  </label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Department of Computer Science"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="2 Years Full-Time"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Description & Overview *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive curriculum details..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Admission Requirements (One item per line)
                </label>
                <textarea
                  rows={3}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="5 Credits in O'Level..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Career Prospects (One career per line)
                </label>
                <textarea
                  rows={2}
                  value={careerProspects}
                  onChange={(e) => setCareerProspects(e.target.value)}
                  placeholder="Full-Stack Developer&#10;Systems Analyst"
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
                  {saving ? 'Saving...' : 'Save Programme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProgrammesPage;
