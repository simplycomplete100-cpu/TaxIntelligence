import React from 'react';
import { ExternalLink, X, BookOpen, FileSpreadsheet, Sparkles, Scale } from 'lucide-react';
import { IRSSource } from '../types';

interface SourceDetailModalProps {
  source: IRSSource | null;
  onClose: () => void;
  onAskAgent: (query: string) => void;
  onTurnIntoResource: (type: string, topic: string, content: string) => void;
}

export const SourceDetailModal: React.FC<SourceDetailModalProps> = ({
  source,
  onClose,
  onAskAgent,
  onTurnIntoResource,
}) => {
  if (!source) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-emerald-700 text-white rounded">
              {source.pubOrForm}
            </span>
            <span className="text-xs text-slate-300">{source.guidanceType}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-800">
          <div>
            <h2 className="text-base font-black text-slate-900 leading-snug">
              {source.title}
            </h2>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
              <span>Agency: {source.agency}</span>
              <span>•</span>
              <span>Tax Year: {source.taxYear}</span>
              <span>•</span>
              <span>Verified: {source.lastUpdated}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
            <span className="font-bold text-slate-900 block text-[10px] uppercase mb-1">
              Authoritative Summary & Scope:
            </span>
            {source.summary}
          </div>

          <div>
            <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block mb-1.5">
              Subject Matters Covered:
            </span>
            <div className="flex flex-wrap gap-1">
              {source.keyTopics.map((topic, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-slate-100 font-medium text-slate-700 rounded text-[11px]"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <a
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs"
            >
              <span>Visit Official Government Source (IRS.gov / Cornell)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
          <button
            onClick={() => {
              onAskAgent(`Explain all rules, requirements, and due diligence checks under ${source.pubOrForm} (${source.title})`);
              onClose();
            }}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Super Agent About Source</span>
          </button>

          <button
            onClick={() => {
              onTurnIntoResource('cheat_sheet', source.pubOrForm, `${source.title}\n\n${source.summary}`);
              onClose();
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Make Cheat Sheet</span>
          </button>
        </div>
      </div>
    </div>
  );
};
