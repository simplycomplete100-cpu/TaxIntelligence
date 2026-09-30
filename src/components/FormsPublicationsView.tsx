import React, { useState, useMemo } from 'react';
import {
  Files,
  Search,
  ExternalLink,
  Sparkles,
  FileSpreadsheet,
  BookOpen,
  Filter,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { TaxFormInfo, TaxYear } from '../types';

interface FormsPublicationsViewProps {
  forms: TaxFormInfo[];
  currentTaxYear: TaxYear;
  onAskAgent: (query: string) => void;
  onTurnIntoResource: (type: string, topic: string, content: string) => void;
  selectedFormNumber?: string;
}

export const FormsPublicationsView: React.FC<FormsPublicationsViewProps> = ({
  forms,
  currentTaxYear,
  onAskAgent,
  onTurnIntoResource,
  selectedFormNumber,
}) => {
  const [searchTerm, setSearchTerm] = useState(selectedFormNumber || '');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', 'Individual', 'Business', 'Due Diligence', 'Credits'];

  const filteredForms = useMemo(() => {
    return forms.filter((f) => {
      const matchesSearch =
        f.formNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.relatedTopics.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = categoryFilter === 'All' || f.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [forms, searchTerm, categoryFilter]);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
              <Files className="w-4 h-4 text-blue-700" />
            </div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              IRS Forms, Schedules & Publications Library
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-800 border border-blue-200">
              Tax Year {currentTaxYear}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Authoritative directory of IRS forms, instructions, schedules, and publications. Never relies on outdated versions for active filing seasons.
          </p>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Form #, publication, keyword (e.g. Schedule C, 8867)..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Forms Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredForms.map((form) => (
          <div
            key={form.formNumber}
            className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 p-5 flex flex-col justify-between transition shadow-xs"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="px-2.5 py-1 bg-slate-900 text-white font-mono text-xs font-black rounded">
                  {form.formNumber}
                </span>
                <span className="text-[10px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {form.category}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {form.title}
                </h3>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Current Filing Season: {form.currentTaxYear}
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-800 block text-[10px] uppercase mb-0.5">Purpose:</span>
                {form.purpose}
              </div>

              <div className="text-xs text-slate-600">
                <span className="font-bold text-slate-700">When Used: </span>
                {form.whenUsed}
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {form.relatedTopics.map((topic, idx) => (
                  <span
                    key={idx}
                    className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-600"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Links and Actions */}
            <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <a
                  href={form.officialSourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
                >
                  <span>Form PDF</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={form.instructionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-700 hover:text-blue-800 font-bold flex items-center gap-1"
                >
                  <span>Instructions</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() =>
                    onAskAgent(
                      `Explain line-by-line preparation requirements, exceptions, and due diligence checks for ${form.formNumber} (${form.title})`
                    )
                  }
                  className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-semibold text-slate-700 flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>Ask Agent</span>
                </button>

                <button
                  onClick={() =>
                    onTurnIntoResource(
                      'cheat_sheet',
                      form.formNumber,
                      `${form.title}\nPurpose: ${form.purpose}\nWhen used: ${form.whenUsed}`
                    )
                  }
                  className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-semibold text-slate-700 flex items-center justify-center gap-1"
                >
                  <FileSpreadsheet className="w-3 h-3 text-amber-600" />
                  <span>Cheat Sheet</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
