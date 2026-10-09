import React, { useState } from 'react';
import { Mail, Phone, Calendar, Trash2, CheckCircle2, Clock, Search } from 'lucide-react';
import { Enquiry } from '../../types';
import api from '../../services/api';

interface AdminEnquiriesPageProps {
  enquiries: Enquiry[];
  onRefresh: () => void;
}

export const AdminEnquiriesPage: React.FC<AdminEnquiriesPageProps> = ({
  enquiries,
  onRefresh,
}) => {
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = enquiries.filter((e) => {
    const matchesStatus = filterStatus === 'all' || e.status === filterStatus;
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase()) ||
      e.message.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = async (id: string, status: Enquiry['status']) => {
    try {
      await api.updateEnquiryStatus(id, status);
      onRefresh();
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove enquiry from ${name}?`)) return;
    try {
      await api.deleteEnquiry(id);
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete enquiry');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-xl font-bold text-white font-serif flex items-center gap-2">
          <Mail className="w-5 h-5 text-teal-400" />
          Prospective Student Enquiries Management
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Review incoming questions regarding ND admission requirements, UTME cut-offs, hostel requests, and track staff resolution.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-2">
          {['all', 'pending', 'reviewed', 'resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filterStatus === st
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search by candidate name or query..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-hidden focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Enquiries Grid: List & Preview Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* List (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 bg-slate-950 rounded-2xl border border-slate-800">
              No enquiries match the current filter.
            </div>
          ) : (
            filtered.map((enq) => {
              const isSelected = selectedEnquiry?.id === enq.id;
              return (
                <div
                  key={enq.id}
                  onClick={() => setSelectedEnquiry(enq)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500 ring-1 ring-emerald-500/50'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-white">{enq.name}</span>
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                        enq.status === 'pending'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : enq.status === 'reviewed'
                          ? 'bg-sky-950 text-sky-400 border border-sky-800'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>

                  <p className="text-xs text-emerald-400 font-medium mb-1 truncate">
                    {enq.subject}
                  </p>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {enq.message}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 mt-3 border-t border-slate-850 font-mono">
                    <span>{enq.email}</span>
                    <span>{new Date(enq.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Detail View (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-6 text-white space-y-4 sticky top-20">
          {selectedEnquiry ? (
            <>
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-base">{selectedEnquiry.name}</h3>
                  <p className="text-xs text-slate-400">{selectedEnquiry.email}</p>
                  {selectedEnquiry.phone && (
                    <p className="text-xs text-slate-400 font-mono">{selectedEnquiry.phone}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(selectedEnquiry.id, selectedEnquiry.name)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded transition-colors"
                  title="Delete Enquiry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5">
                  Subject:
                </span>
                <p className="text-xs font-semibold text-white">{selectedEnquiry.subject}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Enquiry Message:
                </span>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* Status Update Buttons */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  Update Resolution Status:
                </span>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => handleUpdateStatus(selectedEnquiry.id, 'pending')}
                    className={`p-2 rounded-lg border font-medium ${
                      selectedEnquiry.status === 'pending'
                        ? 'bg-amber-950 text-amber-300 border-amber-600'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedEnquiry.id, 'reviewed')}
                    className={`p-2 rounded-lg border font-medium ${
                      selectedEnquiry.status === 'reviewed'
                        ? 'bg-sky-950 text-sky-300 border-sky-600'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Reviewed
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedEnquiry.id, 'resolved')}
                    className={`p-2 rounded-lg border font-medium ${
                      selectedEnquiry.status === 'resolved'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Resolved
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`mailto:${selectedEnquiry.email}?subject=Re: ${encodeURIComponent(
                    selectedEnquiry.subject
                  )} - Federal Polytechnic, Ukana`}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Reply via Email Client</span>
                </a>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-xs text-slate-500">
              <Mail className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              Select an enquiry from the list to view candidate questions and update status.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEnquiriesPage;
