import React, { useState } from 'react';
import {
  Database,
  Plus,
  Edit2,
  Archive,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Search,
  Filter,
  Trash2,
  Check,
  X,
  FileText
} from 'lucide-react';
import { KnowledgeArticle, KnowledgeStatus, TaxYear, IRSSource } from '../types';

interface AdminKnowledgeManagerProps {
  articles: KnowledgeArticle[];
  sources: IRSSource[];
  currentTaxYear: TaxYear;
  onUpdateArticle: (article: KnowledgeArticle) => void;
  onCreateArticle: (article: Omit<KnowledgeArticle, 'id'>) => void;
}

export const AdminKnowledgeManager: React.FC<AdminKnowledgeManagerProps> = ({
  articles,
  sources,
  currentTaxYear,
  onUpdateArticle,
  onCreateArticle,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [editingArticle, setEditingArticle] = useState<KnowledgeArticle | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // New article state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Filing Status');
  const [newTaxYear, setNewTaxYear] = useState<TaxYear>(currentTaxYear);
  const [newOverview, setNewOverview] = useState('');
  const [newQuickRef, setNewQuickRef] = useState('');
  const [newDetailed, setNewDetailed] = useState('');
  const [newStatus, setNewStatus] = useState<KnowledgeStatus>('Draft');

  const statuses: (KnowledgeStatus | 'All')[] = [
    'All',
    'Draft',
    'Under Review',
    'Verified',
    'Published',
    'Needs Update',
    'Archived',
  ];

  const filteredArticles = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onCreateArticle({
      title: newTitle,
      category: newCategory,
      taxYear: newTaxYear,
      status: newStatus,
      overview: newOverview,
      quickReference: newQuickRef,
      detailedExplanation: newDetailed,
      eligibility: ['Standard statutory qualification rules apply'],
      requirements: ['Substantiating documentation retained for 3 years'],
      limits: 'Subject to annual IRS revenue procedures',
      exceptions: ['Refer to Treasury regulations for exceptions'],
      examples: ['Client scenario example will be populated'],
      documentation: ['Form 1040 records', 'Verification of address'],
      forms: ['Form 1040'],
      dueDiligence: 'IRC §6695(g) preparer due diligence applies.',
      commonMistakes: ['Inaccurate documentation', 'Failure to corroborate statements'],
      irsSources: sources.slice(0, 2),
      lastUpdated: new Date().toISOString().split('T')[0],
      author: 'Firm Knowledge Manager',
      reviewer: 'Lead Reviewer',
      version: '1.0',
      isRequiredTraining: false,
    });

    setIsCreating(false);
    setNewTitle('');
    setNewOverview('');
    setNewQuickRef('');
    setNewDetailed('');
  };

  const handleStatusChange = (art: KnowledgeArticle, newStat: KnowledgeStatus) => {
    onUpdateArticle({
      ...art,
      status: newStat,
      lastUpdated: new Date().toISOString().split('T')[0],
    });
  };

  const needsReviewCount = articles.filter(
    (a) => a.status === 'Needs Update' || a.taxYear !== currentTaxYear
  ).length;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Firm Administration
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-300">Article Verification & Lifecycle Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Knowledge Manager & Tax Year Audit
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Manage tax articles, assign tax years, audit sources, and enforce verification statuses across the entire firm knowledge base.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Knowledge Article</span>
        </button>
      </div>

      {/* Tax Year Transition Review Alert */}
      {needsReviewCount > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-4 text-xs text-amber-950">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold text-amber-900">
                Tax Year Transition Notice: {needsReviewCount} Articles Require Annual Review
              </span>
              <p className="text-[11px] text-amber-800">
                Ensure phaseout thresholds, standard deductions, and publication citations are updated for Tax Year {currentTaxYear}.
              </p>
            </div>
          </div>
          <button
            onClick={() => setStatusFilter('Needs Update')}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[11px] shrink-0"
          >
            Filter Pending Reviews
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search articles by title, category, code..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          {statuses.map((stat) => (
            <button
              key={stat}
              onClick={() => setStatusFilter(stat)}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                statusFilter === stat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {stat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Management Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <th className="p-3 font-bold">Article Title</th>
                <th className="p-3 font-bold">Category</th>
                <th className="p-3 font-bold">Tax Year</th>
                <th className="p-3 font-bold">Status</th>
                <th className="p-3 font-bold">Reviewer & Version</th>
                <th className="p-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredArticles.map((art) => (
                <tr key={art.id} className="hover:bg-slate-50">
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{art.title}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-sm">
                      {art.quickReference}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-emerald-800">{art.category}</span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-slate-100 font-mono font-bold rounded">
                      TY {art.taxYear}
                    </span>
                  </td>
                  <td className="p-3">
                    <select
                      value={art.status}
                      onChange={(e) => handleStatusChange(art, e.target.value as KnowledgeStatus)}
                      className="px-2 py-1 rounded border border-slate-300 font-semibold text-[11px] bg-white cursor-pointer"
                    >
                      {statuses
                        .filter((s) => s !== 'All')
                        .map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                    </select>
                  </td>
                  <td className="p-3 text-[11px] text-slate-500">
                    <div>{art.reviewer}</div>
                    <div className="text-[10px] text-slate-400">v{art.version} • {art.lastUpdated}</div>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setEditingArticle(art)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded mr-1"
                      title="Edit Article"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Article Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
              <h2 className="text-sm font-bold">Create New Knowledge Article</h2>
              <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Article Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Schedule E Rental Depreciation & Passive Loss Rules"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Filing Status">Filing Status</option>
                    <option value="Self-Employment">Self-Employment</option>
                    <option value="Tax Credits">Tax Credits</option>
                    <option value="Dependents">Dependents</option>
                    <option value="Rental Property">Rental Property</option>
                    <option value="Due Diligence">Due Diligence</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tax Year</label>
                  <select
                    value={newTaxYear}
                    onChange={(e) => setNewTaxYear(e.target.value as TaxYear)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-bold"
                  >
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as KnowledgeStatus)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Verified">Verified</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Quick Reference Summary</label>
                <input
                  type="text"
                  value={newQuickRef}
                  onChange={(e) => setNewQuickRef(e.target.value)}
                  placeholder="One-sentence rule for quick reference..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Overview</label>
                <textarea
                  rows={2}
                  value={newOverview}
                  onChange={(e) => setNewOverview(e.target.value)}
                  placeholder="High-level overview and statutory context..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Explanation & Code Rules</label>
                <textarea
                  rows={4}
                  value={newDetailed}
                  onChange={(e) => setNewDetailed(e.target.value)}
                  placeholder="In-depth code sections, IRC citations, tests..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-[11px]"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
