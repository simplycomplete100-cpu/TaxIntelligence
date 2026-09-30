import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckSquare,
  AlertTriangle,
  Scale,
  FileText,
  Calculator,
  ExternalLink,
  Info,
  Calendar,
  Sparkles,
  Printer
} from 'lucide-react';
import { TaxYear, FirmProfile } from '../types';

interface DueDiligenceViewProps {
  currentTaxYear: TaxYear;
  firmProfile: FirmProfile;
  onAskAgent: (query: string) => void;
  onOpenResourceGenerator: (type?: string, topic?: string) => void;
}

export const DueDiligenceView: React.FC<DueDiligenceViewProps> = ({
  currentTaxYear,
  firmProfile,
  onAskAgent,
  onOpenResourceGenerator,
}) => {
  const [activeTab, setActiveTab] = useState<'8867_audit' | 'penalty_calc' | 'interview_checklist'>('8867_audit');

  // Interactive Form 8867 Checklist state
  const [form8867Checks, setForm8867Checks] = useState<Record<string, boolean>>({
    eligibility_worksheet: true,
    interview_conducted: true,
    corroborating_docs_inspected: false,
    three_year_retention_acknowledged: true,
    hoh_50_pct_computed: false,
    child_residency_corroborated: false,
    schedule_c_probed: false,
  });

  // Penalty Exposure Calculator state
  const [returnsCount, setReturnsCount] = useState(15);
  const [creditsPerReturn, setCreditsPerReturn] = useState(2); // e.g. EITC + CTC
  const penaltyPerFailure = 635; // 2025/2026 inflation-adjusted statutory penalty per credit/status

  const totalExposure = returnsCount * creditsPerReturn * penaltyPerFailure;

  const toggleCheck = (key: string) => {
    setForm8867Checks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Statutory Compliance
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-300">IRC §6695(g) & Treasury Regulation §1.6695-2</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Preparer Due Diligence & Form 8867 Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Statutory due diligence is a mandatory legal obligation under federal law. Ensure interview notes, residency substantiation, and 3-year record retention satisfy IRS auditor standards.
          </p>
        </div>

        <button
          onClick={() => onOpenResourceGenerator('due_diligence_checklist', 'Form 8867 Due Diligence')}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generate Due Diligence Checklist</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: '8867_audit', label: 'Form 8867 Audit Defense Protocol' },
          { id: 'interview_checklist', label: 'Mandatory Interview Questions' },
          { id: 'penalty_calc', label: 'IRC §6695(g) Penalty Calculator' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: FORM 8867 AUDIT DEFENSE PROTOCOL */}
      {activeTab === '8867_audit' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 Cols): Interactive Checkbox Workflow */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                The 5 Statutory Due Diligence Requirements Checklist
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every federal return claiming EITC, CTC/ACTC/ODC, AOTC, or Head of Household must meet each requirement.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'eligibility_worksheet',
                  title: '1. Complete & Submit Form 8867 with Return',
                  desc: 'Form 8867 must be electronically submitted with Form 1040 for all covered credits and HOH status.',
                },
                {
                  id: 'interview_conducted',
                  title: '2. Perform Probing Client Inquiries (Knowledge Test)',
                  desc: 'Preparer must not know or have reason to know that any information used to determine eligibility is incorrect, inconsistent, or incomplete.',
                },
                {
                  id: 'corroborating_docs_inspected',
                  title: '3. Inspect Corroborating Documents (Third-Party Proof)',
                  desc: 'Review independent records (school, medical, daycare, lease) when facts suggest ambiguity or conflict with IRS records.',
                },
                {
                  id: 'hoh_50_pct_computed',
                  title: '4. Compute 50% Household Upkeep (Form 8867 Part V)',
                  desc: 'If filing Head of Household, confirm client provided >50% of home costs from own funds (not child support/TANF).',
                },
                {
                  id: 'three_year_retention_acknowledged',
                  title: '5. Retain Records for 3 Years (Mandatory)',
                  desc: 'Keep copy of Form 8867, worksheets, record of questions asked, dates, and copies of documents inspected for 3 years from the filing deadline.',
                },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-3.5 rounded-lg border transition cursor-pointer flex items-start gap-3 ${
                    form8867Checks[item.id]
                      ? 'bg-emerald-50/70 border-emerald-500/80 text-emerald-950'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form8867Checks[item.id] || false}
                    onChange={() => {}}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 mt-0.5"
                  />
                  <div>
                    <div className="text-xs font-bold">{item.title}</div>
                    <div className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Statutory Circular 230 Disclaimer */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 block">Professional Responsibility Notice:</span>
              <p className="leading-relaxed">
                This platform is an educational and professional research workstation. AI-generated checklists do not relieve the tax preparer of their personal legal duty under Treasury Department Circular 230 and IRC §6695(g) to exercise independent due diligence.
              </p>
            </div>
          </div>

          {/* Right Column (1 Col): Key Penalty Facts & Common Disallowance Reasons */}
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 space-y-3 shadow-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900">
                  Top 3 Audit Penalty Triggers
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-rose-900">
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-rose-600">1.</span>
                  <span><strong>Schedule C "Peak EITC":</strong> Reporting arbitrary round revenues or minimal expenses to hit the maximum refundable EITC without bookkeeping records.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-rose-600">2.</span>
                  <span><strong>Separated Spouse Living in Home:</strong> Filing HOH when spouse lived in the residence at ANY time between July 1 and December 31.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-rose-600">3.</span>
                  <span><strong>Form 8332 Confusion:</strong> Believing Form 8332 allows noncustodial parents to claim EITC or Head of Household status (it does NOT).</span>
                </li>
              </ul>
            </div>

            {/* Quick Ask Agent Due Diligence */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-xs">
              <span className="text-xs font-bold text-slate-900 block">
                Need Help Evaluating an Ambiguous File?
              </span>
              <p className="text-xs text-slate-500">
                Ask the Tax Super Agent to analyze your client&apos;s specific facts against IRS audit defense standards.
              </p>
              <button
                onClick={() =>
                  onAskAgent(
                    'What specific questions must a preparer ask when a client separated during the tax year wants to claim Head of Household and EITC?'
                  )
                }
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold"
              >
                Ask Super Agent About Due Diligence
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANDATORY INTERVIEW QUESTIONS */}
      {activeTab === 'interview_checklist' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Mandatory Probing Interview Questions (By Covered Credit)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Preparers must contemporaneous record these answers in client permanent tax software notes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-800">
            {/* EITC Questions */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <span className="font-bold text-emerald-800 uppercase text-[11px] block">
                Earned Income Tax Credit (Schedule EIC & Form 8867 Part II)
              </span>
              <ul className="space-y-2 text-slate-700">
                <li>• &quot;Did each child live with you in the United States for more than 183 nights during the year?&quot;</li>
                <li>• &quot;Does anyone else (e.g. child’s other parent, grandparent) also live in the home or claim this child?&quot;</li>
                <li>• &quot;Do you have investment income (interest, dividends, net capital gains) exceeding the statutory limit?&quot;</li>
                <li>• &quot;If self-employed: Did you keep receipts and a contemporaneous mileage log?&quot;</li>
              </ul>
            </div>

            {/* Child Tax Credit & ODC */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <span className="font-bold text-blue-800 uppercase text-[11px] block">
                Child Tax Credit & ODC (Schedule 8812 & Form 8867 Part III)
              </span>
              <ul className="space-y-2 text-slate-700">
                <li>• &quot;Was the child under age 17 at the close of the calendar year?&quot;</li>
                <li>• &quot;Does the child have a valid Social Security number issued on or before the due date of the return?&quot;</li>
                <li>• &quot;Did the child provide more than half of their own financial support?&quot;</li>
                <li>• &quot;If noncustodial parent: Is Form 8332 signed by custodial parent attached to the return?&quot;</li>
              </ul>
            </div>

            {/* Head of Household */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <span className="font-bold text-amber-800 uppercase text-[11px] block">
                Head of Household Filing Status (Form 8867 Part V)
              </span>
              <ul className="space-y-2 text-slate-700">
                <li>• &quot;Were you legally married or separated under court decree as of December 31?&quot;</li>
                <li>• &quot;Did your spouse stay overnight in your home at ANY point between July 1 and December 31?&quot;</li>
                <li>• &quot;Did you provide over 50% of the rent, utilities, and home upkeep from your own wages or funds?&quot;</li>
                <li>• &quot;Did the qualifying child or relative reside in the home for more than half the year?&quot;</li>
              </ul>
            </div>

            {/* American Opportunity Tax Credit */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <span className="font-bold text-rose-800 uppercase text-[11px] block">
                AOTC Education Credit (Form 8863 & Form 8867 Part IV)
              </span>
              <ul className="space-y-2 text-slate-700">
                <li>• &quot;Did the student attend at least half-time in an eligible degree or certificate program?&quot;</li>
                <li>• &quot;Has the student completed four years of higher education before the tax year?&quot;</li>
                <li>• &quot;Has the AOTC been claimed for this student in four prior tax years?&quot;</li>
                <li>• &quot;Do you have Form 1098-T and bursar billing statements substantiating out-of-pocket tuition?&quot;</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PENALTY EXPOSURE CALCULATOR */}
      {activeTab === 'penalty_calc' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-xs max-w-3xl">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-600" />
              IRC §6695(g) Firm Penalty Exposure Calculator
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              The IRS assesses penalties per failure, per credit, per return on preparers and EROs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Number of Audited Returns with Errors:
              </label>
              <input
                type="number"
                min={1}
                max={500}
                value={returnsCount}
                onChange={(e) => setReturnsCount(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Covered Credits / Statuses Claimed per Return:
              </label>
              <select
                value={creditsPerReturn}
                onChange={(e) => setCreditsPerReturn(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-900 bg-white"
              >
                <option value={1}>1 (e.g. HOH only)</option>
                <option value={2}>2 (e.g. HOH + CTC)</option>
                <option value={3}>3 (e.g. HOH + CTC + EITC)</option>
                <option value={4}>4 (e.g. HOH + CTC + EITC + AOTC)</option>
              </select>
            </div>
          </div>

          {/* Result Card */}
          <div className="p-5 rounded-xl bg-rose-50 border border-rose-300 text-rose-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-rose-800">
                Statutory Penalty Liability Exposure:
              </div>
              <div className="text-2xl sm:text-3xl font-black text-rose-700 mt-1">
                ${totalExposure.toLocaleString()}
              </div>
              <div className="text-[11px] text-rose-900 mt-1">
                Based on {returnsCount} returns × {creditsPerReturn} credits @ ${penaltyPerFailure} statutory penalty per failure.
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="px-3 py-1.5 bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs">
                Zero Tolerance Audit Standard
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
