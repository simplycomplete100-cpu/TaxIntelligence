import React, { useState, useEffect } from 'react';
import {
  FilePlus,
  Sparkles,
  Printer,
  Bookmark,
  Edit3,
  Check,
  FileSpreadsheet,
  CheckSquare,
  FileText,
  FileDown,
  Copy,
  Layers,
  Users,
  ShieldAlert,
  Clock,
  RotateCcw,
  Eye,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import {
  ResourceType,
  ResourceAudience,
  TaxYear,
  GeneratedResource,
  FirmProfile
} from '../types';
import { exportResourceToPdf } from '../utils/pdfExport';
import { DocumentRenderer } from './DocumentRenderer';

interface ResourceGeneratorViewProps {
  currentTaxYear: TaxYear;
  firmProfile: FirmProfile;
  onSaveResource: (resource: Omit<GeneratedResource, 'id'>) => void;
  initialType?: ResourceType;
  initialTopic?: string;
  initialSourceContent?: string;
}

// Function to generate clean, hashtag-free professional tax documents immediately
function synthesizeProfessionalTaxDocument(params: {
  type: ResourceType;
  topic: string;
  taxYear: TaxYear;
  audience: ResourceAudience;
  firmName: string;
  sourceContent?: string;
}): string {
  const { type, topic, taxYear, audience, firmName, sourceContent } = params;
  const cleanTopic = topic.replace(/^#+\s*/, '').trim();

  // If sourceContent already provided rich context from Super Agent or IRS Library
  const baseContext = sourceContent ? sourceContent.replace(/^#+\s*/gm, '').trim() : '';

  if (type === 'cheat_sheet') {
    return `${cleanTopic.toUpperCase()} (TAX YEAR ${taxYear})
Prepared for: ${audience} | ${firmName}

CORE STATUTORY RULES & QUALIFICATION
${baseContext ? baseContext.slice(0, 500) : `Key verification standards and statutory provisions for ${cleanTopic} under Title 26 Internal Revenue Code.`}

QUALIFICATION MATRIX & TESTS
1. Primary Eligibility Test: Confirm taxpayer meets all statutory threshold tests as of December 31, ${taxYear}.
2. Substantiation Test: Taxpayer must possess verifiable third-party documentation before filing return.
3. Marital & Filing Status Check: Review potential disqualifications (e.g. separated spouses, joint return exclusions).
4. Threshold & Limit Application: Apply active Tax Year ${taxYear} phaseouts and standard rates.

COMMON RED FLAGS & AUDIT TRIGGERS
- Verbal assertions without matching utility, lease, or platform corroboration.
- Dependent claims spanning multiple households without signed IRS waivers.
- Rounded expense numbers or inconsistent gross receipts records.

PREPARER DUE DILIGENCE MANDATORY CHECKLIST (IRC §6695(g))
- [ ] Confirm client identity and verify valid SSN issued prior to return due date.
- [ ] Inspect and retain physical proof of primary residency (school, medical, or lease records).
- [ ] Complete Form 8867 interview notes and record client responses in tax software.
- [ ] Retain all corroborating workpapers in firm archive for at least 3 years.`;
  }

  if (type === 'client_handout') {
    return `IMPORTANT TAX INFORMATION: ${cleanTopic.toUpperCase()}
Prepared for our Valued Clients | ${firmName}

Dear Client,

When we prepare your ${taxYear} federal tax return, IRS regulations require our firm to verify all deductions, tax credits, and dependent claims before electronic filing. Taking a few moments to review this guide protects your refund and ensures full IRS compliance.

WHY THE IRS REQUIRES THESE DOCUMENTS
The IRS routinely performs correspondence audits on claims for ${cleanTopic}. If official corroborating records cannot be produced upon request, the IRS may disallow the tax benefit, assess substantial penalties, and delay your refund.

DOCUMENTS YOU MUST PROVIDE TO OUR OFFICE
- [ ] Valid government-issued photo ID for taxpayer and spouse.
- [ ] Original Social Security cards (or official SSA letters) for everyone on the return.
- [ ] Proof of physical address for the tax year (utility bill, lease, or mortgage statement).
- [ ] Third-party records corroborating dependent residency (school report card or medical statement).
- [ ] Complete income statements (W-2s, 1099-NEC, 1099-K, brokerage statements).

NEXT STEPS
Please gather these documents before your scheduled tax interview. Our team is dedicated to maximizing your legal tax savings while safeguarding your return against IRS audit inquiries.`;
  }

  if (type === 'preparer_checklist' || type === 'due_diligence_checklist') {
    return `PREPARER DUE DILIGENCE & AUDIT DEFENSE CHECKLIST: ${cleanTopic.toUpperCase()}
Tax Year: ${taxYear} | Preparer Compliance Workpaper | ${firmName}

STATUTORY MANDATE (IRC §6695(g) & CIRCULAR 230)
Preparers must exercise due diligence in determining eligibility for EITC, CTC, ACTC, ODC, AOTC, and Head of Household filing status. Penalties exceed $600 per failure.

INTERVIEW & ELIGIBILITY VERIFICATION
- [ ] Inquire into taxpayer marital status on December 31, ${taxYear}.
- [ ] Verify physical custody nights (>183 nights in primary residence).
- [ ] Confirm taxpayer did not receive disqualifying investment income.
- [ ] Check whether any other family member or relative is claiming the same person.

DOCUMENT RETENTION REQUIREMENTS
- [ ] Copy of driver license or state identification.
- [ ] Copy of Social Security cards for all claimed individuals.
- [ ] Lease agreement, deed, or utility bill in client's name.
- [ ] Form 8867 completed, reviewed, and signed by PTIN holder.

PREPARER CERTIFICATION
I certify that I have conducted a thorough inquiry, inspected corroborating records, and determined that the taxpayer meets the statutory eligibility criteria for ${cleanTopic}.`;
  }

  // Default clean one-pager / summary
  return `${cleanTopic.toUpperCase()} - OPERATIONAL GUIDE
Tax Year: ${taxYear} | Target Audience: ${audience} | ${firmName}

EXECUTIVE SUMMARY
${baseContext ? baseContext : `Authoritative guidance, qualification standards, and procedural verification for ${cleanTopic} for Tax Year ${taxYear}.`}

KEY STATUTORY REQUIREMENTS
1. Statutory Authority: Verify compliance with applicable Internal Revenue Code sections and Treasury Regulations.
2. Recordkeeping Standard: Taxpayers must keep contemporaneous records substantiating all amounts claimed.
3. Due Diligence Safeguard: Preparers must complete due diligence requirements under Circular 230 and IRC §6695.

PRACTICAL ACTION ITEMS
- [ ] Review prior year return for consistency and carried-over attributes.
- [ ] Check active rate and threshold limits for Tax Year ${taxYear}.
- [ ] Document client responses directly in tax software diagnostic notes.`;
}

export const ResourceGeneratorView: React.FC<ResourceGeneratorViewProps> = ({
  currentTaxYear,
  firmProfile,
  onSaveResource,
  initialType = 'cheat_sheet',
  initialTopic = 'Head of Household Qualification Matrix',
  initialSourceContent = '',
}) => {
  const [resourceType, setResourceType] = useState<ResourceType>(initialType);
  const [topic, setTopic] = useState(initialTopic);
  const [audience, setAudience] = useState<ResourceAudience>('New Tax Preparer');
  const [taxYear, setTaxYear] = useState<TaxYear>(currentTaxYear);
  const [detailLevel, setDetailLevel] = useState('Standard');
  const [tone, setTone] = useState('Professional & Authoritative');
  const [includeBranding, setIncludeBranding] = useState(true);
  const [sourceContent, setSourceContent] = useState(initialSourceContent);

  const [generatedContent, setGeneratedContent] = useState<string>(() => {
    return synthesizeProfessionalTaxDocument({
      type: initialType,
      topic: initialTopic,
      taxYear: currentTaxYear,
      audience: 'New Tax Preparer',
      firmName: firmProfile.name,
      sourceContent: initialSourceContent,
    });
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Sync props when user navigates with a specific topic or research item
  useEffect(() => {
    if (initialTopic && initialTopic !== topic) {
      setTopic(initialTopic);
    }
    if (initialType && initialType !== resourceType) {
      setResourceType(initialType);
    }
    if (initialSourceContent) {
      setSourceContent(initialSourceContent);
    }

    // Immediately synthesize and display document so user never sees empty state
    const newDoc = synthesizeProfessionalTaxDocument({
      type: initialType || resourceType,
      topic: initialTopic || topic,
      taxYear,
      audience,
      firmName: firmProfile.name,
      sourceContent: initialSourceContent || sourceContent,
    });
    setGeneratedContent(newDoc);
  }, [initialTopic, initialType, initialSourceContent]);

  const resourceTypes: { id: ResourceType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'cheat_sheet', label: 'Cheat Sheet', icon: FileSpreadsheet },
    { id: 'one_pager', label: 'One-Page Guide', icon: FilePlus },
    { id: 'client_handout', label: 'Client Handout', icon: Users },
    { id: 'preparer_checklist', label: 'Preparer Checklist', icon: CheckSquare },
    { id: 'due_diligence_checklist', label: 'Due Diligence Sheet', icon: ShieldAlert },
    { id: 'client_doc_checklist', label: 'Document Checklist', icon: FileText },
  ];

  const quickTemplates = [
    { title: 'Head of Household Qualification Matrix', type: 'cheat_sheet' as ResourceType, audience: 'New Tax Preparer' as ResourceAudience },
    { title: 'Schedule C Vehicle: Standard Mileage vs Actual', type: 'cheat_sheet' as ResourceType, audience: 'Experienced Tax Preparer' as ResourceAudience },
    { title: 'EITC Statutory Tie-Breaker Decision Tree', type: 'cheat_sheet' as ResourceType, audience: 'Experienced Tax Preparer' as ResourceAudience },
    { title: 'Why We Need Your Dependent Residency Documents', type: 'client_handout' as ResourceType, audience: 'Client' as ResourceAudience },
    { title: 'Form 8867 Preparer Due Diligence Compliance', type: 'due_diligence_checklist' as ResourceType, audience: 'ERO / Firm Owner' as ResourceAudience },
    { title: 'Form 8332 Noncustodial Child Tax Credit Release', type: 'cheat_sheet' as ResourceType, audience: 'New Tax Preparer' as ResourceAudience },
  ];

  const handleSelectTemplate = (tmpl: typeof quickTemplates[0]) => {
    setTopic(tmpl.title);
    setResourceType(tmpl.type);
    setAudience(tmpl.audience);
    const doc = synthesizeProfessionalTaxDocument({
      type: tmpl.type,
      topic: tmpl.title,
      taxYear,
      audience: tmpl.audience,
      firmName: firmProfile.name,
    });
    setGeneratedContent(doc);
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setIsSaved(false);

    try {
      const response = await fetch('/api/agent/generate-resource', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: resourceType,
          topic,
          taxYear,
          audience,
          detailLevel,
          tone,
          sourceContent,
          firmBranding: includeBranding ? firmProfile.name : 'Tax Practice Intelligence',
        }),
      });

      const data = await response.json();
      if (data && data.content) {
        // Strip any residual hashtags from backend response
        const cleanContent = data.content.replace(/^#+\s*/gm, '');
        setGeneratedContent(cleanContent);
      } else {
        throw new Error('No content returned');
      }
    } catch (err) {
      console.warn('API generator fallback to instant client-side synthesizer:', err);
      const fallback = synthesizeProfessionalTaxDocument({
        type: resourceType,
        topic,
        taxYear,
        audience,
        firmName: includeBranding ? firmProfile.name : 'Tax Practice Intelligence',
        sourceContent,
      });
      setGeneratedContent(fallback);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToVault = () => {
    if (!generatedContent.trim()) return;
    onSaveResource({
      title: `${topic} (${taxYear}) - ${resourceType.replace(/_/g, ' ')}`,
      type: resourceType,
      audience,
      taxYear,
      content: generatedContent,
      dateCreated: new Date().toISOString().split('T')[0],
      createdBy: 'Sarah Vance, CPA',
      tags: [resourceType, `TY${taxYear}`, audience],
      isFavorite: true,
      firmBranding: firmProfile.name,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExportPdf = () => {
    if (!generatedContent.trim()) return;
    setIsExportingPdf(true);
    try {
      exportResourceToPdf({
        title: topic,
        type: resourceType,
        audience,
        taxYear,
        content: generatedContent,
        firmName: includeBranding ? firmProfile.name : 'Tax Practice Intelligence',
        eroName: includeBranding ? firmProfile.eroName : '',
        disclaimer:
          audience === 'Client' || audience === 'General Public'
            ? firmProfile.clientDisclaimer
            : firmProfile.proDisclaimer,
      });
    } catch (e) {
      console.error('PDF export error:', e);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-9rem)]">
      {/* Left Column: Generator Controls & Templates */}
      <div className="w-full lg:w-96 shrink-0 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col shadow-xs no-print">
        <div className="p-4 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold">Document & Cheat Sheet Studio</h2>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Turn tax rules into clean, interactive cheat sheets & client handouts
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Quick-Starter Templates */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">
              Popular Pre-Configured Templates
            </label>
            <div className="space-y-1">
              {quickTemplates.slice(0, 4).map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectTemplate(tmpl)}
                  className="w-full text-left p-2 rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition cursor-pointer text-[11px] flex items-center justify-between"
                >
                  <span className="font-semibold text-slate-800 truncate">{tmpl.title}</span>
                  <span className="text-[10px] text-emerald-700 font-bold uppercase shrink-0 ml-1">Load</span>
                </button>
              ))}
            </div>
          </div>

          {/* Resource Type Selection */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">
              Document Format
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {resourceTypes.map((t) => {
                const Icon = t.icon;
                const isSelected = resourceType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setResourceType(t.id);
                      // Update document immediately
                      const newDoc = synthesizeProfessionalTaxDocument({
                        type: t.id,
                        topic,
                        taxYear,
                        audience,
                        firmName: firmProfile.name,
                        sourceContent,
                      });
                      setGeneratedContent(newDoc);
                    }}
                    className={`p-2 rounded-lg border text-left flex items-center gap-2 transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`} />
                    <span className="truncate text-[11px]">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tax Topic */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px] tracking-wider">
              Topic or Tax Subject
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Schedule C Vehicle Mileage vs Actual Expenses"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-900 text-xs"
            />
          </div>

          {/* Audience & Tax Year */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px] tracking-wider">
                Audience
              </label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value as ResourceAudience)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-medium text-slate-800"
              >
                <option value="New Tax Preparer">New Preparer</option>
                <option value="Experienced Tax Preparer">Experienced Pro</option>
                <option value="Client">Client</option>
                <option value="ERO / Firm Owner">ERO / Owner</option>
                <option value="General Public">General Public</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px] tracking-wider">
                Tax Year
              </label>
              <select
                value={taxYear}
                onChange={(e) => setTaxYear(e.target.value as TaxYear)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-bold text-slate-900"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>
          </div>

          {/* Base Research Context */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px] tracking-wider">
              Research Context / Source Notes
            </label>
            <textarea
              rows={3}
              value={sourceContent}
              onChange={(e) => setSourceContent(e.target.value)}
              placeholder="Paste custom notes, research facts, or specific client scenario..."
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-[11px]"
            />
          </div>
        </div>

        {/* Generate / Refresh Button */}
        <div className="p-3 border-t border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Building Document...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate / Update Document</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Column: Live Document Preview (Rendered With NO Hashtags!) */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col shadow-xs">
        {/* Document Action Bar */}
        <div className="p-3.5 border-b border-slate-200 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2 no-print">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-emerald-400 uppercase tracking-wide">
              {resourceType.replace(/_/g, ' ')}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-white font-semibold">TY {taxYear}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">{audience}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-700 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Visual View' : 'Edit Text'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-700 cursor-pointer"
              title="Copy to clipboard"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-700 cursor-pointer"
              title="Print view"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition"
              title="Download structured PDF"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{isExportingPdf ? 'Exporting...' : 'Export PDF'}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveToVault}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-700 cursor-pointer"
            >
              {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span>{isSaved ? 'Saved!' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Live Document Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100/60 flex justify-center">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-xs border border-slate-200 p-6 sm:p-10 min-h-[550px] text-slate-900 printable-document">
            {/* Firm Header */}
            {includeBranding && (
              <div className="pb-4 mb-6 border-b-2 border-slate-900 flex items-center justify-between">
                <div>
                  <div className="font-black text-base sm:text-lg text-slate-950 tracking-tight">
                    {firmProfile.name.toUpperCase()}
                  </div>
                  <div className="text-[11px] text-slate-500">{firmProfile.eroName}</div>
                </div>
                <div className="text-right text-xs">
                  <div className="font-extrabold text-emerald-800">TAX YEAR {taxYear}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Compliance Ready</div>
                </div>
              </div>
            )}

            {/* Content view / edit */}
            {isEditing ? (
              <div className="space-y-3">
                <div className="text-xs text-slate-500 font-medium">
                  Direct text editor. Any sections or checklists you type will be cleanly formatted without markdown hashtags when you switch back to visual view.
                </div>
                <textarea
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  className="w-full h-full min-h-[450px] p-4 border border-slate-300 rounded-lg font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                />
              </div>
            ) : (
              <DocumentRenderer
                content={generatedContent}
                title={topic}
                type={resourceType}
                taxYear={taxYear}
                audience={audience}
                firmName={firmProfile.name}
              />
            )}

            {/* Document Footer */}
            <div className="mt-8 pt-4 border-t border-slate-200 text-[10px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span>{firmProfile.clientDisclaimer}</span>
              <span>Document Generated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
