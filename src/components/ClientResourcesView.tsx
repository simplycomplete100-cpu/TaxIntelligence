import React, { useState } from 'react';
import {
  Users,
  Printer,
  Copy,
  Check,
  Sparkles,
  Download,
  FileText,
  Mail,
  Building2,
  Calendar,
  CheckSquare
} from 'lucide-react';
import { TaxYear, FirmProfile, GeneratedResource } from '../types';
import { DocumentRenderer } from './DocumentRenderer';

interface ClientResourcesViewProps {
  currentTaxYear: TaxYear;
  firmProfile: FirmProfile;
  savedResources: GeneratedResource[];
  onOpenResourceGenerator: (type?: string, topic?: string) => void;
}

export const ClientResourcesView: React.FC<ClientResourcesViewProps> = ({
  currentTaxYear,
  firmProfile,
  savedResources,
  onOpenResourceGenerator,
}) => {
  const [selectedId, setSelectedId] = useState('doc-why-needed');
  const [copied, setCopied] = useState(false);

  const clientHandouts = [
    {
      id: 'doc-why-needed',
      title: 'Why We Need Your Documents (Client Explanation)',
      topic: 'Document Substantiation',
      readTime: '2 min read',
      summary: 'Reassuring client explanation detailing why tax law requires physical IDs, birth certificates, and school records to prevent IRS refund freezes.',
      content: `WHY WE ASK FOR YOUR DOCUMENTS
Dear Valued Client,

When we prepare your federal tax return, federal regulations and IRS due diligence rules require us to review specific documents before submitting your return. 

Our goal is simple: To protect your refund, maximize your legal credits, and prevent IRS audit letters or delay in your money.

WHAT THE IRS REQUIRES US TO VERIFY
1. Your Identity and Your Dependents' Identities:
- [ ] Original Social Security cards (or SSA verification letters) for everyone on the return.
- [ ] Government-issued photo IDs (Driver’s License or State ID) for taxpayer and spouse.
- Why: The IRS automatically rejects electronic tax returns if a name or SSN is off by even one letter.

2. Proof That Your Children Lived With You:
- [ ] The IRS requires proof that each claimed child lived in your home for more than 6 months (183 nights).
- Acceptable documents: School report card, official school registration letter, doctor/pediatrician record, or daycare statement showing your home address.

3. Proof of Household Expenses (For Head of Household):
- [ ] If filing as Head of Household, we must verify you paid more than half the cost of running the home.
- Acceptable documents: Electric/gas/water utility bill or lease agreement in your name.

WE ARE ON YOUR TEAM
We know gathering paperwork takes time. By bringing complete records, you ensure your tax return is 100% accurate, fully defended, and processed without IRS delays.

Thank you for trusting our firm with your tax preparation!`
    },
    {
      id: 'doc-hoh-rules',
      title: 'Head of Household: Plain Language Client Guide',
      topic: 'Filing Status',
      readTime: '3 min read',
      summary: 'Explains who qualifies as Head of Household, why living with a separated spouse disqualifies you, and how the 50% upkeep rule works.',
      content: `UNDERSTANDING HEAD OF HOUSEHOLD FILING STATUS
Head of Household gives you a much higher standard deduction and lower tax rates than Single status. However, the IRS checks this status more closely than almost any other.

DO YOU QUALIFY?
To file as Head of Household, you must satisfy ALL THREE of these conditions:

1. You Were Unmarried on December 31:
- You were single, divorced, or legally separated under a court decree.
- If you were still legally married: You can only qualify if your spouse did not live in your home at ANY time during the last 6 months of the year (July 1 to December 31).

2. You Paid More Than Half the Household Costs:
- You paid more than 50% of the rent/mortgage, utilities (gas, electric, water), home repairs, and food eaten at home.
- Note: Food eaten at restaurants, clothing, and vacations do not count as household upkeep.

3. Your Dependent Lived With You:
- Your qualifying child or relative lived in your home for more than half the year (more than 183 nights).
- Important: A partner or roommate does NOT qualify you for Head of Household, even if they live with you all year.

WHAT YOU SHOULD BRING TO YOUR APPOINTMENT
- [ ] One utility bill in your name.
- [ ] Your lease agreement or mortgage statement.
- [ ] School or medical record showing your child's address matches yours.`
    },
    {
      id: 'doc-schedule-c-records',
      title: 'Self-Employed & 1099 Workers: What Receipts to Keep',
      topic: 'Schedule C / Small Business',
      readTime: '3 min read',
      summary: 'Clean, practical checklist for gig workers, freelancers, and small business owners on mileage logs, bank statements, and allowable expenses.',
      content: `SELF-EMPLOYMENT & GIG WORKER TAX GUIDE
If you drive rideshare, deliver food, freelance, or run a small business, you are self-employed. You report your income and expenses on Schedule C.

1. YOU MUST REPORT ALL INCOME
- The IRS receives copies of Form 1099-NEC and Form 1099-K directly from apps (Uber, Lyft, DoorDash, Square, Stripe, PayPal).
- You must also report cash payments, tips, and checks. Never estimate your gross receipts.

2. VEHICLE MILEAGE RULES (VERY IMPORTANT)
- The IRS strictly disallows estimated mileage.
- You must keep a mileage log (written book or app like MileIQ / Everlance) that shows:
- [ ] Date of each trip
- [ ] Starting and ending locations
- [ ] Business purpose (e.g. "client delivery", "rideshare driving")
- [ ] Number of miles
- Remember: Driving from your home to a regular workplace is commuting and is NOT tax deductible.

3. ALLOWABLE BUSINESS DEDUCTIONS
Keep receipts for expenses that are ordinary and necessary for your business:
- [ ] Equipment, tools, and supplies
- [ ] Software subscriptions and website hosting
- [ ] Cell phone (the business percentage only)
- [ ] Professional licenses and insurance
- [ ] Merchant transaction fees (Square, Stripe fees)

4. SEPARATE YOUR MONEY
The number one way to avoid tax trouble is opening a dedicated business bank account. Never mix personal groceries and household bills with business expenses!`
    },
    {
      id: 'doc-irs-notices',
      title: 'Received an IRS Notice? Don’t Panic: What to Do Next',
      topic: 'IRS Notices & Audits',
      readTime: '2 min read',
      summary: 'Actionable instructions for clients who receive IRS CP2000, CP05, or LTR letters.',
      content: `WHAT TO DO IF YOU RECEIVE AN IRS LETTER
Getting a letter from the IRS can be stressful, but most letters can be resolved quickly if handled immediately.

1. DO NOT IGNORE THE LETTER
- Every IRS letter includes a deadline (usually 30 days). Ignoring the letter can result in automatic penalties or forfeiture of your appeal rights.

2. SEND THE LETTER TO OUR OFFICE IMMEDIATELY
- Do not pay the amount requested or call the IRS until our tax office reviews the notice.
- Often, IRS computer notices (like CP2000) are simply asking for clarification or missing documentation, and the amount they claim you owe is frequently incorrect!

3. WHAT WE WILL DO FOR YOU
- Step 1: We will review the tax year and notice number in the top right corner.
- Step 2: We will pull your original tax return and compare it with the IRS records.
- Step 3: We will prepare an official response with substantiating documents to resolve the inquiry.

We are here to represent and support you throughout the entire tax year!`
    }
  ];

  const activeHandout = clientHandouts.find((h) => h.id === selectedId) || clientHandouts[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${activeHandout.title}\n\n${activeHandout.content}\n\n${firmProfile.name} • ${firmProfile.clientDisclaimer}`
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
            <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center">
              <Users className="w-4 h-4 text-teal-700" />
            </div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Client Handout & Resource Center
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-50 text-teal-800 border border-teal-200">
              Plain English
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Pre-formatted, non-intimidating client handouts ready to print or email. Educate your clients on why documents are needed and avoid e-file rejections.
          </p>
        </div>

        <button
          onClick={() => onOpenResourceGenerator('client_handout', 'Custom Client Explanation')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generate Custom Handout</span>
        </button>
      </div>

      {/* Main 2-Column Handout Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Handout Selector */}
        <div className="space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Available Client Handouts
          </div>
          {clientHandouts.map((h) => {
            const isSelected = selectedId === h.id;
            return (
              <div
                key={h.id}
                onClick={() => setSelectedId(h.id)}
                className={`p-3.5 rounded-xl border transition cursor-pointer ${
                  isSelected
                    ? 'bg-teal-50/70 border-teal-500 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="font-bold text-teal-700 uppercase">{h.topic}</span>
                  <span className="text-slate-400">{h.readTime}</span>
                </div>
                <div className="text-xs font-bold text-slate-900 leading-snug">
                  {h.title}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                  {h.summary}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Printable Document View */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
          {/* Action Toolbar */}
          <div className="p-3.5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between no-print">
            <div className="text-xs">
              <span className="font-bold text-white">{activeHandout.title}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Handout</span>
              </button>
            </div>
          </div>

          {/* Printable Sheet View */}
          <div className="p-8 sm:p-12 text-slate-900 flex-1 overflow-y-auto printable-document">
            {/* Firm Brand Header */}
            <div className="pb-4 mb-6 border-b-2 border-slate-900 flex items-center justify-between">
              <div>
                <div className="font-black text-xl text-slate-950 tracking-tight">
                  {firmProfile.name.toUpperCase()}
                </div>
                <div className="text-xs text-slate-500">{firmProfile.eroName}</div>
              </div>
              <div className="text-right text-xs">
                <div className="font-bold text-teal-800">CLIENT ADVISORY BULLETIN</div>
                <div className="text-[10px] text-slate-400">Tax Year {currentTaxYear} Edition</div>
              </div>
            </div>

            {/* Clean Handout Content without Hashtags */}
            <DocumentRenderer
              content={activeHandout.content}
              title={activeHandout.title}
              type="Client Handout"
              taxYear={currentTaxYear}
              audience="Client"
              firmName={firmProfile.name}
            />

            {/* Client Disclaimer Footer */}
            <div className="mt-10 pt-4 border-t border-slate-200 text-[10px] text-slate-400 flex items-center justify-between">
              <span>{firmProfile.clientDisclaimer}</span>
              <span>Provided for Client Information</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
