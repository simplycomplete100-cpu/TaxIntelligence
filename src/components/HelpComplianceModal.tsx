import React from 'react';
import { HelpCircle, X, ShieldAlert, Sparkles, BookOpen, Scale, CheckCircle2 } from 'lucide-react';

interface HelpComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpComplianceModal: React.FC<HelpComplianceModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold">Platform Guidance & Legal Standards</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-700 leading-relaxed">
          {/* Core Philosophy: MAKE THIS USEFUL */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 space-y-2">
            <span className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              The Defining Philosophy: &quot;MAKE THIS USEFUL&quot;
            </span>
            <p>
              Do not just read answers. Every query produced by the Tax Super Agent features the <strong>MAKE THIS USEFUL</strong> action menu, allowing you to instantly transform complex research into a 1-page Cheat Sheet, a Plain-Language Client Handout, an Interview Questionnaire, or an Interactive Training Lesson for staff.
            </p>
          </div>

          {/* Workflow */}
          <div>
            <h3 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider mb-2">
              The 7-Step Professional Workflow
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px] font-semibold">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">1. ASK</div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">2. RESEARCH</div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">3. VERIFY</div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">4. UNDERSTAND</div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">5. CREATE</div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">6. SAVE</div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">7. TEACH</div>
            </div>
          </div>

          {/* Due Diligence Notice */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Treasury Department Circular 230 & IRC §6695(g)</span>
            </div>
            <p className="text-[11px] text-amber-900 leading-relaxed">
              Tax laws change annually and factual determinations require independent practitioner judgment. This platform does not provide legal representation. Paid preparers remain personally responsible for complying with federal due diligence requirements and retaining corroborating records for at least three years.
            </p>
          </div>

          {/* Universal Shortcut */}
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <span className="font-medium text-slate-700">Universal Search Shortcut:</span>
            <kbd className="px-2 py-1 bg-white border border-slate-300 rounded font-mono text-xs font-bold shadow-xs">
              Cmd / Ctrl + K
            </kbd>
          </div>
        </div>

        <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white font-bold rounded-lg text-xs"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
