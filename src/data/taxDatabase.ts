import {
  KnowledgeArticle,
  IRSSource,
  TaxFormInfo,
  TrainingCourse,
  Scenario,
  GeneratedResource,
  SavedResearch,
  User,
  FirmProfile,
} from '../types';

export const TAX_YEAR_RATES: Record<string, {
  standardDeduction: { single: string; mfj: string; hoh: string; mfs: string; age65Add: string };
  ctcMax: string;
  actcMaxRefundable: string;
  eitcMax: { zero: string; one: string; two: string; threeOrMore: string };
  eitcInvestmentLimit: string;
  businessMileageRate: string;
  section179Max: string;
  iraMax: string;
  socialSecurityWageBase: string;
  statusNotes: string;
}> = {
  '2026': {
    standardDeduction: { single: '$15,000', mfj: '$30,000', hoh: '$22,500', mfs: '$15,000', age65Add: '$1,600 / $2,000' },
    ctcMax: '$2,000 per qualifying child (under 17)',
    actcMaxRefundable: '$1,750 (indexed)',
    eitcMax: { zero: '$649', one: '$4,328', two: '$7,156', threeOrMore: '$8,046' },
    eitcInvestmentLimit: '$12,200',
    businessMileageRate: '71.0¢ / mile (projected)',
    section179Max: '$1,280,000',
    iraMax: '$7,000 ($8,000 age 50+)',
    socialSecurityWageBase: '$178,800',
    statusNotes: 'Projected rates following inflation adjustments; monitor legislative extensions on TCJA individual provisions.',
  },
  '2025': {
    standardDeduction: { single: '$15,000', mfj: '$30,000', hoh: '$22,500', mfs: '$15,000', age65Add: '$1,600 / $2,000' },
    ctcMax: '$2,000 ($1,700 refundable)',
    actcMaxRefundable: '$1,700',
    eitcMax: { zero: '$632', one: '$4,213', two: '$6,960', threeOrMore: '$7,830' },
    eitcInvestmentLimit: '$11,950',
    businessMileageRate: '70.0¢ / mile',
    section179Max: '$1,250,000',
    iraMax: '$7,000 ($8,000 age 50+)',
    socialSecurityWageBase: '$176,100',
    statusNotes: 'Active IRS filing parameters for tax year 2025 returns filed in 2026.',
  },
  '2024': {
    standardDeduction: { single: '$14,600', mfj: '$29,200', hoh: '$21,900', mfs: '$14,600', age65Add: '$1,550 / $1,950' },
    ctcMax: '$2,000 ($1,700 refundable)',
    actcMaxRefundable: '$1,700',
    eitcMax: { zero: '$632', one: '$4,213', two: '$6,960', threeOrMore: '$7,830' },
    eitcInvestmentLimit: '$11,600',
    businessMileageRate: '67.0¢ / mile',
    section179Max: '$1,220,000',
    iraMax: '$7,000 ($8,000 age 50+)',
    socialSecurityWageBase: '$168,600',
    statusNotes: 'Historical official IRS figures for 2024 tax filings.',
  },
  '2023': {
    standardDeduction: { single: '$13,850', mfj: '$27,700', hoh: '$20,800', mfs: '$13,850', age65Add: '$1,500 / $1,850' },
    ctcMax: '$2,000 ($1,600 refundable)',
    actcMaxRefundable: '$1,600',
    eitcMax: { zero: '$600', one: '$3,995', two: '$6,604', threeOrMore: '$7,430' },
    eitcInvestmentLimit: '$11,000',
    businessMileageRate: '65.5¢ / mile',
    section179Max: '$1,160,000',
    iraMax: '$6,500 ($7,500 age 50+)',
    socialSecurityWageBase: '$160,200',
    statusNotes: 'Historical official IRS figures for 2023 tax filings.',
  },
  '2022': {
    standardDeduction: { single: '$12,950', mfj: '$25,900', hoh: '$19,400', mfs: '$12,950', age65Add: '$1,400 / $1,750' },
    ctcMax: '$2,000 ($1,500 refundable)',
    actcMaxRefundable: '$1,500',
    eitcMax: { zero: '$560', one: '$3,733', two: '$6,164', threeOrMore: '$6,935' },
    eitcInvestmentLimit: '$10,300',
    businessMileageRate: '58.5¢ / 62.5¢ (mid-year change)',
    section179Max: '$1,080,000',
    iraMax: '$6,000 ($7,000 age 50+)',
    socialSecurityWageBase: '$147,000',
    statusNotes: 'Historical official IRS figures for 2022 tax filings.',
  },
  'prior': {
    standardDeduction: { single: 'Varies by year', mfj: 'Varies by year', hoh: 'Varies by year', mfs: 'Varies by year', age65Add: 'Varies' },
    ctcMax: 'Refer to archived IRS Pub 17',
    actcMaxRefundable: 'Subject to applicable year rules',
    eitcMax: { zero: 'Prior year caps', one: 'Prior year caps', two: 'Prior year caps', threeOrMore: 'Prior year caps' },
    eitcInvestmentLimit: 'Statutory limits apply',
    businessMileageRate: 'Refer to prior IRS rev procs',
    section179Max: 'Statutory limits apply',
    iraMax: 'Statutory limits apply',
    socialSecurityWageBase: 'Statutory limits apply',
    statusNotes: 'Archived prior year tax research mode. Consult historical publications before preparing amendments.',
  }
};

