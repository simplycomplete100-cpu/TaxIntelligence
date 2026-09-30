import React, { useState, useMemo } from 'react';
import {
  Search,
  ExternalLink,
  BookOpen,
  FileSpreadsheet,
  Scale,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  Filter,
  Bookmark,
  CheckSquare,
  FileText,
  FileDown,
  X,
  Copy,
  Check,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { IRSSource, TaxYear, StructuredAgentResponse } from '../types';
import { exportResourceToPdf } from '../utils/pdfExport';
import { DocumentRenderer } from './DocumentRenderer';

interface IrsResearchViewProps {
  sources: IRSSource[];
  currentTaxYear: TaxYear;
  onAskAgent: (query: string) => void;
  onTurnIntoResource: (type: string, topic: string, content: string) => void;
  onOpenSourceModal: (source: IRSSource) => void;
}

export const IrsResearchView: React.FC<IrsResearchViewProps> = ({
  sources,
  currentTaxYear,
  onAskAgent,
  onTurnIntoResource,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedSourceDetail, setSelectedSourceDetail] = useState<IRSSource | null>(null);
  const [copiedCitation, setCopiedCitation] = useState<string | null>(null);

  // In-page live research state
  const [isResearching, setIsResearching] = useState(false);
  const [activeResearch, setActiveResearch] = useState<{
    query: string;
    content: string;
    structured?: StructuredAgentResponse;
  } | null>(null);

  const guidanceTypes = [
    'All',
    'Official IRS Guidance',
    'IRS Form/Instructions',
    'Statutory Authority',
    'Treasury Regulation',
  ];

  const quickPills = [
    { label: 'Pub 501 (Dependents & HOH)', query: 'IRS Publication 501 Dependents and Head of Household qualifying child' },
    { label: 'Pub 463 (Mileage & Travel)', query: 'IRS Publication 463 Standard Mileage Rate and Vehicle Travel rules' },
    { label: 'Pub 596 (Earned Income Credit)', query: 'IRS Publication 596 Earned Income Tax Credit statutory tiebreakers' },
    { label: 'Pub 587 (Home Office)', query: 'IRS Publication 587 Business Use of Home simplified method' },
    { label: 'Pub 527 (Rental Property)', query: 'IRS Publication 527 Residential Rental Property depreciation' },
    { label: 'Form 8867 (Due Diligence)', query: 'Form 8867 Paid Preparer Due Diligence Checklist rules' },
    { label: 'Form 8332 (Custody Release)', query: 'Form 8332 Release of Claim to Exemption for Noncustodial Parent' },
    { label: 'IRC §152 (Qualifying Child)', query: 'Internal Revenue Code Section 152 Qualifying Child student rules' },
    { label: 'IRC §162 (Business Expenses)', query: 'Internal Revenue Code Section 162 ordinary and necessary expenses' },
  ];

  const filteredSources = useMemo(() => {
    return sources.filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) {
        return selectedType === 'All' || s.guidanceType === selectedType;
      }

      const tokens = q.split(/\s+/).filter(Boolean);
      const targetText = `${s.title} ${s.pubOrForm} ${s.summary} ${s.keyTopics.join(' ')} ${s.agency} ${s.fullGuidance || ''}`.toLowerCase();
      const matchesTokens = tokens.some((token) => targetText.includes(token));
      const matchesType = selectedType === 'All' || s.guidanceType === selectedType;
      return matchesTokens && matchesType;
    });
  }, [sources, searchQuery, selectedType]);

  // Perform live authoritative IRS research
  const handleExecuteResearch = async (queryToRun?: string) => {
    const q = (queryToRun || searchQuery).trim();
    if (!q) return;

    setIsResearching(true);
    try {
      const response = await fetch('/api/agent/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          taxYear: currentTaxYear,
          audience: 'tax_pro',
        }),
      });

      const data = await response.json();
      setActiveResearch({
        query: q,
        content: data.content || data.structured?.quickAnswer || 'Research completed.',
        structured: data.structured,
      });
    } catch (err) {
      console.error('IRS Research query failed:', err);
      onAskAgent(q);
    } finally {
      setIsResearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    handleExecuteResearch(searchQuery);
  };

  const handleSelectPill = (pill: { label: string; query: string }) => {
    setSearchQuery(pill.label);
    handleExecuteResearch(pill.query);
  };

  const handleExportPdf = () => {
    if (!activeResearch) return;
    exportResourceToPdf({
      title: `IRS Research: ${activeResearch.query}`,
      type: 'Authoritative IRS Research Dossier',
      audience: 'Tax Professional / ERO',
      taxYear: currentTaxYear,
      content: activeResearch.content,
      firmName: 'Apex Tax Intelligence',
      fileName: `irs-research-${activeResearch.query.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30)}-ty${currentTaxYear}.pdf`,
    });
  };

  const handleCopyCitation = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCitation(id);
    setTimeout(() => setCopiedCitation(null), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Sleek, Modern Search & Guidance Bar (Clean, no clunky repetitive headers) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Official IRS Guidance & Statutory Reference
              </h1>
              <div className="text-[11px] text-slate-500">
                Verified Publications, Form Instructions, IRC Statutes & Treasury Regulations for TY {currentTaxYear}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              {filteredSources.length} Authorities Cataloged
            </span>
          </div>
        </div>

        {/* Live IRS Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative mt-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by publication (e.g. Pub 501, Pub 596), form (Form 8867, Form 8332), code (IRC §152, §162), or tax topic..."
            className="w-full pl-11 pr-36 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white shadow-inner font-medium transition"
          />
          <div className="absolute right-2 top-2 bottom-2 flex items-center gap-1.5">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
                title="Clear"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              disabled={isResearching || !searchQuery.trim()}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              {isResearching ? (
                <>
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>Researching...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Research</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Topic Chips */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Common Authorities:
          </span>
          {quickPills.map((pill, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPill(pill)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 text-slate-700 whitespace-nowrap transition cursor-pointer font-medium"
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter by Type:
          </span>
          {guidanceTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                selectedType === type
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* ACTIVE AUTHORITATIVE RESEARCH DOSSIER (Rendered with modern DocumentRenderer - NO hashtags!) */}
      {isResearching && (
        <div className="p-6 bg-white border border-emerald-500/50 rounded-xl shadow-sm space-y-2 animate-pulse">
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-4 h-4 animate-spin" />
            <span>Researching Official IRS Guidance & Statutes for Tax Year {currentTaxYear}...</span>
          </div>
          <p className="text-xs text-slate-500">
            Extracting Title 26 Internal Revenue Code, Treasury Regulations, and IRS Publication rules...
          </p>
        </div>
      )}

      {activeResearch && !isResearching && (
        <div className="bg-white border-2 border-emerald-600/70 rounded-xl p-5 sm:p-6 shadow-md space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                Verified IRS Research Result
              </span>
              <span className="text-xs font-bold text-slate-600">
                Tax Year {currentTaxYear}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onAskAgent(activeResearch.query)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open in Super Agent</span>
              </button>
              <button
                onClick={() =>
                  onTurnIntoResource(
                    'cheat_sheet',
                    activeResearch.query,
                    activeResearch.content
                  )
                }
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Build Cheat Sheet</span>
              </button>
              <button
                onClick={handleExportPdf}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
              <button
                onClick={() => setActiveResearch(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Research Inquiry:
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              {activeResearch.query}
            </h2>
          </div>

          {/* Quick Answer Banner */}
          {activeResearch.structured?.quickAnswer && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-1 flex items-center gap-1">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-700" />
                QUICK ANSWER
              </div>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                {activeResearch.structured.quickAnswer}
              </p>
            </div>
          )}

          {/* Clean Content Rendered Without Hashtags */}
          <DocumentRenderer
            content={activeResearch.content}
            type="Authoritative IRS Research"
            taxYear={currentTaxYear}
          />
        </div>
      )}

      {/* Official IRS Publications & Statutory Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-600" />
            Verified Federal Tax Authorities ({filteredSources.length})
          </h2>
          {searchQuery && (
            <span className="text-xs text-slate-500">
              Filtering for &quot;{searchQuery}&quot;
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSources.map((source) => {
            return (
              <div
                key={source.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 p-5 flex flex-col justify-between transition shadow-xs hover:shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-0.5 bg-slate-100 font-mono text-xs font-bold text-slate-900 rounded border border-slate-200">
                      {source.pubOrForm}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {source.guidanceType}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {source.title}
                    </h3>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                      <span>{source.agency}</span>
                      <span>•</span>
                      <span>TY: {source.taxYear}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {source.summary}
                  </p>

                  {/* Key Topics */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {source.keyTopics.slice(0, 4).map((topic, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-medium"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Source Card Actions */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedSourceDetail(source)}
                      className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Read Guidance Dossier</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-slate-700 flex items-center gap-1 text-[11px]"
                      title="Open Official IRS.gov URL"
                    >
                      <span>IRS.gov</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Instant Tools: Build Cheat Sheet / Ask Agent */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        onTurnIntoResource(
                          'cheat_sheet',
                          `${source.pubOrForm} - ${source.title.split(':')[0]}`,
                          source.fullGuidance || source.summary
                        )
                      }
                      className="py-1.5 px-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded text-[11px] font-bold text-amber-900 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3 h-3 text-amber-700" />
                      <span>Build Cheat Sheet</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onAskAgent(
                          `Explain the core rules, thresholds, and preparer due diligence for ${source.pubOrForm} (${source.title}) for Tax Year ${currentTaxYear}`
                        )
                      }
                      className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-semibold text-slate-700 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>Ask Agent</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSources.length === 0 && (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200 space-y-3">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">
              No local publications matched &quot;{searchQuery}&quot;
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Run a live Tax Super Agent inquiry to research Title 26 U.S. Code, Treasury Regulations, and Revenue Procedures for this topic.
            </p>
            <button
              onClick={() => handleExecuteResearch(searchQuery)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Research &quot;{searchQuery}&quot; Across Entire IRS Code</span>
            </button>
          </div>
        )}
      </div>

      {/* DETAILED IRS GUIDANCE READER MODAL (Deep Information, Not a Shell!) */}
      {selectedSourceDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {selectedSourceDetail.pubOrForm}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-300">{selectedSourceDetail.agency}</span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-emerald-400 font-semibold">TY {selectedSourceDetail.taxYear}</span>
              </div>
              <button
                onClick={() => setSelectedSourceDetail(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-slate-800 text-xs sm:text-sm">
              <div>
                <h2 className="text-lg font-black text-slate-900 leading-snug">
                  {selectedSourceDetail.title}
                </h2>
                <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                  <span>Last Updated: {selectedSourceDetail.lastUpdated}</span>
                  <span>•</span>
                  <span>Guidance Type: {selectedSourceDetail.guidanceType}</span>
                </div>
              </div>

              {/* Summary Block */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Executive IRS Summary
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {selectedSourceDetail.summary}
                </p>
              </div>

              {/* Full Guidance Text */}
              {selectedSourceDetail.fullGuidance && (
                <div className="space-y-2">
                  <div className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    Authoritative Guidance & Statutory Rules
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 text-slate-800 leading-relaxed">
                    {selectedSourceDetail.fullGuidance}
                  </div>
                </div>
              )}

              {/* Key Provisions & Statutory Citations */}
              {selectedSourceDetail.keyProvisions && selectedSourceDetail.keyProvisions.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-purple-600" />
                    Key Statutory Provisions & Code Sections
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedSourceDetail.keyProvisions.map((prov, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <span className="font-mono font-medium text-slate-800">{prov}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyCitation(prov, `prov-${idx}`)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded"
                          title="Copy citation"
                        >
                          {copiedCitation === `prov-${idx}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preparer Action Points */}
              {selectedSourceDetail.preparerActionPoints && selectedSourceDetail.preparerActionPoints.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                    Mandatory Preparer Action Points
                  </div>
                  <div className="space-y-1.5">
                    {selectedSourceDetail.preparerActionPoints.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-blue-50/40 p-2.5 rounded-lg border border-blue-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Due Diligence Checklist */}
              {selectedSourceDetail.dueDiligenceCheck && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                    Due Diligence & Audit Defense (IRC §6695(g))
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    {selectedSourceDetail.dueDiligenceCheck}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer with Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
              <a
                href={selectedSourceDetail.url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <span>Open on IRS.gov</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const src = selectedSourceDetail;
                    setSelectedSourceDetail(null);
                    onTurnIntoResource(
                      'cheat_sheet',
                      `${src.pubOrForm} - ${src.title.split(':')[0]}`,
                      src.fullGuidance || src.summary
                    );
                  }}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Build Cheat Sheet</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const src = selectedSourceDetail;
                    setSelectedSourceDetail(null);
                    onAskAgent(
                      `Analyze the requirements of ${src.pubOrForm} (${src.title}) for Tax Year ${currentTaxYear}`
                    );
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask Super Agent</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
