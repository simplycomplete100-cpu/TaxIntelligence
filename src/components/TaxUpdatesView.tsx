import React from 'react';
import {
  Sparkles,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { TaxYear } from '../types';
import { TAX_YEAR_RATES } from '../data/taxDatabase';

interface TaxUpdatesViewProps {
  currentTaxYear: TaxYear;
  onAskAgent: (query: string) => void;
}

export const TaxUpdatesView: React.FC<TaxUpdatesViewProps> = ({
  currentTaxYear,
  onAskAgent,
}) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Tax Law Intelligence Bulletin
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-300">IRS Annual Revenue Procedures & Adjustments</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Updates & What&apos;s New (Tax Year 2026 / 2025)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Essential changes in standard deductions, tax brackets, mileage rates, credit phaseouts, and TCJA sunset monitoring for tax practitioners.
          </p>
        </div>

        <button
          onClick={() =>
            onAskAgent(
              'Summarize all major tax changes and inflation adjustments affecting Tax Year 2026 vs 2025.'
            )
          }
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask Agent to Compare Years</span>
        </button>
      </div>

      {/* Cross-Year Comparison Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Official Inflation Adjustments Comparison Matrix
          </h2>
          <span className="text-xs text-slate-500">IRS Rev. Proc. Parameters</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <th className="p-3 font-bold">Tax Provision / Metric</th>
                <th className="p-3 font-bold text-emerald-800">Tax Year 2026 (Active/Projected)</th>
                <th className="p-3 font-bold text-slate-800">Tax Year 2025</th>
                <th className="p-3 font-bold text-slate-600">Tax Year 2024</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-bold text-slate-900">Standard Deduction: Single</td>
                <td className="p-3 text-emerald-800 font-bold">{TAX_YEAR_RATES['2026'].standardDeduction.single}</td>
                <td className="p-3">{TAX_YEAR_RATES['2025'].standardDeduction.single}</td>
                <td className="p-3 text-slate-500">{TAX_YEAR_RATES['2024'].standardDeduction.single}</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-bold text-slate-900">Standard Deduction: Head of Household</td>
                <td className="p-3 text-emerald-800 font-bold">{TAX_YEAR_RATES['2026'].standardDeduction.hoh}</td>
                <td className="p-3">{TAX_YEAR_RATES['2025'].standardDeduction.hoh}</td>
                <td className="p-3 text-slate-500">{TAX_YEAR_RATES['2024'].standardDeduction.hoh}</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-bold text-slate-900">Standard Deduction: Married Filing Jointly</td>
                <td className="p-3 text-emerald-800 font-bold">{TAX_YEAR_RATES['2026'].standardDeduction.mfj}</td>
                <td className="p-3">{TAX_YEAR_RATES['2025'].standardDeduction.mfj}</td>
                <td className="p-3 text-slate-500">{TAX_YEAR_RATES['2024'].standardDeduction.mfj}</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-bold text-slate-900">Business Standard Mileage Rate</td>
                <td className="p-3 text-emerald-800 font-bold">{TAX_YEAR_RATES['2026'].businessMileageRate}</td>
                <td className="p-3">{TAX_YEAR_RATES['2025'].businessMileageRate}</td>
                <td className="p-3 text-slate-500">{TAX_YEAR_RATES['2024'].businessMileageRate}</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-bold text-slate-900">EITC Max Credit (3+ Children)</td>
                <td className="p-3 text-emerald-800 font-bold">{TAX_YEAR_RATES['2026'].eitcMax.threeOrMore}</td>
                <td className="p-3">{TAX_YEAR_RATES['2025'].eitcMax.threeOrMore}</td>
                <td className="p-3 text-slate-500">{TAX_YEAR_RATES['2024'].eitcMax.threeOrMore}</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-bold text-slate-900">EITC Investment Income Limit</td>
                <td className="p-3 text-emerald-800 font-bold">{TAX_YEAR_RATES['2026'].eitcInvestmentLimit}</td>
                <td className="p-3">{TAX_YEAR_RATES['2025'].eitcInvestmentLimit}</td>
                <td className="p-3 text-slate-500">{TAX_YEAR_RATES['2024'].eitcInvestmentLimit}</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-bold text-slate-900">Section 179 Expense Limit</td>
                <td className="p-3 text-emerald-800 font-bold">{TAX_YEAR_RATES['2026'].section179Max}</td>
                <td className="p-3">{TAX_YEAR_RATES['2025'].section179Max}</td>
                <td className="p-3 text-slate-500">{TAX_YEAR_RATES['2024'].section179Max}</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-bold text-slate-900">Social Security Wage Base</td>
                <td className="p-3 text-emerald-800 font-bold">{TAX_YEAR_RATES['2026'].socialSecurityWageBase}</td>
                <td className="p-3">{TAX_YEAR_RATES['2025'].socialSecurityWageBase}</td>
                <td className="p-3 text-slate-500">{TAX_YEAR_RATES['2024'].socialSecurityWageBase}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Critical Legislative & Audit Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* TCJA Sunset Alert */}
        <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Tax Cuts and Jobs Act (TCJA) Sunset Monitoring</span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            Many individual provisions enacted under TCJA (including individual rate brackets, doubled standard deduction, and elimination of personal exemptions) are statutorily scheduled to sunset unless extended by federal legislation. Monitor platform updates closely.
          </p>
        </div>

        {/* 1099-K Phase-in Alert */}
        <div className="p-5 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-blue-900">
            <ShieldAlert className="w-4 h-4 text-blue-600" />
            <span>Form 1099-K Third-Party Reporting Thresholds</span>
          </div>
          <p className="text-xs text-blue-800 leading-relaxed">
            The IRS phased transition for payment settlement entities (Venmo, PayPal, Cash App, Square, StubHub) requires careful gross receipts reconciliation. Preparers must report all business revenues regardless of whether a 1099-K was generated.
          </p>
        </div>
      </div>
    </div>
  );
};
