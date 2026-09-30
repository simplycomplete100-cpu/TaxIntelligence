import React, { useState } from 'react';
import {
  Sliders,
  ShieldCheck,
  Building2,
  Sparkles,
  Check,
  AlertTriangle,
  Lock,
  FileText
} from 'lucide-react';
import { FirmProfile, TaxYear } from '../types';

interface AdminAgentSettingsProps {
  firmProfile: FirmProfile;
  onSaveProfile: (profile: FirmProfile) => void;
}

export const AdminAgentSettings: React.FC<AdminAgentSettingsProps> = ({
  firmProfile,
  onSaveProfile,
}) => {
  const [form, setForm] = useState<FirmProfile>(firmProfile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
            AI Controls & Policy
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-300">Prompt Governance & Guardrails</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight">
          Tax Super Agent Settings & Custom Knowledge
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
          Configure authoritative citation boundaries, firm-specific SOP injection, client-facing disclaimers, and tax year defaults.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl flex items-center gap-2 text-xs font-semibold">
          <Check className="w-4 h-4 text-emerald-600" />
          Tax Super Agent governance settings and custom instructions successfully saved!
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-xs text-xs">
        {/* Approved Sources Safeguard */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-slate-900 text-sm">Authoritative Source Restriction Policy</span>
            </div>
            <input
              type="checkbox"
              checked={form.approvedSourcesOnly}
              onChange={(e) => setForm({ ...form, approvedSourcesOnly: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
            />
          </div>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            When enabled, the Tax Super Agent strictly grounds all answers in IRS.gov official guidance, the Internal Revenue Code, and Treasury regulations. Unverified commercial blogs are strictly barred.
          </p>
        </div>

        {/* Custom Knowledge & Firm SOPs */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-bold text-slate-800 text-sm">
              Custom Knowledge: Firm Policies & Standard Operating Procedures (SOPs)
            </label>
            <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
              Never Falsely Represented as IRS Guidance
            </span>
          </div>
          <p className="text-slate-500 text-[11px]">
            Add firm-specific intake rules, mandatory document retention procedures, or partner review thresholds. These instructions are injected as firm training guidance.
          </p>
          <textarea
            rows={4}
            value={form.customInstructions}
            onChange={(e) => setForm({ ...form, customInstructions: e.target.value })}
            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
            placeholder="e.g. Firm rule: In addition to standard Form 8867 items, our preparers must inspect 2 consecutive paystubs for all new W-2 clients..."
          />
        </div>

        {/* Disclaimers Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Client-Facing Handout Disclaimer
            </label>
            <textarea
              rows={3}
              value={form.clientDisclaimer}
              onChange={(e) => setForm({ ...form, clientDisclaimer: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-[11px]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Tax Preparer / Professional Disclaimer
            </label>
            <textarea
              rows={3}
              value={form.proDisclaimer}
              onChange={(e) => setForm({ ...form, proDisclaimer: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-[11px]"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition cursor-pointer"
          >
            Save Agent Policies
          </button>
        </div>
      </form>
    </div>
  );
};