export const INITIAL_IRS_SOURCES: IRSSource[] = [
  {
    id: 'src-pub-501',
    title: 'IRS Publication 501: Dependents, Standard Deduction, and Filing Information',
    agency: 'Internal Revenue Service',
    pubOrForm: 'Pub 501',
    taxYear: '2025-2026',
    lastUpdated: '2025-12-15',
    url: 'https://www.irs.gov/publications/p501',
    guidanceType: 'Official IRS Guidance',
    summary: 'Comprehensive IRS guidance on determining filing status, qualifying child and relative dependency tests, and standard deduction rules.',
    keyTopics: ['Filing Status', 'Head of Household', 'Qualifying Child', 'Qualifying Relative', 'Standard Deduction'],
    fullGuidance: 'Publication 501 provides authoritative rules for determining filing status (Single, Married Filing Jointly, Married Filing Separately, Head of Household, Qualifying Surviving Spouse) and claiming dependents under IRC §151 and §152. Under IRC §152(c), a Qualifying Child must meet five tests: (1) Relationship (son, daughter, stepchild, foster child, sibling, stepsibling, or descendant); (2) Age (under 19, or under 24 if a full-time student for at least 5 months, or permanently and totally disabled); (3) Residency (lived with taxpayer for >6 months/183 nights); (4) Support (child did NOT provide more than half of their own support); (5) Joint Return (child did not file a joint return except solely to claim a refund). Gross income of a qualifying child does not matter for dependency purposes.',
    keyProvisions: ['IRC §2(b) Head of Household definition', 'IRC §63 Standard Deduction', 'IRC §152(c) Qualifying Child tests', 'IRC §152(d) Qualifying Relative tests', 'IRC §7703(b) Considered Unmarried rules'],
    preparerActionPoints: [
      'Verify child’s exact date of birth and full-time student status (Form 1098-T or official registrar transcript)',
      'Confirm client paid >50% of the household maintenance costs for Head of Household (lease/mortgage & utilities)',
      'If parents are divorced, verify who had physical custody for the greater number of nights (183+ nights)',
      'Document that student child did not pay >50% of their own support with student loans or summer job earnings'
    ],
    dueDiligenceCheck: 'Form 8867 Part I and Part V required. Preparer must retain address corroboration (school records or doctor statements) and utility verification for 3 years.'
  },
  {
    id: 'src-pub-596',
    title: 'IRS Publication 596: Earned Income Credit (EIC)',
    agency: 'Internal Revenue Service',
    pubOrForm: 'Pub 596',
    taxYear: '2025-2026',
    lastUpdated: '2025-11-20',
    url: 'https://www.irs.gov/publications/p596',
    guidanceType: 'Official IRS Guidance',
    summary: 'Detailed statutory requirements, phaseout limits, tiebreaker rules, and residency guidelines for claiming the EITC.',
    keyTopics: ['EITC', 'Earned Income', 'Tie-Breaker Rules', 'Investment Income Limit', 'Schedule EIC'],
    fullGuidance: 'Publication 596 governs the Earned Income Tax Credit under IRC §32. Eligible individuals must have earned income (W-2 wages or net Schedule C self-employment earnings) below statutory phaseout limits, investment income not exceeding $11,950 (2025) / $12,200 (2026), and a valid Social Security Number issued on or before the due date of the return. When a qualifying child is claimed by more than one taxpayer, statutory tie-breaker rules under IRC §152(c)(4) dictate: (1) Parents prevail over non-parents; (2) If both are parents, the parent with whom the child lived longest wins; (3) If equal time, highest AGI wins; (4) If non-parents, highest AGI wins. Noncustodial parents CANNOT claim EITC under Form 8332.',
    keyProvisions: ['IRC §32 Earned Income Credit', 'IRC §152(c)(4) Statutory Tie-Breaker Hierarchy', 'IRC §6695(g) Paid Preparer Due Diligence', 'Treasury Reg. §1.32-2'],
    preparerActionPoints: [
      'Confirm child resided in the US with taxpayer for more than half the tax year (military deployment counts as home)',
      'Inquire who else resided in the home (grandparents, aunts, other parent) and check potential tie-breaker claims',
      'Verify investment income (Schedule B interest, dividends, capital gains) does not exceed threshold',
      'Reconcile Schedule C business gross receipts and expenses to avoid artificial income inflation/deflation to maximize EITC'
    ],
    dueDiligenceCheck: 'Mandatory Form 8867 Part II completion. Retain school registration letters, health clinic records, or lease showing child shares client address.'
  },
  {
    id: 'src-pub-334',
    title: 'IRS Publication 334: Tax Guide for Small Business (For Individuals Who Use Schedule C)',
    agency: 'Internal Revenue Service',
    pubOrForm: 'Pub 334',
    taxYear: '2025-2026',
    lastUpdated: '2025-12-01',
    url: 'https://www.irs.gov/publications/p334',
    guidanceType: 'Official IRS Guidance',
    summary: 'Guide for sole proprietorships and single-member LLCs filing Schedule C, covering deductible business expenses, recordkeeping, and self-employment tax.',
    keyTopics: ['Schedule C', 'Self-Employment', 'Business Deductions', 'Recordkeeping', '1099-NEC', '1099-K'],
    fullGuidance: 'Publication 334 outlines Federal tax responsibilities for sole proprietors and statutory employees filing Schedule C. Business expenses must be both "ordinary" (common and accepted in industry) and "necessary" (helpful and appropriate for business) under IRC §162. Self-employment tax applies under IRC §1401 to net earnings of $400 or more. Strict substantiation is required under IRC §274 for vehicles, travel, and gifts. Capital purchases over the de minimis safe harbor ($2,500 per invoice) must be capitalized and depreciated under MACRS or expensed under IRC §179 / Bonus Depreciation.',
    keyProvisions: ['IRC §162 Ordinary and necessary trade/business expenses', 'IRC §199A Qualified Business Income Deduction', 'IRC §1401 Self-Employment Tax', 'Treasury Reg. §1.263(a)-1 De Minimis Safe Harbor'],
    preparerActionPoints: [
      'Reconcile all Forms 1099-NEC and 1099-K against taxpayer bank deposits and accounting records',
      'Examine vehicle expense methodology (standard mileage vs actual expenses; verify Year 1 election)',
      'Confirm business owner has contemporaneous accounting books (QuickBooks, spreadsheet, bank statements)',
      'Check if de minimis safe harbor election under Treas. Reg. 1.263(a)-1(f) should be attached to return'
    ],
    dueDiligenceCheck: 'Form 8867 Part IV required when EITC/CTC is claimed with Schedule C income. Inquire how client determined income and expenses; inspect supporting books.'
  },
  {
    id: 'src-pub-463',
    title: 'IRS Publication 463: Travel, Gift, and Car Expenses',
    agency: 'Internal Revenue Service',
    pubOrForm: 'Pub 463',
    taxYear: '2025-2026',
    lastUpdated: '2025-10-18',
    url: 'https://www.irs.gov/publications/p463',
    guidanceType: 'Official IRS Guidance',
    summary: 'Rules for deducting standard mileage vs actual vehicle expenses, business meals, lodging, and required contemporaneous logs under IRC §274(d).',
    keyTopics: ['Vehicle Expenses', 'Standard Mileage', 'Actual Expenses', 'Contemporaneous Log', 'Meals', 'Travel'],
    fullGuidance: 'Publication 463 governs business vehicle and travel deductions under IRC §162 and §274(d). For vehicles, taxpayers choose between the Standard Mileage Rate (70¢/mi for 2025, 71¢/mi projected for 2026) and Actual Expenses (gas, oil, insurance, repairs, depreciation). To use standard mileage on an owned car, it must be elected in the first year the car is available for business. Contemporaneous records must substantiate: (1) Amount of mileage; (2) Date of trip; (3) Business destination; (4) Business purpose. Commuting miles between primary home and regular workplace are NEVER deductible.',
    keyProvisions: ['IRC §274(d) Substantiation requirements', 'Rev. Proc. 2024-40 Standard Mileage Rules', 'Treasury Reg. §1.274-5T Contemporaneous Records'],
    preparerActionPoints: [
      'Ask client for written or mobile app mileage log (e.g. MileIQ, QuickBooks Self-Employed)',
      'Ensure total annual miles (business + commuting + personal) are documented on Form 4562 Part V / Schedule C Part IV',
      'Verify whether client owns or leases another personal vehicle to corroborate business percentage',
      'Inform client that round estimates (e.g., exactly 15,000 miles) trigger IRS correspondence flags'
    ],
    dueDiligenceCheck: 'Verify that taxpayer maintained written or electronic log. Disallow vehicle deduction if taxpayer refuses to provide documentation of business purpose.'
  },
  {
    id: 'src-pub-587',
    title: 'IRS Publication 587: Business Use of Your Home (Including Use by Daycare Providers)',
    agency: 'Internal Revenue Service',
    pubOrForm: 'Pub 587',
    taxYear: '2025-2026',
    lastUpdated: '2025-11-15',
    url: 'https://www.irs.gov/publications/p587',
    guidanceType: 'Official IRS Guidance',
    summary: 'Statutory rules for home office deductions under IRC §280A, comparing the simplified option ($5/sq ft) and actual expenses method via Form 8829.',
    keyTopics: ['Home Office', 'Form 8829', 'IRC §280A', 'Exclusive Use', 'Simplified Method', 'Daycare']
  },
  {
    id: 'src-pub-527',
    title: 'IRS Publication 527: Residential Rental Property (Including Rental of Vacation Homes)',
    agency: 'Internal Revenue Service',
    pubOrForm: 'Pub 527',
    taxYear: '2025-2026',
    lastUpdated: '2025-12-10',
    url: 'https://www.irs.gov/publications/p527',
    guidanceType: 'Official IRS Guidance',
    summary: 'Rules for rental real estate income and deductions on Schedule E, MACRS 27.5-year depreciation, repairs vs improvements, and vacation home personal use limits.',
    keyTopics: ['Rental Property', 'Schedule E', 'Depreciation', 'Passive Loss', 'Vacation Home', 'MACRS']
  },
  {
    id: 'src-pub-502',
    title: 'IRS Publication 502: Medical and Dental Expenses',
    agency: 'Internal Revenue Service',
    pubOrForm: 'Pub 502',
    taxYear: '2025-2026',
    lastUpdated: '2025-11-05',
    url: 'https://www.irs.gov/publications/p502',
    guidanceType: 'Official IRS Guidance',
    summary: 'Deductible and non-deductible medical and dental expenses on Schedule A subject to the 7.5% Adjusted Gross Income statutory haircut under IRC §213.',
    keyTopics: ['Medical Expenses', 'Schedule A', '7.5% AGI Limit', 'Itemized Deductions', 'HSA Reconciliation']
  },
  {
    id: 'src-pub-523',
    title: 'IRS Publication 523: Selling Your Home',
    agency: 'Internal Revenue Service',
    pubOrForm: 'Pub 523',
    taxYear: '2025-2026',
    lastUpdated: '2025-10-25',
    url: 'https://www.irs.gov/publications/p523',
    guidanceType: 'Official IRS Guidance',
    summary: 'Authoritative rules for the IRC §121 capital gain exclusion on primary residences ($250k single / $500k MFJ), 2-out-of-5-year eligibility test, and partial exclusions.',
    keyTopics: ['Sale of Home', 'IRC §121', 'Capital Gains', 'Cost Basis', 'Exclusion Limit']
  },
  {
    id: 'src-pub-590a',
    title: 'IRS Publication 590-A: Contributions to Individual Retirement Arrangements (IRAs)',
    agency: 'Internal Revenue Service',
    pubOrForm: 'Pub 590-A',
    taxYear: '2025-2026',
    lastUpdated: '2025-12-08',
    url: 'https://www.irs.gov/publications/p590a',
    guidanceType: 'Official IRS Guidance',
    summary: 'Rules and income phaseouts for Traditional and Roth IRA contributions, nondeductible contributions, Form 8606 tracking, and rollover guidelines.',
    keyTopics: ['Traditional IRA', 'Roth IRA', 'Contribution Limits', 'Backdoor Roth', 'Form 8606']
  },
  {
    id: 'src-pub-590b',
    title: 'IRS Publication 590-B: Distributions from Individual Retirement Arrangements (IRAs)',
    agency: 'Internal Revenue Service',
    pubOrForm: 'Pub 590-B',
    taxYear: '2025-2026',
    lastUpdated: '2025-12-08',
    url: 'https://www.irs.gov/publications/p590b',
    guidanceType: 'Official IRS Guidance',
    summary: 'Rules governing IRA distributions, early withdrawal 10% penalty exceptions under IRC §72(t), Form 5329, and Required Minimum Distributions (RMDs) under SECURE 2.0.',
    keyTopics: ['IRA Distributions', '10% Penalty', 'IRC §72(t)', 'Form 5329', 'RMDs', 'SECURE 2.0']
  },
  {
    id: 'src-pub-970',
    title: 'IRS Publication 970: Tax Benefits for Education',
    agency: 'Internal Revenue Service',
    pubOrForm: 'Pub 970',
    taxYear: '2025-2026',
    lastUpdated: '2025-12-05',
    url: 'https://www.irs.gov/publications/p970',
    guidanceType: 'Official IRS Guidance',
    summary: 'Authoritative rules for the American Opportunity Tax Credit (AOTC), Lifetime Learning Credit (LLC), student loan interest deduction, and Form 1098-T reconciliation.',
    keyTopics: ['Education Credits', 'Form 8863', 'AOTC', 'Lifetime Learning', 'Form 1098-T', 'Student Loans']
  },
  {
    id: 'src-pub-925',
    title: 'IRS Publication 925: Passive Activity and At-Risk Rules',
    agency: 'Internal Revenue Service',
    pubOrForm: 'Pub 925',
    taxYear: '2025-2026',
    lastUpdated: '2025-11-18',
    url: 'https://www.irs.gov/publications/p925',
    guidanceType: 'Official IRS Guidance',
    summary: 'Explains passive loss limits under IRC §469, the $25,000 active participation rental loss allowance and $100k-$150k phaseout, and Form 8582 calculations.',
    keyTopics: ['Passive Activity', 'IRC §469', 'Form 8582', '$25k Allowance', 'At-Risk Rules']
  },
  {
    id: 'src-form-8867',
    title: 'Form 8867 Instructions: Paid Preparer’s Due Diligence Checklist',
    agency: 'Internal Revenue Service',
    pubOrForm: 'Form 8867',
    taxYear: 'Current',
    lastUpdated: '2025-11-10',
    url: 'https://www.irs.gov/forms-pubs/about-form-8867',
    guidanceType: 'IRS Form/Instructions',
    summary: 'Mandatory due diligence inquiries, documentation verification, and record retention rules under IRC §6695(g) for EITC, CTC, AOTC, and HOH.',
    keyTopics: ['Due Diligence', 'Form 8867', 'Penalties §6695(g)', 'EITC Audit', 'HOH Verification', 'Circular 230']
  },
  {
    id: 'src-form-8332',
    title: 'Form 8332 Instructions: Release/Revocation of Release of Claim to Exemption for Child',
    agency: 'Internal Revenue Service',
    pubOrForm: 'Form 8332',
    taxYear: 'Current',
    lastUpdated: '2025-10-01',
    url: 'https://www.irs.gov/forms-pubs/about-form-8332',
    guidanceType: 'IRS Form/Instructions',
    summary: 'Authoritative requirements for custodial parents releasing Child Tax Credit and ODC to noncustodial parents under IRC §152(e). Explicitly explains that EITC and HOH do NOT transfer.',
    keyTopics: ['Form 8332', 'Noncustodial Parent', 'Child Tax Credit', 'IRC §152(e)', 'Custody Dispute']
  },
  {
    id: 'src-form-8829',
    title: 'Instructions for Form 8829: Expenses for Business Use of Your Home',
    agency: 'Internal Revenue Service',
    pubOrForm: 'Form 8829',
    taxYear: 'Current',
    lastUpdated: '2025-11-20',
    url: 'https://www.irs.gov/forms-pubs/about-form-8829',
    guidanceType: 'IRS Form/Instructions',
    summary: 'Instructions for calculating actual home office deductions, allocable indirect costs, and depreciation under IRC §280A.',
    keyTopics: ['Form 8829', 'Home Office', 'Business Square Footage', 'Depreciation Recapture', 'Schedule C']
  },
  {
    id: 'src-form-8606',
    title: 'Instructions for Form 8606: Nondeductible IRAs',
    agency: 'Internal Revenue Service',
    pubOrForm: 'Form 8606',
    taxYear: 'Current',
    lastUpdated: '2025-11-30',
    url: 'https://www.irs.gov/forms-pubs/about-form-8606',
    guidanceType: 'IRS Form/Instructions',
    summary: 'Instructions for tracking basis in nondeductible Traditional IRAs, calculating taxable amounts of Roth conversions, and applying the pro-rata rule under IRC §408(d).',
    keyTopics: ['Form 8606', 'Backdoor Roth', 'IRA Basis', 'Pro-Rata Rule', 'Roth Conversion']
  },
  {
    id: 'src-irc-sec-152',
    title: 'Internal Revenue Code § 152 - Dependent Defined (Qualifying Child & Qualifying Relative)',
    agency: 'United States Congress / IRC',
    pubOrForm: '26 U.S. Code § 152',
    taxYear: 'Permanent Statutory Law',
    lastUpdated: 'Current Code',
    url: 'https://www.law.cornell.edu/uscode/text/26/152',
    guidanceType: 'Statutory Authority',
    summary: 'Statutory definitions of Qualifying Child (relationship, age, residency, support) and Qualifying Relative, support calculations, and custodial parent special rules.',
    keyTopics: ['IRC §152', 'Qualifying Child', 'Qualifying Relative', 'Student Under 24', 'Support Test', 'Tie-Breaker']
  },
  {
    id: 'src-irc-sec-2',
    title: 'Internal Revenue Code § 2 - Definitions and Special Rules (Filing Status & Head of Household)',
    agency: 'United States Congress / IRC',
    pubOrForm: '26 U.S. Code § 2',
    taxYear: 'Permanent Statutory Law',
    lastUpdated: 'Current Code',
    url: 'https://www.law.cornell.edu/uscode/text/26/2',
    guidanceType: 'Statutory Authority',
    summary: 'Statutory definitions of Surviving Spouse and Head of Household, including the cost of maintaining a household criteria and dependent co-residency.',
    keyTopics: ['Filing Status', 'IRC §2', 'Head of Household', 'Surviving Spouse', 'Considered Unmarried']
  },
  {
    id: 'src-irc-sec-162',
    title: 'Internal Revenue Code § 162 - Trade or Business Expenses',
    agency: 'United States Congress / IRC',
    pubOrForm: '26 U.S. Code § 162',
    taxYear: 'Permanent Statutory Law',
    lastUpdated: 'Current Code',
    url: 'https://www.law.cornell.edu/uscode/text/26/162',
    guidanceType: 'Statutory Authority',
    summary: 'Foundational statutory authorization for deducting all ordinary and necessary expenses incurred in carrying on any trade or business.',
    keyTopics: ['IRC §162', 'Ordinary and Necessary', 'Business Expenses', 'Schedule C', 'Deductions']
  },
  {
    id: 'src-irc-sec-213',
    title: 'Internal Revenue Code § 213 - Medical, Dental, etc., Expenses',
    agency: 'United States Congress / IRC',
    pubOrForm: '26 U.S. Code § 213',
    taxYear: 'Permanent Statutory Law',
    lastUpdated: 'Current Code',
    url: 'https://www.law.cornell.edu/uscode/text/26/213',
    guidanceType: 'Statutory Authority',
    summary: 'Statute governing itemized medical deductions, establishing that only unreimbursed medical care expenses exceeding 7.5% of AGI are allowable.',
    keyTopics: ['IRC §213', 'Medical Expenses', '7.5% AGI Floor', 'Schedule A', 'Prescription Drugs']
  },
  {
    id: 'src-irc-sec-469',
    title: 'Internal Revenue Code § 469 - Passive Activity Losses and Credits Limited',
    agency: 'United States Congress / IRC',
    pubOrForm: '26 U.S. Code § 469',
    taxYear: 'Permanent Statutory Law',
    lastUpdated: 'Current Code',
    url: 'https://www.law.cornell.edu/uscode/text/26/469',
    guidanceType: 'Statutory Authority',
    summary: 'Statute restricting passive losses, defining rental activities as passive, establishing the $25k active participation exception, and real estate professional criteria.',
    keyTopics: ['IRC §469', 'Passive Loss', 'Rental Real Estate', 'Active Participation', 'Real Estate Professional']
  },
  {
    id: 'src-irc-sec-6695g',
    title: 'Internal Revenue Code § 6695(g) - Failure to Be Diligent in Determining Eligibility for Certain Credits',
    agency: 'United States Congress / IRC',
    pubOrForm: '26 U.S. Code § 6695(g)',
    taxYear: 'Permanent Statutory Law',
    lastUpdated: 'Current Code',
    url: 'https://www.law.cornell.edu/uscode/text/26/6695',
    guidanceType: 'Statutory Authority',
    summary: 'Statute establishing mandatory monetary penalties on paid preparers for each failure to comply with due diligence standards for EITC, CTC, AOTC, and HOH.',
    keyTopics: ['IRC §6695(g)', 'Preparer Penalties', 'Due Diligence', 'Form 8867', 'IRS Audit']
  }
];

