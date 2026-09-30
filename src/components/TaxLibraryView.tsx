import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  FileSpreadsheet,
  GraduationCap,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Copy,
  Check,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { KnowledgeArticle, TaxYear, IRSSource } from '../types';

interface TaxLibraryViewProps {
  articles: KnowledgeArticle[];
  currentTaxYear: TaxYear;
  onOpenSourceModal: (source: IRSSource) => void;
  onTurnIntoResource: (type: string, topic: string, content: string) => void;
  selectedArticleId?: string;
}

export const TaxLibraryView: React.FC<TaxLibraryViewProps> = ({
  articles,
  currentTaxYear,
  onOpenSourceModal,
  onTurnIntoResource,
  selectedArticleId,
}) => {
  const [selectedId, setSelectedId] = useState<string>(selectedArticleId || articles[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [copied, setCopied] = useState(false);

  const categories = ['All', 'Filing Status', 'Self-Employment', 'Tax Credits', 'Dependents', 'Due Diligence', 'Income', 'Deductions'];

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchesSearch =
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.overview.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.forms.some((f) => f.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCat = categoryFilter === 'All' || a.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [articles, searchTerm, categoryFilter]);

  const activeArticle = articles.find((a) => a.id === selectedId) || filteredArticles[0] || articles[0];

  const handleCopy = () => {
    if (!activeArticle) return;
    navigator.clipboard.writeText(
      `${activeArticle.title}\n\nOVERVIEW:\n${activeArticle.overview}\n\nQUICK REF:\n${activeArticle.quickReference}\n\nRULES:\n${activeArticle.detailedExplanation}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Left Column: Category Explorer & Article List */}
      <div className="w-full lg:w-80 shrink-0 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col shadow-xs">
        {/* Search & Filter Header */}
        <div className="p-3.5 border-b border-slate-200 bg-slate-50 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Tax Reference Library
            </span>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              TY {currentTaxYear}
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter topics, forms..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-slate-600">
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap transition cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Article Cards */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {filteredArticles.map((art) => {
            const isSelected = activeArticle?.id === art.id;
            return (
              <div
                key={art.id}
                onClick={() => setSelectedId(art.id)}
                className={`p-3 rounded-lg border transition cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50/80 border-emerald-500 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="font-bold uppercase tracking-wider text-emerald-700">
                    {art.category}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono text-[9px]">
                    v{art.version}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 leading-snug">
                  {art.title}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                  {art.quickReference}
                </p>
                <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="text-emerald-700 font-semibold">{art.status}</span>
                  <span>{art.forms.slice(0, 2).join(', ')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Detailed Article Dossier */}
      {activeArticle && (
        <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col shadow-xs">
          {/* Article Header Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold rounded uppercase">
                  {activeArticle.category}
                </span>
                <span className="text-slate-400 text-xs">•</span>
                <span className="text-xs text-slate-300 font-medium">Tax Year {activeArticle.taxYear}</span>
                <span className="text-slate-400 text-xs">•</span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {activeArticle.status}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                {activeArticle.title}
              </h1>
            </div>

            {/* Top Action Suite */}
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  onTurnIntoResource(
                    'cheat_sheet',
                    activeArticle.title,
                    `${activeArticle.overview}\n\n${activeArticle.detailedExplanation}`
                  )
                }
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Make Cheat Sheet</span>
              </button>

              <button
                onClick={handleCopy}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs border border-slate-700"
                title="Copy Article Text"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Article Content Tabs & Sections */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-slate-800">
            {/* Quick Reference Callout */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                QUICK REFERENCE SUMMARY
              </div>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                {activeArticle.quickReference}
              </p>
            </div>

            {/* Overview & Detailed Explanation */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Overview & Statutory Foundation
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {activeArticle.overview}
              </p>
              <div className="mt-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-mono">
                {activeArticle.detailedExplanation}
              </div>
            </div>

            {/* Eligibility & Requirements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Eligibility Criteria
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {activeArticle.eligibility.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Mandatory Requirements & Records
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {activeArticle.requirements.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Limits & Exceptions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Statutory Limits & Phaseouts (TY {activeArticle.taxYear})
                </div>
                <div className="text-xs font-bold text-slate-800 font-mono">
                  {activeArticle.limits}
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Key Exceptions & Special Rules
                </div>
                <ul className="space-y-1 text-xs text-slate-700">
                  {activeArticle.exceptions.map((ex, idx) => (
                    <li key={idx}>• {ex}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Practical Examples */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Practical Client Scenarios
              </h3>
              <div className="space-y-2">
                {activeArticle.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 italic leading-relaxed"
                  >
                    &quot;{ex}&quot;
                  </div>
                ))}
              </div>
            </div>

            {/* Due Diligence & Common Mistakes */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Preparer Due Diligence & Form 8867 Enforcement
                </h4>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                {activeArticle.dueDiligence}
              </p>

              <div>
                <span className="text-[11px] font-bold text-amber-900 uppercase">Common Traps & Disqualifiers:</span>
                <ul className="mt-1 space-y-1 text-xs text-amber-800">
                  {activeArticle.commonMistakes.map((m, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="font-bold text-amber-700">⚠</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Attached IRS Sources */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Authoritative IRS Sources & Guidance
              </h3>
              <div className="space-y-2">
                {activeArticle.irsSources.map((src) => (
                  <div
                    key={src.id}
                    onClick={() => onOpenSourceModal(src)}
                    className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-between cursor-pointer transition text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 bg-slate-100 font-mono text-[11px] font-bold rounded border border-slate-200">
                        {src.pubOrForm}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900">{src.title}</div>
                        <div className="text-[10px] text-slate-500">{src.guidanceType} • {src.agency}</div>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      View Source <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Article Footer Audit Trail */}
            <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
              <div>
                Author: <span className="text-slate-600 font-semibold">{activeArticle.author}</span> • Reviewer: <span className="text-slate-600 font-semibold">{activeArticle.reviewer}</span>
              </div>
              <div>Last Verified: {activeArticle.lastUpdated}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
