import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Folder,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Bookmark,
  Copy,
  Check,
  FileSpreadsheet,
  Trash2,
  FileText
} from 'lucide-react';
import { SavedResearch, TaxYear } from '../types';

interface RecentResearchViewProps {
  researchList: SavedResearch[];
  currentTaxYear: TaxYear;
  onTurnIntoResource: (type: string, topic: string, content: string) => void;
  onAskAgent: (query: string) => void;
  selectedResearchId?: string;
}

export const RecentResearchView: React.FC<RecentResearchViewProps> = ({
  researchList,
  currentTaxYear,
  onTurnIntoResource,
  onAskAgent,
  selectedResearchId,
}) => {
  const [selectedId, setSelectedId] = useState<string>(selectedResearchId || researchList[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [folderFilter, setFolderFilter] = useState('All');
  const [copied, setCopied] = useState(false);

  const folders = ['All', 'Filing Status', 'Schedule C', 'Due Diligence', 'General Tax Research'];

  const filtered = useMemo(() => {
    return researchList.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFolder = folderFilter === 'All' || item.folder === folderFilter;
      return matchesSearch && matchesFolder;
    });
  }, [researchList, searchTerm, folderFilter]);

  const activeItem = researchList.find((r) => r.id === selectedId) || filtered[0] || researchList[0];

  const handleCopy = () => {
    if (!activeItem) return;
    navigator.clipboard.writeText(`${activeItem.question}\n\n${activeItem.content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Left Column: Research Logs & Folder Filters */}
      <div className="w-full lg:w-80 shrink-0 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col shadow-xs">
        <div className="p-3.5 border-b border-slate-200 bg-slate-50 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <History className="w-4 h-4 text-emerald-600" />
              Recent Tax Research Logs
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              {researchList.length} Inquiries
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search previous questions..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Folder Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-slate-600">
            {folders.map((f) => (
              <button
                key={f}
                onClick={() => setFolderFilter(f)}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap transition cursor-pointer ${
                  folderFilter === f
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {filtered.map((item) => {
            const isSelected = activeItem?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`p-3 rounded-lg border transition cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50/80 border-emerald-500 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <Folder className="w-3 h-3" /> {item.folder}
                  </span>
                  <span className="text-slate-400">{item.date}</span>
                </div>
                <div className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                  {item.title}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                  {item.question}
                </p>
                <div className="mt-2 pt-1 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>TY {item.taxYear}</span>
                  <span>{item.sources.length} Verified Sources</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Research Dossier View */}
      {activeItem ? (
        <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col shadow-xs">
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <span className="font-bold text-emerald-400 uppercase tracking-wider">Research Record</span>
                <span>•</span>
                <span>Folder: {activeItem.folder}</span>
                <span>•</span>
                <span>Date: {activeItem.date}</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                {activeItem.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs border border-slate-700"
                title="Copy Research"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                onClick={() =>
                  onTurnIntoResource('cheat_sheet', activeItem.title, activeItem.content)
                }
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Turn into Cheat Sheet</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-800">
            {/* The Original Question */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Original Question / Preparer Inquiry
              </span>
              <p className="text-xs sm:text-sm font-semibold text-slate-900">
                {activeItem.question}
              </p>
            </div>

            {/* Content Text */}
            <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-4">
              {activeItem.content}
            </div>

            {/* Internal Preparer Notes */}
            {activeItem.notes && (
              <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-950">
                <span className="font-bold text-amber-900 block mb-0.5">Preparer Working Notes:</span>
                {activeItem.notes}
              </div>
            )}

            {/* Attached Sources */}
            {activeItem.sources && activeItem.sources.length > 0 && (
              <div className="pt-4 border-t border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                  Corroborating Authoritative Sources
                </span>
                <div className="space-y-1.5">
                  {activeItem.sources.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 bg-white border border-slate-300 rounded">
                          {s.pubOrForm}
                        </span>
                        <span className="font-semibold text-slate-900">{s.title}</span>
                      </div>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-bold text-[11px]"
                      >
                        <span>IRS Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