export const INITIAL_KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'art-hoh-complete',
    title: 'Head of Household (HOH) Complete Qualification & Due Diligence Guide',
    category: 'Filing Status',
    taxYear: '2026',
    status: 'Verified',
    overview: 'Head of Household offers significant tax benefits including a substantially higher standard deduction and more gradual tax brackets. Because of widespread misfiling, the IRS subjects HOH claims to mandatory preparer due diligence under IRC §6695(g).',
    quickReference: 'Must be unmarried or considered unmarried as of Dec 31; must pay >50% of the cost of keeping up the home; qualifying person must live with taxpayer for >6 months (except dependent parents).',
    detailedExplanation: 'Under IRC §2(b), an individual is considered Head of Household if they are not married at the close of their taxable year, are not a surviving spouse, and maintain as their home a household which constitutes for more than one-half of such taxable year the principal place of abode of a qualifying child or dependent relative. Under IRC §7703(b), a legally married individual can be "considered unmarried" if they file a separate return, pay more than half the cost of keeping up their home for the tax year, their spouse did not live in the home during the last 6 months of the tax year, and the home was the principal home of the child for more than half the year.',
    eligibility: [
      'Unmarried or legally separated under divorce decree as of December 31, OR meets the 4-part "considered unmarried" rule',
      'Paid more than 50% of total household maintenance expenses during the tax year',
      'Maintained principal home for a qualifying child or qualifying relative for more than half the year (parent may live in separate home if taxpayer paid >50% of costs)',
      'Taxpayer cannot be claimed as a dependent by any other taxpayer'
    ],
    requirements: [
      'Contemporaneous household expense records (rent/mortgage receipts, utility statements, grocery bills)',
      'Proof of residency showing client and child share the same physical address (school, pediatrician, lease)',
      'Completion of Form 8867 Part I and Part V by the paid preparer prior to return submission'
    ],
    limits: 'Standard deduction $22,500 (2026 projected) / $21,900 (2025) / $21,900 (2024). Compare with Single ($15,000 / $14,600).',
    exceptions: [
      'Temporary absences for school, medical care, military service, or juvenile incarceration count as time lived at home',
      'Dependent parent does NOT have to live with the taxpayer, provided the taxpayer paid more than half the cost of maintaining the parent’s separate home (e.g., apartment or assisted living)'
    ],
    examples: [
      'Sarah separated from her husband in February 2025. Her husband moved out completely on April 15, 2025. Sarah paid the entire rent and electric bills for herself and her 8-year-old son. Because her spouse did not reside in the home between July 1 and December 31, Sarah is considered unmarried and qualifies for HOH.',
      'Carlos and his girlfriend live together in an apartment Carlos pays for. The girlfriend earned $3,000 and is claimed by Carlos as a qualifying relative dependent. However, a boyfriend/girlfriend can NEVER qualify a taxpayer for Head of Household status. Carlos must file as Single.'
    ],
    documentation: [
      'Lease agreement or mortgage statement in client’s name',
      'Utility bills covering the second half of the calendar year',
      'School registration letter, report card, or medical records verifying child’s address',
      'Divorce decree or court order of separate maintenance if applicable'
    ],
    forms: ['Form 1040', 'Form 8867', 'Schedule 8812', 'Form 8332 (if custody release)'],
    dueDiligence: 'IRC §6695(g) imposes penalties exceeding $600 per failure. Preparers must not rely on uncorroborated verbal statements. Document the specific interview questions asked, who provided household funds, and inspect physical address evidence.',
    commonMistakes: [
      'Claiming HOH when spouse lived in the house at any time between July 1 and December 31',
      'Counting child support or welfare payments as household funds provided by the taxpayer',
      'Attempting to claim HOH using a non-relative or domestic partner dependent',
      'Failing to complete and submit Form 8867 with the electronic return'
    ],
    irsSources: [
      INITIAL_IRS_SOURCES[0],
      INITIAL_IRS_SOURCES[4],
      INITIAL_IRS_SOURCES[5]
    ],
    lastUpdated: '2026-01-15',
    author: 'Tax Director Sarah Vance, CPA',
    reviewer: 'Chief Compliance Officer Marcus Chen, EA',
    version: '4.2',
    isRequiredTraining: true
  },
  {
    id: 'art-schedule-c-diligence',
    title: 'Schedule C Self-Employment: Ordinary Expenses & Audit Defense',
    category: 'Self-Employment',
    taxYear: '2026',
    status: 'Verified',
    overview: 'Schedule C reports sole proprietorship and single-member LLC earnings. Self-employed taxpayers pay 15.3% Self-Employment Tax (IRC §1402) in addition to income tax. When self-employment income maximizes the Earned Income Tax Credit, the return is scrutinized heavily under IRS preparer compliance programs.',
    quickReference: 'Gross income includes all cash, app, 1099-NEC, and 1099-K receipts. Deductions must be ordinary and necessary under IRC §162. Vehicle deductions require contemporaneous mileage logs.',
    detailedExplanation: 'Under IRC §162, business expenses must be ordinary (common and accepted in the field) and necessary (helpful and appropriate). Under IRC §274(d), strict substantiation rules apply to vehicles, travel, and gifts. Estimates and round numbers trigger immediate audit flags. Preparers must probe whether the business actually exists, verify books and bank records, and ensure 1099-NEC information returns were filed for contractors paid $600+.',
    eligibility: [
      'Operating an active trade or business with intent to realize profit',
      'Independent contractors, gig workers (rideshare, delivery), freelancers, and single-member LLCs'
    ],
    requirements: [
      'Separation of personal and business finances',
      'Detailed ledger or accounting summary of revenues and expenditures',
      'Contemporaneous vehicle mileage log specifying date, destination, business purpose, and odometer readings',
      'Proof of Form 1099-NEC filing for subcontractors paid $600 or more'
    ],
    limits: 'Self-employment tax: 15.3% (12.4% Social Security up to wage cap + 2.9% Medicare without cap). Deduct 50% of SE tax on Schedule 1.',
    exceptions: [
      'Hobby losses: Under IRC §183, activities not engaged in for profit cannot claim expenses in excess of gross income (and under TCJA, miscellaneous itemized deductions for hobby expenses are suspended)'
    ],
    examples: [
      'Elena is an independent hairstylist. She rents a salon chair for $800/month, purchases hair products wholesale for $3,400, and received $38,000 from clients (Square records + cash ledger). She can deduct the chair rental, product costs, liability insurance, and merchant processing fees. Her net profit of $25,000 is reported on Schedule C and Subject to Schedule SE.'
    ],
    documentation: [
      'Bank and merchant processing (Square, Stripe, Venmo, PayPal) statements',
      'Invoices, vendor receipts, and proof of payment',
      'Written vehicle mileage log or verified GPS tracking export (MileIQ, Everlance)',
      'Copy of Forms 1099-NEC filed with IRS and provided to recipients'
    ],
    forms: ['Schedule C (Form 1040)', 'Schedule SE', 'Form 4562', 'Form 8829', 'Form 8867'],
    dueDiligence: 'The IRS expects preparers to ask: Did you keep receipts? Did you keep a mileage log? Is there a separate business bank account? Did you file 1099s? If the taxpayer has no records and reports exactly enough income to maximize EITC, preparers must decline the return.',
    commonMistakes: [
      'Deducting personal commuting miles (travel from home to a regular workplace)',
      'Reporting round numbers ($5,000 travel, $2,000 supplies) with zero itemized substantiation',
      'Deducting 100% of auto expenses when only one family car exists',
      'Failing to report cash and digital payment app gross receipts'
    ],
    irsSources: [
      INITIAL_IRS_SOURCES[2],
      INITIAL_IRS_SOURCES[3]
    ],
    lastUpdated: '2026-02-01',
    author: 'David Thorne, EA',
    reviewer: 'Sarah Vance, CPA',
    version: '3.8',
    isRequiredTraining: true
  },
  {
    id: 'art-eitc-tiebreakers',
    title: 'Earned Income Tax Credit (EITC) & Statutory Tie-Breaker Rules',
    category: 'Tax Credits',
    taxYear: '2026',
    status: 'Verified',
    overview: 'The EITC is a refundable tax credit for low-to-moderate-income workers. Eligibility depends on earned income, filing status, qualifying children, and investment income. When more than one person can claim a child, statutory tie-breaker rules under IRC §152(c)(4) strictly govern who receives the credit.',
    quickReference: 'Refundable credit up to $8,046 (2026 projected) / $7,830 (2025). Investment income limit $12,200 (2026) / $11,950 (2025). Cannot be claimed using Form 8332.',
    detailedExplanation: 'Under IRC §32, qualifying children must meet Relationship, Age, Residency (>6 months in US), and Joint Return tests. Under the tie-breaker rules of IRC §152(c)(4): (1) If only one claimant is a parent, the parent wins. (2) If both claimants are parents and do not file jointly, the parent with whom the child lived the longest wins. If time lived with both parents is equal, the parent with highest AGI wins. (3) If neither claimant is a parent, the person with the highest AGI wins. (4) If a non-parent attempts to claim against a parent, the non-parent can only win if their AGI is higher than the parent’s AGI and the parent agrees.',
    eligibility: [
      'Taxpayer and qualifying children must have valid Social Security numbers by return due date',
      'Earned income from wages, tips, or net self-employment',
      'Investment income does not exceed the statutory threshold ($12,200 in 2026 / $11,950 in 2025)',
      'Cannot be Married Filing Separately unless qualifying under special abandoned/separated spouse exceptions'
    ],
    requirements: [
      'Proof that child lived with taxpayer in the US for more than 183 nights',
      'Social Security cards showing valid employment authority',
      'Completion of Form 8867 Part II by paid preparer'
    ],
    limits: 'Max credit: 0 children ($649), 1 child ($4,328), 2 children ($7,156), 3+ children ($8,046). Phaseouts apply based on AGI.',
    exceptions: [
      'Child with permanent and total disability qualifies regardless of age',
      'Temporary absences for school or medical care count as residence'
    ],
    examples: [
      'Michael and his 5-year-old daughter lived with Michael’s mother (the grandmother) for the entire tax year. Michael’s AGI is $18,000. Grandmother’s AGI is $36,000. Under tie-breaker rules, Michael as the parent has primary legal entitlement. If Michael chooses not to claim the child, grandmother may claim the child for EITC only because her AGI ($36k) is higher than Michael’s ($18k).'
    ],
    documentation: [
      'School attendance records or official daycare statements with physical address',
      'Medical provider statements listing parent as custodial guardian and child address',
      'Birth certificates establishing legal parental relationship'
    ],
    forms: ['Schedule EIC', 'Form 8867', 'Form 8862 (if previously disallowed)'],
    dueDiligence: 'Form 8867 Part II is mandatory. Paid preparers must probe whether another person (e.g. absent parent, grandparent) also lived in the home or is claiming the child on their return.',
    commonMistakes: [
      'Non-custodial parent attempting to claim EITC with Form 8332 (Form 8332 only transfers CTC/ODC, never EITC or HOH)',
      'Claiming children who lived outside the US for more than half the year',
      'Failing to verify that Social Security numbers were issued on or before the tax return due date'
    ],
    irsSources: [
      INITIAL_IRS_SOURCES[1],
      INITIAL_IRS_SOURCES[4]
    ],
    lastUpdated: '2026-01-20',
    author: 'Marcus Chen, EA',
    reviewer: 'Sarah Vance, CPA',
    version: '4.0',
    isRequiredTraining: true
  },
  {
    id: 'art-child-tax-credit',
    title: 'Child Tax Credit (CTC) & Credit for Other Dependents (ODC)',
    category: 'Tax Credits',
    taxYear: '2026',
    status: 'Verified',
    overview: 'The Child Tax Credit provides up to $2,000 per qualifying child under age 17. The Additional Child Tax Credit (ACTC) is the refundable portion. Dependents who do not qualify for CTC (age 17+, elderly parents) may qualify for the nonrefundable $500 Credit for Other Dependents.',
    quickReference: '$2,000 per child under age 17 at close of tax year; must have valid SSN issued by return due date; phaseout begins at $200k ($400k MFJ).',
    detailedExplanation: 'Under IRC §24, a qualifying child for CTC must be under age 17 at the end of the calendar year, a US citizen, US national, or US resident alien, and must have a Social Security number valid for employment. The credit phases out by $50 for each $1,000 of modified AGI over $200,000 ($400,000 for married couples filing jointly). If the nonrefundable CTC exceeds tax liability, the taxpayer may receive the refundable Additional Child Tax Credit (ACTC) calculated on Form 8812 based on 15% of earned income exceeding $2,500.',
    eligibility: [
      'Child is under age 17 on December 31 of the tax year',
      'Child is taxpayer’s son, daughter, stepchild, foster child, sibling, or descendant of any of them',
      'Child did not provide more than half of their own support',
      'Child lived with taxpayer for more than half the year',
      'Child has a valid SSN (ITIN not allowed for CTC, but eligible for $500 ODC)'
    ],
    requirements: [
      'Form 1040 with Schedule 8812 attached',
      'Form 8332 if claimed by noncustodial parent pursuant to divorce or separation agreement',
      'Form 8867 Part III completed by paid preparer'
    ],
    limits: 'Credit amount: $2,000 per child. Refundable cap: up to $1,750 (2026) / $1,700 (2025/2024). Phaseout starts at $400k MFJ / $200k other.',
    exceptions: [
      'Children aged 17-18, or full-time students aged 19-23, do not qualify for the $2,000 CTC but do qualify for the $500 ODC'
    ],
    examples: [
      'John and Lisa have twin daughters who turned 16 in August 2025, and a son who turned 17 in October 2025. Their AGI is $110,000. On their 2025 return, they qualify for $4,000 CTC for the 16-year-old twins ($2,000 x 2) and $500 ODC for the 17-year-old son, for a total credit of $4,500.'
    ],
    documentation: [
      'Child Social Security card showing SSN valid for employment',
      'Proof of age (birth certificate, passport)',
      'Proof of residency with taxpayer',
      'Form 8332 signed by custodial parent if applicable'
    ],
    forms: ['Form 1040', 'Schedule 8812', 'Form 8867', 'Form 8332'],
    dueDiligence: 'Form 8867 Part III is mandatory. Preparers must verify the age of the child and ensure the Social Security card does not state "Not Valid for Employment".',
    commonMistakes: [
      'Claiming CTC for a child who reached age 17 before midnight on December 31',
      'Using an ITIN to claim the $2,000 CTC (ITIN only qualifies for $500 ODC)',
      'Custodial parent filing return claiming child when they previously executed an unconditional Form 8332'
    ],
    irsSources: [
      INITIAL_IRS_SOURCES[0],
      INITIAL_IRS_SOURCES[4]
    ],
    lastUpdated: '2026-01-25',
    author: 'Sarah Vance, CPA',
    reviewer: 'David Thorne, EA',
    version: '3.5',
    isRequiredTraining: true
  }
];

