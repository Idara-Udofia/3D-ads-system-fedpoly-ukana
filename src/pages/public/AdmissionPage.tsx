import React, { useState } from 'react';
import {
  FileCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Send,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AdmissionInfo } from '../../types';

interface AdmissionPageProps {
  admissionInfo: AdmissionInfo[];
  onOpenEnquiry: () => void;
}

export const AdmissionPage: React.FC<AdmissionPageProps> = ({
  admissionInfo,
  onOpenEnquiry,
}) => {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const categories = [
    'Overview',
    'Eligibility',
    'Requirements',
    'Application Process',
    'Documents',
    'FAQ',
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
          <FileCheck className="w-4 h-4" />
          <span>Prospective Student Admission Office</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
          Admissions, Eligibility & Screening Procedures
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          National Diploma (ND) full-time admission guidelines for Federal Polytechnic, Ukana. Review criteria, prepare verification credentials, and submit screening applications.
        </p>
      </div>

      {/* Demo Notice Warning (Mandatory Demonstration Content Policy) */}
      <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-xs flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-950">
            DEMO ADMISSION PARAMETERS POLICY:
          </p>
          <p className="leading-relaxed">
            All cut-off marks, application calendar timelines, and administrative guidelines shown below represent editable demonstration content for this academic software project. Authorised admissions staff can update official JAMB benchmarks and requirements via the Administrator Dashboard.
          </p>
        </div>
      </div>

      {/* Structured Sections Rendered Dynamically from DB */}
      <div className="space-y-8">
        {admissionInfo.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                {item.category}
              </span>
              <h2 className="text-xl font-bold text-slate-900 font-serif">
                {item.title}
              </h2>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
              {item.content}
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action: Enquire directly */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl font-bold font-serif">
            Have Questions About Your O'Level Combination?
          </h3>
          <p className="text-xs text-emerald-200/90 max-w-lg">
            Our admissions counselors can confirm your subject prerequisites and assist you with portal registration.
          </p>
        </div>

        <button
          onClick={onOpenEnquiry}
          className="px-6 py-3 bg-white text-emerald-950 hover:bg-emerald-50 font-bold text-xs sm:text-sm rounded-xl shrink-0 transition-colors shadow-lg flex items-center gap-2"
        >
          <Send className="w-4 h-4 text-emerald-700" />
          <span>Contact Admissions Desk</span>
        </button>
      </div>
    </div>
  );
};

export default AdmissionPage;
