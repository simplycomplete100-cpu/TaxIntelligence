import React, { useState, useMemo } from 'react';
import {
  Bookmark,
  Search,
  Filter,
  Printer,
  Copy,
  Check,
  Star,
  Trash2,
  Edit3,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Calendar,
  Users,
  FileSpreadsheet,
  FilePlus,
  CheckSquare,
  FileDown
} from 'lucide-react';
import { GeneratedResource, TaxYear, FirmProfile } from '../types';
import { exportResourceToPdf } from '../utils/pdfExport';
import { DocumentRenderer } from './DocumentRenderer';

interface SavedResourcesViewProps {
  resources: GeneratedResource[];
  currentTaxYear: TaxYear;
  firmProfile: FirmProfile;
  onDeleteResource: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onOpenResourceGenerator: (type?: string, topic?: string) => void;
  selectedResourceId?: string;
}

export const SavedResourcesView: React.FC<SavedResourcesViewProps> = ({
  resources,
  currentTaxYear,
  firmProfile,
  onDeleteResource,
  onToggleFavorite,
  onOpenResourceGenerator,
  selectedResourceId,
}) => {
  const [selectedId, setSelectedId] = useState<string>(selectedResourceId || resources[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [copied, setCopied] = useState(false);

  const types = ['All', 'cheat_sheet', 'client_handout', 'one_pager', 'preparer_checklist'];

  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      const matchesSearch =
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = typeFilter === 'All' || r.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [resources, searchTerm, typeFilter]);

  const activeResource = resources.find((r) => r.id === selectedId) || filteredResources[0] || resources[0];

  const handleCopy = () => {
    if (!activeResource) return;
    navigator.clipboard.writeText(activeResource.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Left Column: Vault Directory & Filter */}
      <div className="w-full lg:w-80 shrink-0 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col shadow-xs no-print">
        <div className="p-3.5 border-b border-slate-200 bg-slate-50 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-emerald-600" />
              Saved Resources Vault
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              {resources.length} Saved
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search saved resources..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Type Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-slate-600">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize whitespace-nowrap transition cursor-pointer ${
                  typeFilter === t
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Resource List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {filteredResources.map((res) => {
            const isSelected = activeResource?.id === res.id;

            return (
              <div
                key={res.id}
                onClick={() => setSelectedId(res.id)}
                className={`p-3 rounded-lg border transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-50/80 border-emerald-500 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="font-bold uppercase tracking-wider text-amber-700">
                      {res.type.replace('_', ' ')}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(res.id);
                      }}
                      className="text-amber-500 hover:text-amber-600"
                    >
                      <Star className={`w-3.5 h-3.5 ${res.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                    </button>
                  </div>
                  <div className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                    {res.title}
                  </div>
                </div>

                <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>TY {res.taxYear} • {res.audience}</span>
                  <span>{res.dateCreated}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: View / Print Document Canvas */}
      {activeResource ? (
        <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col shadow-xs">
          {/* Action Bar */}
          <div className="p-3.5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between no-print">
            <div className="text-xs flex items-center gap-2">
              <span className="font-bold text-white uppercase">{activeResource.type.replace('_', ' ')}</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 font-semibold">TY {activeResource.taxYear}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">{activeResource.audience}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-700 cursor-pointer"
                title="Print view"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>

              <button
                onClick={() => {
                  exportResourceToPdf({
                    title: activeResource.title,
                    type: activeResource.type,
                    audience: activeResource.audience,
                    taxYear: activeResource.taxYear,
                    content: activeResource.content,
                    firmName: firmProfile.name,
                    eroName: firmProfile.eroName,
                    disclaimer:
                      activeResource.audience === 'Client' || activeResource.audience === 'General Public'
                        ? firmProfile.clientDisclaimer
                        : firmProfile.proDisclaimer,
                  });
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition"
                title="Download structured PDF via jsPDF"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>

              <button
                onClick={() => onDeleteResource(activeResource.id)}
                className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-slate-800 rounded-lg"
                title="Delete Resource"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Printable Document View */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-100 flex justify-center">
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-sm border border-slate-200 p-8 sm:p-12 min-h-[600px] text-slate-900 printable-document">
              {/* Firm Header */}
              <div className="pb-4 mb-6 border-b-2 border-slate-900 flex items-center justify-between">
                <div>
                  <div className="font-black text-lg text-slate-950 tracking-tight">
                    {firmProfile.name.toUpperCase()}
                  </div>
                  <div className="text-xs text-slate-500">{firmProfile.eroName}</div>
                </div>
                <div className="text-right text-xs">
                  <div className="font-bold text-emerald-800">TAX YEAR {activeResource.taxYear}</div>
                  <div className="text-[10px] text-slate-400">Authoritative Practice Resource</div>
                </div>
              </div>

              {/* Clean Resource Content without Hashtags */}
              <DocumentRenderer
                content={activeResource.content}
                title={activeResource.title}
                type={activeResource.type}
                taxYear={activeResource.taxYear}
                audience={activeResource.audience}
                firmName={firmProfile.name}
              />

              {/* Footer */}
              <div className="mt-8 pt-4 border-t border-slate-200 text-[10px] text-slate-400 flex items-center justify-between">
                <span>{firmProfile.clientDisclaimer}</span>
                <span>Created by: {activeResource.createdBy} • {activeResource.dateCreated}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center text-slate-400">
          <Bookmark className="w-12 h-12 text-slate-300 mb-2" />
          <div className="font-bold text-slate-700">No Resource Selected</div>
        </div>
      )}
    </div>
  );
};