export const INITIAL_FORMS_AND_PUBS: TaxFormInfo[] = [
  {
    formNumber: 'Form 1040',
    title: 'U.S. Individual Income Tax Return',
    purpose: 'Primary annual tax return filed by US citizens and resident aliens to report income, deductions, credits, and calculate tax liability.',
    whenUsed: 'Annual filing due April 15 (or next business day) for calendar year individual taxpayers.',
    relatedTopics: ['Filing Status', 'Income', 'Standard Deduction', 'Tax Credits'],
    currentTaxYear: '2025-2026',
    officialSourceUrl: 'https://www.irs.gov/forms-pubs/about-form-1040',
    instructionsUrl: 'https://www.irs.gov/instructions/i1040gi',
    category: 'Individual'
  },
  {
    formNumber: 'Schedule C',
    title: 'Profit or Loss From Business (Sole Proprietorship)',
    purpose: 'Reports income and allowable business deductions from an unincorporated business or single-member LLC.',
    whenUsed: 'Filed with Form 1040 when taxpayer has self-employment or 1099 independent contractor activities.',
    relatedTopics: ['Self-Employment', 'Business Expenses', 'Mileage', 'Depreciation'],
    currentTaxYear: '2025-2026',
    officialSourceUrl: 'https://www.irs.gov/forms-pubs/about-schedule-c-form-1040',
    instructionsUrl: 'https://www.irs.gov/instructions/i1040sc',
    category: 'Business'
  },
  {
    formNumber: 'Schedule E',
    title: 'Supplemental Income and Loss',
    purpose: 'Reports income or loss from rental real estate, royalties, partnerships, S corporations, estates, and trusts.',
    whenUsed: 'Filed with Form 1040 when taxpayer owns residential or commercial rental properties or pass-through K-1 investments.',
    relatedTopics: ['Rental Property', 'Passive Activity Loss', 'Depreciation', 'K-1'],
    currentTaxYear: '2025-2026',
    officialSourceUrl: 'https://www.irs.gov/forms-pubs/about-schedule-e-form-1040',
    instructionsUrl: 'https://www.irs.gov/instructions/i1040se',
    category: 'Individual'
  },
  {
    formNumber: 'Form 8867',
    title: 'Paid Preparer’s Due Diligence Checklist',
    purpose: 'Mandatory form completed by paid tax preparers claiming EITC, CTC/ACTC/ODC, AOTC, and Head of Household filing status.',
    whenUsed: 'Must be electronically filed with every federal return claiming covered credits or HOH status under IRC §6695(g).',
    relatedTopics: ['Due Diligence', 'EITC', 'CTC', 'HOH', 'Preparer Penalties'],
    currentTaxYear: '2025-2026',
    officialSourceUrl: 'https://www.irs.gov/forms-pubs/about-form-8867',
    instructionsUrl: 'https://www.irs.gov/instructions/i8867',
    category: 'Due Diligence'
  },
  {
    formNumber: 'Form 8862',
    title: 'Information To Claim Certain Credits After Disallowance',
    purpose: 'Required when an IRS audit previously disallowed or reduced a taxpayer’s EITC, CTC, ACTC, ODC, or AOTC due to reckless or intentional disregard of rules.',
    whenUsed: 'Attached to Form 1040 the first year a taxpayer re-claims a previously banned or reduced credit.',
    relatedTopics: ['Audit Disallowance', 'EITC Ban', 'CTC Ban', 'Due Diligence'],
    currentTaxYear: '2025-2026',
    officialSourceUrl: 'https://www.irs.gov/forms-pubs/about-form-8862',
    instructionsUrl: 'https://www.irs.gov/instructions/i8862',
    category: 'Due Diligence'
  },
  {
    formNumber: 'Form 8332',
    title: 'Release/Revocation of Release of Claim to Exemption for Child by Custodial Parent',
    purpose: 'Allows a custodial parent to release their claim to the child’s dependency exemption and Child Tax Credit to the noncustodial parent.',
    whenUsed: 'Attached to noncustodial parent’s return. Does NOT transfer EITC or Head of Household status.',
    relatedTopics: ['Divorce & Separation', 'Child Custody', 'CTC', 'Tie-Breaker Rules'],
    currentTaxYear: '2025-2026',
    officialSourceUrl: 'https://www.irs.gov/forms-pubs/about-form-8332',
    instructionsUrl: 'https://www.irs.gov/instructions/i8332',
    category: 'Individual'
  },
  {
    formNumber: 'Form 8863',
    title: 'Education Credits (American Opportunity and Lifetime Learning Credits)',
    purpose: 'Calculates the American Opportunity Tax Credit (up to $2,500 with $1,000 refundable) and Lifetime Learning Credit (up to $2,000 nonrefundable).',
    whenUsed: 'Attached to Form 1040 when taxpayer, spouse, or dependent incurred qualified higher education tuition and fees.',
    relatedTopics: ['Higher Education', 'Form 1098-T', 'AOTC', 'Lifetime Learning'],
    currentTaxYear: '2025-2026',
    officialSourceUrl: 'https://www.irs.gov/forms-pubs/about-form-8863',
    instructionsUrl: 'https://www.irs.gov/instructions/i8863',
    category: 'Credits'
  },
  {
    formNumber: 'Form 2441',
    title: 'Child and Dependent Care Expenses',
    purpose: 'Calculates the nonrefundable credit for expenses paid to a care provider so taxpayer (and spouse) can work or look for work.',
    whenUsed: 'Filed with Form 1040 when qualified care expenses were paid for a qualifying child under age 13 or disabled spouse/dependent.',
    relatedTopics: ['Daycare Expenses', 'Dependent Care FSA', 'Child Care Provider EIN'],
    currentTaxYear: '2025-2026',
    officialSourceUrl: 'https://www.irs.gov/forms-pubs/about-form-2441',
    instructionsUrl: 'https://www.irs.gov/instructions/i2441',
    category: 'Credits'
  }
];

