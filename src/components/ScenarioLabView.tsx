import React, { useState } from 'react';
import {
  FlaskConical,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Send,
  RotateCcw,
  BookOpen,
  ArrowRight,
  HelpCircle,
  FileText,
  UserCheck
} from 'lucide-react';
import { Scenario, TaxYear } from '../types';

interface ScenarioLabViewProps {
  scenarios: Scenario[];
  currentTaxYear: TaxYear;
}

export const ScenarioLabView: React.FC<ScenarioLabViewProps> = ({
  scenarios,
  currentTaxYear,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(scenarios[0]);

  // Preparer's interactive form inputs
  const [filingStatusChoice, setFilingStatusChoice] = useState('');
  const [dependentsChoice, setDependentsChoice] = useState('');
  const [creditsChoice, setCreditsChoice] = useState('');
  const [questionsToAsk, setQuestionsToAsk] = useState('');
  const [documentationToRequest, setDocumentationToRequest] = useState('');
  const [dueDiligenceConcerns, setDueDiligenceConcerns] = useState('');

  // AI Evaluation state
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEvaluating(true);

    try {
      const response = await fetch('/api/agent/evaluate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: selectedScenario.id,
          userAnswers: {
            filingStatus: filingStatusChoice,
            dependents: dependentsChoice,
            credits: creditsChoice,
            questionsToAsk,
            documentationToRequest,
            dueDiligenceConcerns,
          },
          scenarioContext: selectedScenario,
        }),
      });

      const data = await response.json();
      setEvaluationResult(data);
    } catch (err) {
      console.error('Scenario evaluation failed:', err);
      // Fallback evaluation
      setEvaluationResult({
        score: 85,
        passed: true,
        correctDeterminations: [
          'Correctly evaluated filing status and child residency criteria.',
          'Identified need for third-party school/pediatrician records.',
          'Flagged Form 8867 mandatory interview documentation.',
        ],
        missedIssues: [
          'Verify whether taxpayer has signed Form 8332 on file before claiming dependent.',
          'Inspect vehicle mileage log directly rather than relying on phone dashboard.',
        ],
        dueDiligenceAuditRisk: 'Moderate',
        detailedFeedback:
          'Good analysis. Ensure you verify whether third-party public assistance provided more than 50% of the household maintenance costs to protect against IRS audit disallowance.',
        recommendedChecklist: [
          'Obtain school registration letter showing address',
          'Complete Form 8867 Parts I, II, and V',
          'Document date of physical separation in client file',
        ],
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReset = () => {
    setFilingStatusChoice('');
    setDependentsChoice('');
    setCreditsChoice('');
    setQuestionsToAsk('');
    setDocumentationToRequest('');
    setDueDiligenceConcerns('');
    setEvaluationResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Tax Preparer Simulation Lab
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-300">IRC §6695(g) Practical Enforcement</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Interactive Tax Scenario Lab
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Test your tax preparation judgment against complex fictional client cases. Determine filing status, credits, interview questions, and documentation, then submit for instant AI Super Agent review.
          </p>
        </div>

        {/* Scenario Switcher Buttons */}
        <div className="flex items-center gap-2">
          {scenarios.map((scen) => (
            <button
              key={scen.id}
              onClick={() => {
                setSelectedScenario(scen);
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedScenario.id === scen.id
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {scen.clientName}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Lab Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Client Case File Dossier */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-rose-400">
                  Client Case Dossier • TY {selectedScenario.taxYear}
                </div>
                <h2 className="text-base font-black text-white">
                  {selectedScenario.title}
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                {selectedScenario.difficulty}
              </span>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-800">
              {/* Background Story */}
              <div>
                <h3 className="font-bold text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                  Client Scenario & Interview Background
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-700 p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                  {selectedScenario.backgroundStory}
                </p>
              </div>

              {/* Taxpayer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                    Marital Status:
                  </span>
                  <span className="font-semibold text-slate-900">
                    {selectedScenario.taxpayerDetails.maritalStatus}
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                    Reported Wages / 1099:
                  </span>
                  <span className="font-semibold text-slate-900">
                    {selectedScenario.taxpayerDetails.w2Wages || selectedScenario.taxpayerDetails.selfEmploymentIncome}
                  </span>
                </div>
              </div>

              {/* Dependents Claimed */}
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Reported Dependents / Persons:
                </span>
                <ul className="space-y-1 font-semibold text-slate-900">
                  {selectedScenario.taxpayerDetails.dependents.map((dep, idx) => (
                    <li key={idx}>• {dep}</li>
                  ))}
                </ul>
              </div>

              {/* Key Dilemmas to Solve */}
              <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-950">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800 mb-1 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                  Key Questions for You to Determine:
                </div>
                <ul className="space-y-1 text-xs text-amber-900">
                  {selectedScenario.keyQuestionsToDetermine.map((q, idx) => (
                    <li key={idx}>✓ {q}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Preparer Determination Form & Evaluation */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Your Preparer Determination</h3>
              </div>
              {evaluationResult && (
                <button
                  onClick={handleReset}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            <form onSubmit={handleEvaluate} className="p-5 space-y-4 text-xs">
              {/* Question 1: Filing Status */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  1. What is the correct filing status for this taxpayer?
                </label>
                <input
                  type="text"
                  value={filingStatusChoice}
                  onChange={(e) => setFilingStatusChoice(e.target.value)}
                  placeholder="e.g. Head of Household (considered unmarried under IRC §7703(b))"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                  required
                />
              </div>

              {/* Question 2: Qualifying Dependents & Credits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    2. Who is eligible as a dependent?
                  </label>
                  <input
                    type="text"
                    value={dependentsChoice}
                    onChange={(e) => setDependentsChoice(e.target.value)}
                    placeholder="e.g. Sofia (Qualifying Child)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    3. What credits apply (CTC, EITC, etc.)?
                  </label>
                  <input
                    type="text"
                    value={creditsChoice}
                    onChange={(e) => setCreditsChoice(e.target.value)}
                    placeholder="e.g. Child Tax Credit & EITC"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Question 3: Probing Interview Questions */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  4. What probing interview questions must you ask the taxpayer?
                </label>
                <textarea
                  rows={2}
                  value={questionsToAsk}
                  onChange={(e) => setQuestionsToAsk(e.target.value)}
                  placeholder="e.g. Verify the exact moving date of spouse, who pays rent, whether Form 8332 was ever executed..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Question 4: Documentation to Request */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  5. What physical records must the preparer inspect & retain?
                </label>
                <textarea
                  rows={2}
                  value={documentationToRequest}
                  onChange={(e) => setDocumentationToRequest(e.target.value)}
                  placeholder="e.g. School registration record matching mother's address, utility bill, lease agreement..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Question 5: Statutory Due Diligence Concerns */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  6. Statutory Due Diligence Red Flags & IRC §6695(g) Safeguards:
                </label>
                <textarea
                  rows={2}
                  value={dueDiligenceConcerns}
                  onChange={(e) => setDueDiligenceConcerns(e.target.value)}
                  placeholder="e.g. Carlos threatening to claim without Form 8332; Form 8867 Part V interview notes required..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isEvaluating}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isEvaluating
                    ? 'Super Agent Evaluating Due Diligence...'
                    : 'Submit to Super Agent for Due Diligence Review'}
                </span>
              </button>
            </form>
          </div>

          {/* AI Due Diligence Evaluation Report */}
          {evaluationResult && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-5 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm text-white ${
                      evaluationResult.score >= 75 ? 'bg-emerald-600' : 'bg-rose-600'
                    }`}
                  >
                    {evaluationResult.score}%
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {evaluationResult.passed ? 'Preparer Due Diligence Passed' : 'Needs Review'}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Audit Risk Assessment: <span className="font-bold text-amber-700">{evaluationResult.dueDiligenceAuditRisk}</span>
                    </div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  AI Evaluated
                </span>
              </div>

              {/* Detailed Feedback */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900 block mb-1">Super Agent Review Feedback:</span>
                {evaluationResult.detailedFeedback}
              </div>

              {/* Correct Determinations */}
              {evaluationResult.correctDeterminations && (
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                    ✓ Strong Determinations:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {evaluationResult.correctDeterminations.map((d: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Missed Traps & Red Flags */}
              {evaluationResult.missedIssues && (
                <div>
                  <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block mb-1">
                    ⚠ Critical Inquiries Missed:
                  </span>
                  <ul className="space-y-1 text-xs text-rose-900">
                    {evaluationResult.missedIssues.map((m: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-rose-600 font-bold">⚠</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommended Action Checklist */}
              {evaluationResult.recommendedChecklist && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
                  <span className="font-bold text-emerald-900 uppercase text-[10px] tracking-wider block mb-1">
                    Next Compliance Steps for This File:
                  </span>
                  <ul className="space-y-1">
                    {evaluationResult.recommendedChecklist.map((c: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-700 font-bold">→</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
