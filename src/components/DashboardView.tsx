import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Bot,
  FileSpreadsheet,
  FilePlus,
  Users,
  CheckSquare,
  GraduationCap,
  Files,
  ArrowRight,
  TrendingUp,
  Bookmark,
  Clock,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Calendar,
  AlertCircle
} from 'lucide-react';
import {
  User,
  FirmProfile,
  TaxYear,
  SavedResearch,
  GeneratedResource,
  KnowledgeArticle,
  TrainingCourse
} from '../types';
import { NavTab } from './Sidebar';
import { TAX_YEAR_RATES } from '../data/taxDatabase';

interface DashboardViewProps {
  currentUser: User;
  firmProfile: FirmProfile;
  currentTaxYear: TaxYear;
  savedResearch: SavedResearch[];
  savedResources: GeneratedResource[];
  articles: KnowledgeArticle[];
  courses: TrainingCourse[];
  onNavigateTo: (tab: NavTab, targetId?: string) => void;
  onAskAgent: (question: string) => void;
  onOpenResourceGenerator: (type?: string, topic?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  firmProfile,
  currentTaxYear,
  savedResearch,
  savedResources,
  articles,
  courses,
  onNavigateTo,
  onAskAgent,
  onOpenResourceGenerator,
}) => {
  const [quickQuestion, setQuickQuestion] = useState('');

  const yearData = TAX_YEAR_RATES[currentTaxYear] || TAX_YEAR_RATES['2026'];

  const quickPrompts = [
    'Qualifying person rules for Head of Household (unmarried vs considered unmarried)',
    'Schedule C standard mileage rate vs actual vehicle expense depreciation rules',
    'EITC statutory tie-breaker rules between custodial parent and grandparent',
    'Form 8867 mandatory interview documentation for child tax credit',
    'Form 8332 noncustodial release: what credits transfer and what credits do not',
    '1099-K reporting threshold updates and gross receipts reconciliation',
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuestion.trim()) return;
    onAskAgent(quickQuestion);
    onNavigateTo('super_agent');
  };

  const handleSelectPrompt = (prompt: string) => {
    onAskAgent(prompt);
    onNavigateTo('super_agent');
  };

  return (
    <div className="space-y-6">
      {/* Centerpiece: WHAT DO YOU NEED HELP WITH TODAY? & Large Tax Super Agent Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center">
              <Bot className="w-4 h-4 text-emerald-700" />
            </div>
            <h2 className="text-sm font-extrabold text-slate-900 tracking-wide uppercase">
              What do you need help with today?
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Tax Super Agent Online
          </span>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={quickQuestion}
            onChange={(e) => setQuickQuestion(e.target.value)}
            placeholder={`Ask any federal tax question for Tax Year ${currentTaxYear} (e.g. "Can a noncustodial parent claim EITC with Form 8332?")...`}
            className="w-full pl-4 pr-32 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white shadow-inner font-medium transition"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <span>Research</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Suggested Quick Queries */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Popular:
          </span>
          {quickPrompts.slice(0, 4).map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPrompt(p)}
              className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 rounded-lg text-slate-700 whitespace-nowrap transition cursor-pointer font-medium"
            >
              {p.length > 55 ? `${p.slice(0, 52)}...` : p}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Action Workstation Grid (Prompt Section 2) */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Quick Action Studio
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {[
            { label: 'Ask Tax Agent', icon: Bot, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', action: () => onNavigateTo('super_agent') },
            { label: 'Research IRS', icon: Search, color: 'text-blue-600 bg-blue-50 border-blue-200', action: () => onNavigateTo('irs_research') },
            { label: 'Create Cheat Sheet', icon: FileSpreadsheet, color: 'text-amber-600 bg-amber-50 border-amber-200', action: () => onOpenResourceGenerator('cheat_sheet', 'Head of Household') },
            { label: 'Create One-Pager', icon: FilePlus, color: 'text-indigo-600 bg-indigo-50 border-indigo-200', action: () => onOpenResourceGenerator('one_pager', 'Schedule C Deductions') },
            { label: 'Client Handout', icon: Users, color: 'text-teal-600 bg-teal-50 border-teal-200', action: () => onNavigateTo('client_resources') },
            { label: 'Create Checklist', icon: CheckSquare, color: 'text-violet-600 bg-violet-50 border-violet-200', action: () => onOpenResourceGenerator('preparer_checklist', 'EITC Verification') },
            { label: 'Start Training', icon: GraduationCap, color: 'text-rose-600 bg-rose-50 border-rose-200', action: () => onNavigateTo('training_center') },
            { label: 'Look Up Form', icon: Files, color: 'text-slate-600 bg-slate-100 border-slate-200', action: () => onNavigateTo('forms_pubs') },
          ].map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <button
                key={idx}
                onClick={tool.action}
                className="p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl flex flex-col items-center justify-center text-center transition group shadow-xs cursor-pointer"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 border ${tool.color} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-800 leading-tight">
                  {tool.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Continue Recent Research + Recently Viewed Topics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continue Recent Research */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Continue Recent Research</h3>
              </div>
              <button
                onClick={() => onNavigateTo('recent_research')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                View all ({savedResearch.length}) <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {savedResearch.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigateTo('recent_research', item.id)}
                  className="p-3.5 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50/80 transition cursor-pointer flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        TY {item.taxYear}
                      </span>
                      <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{item.question}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5">
                      <span>Folder: {item.folder}</span>
                      <span>•</span>
                      <span>{item.sources.length} IRS Sources verified</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 shrink-0 mt-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Popular Tax Topics / Library Quick Access */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Tax Knowledge Library Core</h3>
              </div>
              <button
                onClick={() => onNavigateTo('tax_library')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                Browse Library <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {articles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => onNavigateTo('tax_library', art.id)}
                  className="p-3.5 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-emerald-700">{art.category}</span>
                      <span className="text-slate-400">v{art.version}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">
                      {art.title}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {art.quickReference}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="text-emerald-700 font-semibold">{art.status}</span>
                    <span>{art.forms.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Saved Cheat Sheets + Training Progress + Due Diligence Alert */}
        <div className="space-y-6">
          {/* Saved Cheat Sheets */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">Saved Cheat Sheets</h3>
              </div>
              <button
                onClick={() => onNavigateTo('cheat_sheets')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                All
              </button>
            </div>

            <div className="space-y-2">
              {savedResources.slice(0, 3).map((res) => (
                <div
                  key={res.id}
                  onClick={() => onNavigateTo('saved_resources', res.id)}
                  className="p-2.5 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition cursor-pointer"
                >
                  <div className="text-xs font-bold text-slate-900 line-clamp-1">{res.title}</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                    <span className="font-medium text-amber-700 capitalize">{res.type.replace('_', ' ')}</span>
                    <span>Audience: {res.audience}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Training Progress */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900">Preparer Training Hub</h3>
              </div>
              <button
                onClick={() => onNavigateTo('training_center')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Go to Center
              </button>
            </div>

            {courses.slice(0, 1).map((c) => (
              <div key={c.id} className="space-y-2">
                <div className="text-xs font-semibold text-slate-800">{c.title}</div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full w-2/3" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>66% Completed</span>
                  <span>2 of 3 Lessons</span>
                </div>
                <button
                  onClick={() => onNavigateTo('scenario_lab')}
                  className="w-full mt-2 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <span>Launch Scenario Lab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Statutory Due Diligence Alert Box */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Preparer Due Diligence Reminder</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              IRC §6695(g) penalties apply to each covered credit (EITC, CTC/ACTC/ODC, AOTC) and Head of Household filing status. Always corroborate client statements with third-party records.
            </p>
            <button
              onClick={() => onNavigateTo('due_diligence')}
              className="text-[11px] font-bold text-amber-900 underline hover:text-amber-950"
            >
              Open Form 8867 Compliance Workstation →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
