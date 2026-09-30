import React, { useState } from 'react';
import { Building2, X, Check, ShieldCheck, Sparkles, Sliders } from 'lucide-react';
import { FirmProfile, TaxYear } from '../types';

interface WhiteLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  firmProfile: FirmProfile;
  onSaveProfile: (profile: FirmProfile) => void;
}

export const WhiteLabelModal: React.FC<WhiteLabelModalProps> = ({
  isOpen,
  onClose,
  firmProfile,
  onSaveProfile,
}) => {
  const [form, setForm] = useState<FirmProfile>(firmProfile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(form);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Firm White-Label & Agent Settings</h2>
              <p className="text-xs text-slate-400">Configure your tax firm identity, custom SOPs, and agent safeguards</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg flex items-center gap-2 font-medium">
              <Check className="w-4 h-4 text-emerald-600" />
              Firm settings and agent configuration successfully updated!
            </div>
          )}

          {/* Firm Name & ERO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tax Firm / Practice Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">ERO Number / Official Title</label>
              <input
                type="text"
                value={form.eroName}
                onChange={(e) => setForm({ ...form, eroName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                required
              />
            </div>
          </div>

          {/* Brand Color & Logo Shortcode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Brand Accent Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.brandColor}
                  onChange={(e) => setForm({ ...form, brandColor: e.target.value })}
                  className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={form.brandColor}
                  onChange={(e) => setForm({ ...form, brandColor: e.target.value })}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg font-mono text-xs"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Default Tax Year</label>
              <select
                value={form.defaultTaxYear}
                onChange={(e) => setForm({ ...form, defaultTaxYear: e.target.value as TaxYear })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium bg-white"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>
          </div>

          {/* Custom Knowledge & Firm SOPs */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">Custom Firm Guidance & SOPs (Injected into Super Agent)</label>
              <span className="text-[10px] text-slate-400">Never falsely represented as IRS law</span>
            </div>
            <textarea
              rows={3}
              value={form.customInstructions}
              onChange={(e) => setForm({ ...form, customInstructions: e.target.value })}
              placeholder="e.g. Mandatory requirement: All preparers must request two years of W-2s for new clients claiming CTC..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Client Handout Disclaimer */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Client-Facing Disclaimers</label>
            <textarea
              rows={2}
              value={form.clientDisclaimer}
              onChange={(e) => setForm({ ...form, clientDisclaimer: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Preparer Disclaimer */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Tax Preparer / Professional Disclaimer</label>
            <textarea
              rows={2}
              value={form.proDisclaimer}
              onChange={(e) => setForm({ ...form, proDisclaimer: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Strict Approved Sources Toggle */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-semibold text-slate-800">Strict IRS & Authoritative Sources Only</span>
                <p className="text-[11px] text-slate-500">Prevent agent from relying on unverified third-party blogs</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={form.approvedSourcesOnly}
              onChange={(e) => setForm({ ...form, approvedSourcesOnly: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-100 rounded-lg font-medium text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm transition"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