export const INITIAL_TRAINING_COURSES: TrainingCourse[] = [
  {
    id: 'course-foundations-due-diligence',
    title: 'Preparer Due Diligence Masterclass (IRC §6695(g) & Form 8867)',
    category: 'Compliance & Ethics',
    description: 'Essential certification for new and experienced tax preparers to master statutory due diligence requirements, avoid costly penalties, and master interview techniques.',
    targetAudience: 'New Tax Preparer',
    lessons: [
      {
        id: 'lesson-8867-core',
        courseId: 'course-foundations-due-diligence',
        title: 'Mastering Form 8867: The 5 Statutory Due Diligence Requirements',
        taxYear: '2026',
        difficulty: 'Beginner',
        estimatedMinutes: 20,
        learningObjectives: [
          'Identify the four tax benefits covered by IRC §6695(g) (EITC, CTC/ACTC/ODC, AOTC, HOH)',
          'Explain the knowledge requirement and what constitutes "reasonable cause"',
          'List the mandatory documentation retention period (3 years from filing deadline)',
          'Formulate contemporaneous interview notes that satisfy IRS auditor standards'
        ],
        content: `### Statutory Background
Under Internal Revenue Code § 6695(g), a paid tax preparer who fails to comply with statutory due diligence requirements with respect to determining eligibility for, or the amount of, the EITC, CTC/ACTC/ODC, AOTC, and Head of Household filing status is subject to a penalty of over $600 per failure.

### The Five Mandatory Due Diligence Requirements
1. **Submit the checklist:** Complete and file Form 8867 electronically with the return.
2. **Compute the credit:** Complete applicable credit worksheets or use tax preparation software.
3. **Knowledge requirement:** Interview the taxpayer, ask probing questions, and corroborate answers. If information appears incorrect, inconsistent, or incomplete, the preparer MUST make additional reasonable inquiries.
4. **Retention of records:** Retain Form 8867, worksheets, written records of questions asked, and copies of documents inspected for three years.
5. **Certification of inquiries:** Contemporaneously record the taxpayer's answers and date of inquiry.`,
        redFlags: [
          'Client provides exact round numbers without receipts',
          'Taxpayer claiming children who live at a different address with no court order',
          'Claiming Head of Household while married and living with spouse at any point July 1 - Dec 31'
        ],
        dueDiligenceFocus: 'Never accept verbal representations when facts suggest ambiguity. Document what question was asked, what the client answered, and what document was inspected.',
        quiz: [
          {
            id: 'q1',
            question: 'What is the statutory penalty per failure under IRC §6695(g) for failing to exercise due diligence?',
            options: [
              'Zero for first offense',
              '$50 per return',
              'Over $600 per failure (indexed annually for inflation)',
              '$5,000 flat penalty'
            ],
            correctIndex: 2,
            explanation: 'The penalty is indexed annually for inflation and exceeds $600 per failure (each credit and HOH status can trigger a separate penalty on the same return).',
            irsSourceRef: 'IRC §6695(g) & Form 8867 Instructions'
          },
          {
            id: 'q2',
            question: 'How long must a tax preparer retain Form 8867, worksheets, and copies of supporting documents?',
            options: [
              '1 year',
              '3 years from the latest of filing deadline or actual date filed',
              '7 years',
              'Indefinitely'
            ],
            correctIndex: 1,
            explanation: 'Records must be retained for at least 3 years from the later of the return due date (without extensions) or the date the return was electronically filed.',
            irsSourceRef: 'Treasury Regulation § 1.6695-2(b)(4)'
          },
          {
            id: 'q3',
            question: 'Can a noncustodial parent use Form 8332 signed by the custodial parent to claim the Earned Income Tax Credit (EITC)?',
            options: [
              'Yes, Form 8332 transfers all child tax benefits',
              'No, Form 8332 transfers only the Child Tax Credit / ODC, never EITC or Head of Household status',
              'Yes, if the divorce agreement was entered before 2008',
              'Only if the noncustodial parent paid more child support than the custodial parent'
            ],
            correctIndex: 1,
            explanation: 'Under IRC §152(e) and §32, Form 8332 releases the dependency exemption and Child Tax Credit/ODC only. It does NOT transfer EITC, Head of Household filing status, or the Child and Dependent Care credit.',
            irsSourceRef: 'IRS Publication 501 & Form 8332 Instructions'
          }
        ]
      },
      {
        id: 'lesson-hoh-interview',
        courseId: 'course-foundations-due-diligence',
        title: 'Conducting the Head of Household Client Interview',
        taxYear: '2026',
        difficulty: 'Intermediate',
        estimatedMinutes: 25,
        learningObjectives: [
          'Differentiate legally unmarried taxpayers from taxpayers "considered unmarried"',
          'Execute the 50% household upkeep computation worksheet',
          'Identify common disqualifying domestic relationships'
        ],
        content: `### Probing Questions for HOH
When a taxpayer wishes to file as Head of Household, preparers must ask specific questions:
1. "Were you legally married on December 31?"
2. "Did your spouse stay overnight in your home at any point between July 1 and December 31?"
3. "Who pays the rent, electric bill, and groceries?"
4. "Did you receive non-taxable welfare or housing vouchers, and did your personal funds exceed those vouchers?"`,
        redFlags: [
          'Client states they are separated but cannot provide proof of separate residences',
          'Client wants to claim a live-in romantic partner as qualifying person',
          'Client’s only income was child support and SNAP benefits'
        ],
        dueDiligenceFocus: 'Corroborate that the client paid more than 50% from their own funds, not third-party governmental aid.',
        quiz: [
          {
            id: 'q-hoh-1',
            question: 'Can a taxpayer file as Head of Household if their spouse lived in the house until August 15?',
            options: [
              'Yes, because they were separated by December 31',
              'No, because the spouse lived in the residence during the last 6 months of the year',
              'Yes, if they had separate bedrooms',
              'Yes, if they signed an informal separation letter'
            ],
            correctIndex: 1,
            explanation: 'Under the "considered unmarried" rules of IRC §7703(b), the spouse must NOT have lived in the home at any time during the last 6 months of the taxable year.',
            irsSourceRef: 'IRC §7703(b) & Pub 501'
          }
        ]
      }
    ]
  },
  {
    id: 'course-schedule-c-audits',
    title: 'Schedule C Audit Defense: Mileage, 1099-K & Home Office',
    category: 'Business & Self-Employment',
    description: 'Advanced guidelines on vetting self-employment returns, reconciling 1099-K merchant reports, validating auto mileage, and defending home office deductions.',
    targetAudience: 'Experienced Tax Preparer',
    lessons: [
      {
        id: 'lesson-mileage-substantiation',
        courseId: 'course-schedule-c-audits',
        title: 'Vehicle Expenses: Standard Mileage vs. Actual & The Contemporaneous Rule',
        taxYear: '2026',
        difficulty: 'Intermediate',
        estimatedMinutes: 20,
        learningObjectives: [
          'Distinguish deductible business travel from non-deductible commuting',
          'State the strict substantiation requirements of IRC §274(d)',
          'Identify situations where standard mileage cannot be used'
        ],
        content: `### IRC §274(d) Strict Substantiation
The IRS explicitly disallows vehicle expense deductions based on estimates. The taxpayer must maintain a contemporaneous log recording:
1. Date of trip
2. Starting and ending destination
3. Specific business purpose
4. Exact business mileage
5. Total odometer reading at start and end of year`,
        redFlags: [
          'Round number of miles (e.g., exactly 15,000 miles)',
          '100% business use claimed on family vehicle with no second car in household',
          'Commuting from home to regular client office claimed as business trip'
        ],
        dueDiligenceFocus: 'Inspect the mileage log app or written book before entering vehicle deductions on Schedule C.',
        quiz: [
          {
            id: 'q-mileage-1',
            question: 'Which of the following trips is deductible on Schedule C?',
            options: [
              'Driving from taxpayer’s home to their permanent salon chair every morning',
              'Driving from principal client office to a secondary client site to deliver products',
              'Stopping at grocery store on way home from work to buy family dinner',
              'Driving to work on weekends'
            ],
            correctIndex: 1,
            explanation: 'Travel between two business locations in the same workday is deductible. Travel from home to a regular principal workplace is personal commuting.',
            irsSourceRef: 'IRS Publication 463'
          }
        ]
      }
    ]
  }
];

