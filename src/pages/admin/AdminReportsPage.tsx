import React, { useState } from 'react';
import {
  FileText,
  Download,
  Users,
  Video,
  GraduationCap,
  Building2,
  Compass,
  Mail,
  Table,
} from 'lucide-react';
import api from '../../services/api';

export const AdminReportsPage: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string>('visitors');
  const [reportData, setReportData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const reportTypes = [
    { id: 'visitors', label: 'Visitor & Traffic Report', icon: Users, desc: 'Session analytics, device platforms, and page views.' },
    { id: 'videos', label: 'Video Performance Report', icon: Video, desc: 'Advertisement views, duration, completion counts.' },
    { id: 'programmes', label: 'Programme Engagement Report', icon: GraduationCap, desc: 'Curriculum views and department distribution.' },
    { id: 'facilities', label: 'Facility Interaction Report', icon: Building2, desc: 'Infrastructure inquiries and categories.' },
    { id: 'campus', label: '3D Campus Spatial Report', icon: Compass, desc: 'Landmark click-throughs and 3D coordinates.' },
    { id: 'enquiries', label: 'Admissions Enquiry Report', icon: Mail, desc: 'Prospective student contact leads and statuses.' },
  ];

  const handlePreviewReport = async (type: string) => {
    setSelectedReport(type);
    setLoading(true);
    try {
      const res = await api.getReportData(type);
      setReportData(res);
    } catch (err: any) {
      alert(err.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const downloadCsv = (type: string) => {
    window.location.href = api.getReportUrl(type, 'csv');
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-xl font-bold text-white font-serif flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-400" />
          Institutional Reports & Data Exports
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Generate structured institutional analytics, video advertisement engagement metrics, and download CSV spreadsheets.
        </p>
      </div>

      {/* Report Types Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map((rep) => {
          const Icon = rep.icon;
          const isSelected = selectedReport === rep.id;
          return (
            <div
              key={rep.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className="text-[10px] font-mono text-slate-500 uppercase">
                    CSV Ready
                  </span>
                </div>
                <h3 className="font-bold text-sm text-white">{rep.label}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{rep.desc}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-850 flex items-center gap-2">
                <button
                  onClick={() => handlePreviewReport(rep.id)}
                  className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  Preview Table
                </button>
                <button
                  onClick={() => downloadCsv(rep.id)}
                  className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                  title="Download CSV"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Data Preview Table */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-850 pb-4">
          <div>
            <h3 className="text-sm font-bold text-white capitalize font-serif">
              Report Data Preview: {selectedReport}
            </h3>
            {reportData && (
              <span className="text-[11px] text-slate-400 font-mono">
                {reportData.totalRecords} Records · Generated {new Date(reportData.generatedAt).toLocaleTimeString()}
              </span>
            )}
          </div>

          <button
            onClick={() => downloadCsv(selectedReport)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors self-start shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV Spreadsheet</span>
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">
            Generating report data...
          </div>
        ) : reportData ? (
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 text-[11px] uppercase tracking-wider sticky top-0">
                <tr>
                  {reportData.headers.map((h: string, idx: number) => (
                    <th key={idx} className="px-4 py-2.5 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {reportData.data.map((row: string[], rIdx: number) => (
                  <tr key={rIdx} className="hover:bg-slate-900/40">
                    {row.map((cell: string, cIdx: number) => (
                      <td key={cIdx} className="px-4 py-2.5 truncate max-w-xs font-mono text-[11px]">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-500">
            <Table className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            Click "Preview Table" on any report above to view tabular data or download the raw CSV.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReportsPage;
