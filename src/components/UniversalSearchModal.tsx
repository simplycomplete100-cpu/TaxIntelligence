import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  BookOpen,
  FileSpreadsheet,
  Files,
  GraduationCap,
  ExternalLink,
  ChevronRight,
  Filter,
  ArrowRight
} from 'lucide-react';
import {
  KnowledgeArticle,
  IRSSource,
  TaxFormInfo,
  GeneratedResource,
  TrainingCourse,
  TaxYear
} from '../types';
import { NavTab } from './Sidebar';

interface UniversalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: KnowledgeArticle[];
  sources: IRSSource[];
  forms: TaxFormInfo[];
  resources: GeneratedResource[];
  courses: TrainingCourse[];
  currentTaxYear: TaxYear;
  onNavigateTo: (tab: NavTab, targetId?: string) => void;
  onAskAgent: (query: string) => void;
}

export const UniversalSearchModal: React.FC<UniversalSearchModalProps> = ({
  isOpen,
  onClose,
  articles,
  sources,
  forms,
  resources,
  courses,
  currentTaxYear,
  onNavigateTo,
  onAskAgent,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  if (!isOpen) return null;

  const results = useMemo(() => {
    if (!query.trim()) {
      return {
        articles: articles.slice(0, 3),
        sources: sources.slice(0, 3),
        forms: forms.slice(0, 3),
        resources: resources.slice(0, 2),
      };
    }

    const q = query.toLowerCase();

    return {
      articles: articles.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.overview.toLowerCase().includes(q) ||
          a.forms.some((f) => f.toLowerCase().includes(q))
      ),
      sources: sources.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.pubOrForm.toLowerCase().includes(q) ||
          s.keyTopics.some((t) => t.toLowerCase().includes(q))
      ),
      forms: forms.filter(
        (f) =>
          f.formNumber.toLowerCase().includes(q) ||
          f.title.toLowerCase().includes(q) ||
          f.relatedTopics.some((t) => t.toLowerCase().includes(q))
      ),
      resources: resources.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q))
      ),
    };
  }, [query, articles, sources, forms, resources]);

  const totalResults =
    results.articles.length +
    results.sources.length +
    results.forms.length +
    results.resources.length;

  const handleSelectArticle = (art: KnowledgeArticle) => {
    onNavigateTo('tax_library', art.id);
    onClose();
  };

  const handleSelectForm = (form: TaxFormInfo) => {
    onNavigateTo('forms_pubs', form.formNumber);
    onClose();
  };

  const handleSelectResource = (res: GeneratedResource) => {
    onNavigateTo('saved_resources', res.id);
    onClose();
  };

  const handleSelectSource = (src: IRSSource) => {
    onNavigateTo('irs_research', src.id);
    onClose();
  };

  const handleAskAgent = () => {
    if (!query.trim()) return;
    onAskAgent(query);
    onNavigateTo('super_agent');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-emerald-600 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAskAgent();
            }}
            placeholder="Search tax rules, Head of Household, Schedule C, Form 8867, mileage..."
            className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded text-xs font-semibold text-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 border-b border-slate-100 bg-white flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="font-semibold text-slate-600 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {['all', 'articles', 'forms', 'sources', 'cheat_sheets'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize ${
                  filterType === f
                    ? 'bg-emerald-100 text-emerald-800 font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>
          <span className="text-[11px] text-slate-400">
            {totalResults} results {query ? `for "${query}"` : ''}
          </span>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Ask Super Agent Action */}
          {query.trim() && (
            <div
              onClick={handleAskAgent}
              className="p-3 rounded-lg bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 flex items-center justify-between cursor-pointer transition"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  AI
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-950">
                    Ask Tax Super Agent: &quot;{query}&quot;
                  </div>
                  <div className="text-[11px] text-emerald-700">
                    Generate instant authoritative answer with IRC citations & client documents
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-700" />
            </div>
          )}

          {/* Knowledge Articles */}
          {(filterType === 'all' || filterType === 'articles') &&
            results.articles.length > 0 && (
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  Tax Knowledge Library
                </div>
                <div className="space-y-1.5">
                  {results.articles.map((art) => (
                    <div
                      key={art.id}
                      onClick={() => handleSelectArticle(art)}
                      className="p-2.5 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition"
                    >
                      <div>
                        <div className="text-xs font-semibold text-slate-900">
                          {art.title}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="font-medium text-emerald-700">{art.category}</span>
                          <span>•</span>
                          <span>TY {art.taxYear}</span>
                          <span>•</span>
                          <span className="truncate max-w-xs">{art.quickReference}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* IRS Forms & Pubs */}
          {(filterType === 'all' || filterType === 'forms') &&
            results.forms.length > 0 && (
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Files className="w-3.5 h-3.5 text-slate-500" />
                  IRS Forms & Instructions
                </div>
                <div className="space-y-1.5">
                  {results.forms.map((form) => (
                    <div
                      key={form.formNumber}
                      onClick={() => handleSelectForm(form)}
                      className="p-2.5 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="px-2 py-0.5 bg-slate-100 font-mono text-xs font-bold text-slate-800 rounded border border-slate-200">
                          {form.formNumber}
                        </span>
                        <div>
                          <div className="text-xs font-semibold text-slate-900">
                            {form.title}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate max-w-md">
                            {form.purpose}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* IRS Sources */}
          {(filterType === 'all' || filterType === 'sources') &&
            results.sources.length > 0 && (
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  Official IRS Guidance & Code
                </div>
                <div className="space-y-1.5">
                  {results.sources.map((src) => (
                    <div
                      key={src.id}
                      onClick={() => handleSelectSource(src)}
                      className="p-2.5 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition"
                    >
                      <div>
                        <div className="text-xs font-semibold text-slate-900">
                          {src.title}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-emerald-700 font-bold">{src.pubOrForm}</span>
                          <span>•</span>
                          <span>{src.guidanceType}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Saved Resources / Cheat Sheets */}
          {(filterType === 'all' || filterType === 'cheat_sheets') &&
            results.resources.length > 0 && (
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
                  Cheat Sheets & One-Pagers
                </div>
                <div className="space-y-1.5">
                  {results.resources.map((res) => (
                    <div
                      key={res.id}
                      onClick={() => handleSelectResource(res)}
                      className="p-2.5 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition"
                    >
                      <div>
                        <div className="text-xs font-semibold text-slate-900">
                          {res.title}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="uppercase text-[10px] font-bold text-amber-700">
                            {res.type.replace('_', ' ')}
                          </span>
                          <span>•</span>
                          <span>Target: {res.audience}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Modal Footer Keybinds */}
        <div className="p-2.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>Press <kbd className="px-1 py-0.5 bg-slate-200 rounded font-mono text-[10px]">Enter</kbd> to ask Tax Super Agent</span>
            <span>Press <kbd className="px-1 py-0.5 bg-slate-200 rounded font-mono text-[10px]">ESC</kbd> to close</span>
          </div>
          <span className="font-semibold text-emerald-700">Active Tax Year: {currentTaxYear}</span>
        </div>
      </div>
    </div>
  );
};