export const INITIAL_SCENARIOS: Scenario[] = [
  {
    id: 'scen-maria-custody',
    title: 'The Separated Parent & Multi-Household Custody Dispute',
    difficulty: 'Intermediate',
    taxYear: '2026',
    clientName: 'Maria Rodriguez',
    backgroundStory: 'Maria separated from her husband, Carlos, in March 2025. Carlos moved into an apartment across town on May 1, 2025. Maria stayed in the family rental home with their 9-year-old daughter Sofia. In October 2025, Carlos lost his job and Sofia spent three weeks staying at Carlos’s apartment while Maria worked extra overtime shifts. Carlos gave Maria $2,000 total in informal cash support during the year. Carlos is now demanding to claim Sofia on his tax return because he claims he paid support. Maria paid $18,000 in rent, $2,400 in utilities, and bought all groceries. Carlos never signed Form 8332.',
    taxpayerDetails: {
      maritalStatus: 'Married (Separated May 1, 2025 - no formal legal separation agreement)',
      dependents: ['Sofia Rodriguez (Age 9, Daughter, lived with Maria > 10 months)'],
      w2Wages: '$34,500 from hospital medical records clerk position',
      selfEmploymentIncome: '$0',
      specialCircumstances: 'Spouse moved out on May 1; Carlos claims he should get EITC because he paid $2,000 cash support.'
    },
    keyQuestionsToDetermine: [
      'Can Maria file as Head of Household under the "considered unmarried" rules?',
      'Can Carlos legally claim Sofia for EITC or Child Tax Credit without a signed Form 8332?',
      'What documents must the preparer request from Maria to satisfy Form 8867 due diligence?'
    ],
    authoritativeAnswer: {
      correctFilingStatus: 'Head of Household (considered unmarried under IRC §7703(b))',
      eligibleDependents: ['Sofia Rodriguez as Qualifying Child'],
      eligibleCredits: ['Child Tax Credit ($2,000)', 'Earned Income Tax Credit (1 qualifying child)'],
      requiredForms: ['Form 1040', 'Schedule EIC', 'Schedule 8812', 'Form 8867 (Parts I, II, III, V)'],
      dueDiligenceRedFlags: [
        'Carlos lived in the home until May 1. Note: July 1 to Dec 31 is the statutory 6-month window. Since Carlos moved out May 1, he was absent for the ENTIRE last 6 months (July 1 - Dec 31). Therefore Maria meets the test!',
        'Informal cash child support cannot be counted as household support by Maria, but her $34.5k wages easily prove she paid >50% of the $20.4k total household costs.',
        'Carlos cannot claim Sofia for CTC or EITC: Sofia lived with Maria for >10 months, Maria is the custodial parent, and Maria has not signed Form 8332.'
      ],
      statutoryCitations: ['IRC §7703(b)', 'IRC §2(b)', 'IRC §32(c)(3)', 'IRC §152(e)', 'Form 8867 Instructions']
    }
  },
  {
    id: 'scen-derek-rideshare',
    title: 'The Rideshare Driver With Estimated Expenses & Peak EITC',
    difficulty: 'Advanced',
    taxYear: '2026',
    clientName: 'Derek Washington',
    backgroundStory: 'Derek is unmarried and cares for his 4-year-old nephew. He comes to your tax office with a Form 1099-K showing $28,400 in gross rideshare ride payments. Derek tells you he drove "about 28,000 business miles", spent "around $4,000 on car repairs and gas", and paid "$1,200 for cell phone". He does not have a written mileage log or receipts, but says his rideshare app dashboard shows he was online 1,200 hours. The net profit Derek wants to report happens to place him precisely at the maximum refundable EITC threshold.',
    taxpayerDetails: {
      maritalStatus: 'Single',
      dependents: ['Marcus Washington (Age 4, Nephew, lived with Derek entire year)'],
      w2Wages: '$0',
      selfEmploymentIncome: '$28,400 gross 1099-K',
      specialCircumstances: 'Estimating vehicle mileage and expenses; nephew relationship; potential peak EITC audit trigger.'
    },
    keyQuestionsToDetermine: [
      'Can the preparer accept Derek’s verbal estimates of 28,000 miles without a contemporaneous log?',
      'Can Derek claim his 4-year-old nephew for EITC and CTC? What proof of relationship and residency is required?',
      'What are the paid preparer due diligence obligations under IRC §6695(g) regarding Schedule C expenses?'
    ],
    authoritativeAnswer: {
      correctFilingStatus: 'Head of Household (qualifying relative/nephew qualifying child under IRC §152(c))',
      eligibleDependents: ['Marcus Washington (nephew)'],
      eligibleCredits: ['Child Tax Credit ($2,000)', 'Earned Income Tax Credit (1 child)'],
      requiredForms: ['Schedule C', 'Schedule SE', 'Schedule EIC', 'Schedule 8812', 'Form 8867'],
      dueDiligenceRedFlags: [
        'CRITICAL: Under IRC §274(d) and Form 8867 Part VI, preparers CANNOT accept estimates for vehicle expenses. The preparer must request the actual rideshare platform annual tax summary report (which distinguishes on-trip miles from personal commuting) or a GPS tracking export.',
        'Nephew relationship requires birth certificates proving Derek is the brother of Marcus’s mother/father, plus proof Marcus lived with Derek for >183 days (pediatrician records, daycare records).',
        'If Derek refuses to provide mileage logs or platform records, the preparer MUST decline to prepare the return to avoid §6695(g) and Circular 230 sanctions.'
      ],
      statutoryCitations: ['IRC §274(d)', 'IRC §6695(g)', 'Treas. Reg. §1.6695-2', 'Pub 463', 'Pub 596']
    }
  }
];

