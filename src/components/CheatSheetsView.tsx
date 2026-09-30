import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Sparkles,
  Download,
  Bookmark,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Copy,
  Check
} from 'lucide-react';
import { TaxYear, FirmProfile, GeneratedResource } from '../types';

interface CheatSheetsViewProps {
  currentTaxYear: TaxYear;
  firmProfile: FirmProfile;
  savedResources: GeneratedResource[];
  onOpenResourceGenerator: (type?: string, topic?: string) => void;
}

export const CheatSheetsView: React.FC<CheatSheetsViewProps> = ({
  currentTaxYear,
  firmProfile,
  savedResources,
  onOpenResourceGenerator,
}) => {
  const [selectedSheet, setSelectedSheet] = useState<string>('hoh-2026');
  const [copied, setCopied] = useState(false);

  // Pre-configured, verified high-yield cheat sheets
  const builtInCheatSheets = [
    {
      id: 'hoh-2026',
      title: 'Head of Household (HOH) 2026 Qualification Matrix',
      taxYear: '2026',
      audience: 'New Tax Preparer',
      definition: 'Filing status providing a higher standard deduction ($22,500) and wider tax brackets for unmarried taxpayers who maintain a home for a qualifying dependent.',
      requirements: [
        'Unmarried or "considered unmarried" under IRC §7703(b) on December 31, 2026',
        'Personally paid >50% of the cost of keeping up the primary residence for the year',
        'Qualifying person lived in the home for >6 months (183+ nights)'
      ],
      quickTest: [
        { q: 'Was client legally married on Dec 31?', ifYes: 'Apply "Considered Unmarried" 4-part test below.', ifNo: 'Client passes marital status test.' },
        { q: 'Did spouse live in home between July 1 & Dec 31?', ifYes: 'DISQUALIFIED from Head of Household.', ifNo: 'Passes absence test.' },
        { q: 'Did client pay >50% of rent, utilities, food?', ifYes: 'Passes upkeep test.', ifNo: 'DISQUALIFIED (cannot count welfare/SNAP).' }
      ],
      disqualifiers: [
        'Spouse stayed in the home even ONE night between July 1 and Dec 31',
        'Boyfriend/girlfriend claimed as dependent (cannot qualify taxpayer for HOH)',
        'Relying on child support or TANF to meet the 50% household upkeep test',
        'Noncustodial parent attempting to claim HOH based on Form 8332'
      ],
      questionsToAsk: [
        'Were you married on December 31? If separated, on what exact date did your spouse move out?',
        'What were your total household rent and utility expenses, and did your income cover over half?',
        'Does the child live with you during the school week?'
      ],
      documentation: [
        'Lease agreement or mortgage statement in client’s name',
        'Electric, gas, water utility bills',
        'School registration or medical records showing child shares address',
        'Form 8867 Part I and Part V'
      ],
      dueDiligence: 'IRC §6695(g) penalty exceeds $600 per failure. Preparers must not accept verbal assertions without checking utility and address corroboration.',
      irsRefs: ['IRC §2(b)', 'IRC §7703(b)', 'IRS Publication 501', 'Form 8867']
    },
    {
      id: 'schedule-c-mileage',
      title: 'Schedule C Vehicle Expenses: Standard Mileage vs Actual',
      taxYear: '2026',
      audience: 'Tax Preparer',
      definition: 'Operational rules under IRC §162 and §274(d) for deducting vehicular business use for sole proprietors, rideshare drivers, and contractors.',
      requirements: [
        'Contemporaneous written or digital log recording date, destination, business purpose, and odometer readings',
        'Separation of personal commuting miles from deductible business travel',
        'Election made in Year 1 if using standard mileage on owned vehicle'
      ],
      quickTest: [
        { q: 'Is standard mileage chosen in Year 1 car was available for business?', ifYes: 'Can use standard mileage or actual in future years.', ifNo: 'Must use actual expenses permanently.' },
        { q: 'Does taxpayer have written or app log with dates & miles?', ifYes: 'Deduction allowable.', ifNo: 'DISALLOWED under IRC §274(d).' }
      ],
      disqualifiers: [
        'Commuting between personal residence and regular primary work location',
        'Claiming 100% business use on family vehicle when no other personal car is owned',
        'Estimating miles with round numbers (e.g. exactly 20,000 miles)'
      ],
      questionsToAsk: [
        'Do you have a second vehicle for personal and family use?',
        'What was your vehicle odometer reading on Jan 1 and Dec 31?',
        'Do you have an app export (e.g. MileIQ, Uber/Lyft summary) showing trip details?'
      ],
      documentation: [
        'Annual platform tax summary reports',
        'Written mileage log book or mileage app PDF export',
        'Repair receipts and oil change invoices verifying odometer progression'
      ],
      dueDiligence: 'IRS targets vehicle deductions where net profit maximizes EITC. Preparers must inspect the log and confirm personal miles were subtracted.',
      irsRefs: ['IRC §274(d)', 'IRS Publication 463', 'IRS Publication 334', 'Form 4562']
    },
    {
      id: 'eitc-tiebreaker',
      title: 'EITC Statutory Tie-Breaker Decision Tree',
      taxYear: '2026',
      audience: 'Experienced Preparer',
      definition: 'Hierarchy of legal rules under IRC §152(c)(4) when a qualifying child meets the tests for more than one taxpayer.',
      requirements: [
        'Child meets relationship, age, and residency tests for multiple people',
        'Parents do not file a joint return together'
      ],
      quickTest: [
        { q: 'Is one claimant a parent and the other non-parent?', ifYes: 'Parent wins automatically unless parent agrees and non-parent AGI is higher.', ifNo: 'Move to next tie-breaker.' },
        { q: 'Are both claimants parents?', ifYes: 'Parent with whom child lived longest wins. If equal, parent with highest AGI wins.', ifNo: 'Move to non-parent test.' },
        { q: 'Neither claimant is a parent?', ifYes: 'Person with highest AGI wins.', ifNo: 'Consult tax counsel.' }
      ],
      disqualifiers: [
        'Noncustodial parent attempting to claim EITC with Form 8332',
        'Grandparent claiming child when parent lives in the home and has higher AGI'
      ],
      questionsToAsk: [
        'Who else lived in the home with the child during the year?',
        'How many nights did the child spend at each parent’s home?',
        'What was the adjusted gross income of all adults in the residence?'
      ],
      documentation: [
        'Calendar log or school attendance records showing overnight stays',
        'Proof of relationship (birth certificates)',
        'Form 8867 Part II completed and retained'
      ],
      dueDiligence: 'Preparers must ask who else resides in the home and verify whether another parent or relative is filing to claim the same child.',
      irsRefs: ['IRC §32(c)', 'IRC §152(c)(4)', 'IRS Publication 596', 'Form 8867']
    }
  ];

  const activeSheet = builtInCheatSheets.find((s) => s.id === selectedSheet) || builtInCheatSheets[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${activeSheet.title}\n\nDEFINITION:\n${activeSheet.definition}\n\nREQUIREMENTS:\n${activeSheet.requirements.join('\n')}\n\nDUE DILIGENCE:\n${activeSheet.dueDiligence}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4 text-amber-700" />
            </div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Tax Preparer Cheat Sheet Hub
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200">
              Tax Year {currentTaxYear}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Concise, high-impact 1-page visual references, qualification matrices, disqualifier checklists, and IRS code citations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenResourceGenerator('cheat_sheet', 'New Custom Topic')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Build New Cheat Sheet</span>
          </button>
        </div>
      </div>

      {/* Select Cheat Sheet Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-print">
        {builtInCheatSheets.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedSheet(s.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              selectedSheet === s.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <FileSpreadsheet className={`w-3.5 h-3.5 ${selectedSheet === s.id ? 'text-amber-400' : 'text-slate-400'}`} />
            <span>{s.title.split(' ')[0]} {s.title.split(' ')[1]}</span>
          </button>
        ))}
      </div>

      {/* Active Cheat Sheet Visual Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Card Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span className="font-bold text-amber-400 uppercase tracking-wider">Cheat Sheet</span>
              <span>•</span>
              <span>Target: {activeSheet.audience}</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">TY {activeSheet.taxYear}</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white">
              {activeSheet.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              onClick={() => onOpenResourceGenerator('cheat_sheet', activeSheet.title)}
              className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 shadow-sm transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Customize in Studio</span>
            </button>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-700 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Sheet</span>
            </button>
          </div>
        </div>

        {/* Cheat Sheet Content Body */}
        <div className="p-6 space-y-6 text-slate-800">
          {/* Definition */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed">
            <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block mb-1">
              Statutory Definition & Purpose
            </span>
            {activeSheet.definition}
          </div>

          {/* Quick Qualification Matrix Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Quick Qualification Decision Tree
            </h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <th className="p-2.5 font-bold">Inquiry Question</th>
                    <th className="p-2.5 font-bold text-emerald-800">If YES Result</th>
                    <th className="p-2.5 font-bold text-rose-800">If NO Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {activeSheet.quickTest.map((test, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2.5 font-semibold text-slate-900">{test.q}</td>
                      <td className="p-2.5 text-emerald-800 font-medium">{test.ifYes}</td>
                      <td className="p-2.5 text-rose-800 font-medium">{test.ifNo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Disqualifying Traps & Due Diligence Red Flags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 text-rose-950">
              <div className="text-[10px] font-bold uppercase tracking-wider text-rose-800 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Disqualifying Situations & Red Flags
              </div>
              <ul className="space-y-1.5 text-xs text-rose-900">
                {activeSheet.disqualifiers.map((d, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="font-bold text-rose-600">✕</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                IRC §6695(g) Due Diligence Protocol
              </div>
              <p className="text-xs text-amber-900 leading-relaxed mb-2">
                {activeSheet.dueDiligence}
              </p>
              <div className="text-[11px] font-semibold text-amber-950">
                Mandatory Documentation to Retain:
              </div>
              <ul className="mt-1 space-y-1 text-xs text-amber-800">
                {activeSheet.documentation.map((doc, idx) => (
                  <li key={idx}>• {doc}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Questions to Ask Client */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              Mandatory Preparer Interview Questions
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {activeSheet.questionsToAsk.map((q, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600">{idx + 1}.</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Authoritative Citations Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Authoritative IRS References:</span>
              {activeSheet.irsRefs.map((ref, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-mono text-[11px] font-bold border border-slate-200"
                >
                  {ref}
                </span>
              ))}
            </div>
            <span className="text-[10px] text-slate-400">
              {firmProfile.name} • Strictly Internal Practice Aid
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