export const INITIAL_SAVED_RESEARCH: SavedResearch[] = [
  {
    id: 'res-1',
    title: 'Head of Household - Separated Spouse 6-Month Rule Substantiation',
    question: 'How do I prove a client meets the "considered unmarried" rule when the divorce is not yet final?',
    taxYear: '2026',
    content: 'Full statutory breakdown under IRC §7703(b): taxpayer must maintain home as principal residence of child for >6 months, pay >50% costs, and spouse must have lived apart for the entire period of July 1 to Dec 31.',
    sources: [INITIAL_IRS_SOURCES[0], INITIAL_IRS_SOURCES[4]],
    date: '2026-02-14',
    folder: 'Filing Status',
    tags: ['HOH', 'Separated', 'Due Diligence', 'Form 8867'],
    notes: 'Keep lease and separate utility bills in client permanent file.'
  },
  {
    id: 'res-2',
    title: 'Standard Mileage vs Actual Auto Expenses: Depreciation Recapture Rules',
    question: 'If a client used standard mileage in year 1, can they switch to actual expenses in year 2?',
    taxYear: '2026',
    content: 'Yes, if the vehicle is owned, standard mileage must be chosen in the first year the car is available for business. In later years, the taxpayer can switch to actual expenses, but must compute depreciation using straight-line.',
    sources: [INITIAL_IRS_SOURCES[3]],
    date: '2026-02-10',
    folder: 'Schedule C',
    tags: ['Auto', 'Mileage', 'Depreciation', 'Schedule C'],
    notes: 'Verify with client vehicle purchase date and prior year Schedule C method.'
  }
];

export const INITIAL_GENERATED_RESOURCES: GeneratedResource[] = [
  {
    id: 'gen-1',
    title: '2026 Head of Household Quick Qualification Cheat Sheet',
    type: 'cheat_sheet',
    audience: 'New Tax Preparer',
    taxYear: '2026',
    content: `HEAD OF HOUSEHOLD (HOH) QUALIFICATION CHEAT SHEET (TAX YEAR 2026)
Prepared for: Tax Preparation Staff | Apex Tax Intelligence

THE THREE CORE QUALIFICATION TESTS
1. Marital Status Test: Taxpayer must be unmarried OR "considered unmarried" on December 31, 2026.
2. Cost of Home Test: Taxpayer personally paid more than 50% of the cost of keeping up their home during 2026.
3. Qualifying Person Test: A qualifying child or dependent relative lived in the home for more than half the year (183+ nights).

THE "CONSIDERED UNMARRIED" 4-PART RULE (IRC §7703(b))
All four must be satisfied if taxpayer was still legally married on Dec 31:
- [ ] Files a separate return from spouse (MFS or single eligibility).
- [ ] Paid more than half the cost of maintaining the primary home for the year.
- [ ] Spouse did NOT live in the home at ANY time between July 1 and December 31.
- [ ] Home was the main home of taxpayer's child, stepchild, or foster child for more than half the year.

WHAT COUNTS IN THE 50% UPKEEP COMPUTATION?
| INCLUDED IN UPKEEP | EXCLUDED FROM UPKEEP |
| Rent or Mortgage Interest | Clothing & Personal Grooming |
| Real Estate Taxes & Insurance | Food Eaten Outside the Home |
| Utilities (Electric, Gas, Water) | Medical Expenses & Copays |
| Maintenance & Home Repairs | Education & College Tuition |
| Food Eaten Inside the Home | Vacations & Life Insurance |

PREPARER DUE DILIGENCE MANDATORY CHECKLIST (IRC §6695(g))
- [ ] Inquire who else lived in the home during 2026.
- [ ] Inspect and retain copy of lease, mortgage statement, or utility bill in client's name.
- [ ] Confirm child's school or pediatrician record matches client address.
- [ ] Complete Form 8867 Part V and record client answers in software notes.`,
    dateCreated: '2026-02-18',
    createdBy: 'Sarah Vance, CPA',
    tags: ['Cheat Sheet', 'HOH', 'Filing Status', 'Due Diligence'],
    isFavorite: true,
    firmBranding: 'Apex Tax Intelligence'
  },
  {
    id: 'gen-2',
    title: 'Client Handout: Why We Need Your Dependent & Residency Documents',
    type: 'client_handout',
    audience: 'Client',
    taxYear: '2026',
    content: `WHY WE NEED YOUR DOCUMENTS
Prepared for our Valued Clients | Apex Tax Intelligence

Dear Client,

When we prepare your tax return, federal law requires us to verify that all dependents and tax credits comply strictly with IRS rules. The IRS regularly audits tax returns claiming children and tax credits, and without the proper documents, refunds can be delayed or denied.

To protect you and ensure your return is processed smoothly, please provide the following:

1. SOCIAL SECURITY CARDS
- We must review the original Social Security cards (or official SSA letters) for you, your spouse, and every child listed on your return.
- The names on your tax return must match IRS and Social Security records exactly to prevent electronic filing rejections.

2. PROOF THAT YOUR CHILD LIVED WITH YOU IN 2026
The IRS requires proof that your child lived in your home for more than 6 months (183 nights). Please bring ONE of the following:
- School records: A report card, school registration letter, or bus schedule showing your child’s name and your home address.
- Medical records: A statement from your pediatrician, clinic, or health insurance showing your child’s address.
- Official lease agreement: Showing your child listed as an authorized resident in your home.
- Daycare statement: Showing tuition paid and your home address.

3. HEAD OF HOUSEHOLD HOME EXPENSE PROOF
If you are filing as Head of Household, we must verify you paid more than half the cost of running your household:
- One utility bill (electric, gas, or water) in your name.
- Lease agreement or mortgage statement in your name.

Thank you for your cooperation! Taking a few minutes to bring these documents protects your refund and guarantees that your return is 100% IRS compliant.`,
    dateCreated: '2026-02-15',
    createdBy: 'Marcus Chen, EA',
    tags: ['Client Handout', 'Residency', 'Dependents', 'Plain Language'],
    isFavorite: true,
    firmBranding: 'Apex Tax Intelligence'
  }
];

export const INITIAL_USER: User = {
  id: 'usr-current',
  name: 'Sarah Vance, CPA',
  email: 'svance@apextaxintel.com',
  role: 'firm_admin',
  firmId: 'firm-apex',
  avatar: 'SV',
  ptin: 'P01849203'
};

export const INITIAL_FIRM_PROFILE: FirmProfile = {
  id: 'firm-apex',
  name: 'Apex Tax Intelligence',
  eroName: 'Apex Tax Solutions LLC (ERO #88219)',
  brandColor: '#0f766e',
  logoText: 'APEX TAX INTEL',
  customInstructions: 'All staff must complete Form 8867 interview sheets and obtain physical school address letters before submitting EITC or HOH returns. No handwritten mileage summaries accepted without odometer start/end.',
  clientDisclaimer: 'This tax preparation firm operates in compliance with Treasury Department Circular 230. Tax resources are provided for educational and client advisory purposes.',
  proDisclaimer: 'Confidential tax intelligence for authorized firm staff. Preparers must exercise independent professional due diligence pursuant to IRC §6695(g).',
  approvedSourcesOnly: true,
  defaultTaxYear: '2026'
};
