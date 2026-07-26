/**
 * Programmatic SEO data for all Finovert service landing pages.
 * Each service gets a fully generated landing page at /services/:slug with
 * unique metadata, Schema.org markup, FAQs, process steps, and internal links.
 */

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceStep {
  name: string;
  text: string;
}

export interface ServiceSeoEntry {
  slug: string;
  name: string;
  category: string;
  /** Unique 1–2 sentence definition used as the direct answer / meta description. */
  description: string;
  keywords?: string[];
  timeline?: string;
  pricingNote?: string;
  extraFaqs?: ServiceFAQ[];
}

export interface ServiceContent extends ServiceSeoEntry {
  timeline: string;
  pricingNote: string;
  benefits: string[];
  eligibility: string[];
  documents: string[];
  process: ServiceStep[];
  commonMistakes: string[];
  faqs: ServiceFAQ[];
  related: ServiceSeoEntry[];
  metaTitle: string;
  metaDescription: string;
  allKeywords: string[];
}

/* ------------------------------------------------------------------ */
/* Category-level defaults                                             */
/* ------------------------------------------------------------------ */

interface CategoryDefaults {
  timeline: string;
  pricingNote: string;
  benefits: string[];
  eligibility: string[];
  documents: string[];
  process: ServiceStep[];
  commonMistakes: string[];
  keywords: string[];
}

const CATEGORY_DEFAULTS: Record<string, CategoryDefaults> = {
  "Company Registration": {
    timeline: "7–15 working days",
    pricingNote:
      "Pricing starts at an affordable, all-inclusive professional fee plus applicable government charges. Book a free consultation for an exact quote for your business.",
    benefits: [
      "Separate legal entity with limited liability protection",
      "Higher credibility with banks, investors, and customers",
      "Easier access to funding, loans, and government schemes",
      "Perpetual succession — the business continues beyond its owners",
      "PAN, TAN, and GST support handled in one place",
      "Complete post-incorporation compliance support from expert CAs",
    ],
    eligibility: [
      "At least the minimum number of directors/partners required for the chosen structure",
      "At least one director/partner who is an Indian resident",
      "A registered office address in India (residential or commercial)",
      "Valid identity and address proof for all directors/partners",
    ],
    documents: [
      "PAN card of all directors/partners",
      "Aadhaar card / passport / voter ID of all directors/partners",
      "Passport-size photographs",
      "Bank statement or utility bill (address proof, not older than 2 months)",
      "Registered office proof — rent agreement or ownership document with utility bill and NOC",
      "Digital Signature Certificate (DSC) — we help you obtain one if needed",
    ],
    process: [
      { name: "Free consultation", text: "Talk to a Finovert expert to select the right business structure and confirm eligibility." },
      { name: "Documentation", text: "We collect and verify your documents and obtain Digital Signature Certificates (DSC) for the directors." },
      { name: "Name approval", text: "We file the name reservation application with the Ministry of Corporate Affairs (MCA) with up to 2 name options." },
      { name: "Drafting & filing", text: "Our experts draft the MoA, AoA, and incorporation forms and file the SPICe+ application with the MCA." },
      { name: "Incorporation certificate", text: "Receive your Certificate of Incorporation along with PAN and TAN." },
      { name: "Post-incorporation support", text: "We assist with bank account opening, GST registration, and ongoing compliance." },
    ],
    commonMistakes: [
      "Choosing the wrong business structure for your growth and funding plans",
      "Submitting name options that conflict with existing companies or trademarks",
      "Errors or mismatches in directors' KYC documents that delay approval",
      "Ignoring post-incorporation compliance like auditor appointment and INC-20A",
    ],
    keywords: [
      "company registration",
      "register company online",
      "business registration india",
      "company incorporation",
      "business incorporation",
      "startup registration",
      "online company registration india",
    ],
  },
  NGO: {
    timeline: "10–30 working days",
    pricingNote:
      "Transparent professional fees with government charges billed at actuals. Book a free consultation for a quote tailored to your NGO's structure and state.",
    benefits: [
      "Legal recognition for your charitable or non-profit activities",
      "Eligibility for tax exemptions under 80G and 12A",
      "Ability to receive grants, CSR funds, and foreign contributions (with FCRA)",
      "Improved donor trust and transparent governance",
      "End-to-end drafting, filing, and compliance support by experts",
    ],
    eligibility: [
      "A clearly defined charitable, social, educational, or religious objective",
      "Minimum number of members/trustees as required by the chosen structure",
      "Valid KYC documents for all founding members or trustees",
      "A registered address in India for the organisation",
    ],
    documents: [
      "PAN and Aadhaar of all members/trustees",
      "Passport-size photographs of members/trustees",
      "Address proof of members (bank statement or utility bill)",
      "Registered office proof with NOC from the owner",
      "Draft trust deed / MoA and rules & regulations (we draft these for you)",
    ],
    process: [
      { name: "Free consultation", text: "Discuss your objectives with our experts to choose between a trust, society, or Section 8 company." },
      { name: "Document collection", text: "We collect KYC documents and details of members, trustees, and objectives." },
      { name: "Drafting", text: "Our team drafts the trust deed, MoA, or bylaws as per the applicable law." },
      { name: "Filing & registration", text: "We file the application with the relevant registrar or MCA and follow up until approval." },
      { name: "Certificate & next steps", text: "Receive your registration certificate, then apply for PAN, 80G, 12A, and CSR registration as needed." },
    ],
    commonMistakes: [
      "Vague or overly broad objects clauses that get rejected",
      "Not applying for 80G and 12A immediately after registration",
      "Missing annual compliance, which risks cancellation of tax exemptions",
      "Accepting foreign donations without FCRA registration",
    ],
    keywords: [
      "ngo registration",
      "ngo registration india",
      "charitable organisation registration",
      "non profit registration india",
      "80g 12a registration",
    ],
  },
  "Licenses & Certifications": {
    timeline: "3–15 working days",
    pricingNote:
      "Fixed professional fees with no hidden charges; government fees vary by license and state. Book a free consultation for an exact quote.",
    benefits: [
      "Operate your business fully legally and avoid penalties",
      "Build trust with customers, vendors, and marketplaces",
      "Unlock government schemes, subsidies, and tender eligibility",
      "Expert-managed filing with fast turnaround",
      "Renewal and compliance reminders so you never miss a deadline",
    ],
    eligibility: [
      "A registered business entity or proprietorship in India",
      "Valid PAN of the business or proprietor",
      "Business premises address proof where applicable",
      "Sector-specific requirements confirmed during consultation",
    ],
    documents: [
      "PAN card of business/proprietor",
      "Aadhaar card of the applicant",
      "Business address proof (utility bill / rent agreement)",
      "Passport-size photograph of the applicant",
      "Business registration proof (COI / partnership deed, if applicable)",
    ],
    process: [
      { name: "Free consultation", text: "Confirm the exact license or certification your business needs." },
      { name: "Document collection", text: "Share basic KYC and business documents with our team." },
      { name: "Application filing", text: "Our experts prepare and file the application with the relevant authority." },
      { name: "Follow-up & clarifications", text: "We track your application and respond to any queries from the department." },
      { name: "License delivered", text: "Receive your license/certificate along with guidance on renewals and compliance." },
    ],
    commonMistakes: [
      "Applying under the wrong license category or class",
      "Mismatched business details across PAN, GST, and the application",
      "Missing renewal deadlines and paying late fees or penalties",
    ],
    keywords: [
      "business license india",
      "license registration online",
      "certification services india",
      "business certification",
      "licensing consultant",
    ],
  },
  "FSSAI Registration": {
    timeline: "7–60 working days (depending on license type)",
    pricingNote:
      "Professional fees depend on the FSSAI license category (Basic, State, or Central) and validity period chosen (1–5 years). Book a free consultation for an exact quote.",
    benefits: [
      "Legally operate any food business in India",
      "Mandatory 14-digit FSSAI license number for packaging and marketing",
      "Consumer trust through the FSSAI logo on your products",
      "Eligibility to sell on food delivery platforms and marketplaces",
      "Expert guidance on food safety compliance and annual returns",
    ],
    eligibility: [
      "Any Food Business Operator (FBO): manufacturer, trader, restaurant, cloud kitchen, distributor, or importer",
      "Basic Registration: annual turnover up to ₹12 lakh",
      "State License: annual turnover between ₹12 lakh and ₹20 crore",
      "Central License: annual turnover above ₹20 crore, importers/exporters, or multi-state operations",
    ],
    documents: [
      "Photo ID and address proof of the proprietor/partners/directors",
      "Passport-size photograph of the applicant",
      "Business premises proof (rent agreement / utility bill)",
      "Food safety management plan (for State/Central license)",
      "List of food products/categories to be handled",
      "Form B duly filled and signed",
    ],
    process: [
      { name: "Free consultation", text: "Determine whether you need Basic Registration, State License, or Central License based on turnover and operations." },
      { name: "Document collection", text: "Share KYC, premises proof, and your food product list." },
      { name: "Application filing", text: "We file Form A/Form B on the FoSCoS portal with all annexures." },
      { name: "Department follow-up", text: "We respond to queries and coordinate inspection if applicable." },
      { name: "License issued", text: "Receive your 14-digit FSSAI license and guidance on labelling and annual returns." },
    ],
    commonMistakes: [
      "Applying for Basic Registration when turnover requires a State/Central license",
      "Missing product categories in the application, restricting future operations",
      "Not filing the mandatory FSSAI annual return (Form D1) on time",
      "Letting the license expire — renewals must be filed before expiry",
    ],
    keywords: [
      "fssai registration",
      "fssai license",
      "food license india",
      "food business license",
      "foscos registration",
      "food registration online",
    ],
  },
  "Trade License": {
    timeline: "7–15 working days",
    pricingNote:
      "Fees vary by municipality/state and business category. Book a free consultation for an exact, all-inclusive quote for your city.",
    benefits: [
      "Operate your trade or business legally within your municipal area",
      "Avoid fines, penalties, and closure notices from local authorities",
      "Required for bank accounts, tenders, and many B2B contracts",
      "Expert handling of municipal paperwork and follow-ups",
    ],
    eligibility: [
      "Business premises located within the municipal corporation's jurisdiction",
      "Applicant above 18 years of age with no criminal disqualification",
      "The trade must be legally permissible at the premises",
    ],
    documents: [
      "PAN of the applicant/business",
      "Aadhaar / ID proof of the applicant",
      "Premises proof — property tax receipt, rent agreement, or ownership deed",
      "NOC from the property owner (if rented)",
      "Passport-size photograph",
    ],
    process: [
      { name: "Free consultation", text: "Confirm the license category and municipal requirements for your trade." },
      { name: "Document collection", text: "Share KYC and premises documents with our team." },
      { name: "Application filing", text: "We file the application with the municipal corporation and pay the applicable fee." },
      { name: "Inspection & follow-up", text: "We coordinate any premises inspection and respond to department queries." },
      { name: "License delivered", text: "Receive your trade license with reminders for annual renewal." },
    ],
    commonMistakes: [
      "Operating without a license and attracting retrospective penalties",
      "Applying under the wrong trade category",
      "Missing the annual renewal window (usually January–March)",
    ],
    keywords: [
      "trade license",
      "trade license registration",
      "municipal trade license",
      "trade license online",
      "business trade license india",
    ],
  },
  "BIS Registration": {
    timeline: "30–90 working days",
    pricingNote:
      "Costs depend on the product category, testing charges, and BIS scheme applicable. Book a free consultation for a detailed cost estimate.",
    benefits: [
      "Legally sell products covered under mandatory BIS certification in India",
      "ISI/BIS mark builds strong consumer trust in product quality",
      "Access to government tenders and organised retail channels",
      "End-to-end support: testing coordination, documentation, and factory audit",
    ],
    eligibility: [
      "Manufacturers (Indian or foreign) of products covered under BIS schemes",
      "Access to in-house or BIS-recognised lab testing for the product",
      "Manufacturing process meeting the relevant Indian Standard (IS)",
    ],
    documents: [
      "Business registration proof and factory address proof",
      "Manufacturing process flow chart and machinery list",
      "Product test reports from a BIS-recognised laboratory",
      "Trademark/brand details and product labels",
      "Authorized Indian Representative details (for foreign manufacturers)",
    ],
    process: [
      { name: "Free consultation", text: "Identify the applicable Indian Standard and BIS scheme (ISI, CRS, or Hallmark) for your product." },
      { name: "Product testing", text: "We coordinate sample testing at a BIS-recognised laboratory." },
      { name: "Application filing", text: "Our experts prepare and file the BIS application with test reports and documents." },
      { name: "Audit / inspection", text: "We support you through the factory audit or verification stage where applicable." },
      { name: "License granted", text: "Receive your BIS license/registration and start using the mark on your products." },
    ],
    commonMistakes: [
      "Selling covered products without mandatory BIS registration",
      "Using non-recognised labs for product testing",
      "Incomplete technical documentation causing repeated queries",
    ],
    keywords: [
      "bis certification",
      "bis registration india",
      "isi mark",
      "bis crs registration",
      "product certification india",
    ],
  },
  "International Business Setup": {
    timeline: "2–8 weeks",
    pricingNote:
      "Fees depend on the structure, RBI/regulatory approvals required, and documentation. Book a free consultation for a tailored quote.",
    benefits: [
      "Enter the Indian market through the right legal structure",
      "Full RBI, FEMA, and MCA compliance handled by experts",
      "Faster approvals through correctly prepared documentation",
      "Ongoing accounting, tax, and compliance support after setup",
    ],
    eligibility: [
      "A foreign company or investor planning operations or investment in India",
      "Sector eligible for FDI under the automatic or approval route",
      "Valid corporate documents of the parent entity, notarised/apostilled",
    ],
    documents: [
      "Certificate of incorporation of the parent/foreign company (apostilled)",
      "Board resolution authorising the India setup",
      "KYC of authorised signatories and directors",
      "Registered office proof in India",
      "Financial statements of the parent company (as applicable)",
    ],
    process: [
      { name: "Free consultation", text: "Choose the right route — subsidiary, branch office, liaison office, or project office." },
      { name: "Documentation", text: "We prepare and legalise all parent-company and KYC documents." },
      { name: "Regulatory filing", text: "Applications are filed with the RBI/AD bank and/or MCA as applicable." },
      { name: "Approvals & registration", text: "We follow up until approvals, incorporation, PAN, TAN, and GST are in place." },
      { name: "Post-setup compliance", text: "FEMA reporting, accounting, and annual compliance handled end to end." },
    ],
    commonMistakes: [
      "Choosing a branch office when a subsidiary is more tax-efficient (or vice versa)",
      "Missing FEMA reporting timelines like FC-GPR filing",
      "Improperly apostilled or notarised parent-company documents",
    ],
    keywords: [
      "foreign company registration india",
      "international business setup",
      "fdi india",
      "fema compliance",
      "india market entry",
    ],
  },
  "Other Services": {
    timeline: "Ongoing / as per scope",
    pricingNote:
      "Flexible monthly retainers or per-filing pricing based on business size and volume. Book a free consultation for a custom plan.",
    benefits: [
      "CA-backed expertise without hiring a full-time team",
      "Always-on compliance — never miss a due date",
      "Clean books and reports that are investor- and audit-ready",
      "One platform for accounting, tax, payroll, and compliance",
    ],
    eligibility: [
      "Any registered business — startup, SME, or enterprise",
      "Proprietorships and professionals are also supported",
    ],
    documents: [
      "Business PAN and registration documents",
      "Bank statements and existing books of accounts (if any)",
      "GST and tax login credentials (shared securely)",
      "Employee data for payroll services (if applicable)",
    ],
    process: [
      { name: "Free consultation", text: "We understand your business, volumes, and compliance status." },
      { name: "Scope & proposal", text: "Get a clear scope of work with transparent pricing." },
      { name: "Onboarding", text: "Secure handover of data, credentials, and past records." },
      { name: "Ongoing delivery", text: "Dedicated experts manage your filings, books, and reports with regular updates." },
    ],
    commonMistakes: [
      "Maintaining books only at year-end instead of monthly",
      "Missing TDS/GST due dates and paying interest and late fees",
      "No reconciliation between books, GST returns, and bank statements",
    ],
    keywords: [
      "accounting services india",
      "virtual cfo",
      "tax consultant india",
      "ca services online",
      "business compliance services",
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export const SERVICES: ServiceSeoEntry[] = [
  // ---------- Company Registration ----------
  {
    slug: "company-registration",
    name: "Company Registration",
    category: "Company Registration",
    description:
      "Company registration is the legal process of incorporating a business with the Ministry of Corporate Affairs (MCA) in India, giving it a separate legal identity, limited liability, and the ability to raise funding. Finovert handles the entire process online in 7–15 working days.",
    keywords: ["register a company in india", "new company registration", "mca company registration"],
  },
  {
    slug: "private-limited-company-registration",
    name: "Private Limited Company Registration",
    category: "Company Registration",
    description:
      "A Private Limited Company is India's most popular business structure for startups, offering limited liability, easy fundraising, and high credibility. It requires a minimum of 2 directors and 2 shareholders, and Finovert registers it end to end with the MCA.",
    keywords: ["pvt ltd registration", "private limited company", "pvt ltd company registration online"],
  },
  {
    slug: "public-limited-company-registration",
    name: "Public Limited Company Registration",
    category: "Company Registration",
    description:
      "A Public Limited Company can raise capital from the public and list on stock exchanges. It requires a minimum of 3 directors and 7 shareholders. Finovert manages the complete incorporation, from name approval to Certificate of Incorporation.",
    keywords: ["public limited company", "public company registration india"],
  },
  {
    slug: "llp-registration",
    name: "LLP Registration",
    category: "Company Registration",
    description:
      "A Limited Liability Partnership (LLP) combines the flexibility of a partnership with limited liability protection, with lower compliance than a private limited company. Finovert registers your LLP with the MCA, including the LLP agreement, in 7–15 working days.",
    keywords: ["llp registration online", "limited liability partnership", "llp company registration"],
  },
  {
    slug: "partnership-firm-registration",
    name: "Partnership Firm Registration",
    category: "Company Registration",
    description:
      "A Partnership Firm is a simple structure where two or more partners share profits under a partnership deed governed by the Indian Partnership Act, 1932. Finovert drafts your deed and registers the firm with the Registrar of Firms.",
    keywords: ["partnership firm", "partnership deed registration", "register partnership firm india"],
  },
  {
    slug: "sole-proprietorship-registration",
    name: "Sole Proprietorship Registration",
    category: "Company Registration",
    description:
      "A Sole Proprietorship is the simplest way for a single owner to start a business in India, established through registrations like GST, MSME/Udyam, and Shop & Establishment. Finovert sets it up quickly with all the licenses you need.",
    keywords: ["sole proprietorship", "proprietorship registration", "single owner business registration"],
  },
  {
    slug: "one-person-company-registration",
    name: "One Person Company (OPC) Registration",
    category: "Company Registration",
    description:
      "A One Person Company (OPC) lets a single founder enjoy limited liability and corporate status with just one director and one nominee. Finovert incorporates your OPC with the MCA, including PAN, TAN, and post-incorporation support.",
    keywords: ["opc registration", "one person company", "single person company registration"],
  },
  {
    slug: "startup-india-registration",
    name: "Startup India Registration",
    category: "Company Registration",
    description:
      "Startup India (DPIIT) recognition gives eligible startups tax exemptions under Section 80-IAC, easier compliance, IPR fast-tracking, and access to government funds. Finovert prepares your application and pitch documentation for DPIIT recognition.",
    keywords: ["startup india registration", "dpiit recognition", "startup india certificate"],
  },
  {
    slug: "startup-registration",
    name: "Startup Registration",
    category: "Company Registration",
    description:
      "Startup registration covers everything a new venture needs to launch legally in India — entity incorporation, GST, MSME, and DPIIT recognition. Finovert bundles it all so founders can focus on building, not paperwork.",
    keywords: ["startup registration india", "register a startup", "new business registration"],
  },
  {
    slug: "nidhi-company-registration",
    name: "Nidhi Company Registration",
    category: "Company Registration",
    description:
      "A Nidhi Company is an NBFC-type public company that borrows from and lends only to its members, promoting savings. It needs 7 shareholders and 3 directors, with ₹10 lakh minimum capital. Finovert manages incorporation and NDH compliance.",
    keywords: ["nidhi company", "nidhi company registration online", "mutual benefit company"],
  },
  {
    slug: "microfinance-company-registration",
    name: "Microfinance Company Registration",
    category: "Company Registration",
    description:
      "A Microfinance Company provides small loans to low-income groups. It can be set up as an NBFC-MFI (RBI licensed) or a Section 8 microfinance company without RBI approval. Finovert helps you choose and register the right model.",
    keywords: ["microfinance company registration", "section 8 microfinance", "nbfc mfi registration"],
  },
  {
    slug: "producer-company-registration",
    name: "Producer Company Registration",
    category: "Company Registration",
    description:
      "A Producer Company is owned by farmers or producers to improve income through collective production, harvesting, and marketing. It requires 10 producer members or 2 producer institutions and 5 directors. Finovert handles the complete MCA process.",
    keywords: ["producer company", "farmer producer company", "fpc registration"],
  },
  {
    slug: "indian-subsidiary-registration",
    name: "Indian Subsidiary Registration",
    category: "Company Registration",
    description:
      "An Indian Subsidiary lets a foreign company own and operate a business in India, usually as a private limited company under the automatic FDI route. Finovert manages incorporation, FEMA reporting, and post-setup compliance end to end.",
    keywords: ["indian subsidiary", "subsidiary company india", "foreign subsidiary registration india"],
  },
  {
    slug: "foreign-subsidiary-company-registration",
    name: "Foreign Subsidiary Company Registration",
    category: "Company Registration",
    description:
      "Foreign Subsidiary Company registration enables an overseas parent to establish a wholly or partly owned Indian company with full FDI and FEMA compliance. Finovert handles apostilled documentation, incorporation, RBI reporting, and tax registrations.",
    keywords: ["foreign subsidiary company", "wholly owned subsidiary india", "foreign parent company india"],
  },
  {
    slug: "foreign-company-registration",
    name: "Foreign Company Registration",
    category: "Company Registration",
    description:
      "Foreign Company registration covers all routes for an overseas business to operate in India — subsidiary, branch office, liaison office, or project office. Finovert advises the optimal route and executes registration with the MCA and RBI.",
    keywords: ["foreign company registration india", "foreign business in india", "india entry for foreign company"],
  },

  // ---------- NGO ----------
  {
    slug: "section-8-company-registration",
    name: "Section 8 Company Registration",
    category: "NGO",
    description:
      "A Section 8 Company is a non-profit company registered under the Companies Act for charitable, educational, or social objectives, with the highest credibility among NGO structures. Finovert manages the license and incorporation with the MCA.",
    keywords: ["section 8 company", "section 8 ngo registration", "non profit company india"],
  },
  {
    slug: "trust-registration",
    name: "Trust Registration",
    category: "NGO",
    description:
      "Trust registration creates a legal charitable trust under the Indian Trusts Act / state acts through a registered trust deed, ideal for running charitable activities, schools, or temples. Finovert drafts the deed and completes sub-registrar registration.",
    keywords: ["trust registration online", "charitable trust deed", "public trust registration"],
  },
  {
    slug: "society-registration",
    name: "Society Registration",
    category: "NGO",
    description:
      "Society registration under the Societies Registration Act, 1860 creates a member-based non-profit for charitable, literary, or scientific purposes, requiring at least 7 members. Finovert drafts the MoA and bylaws and registers with the Registrar of Societies.",
    keywords: ["society registration", "societies registration act", "register a society india"],
  },
  {
    slug: "ngo-registration",
    name: "NGO Registration",
    category: "NGO",
    description:
      "NGO registration gives your social initiative a legal identity as a trust, society, or Section 8 company, enabling donations, grants, and tax exemptions. Finovert helps you pick the right structure and registers it end to end.",
    keywords: ["ngo registration online", "register ngo india", "non profit organisation registration"],
  },
  {
    slug: "80g-registration",
    name: "80G Registration",
    category: "NGO",
    description:
      "80G registration allows donors to claim tax deductions on donations to your NGO, dramatically improving fundraising. Finovert files Form 10A/10AB with the Income Tax Department and manages the entire approval process.",
    keywords: ["80g registration", "80g certificate", "donation tax exemption ngo"],
  },
  {
    slug: "12a-registration",
    name: "12A Registration",
    category: "NGO",
    description:
      "12A registration exempts your NGO's income from income tax, making it essential for every trust, society, and Section 8 company. Finovert prepares and files the application and handles departmental follow-ups until approval.",
    keywords: ["12a registration", "12a certificate ngo", "ngo income tax exemption"],
  },
  {
    slug: "fcra-registration",
    name: "FCRA Registration",
    category: "NGO",
    description:
      "FCRA registration under the Foreign Contribution (Regulation) Act permits NGOs to legally receive foreign donations. It requires a 3-year track record (or prior permission route). Finovert manages the FC-3 application and SBI FCRA account setup.",
    keywords: ["fcra registration", "foreign funding ngo", "fc-3 application"],
  },
  {
    slug: "ngo-annual-compliance",
    name: "NGO Annual Compliance",
    category: "NGO",
    description:
      "NGO annual compliance includes ITR-7 filing, audit reports (Form 10B/10BB), FCRA returns, and renewals of 80G/12A — all mandatory to keep exemptions alive. Finovert manages your NGO's complete compliance calendar.",
    keywords: ["ngo compliance", "itr 7 filing", "ngo annual filing", "form 10b audit"],
  },
  {
    slug: "csr-registration",
    name: "CSR Registration",
    category: "NGO",
    description:
      "CSR registration (Form CSR-1) allows NGOs to receive Corporate Social Responsibility funds from companies. It requires an existing 80G and 12A registration. Finovert files your CSR-1 and gets your unique CSR registration number.",
    keywords: ["csr registration", "csr-1 filing", "csr funding for ngo"],
  },
  {
    slug: "charitable-trust-registration",
    name: "Charitable Trust Registration",
    category: "NGO",
    description:
      "Charitable Trust registration establishes a public trust dedicated to relief, education, healthcare, or community welfare through a registered trust deed. Finovert drafts, notarises, and registers your trust and then secures PAN, 80G, and 12A.",
    keywords: ["charitable trust registration", "public charitable trust", "trust deed registration"],
  },

  // ---------- Licenses & Certifications ----------
  {
    slug: "iso-certification",
    name: "ISO Certification",
    category: "Licenses & Certifications",
    description:
      "ISO certification (like ISO 9001, 14001, 27001) demonstrates that your business meets international standards for quality, environment, or information security. Finovert manages documentation, audit coordination, and certification.",
    keywords: ["iso certification india", "iso 9001", "iso 27001", "iso certificate online"],
  },
  {
    slug: "msme-registration",
    name: "MSME Registration",
    category: "Licenses & Certifications",
    description:
      "MSME (Udyam) registration gives micro, small, and medium enterprises access to subsidised loans, protection against delayed payments, and government scheme benefits. Finovert completes your Udyam registration the same day.",
    keywords: ["msme registration", "udyam registration", "msme certificate online"],
    timeline: "1–2 working days",
  },
  {
    slug: "import-export-code",
    name: "Import Export Code (IEC)",
    category: "Licenses & Certifications",
    description:
      "The Import Export Code (IEC) is a 10-digit code from DGFT that is mandatory for any import or export business in India. Finovert obtains your IEC quickly with lifetime validity and no renewal hassle.",
    keywords: ["iec code", "import export code registration", "dgft iec online"],
    timeline: "2–5 working days",
  },
  {
    slug: "shop-establishment-license",
    name: "Shop & Establishment License",
    category: "Licenses & Certifications",
    description:
      "The Shop & Establishment License is a state labour-department registration mandatory for shops, offices, and commercial establishments, covering working hours and employee rights. Finovert registers your establishment in your state.",
    keywords: ["shop and establishment license", "gumasta license", "shop act registration"],
  },
  {
    slug: "professional-tax-registration",
    name: "Professional Tax Registration",
    category: "Licenses & Certifications",
    description:
      "Professional Tax registration is mandatory for employers and professionals in many Indian states, covering PTEC and PTRC registrations and monthly deductions. Finovert registers you and manages ongoing PT return filings.",
    keywords: ["professional tax registration", "ptec ptrc", "professional tax online"],
  },
  {
    slug: "drug-license",
    name: "Drug License",
    category: "Licenses & Certifications",
    description:
      "A Drug License from the State/Central Drug Authority is mandatory to manufacture, sell, or distribute pharmaceuticals — retail (Form 20/21) or wholesale (Form 20B/21B). Finovert manages premises documentation, applications, and inspections.",
    keywords: ["drug license india", "retail drug license", "wholesale drug license", "pharmacy license"],
    timeline: "30–60 working days",
  },
  {
    slug: "digital-signature-certificate",
    name: "Digital Signature Certificate (DSC)",
    category: "Licenses & Certifications",
    description:
      "A Digital Signature Certificate (Class 3 DSC) is required to sign MCA, GST, income tax, and tender filings electronically in India. Finovert issues DSCs with same-day processing and doorstep token delivery.",
    keywords: ["digital signature certificate", "class 3 dsc", "dsc online"],
    timeline: "Same day – 2 working days",
  },
  {
    slug: "gst-registration",
    name: "GST Registration",
    category: "Licenses & Certifications",
    description:
      "GST registration is mandatory for businesses crossing the turnover threshold (₹40 lakh for goods, ₹20 lakh for services in most states) or selling online. Finovert gets your GSTIN in 3–7 days and supports ongoing return filing.",
    keywords: ["gst registration online", "gstin", "gst number apply", "gst consultant"],
    timeline: "3–7 working days",
  },
  {
    slug: "trademark-registration",
    name: "Trademark Registration",
    category: "Licenses & Certifications",
    description:
      "Trademark registration protects your brand name, logo, or slogan across India for 10 years (renewable), giving you exclusive rights and ™/® usage. Finovert runs the search, files the application, and handles objections.",
    keywords: ["trademark registration india", "brand registration", "logo trademark", "tm registration online"],
    timeline: "1–3 days to file; 6–18 months to registration",
  },

  // ---------- FSSAI ----------
  {
    slug: "fssai-basic-registration",
    name: "FSSAI Basic Registration",
    category: "FSSAI Registration",
    description:
      "FSSAI Basic Registration is for small food businesses with annual turnover up to ₹12 lakh — petty retailers, home kitchens, and small manufacturers. Finovert files your Form A on FoSCoS and delivers your 14-digit registration fast.",
    keywords: ["fssai basic registration", "food registration small business", "fssai for home kitchen"],
    timeline: "7–10 working days",
  },
  {
    slug: "fssai-state-license",
    name: "FSSAI State License",
    category: "FSSAI Registration",
    description:
      "The FSSAI State License is required for food businesses with turnover between ₹12 lakh and ₹20 crore, including mid-size manufacturers, restaurants, and storage units. Finovert prepares Form B and all annexures for a smooth approval.",
    keywords: ["fssai state license", "food license state", "fssai license for restaurant"],
    timeline: "15–30 working days",
  },
  {
    slug: "fssai-central-license",
    name: "FSSAI Central License",
    category: "FSSAI Registration",
    description:
      "The FSSAI Central License applies to food businesses with turnover above ₹20 crore, importers/exporters, e-commerce operators, and multi-state chains. Finovert manages the complete central licensing process on FoSCoS.",
    keywords: ["fssai central license", "food import license", "central food license india"],
    timeline: "30–60 working days",
  },
  {
    slug: "fssai-license-renewal",
    name: "FSSAI License Renewal",
    category: "FSSAI Registration",
    description:
      "FSSAI licenses must be renewed before expiry — late renewal attracts a daily penalty and an expired license means stopping operations. Finovert tracks your validity and renews your license for 1–5 years without disruption.",
    keywords: ["fssai renewal online", "food license renewal", "fssai license expiry"],
    timeline: "7–15 working days",
  },
  {
    slug: "fssai-license-modification",
    name: "FSSAI License Modification",
    category: "FSSAI Registration",
    description:
      "FSSAI License Modification updates your existing license for changes in address, products, capacity, or ownership details. Finovert files the modification on FoSCoS so your license always reflects your current operations.",
    keywords: ["fssai modification", "change fssai license details", "fssai address change"],
    timeline: "7–15 working days",
  },
  {
    slug: "food-product-approval",
    name: "Food Product Approval",
    category: "FSSAI Registration",
    description:
      "Food Product Approval is required for proprietary foods, novel ingredients, and products not covered by existing FSSAI standards. Finovert manages product dossiers, lab testing, and the FSSAI approval process.",
    keywords: ["food product approval", "fssai product approval", "proprietary food approval"],
    timeline: "30–90 working days",
  },
  {
    slug: "fssai-annual-return-filing",
    name: "FSSAI Annual Return Filing",
    category: "FSSAI Registration",
    description:
      "Every FSSAI license holder in manufacturing must file the annual return (Form D1) by 31st May each year; late filing attracts penalties per day. Finovert prepares and files your return accurately and on time.",
    keywords: ["fssai annual return", "form d1 filing", "fssai return due date"],
    timeline: "2–5 working days",
  },

  // ---------- Trade License ----------
  {
    slug: "trade-license-registration",
    name: "Trade License Registration",
    category: "Trade License",
    description:
      "A Trade License from your municipal corporation legally authorises you to carry on a trade or business at specific premises. Finovert handles the application, fees, and inspections for your city.",
    keywords: ["trade license apply", "new trade license", "municipal license business"],
  },
  {
    slug: "trade-license-renewal",
    name: "Trade License Renewal",
    category: "Trade License",
    description:
      "Trade licenses must be renewed annually (typically January–March window) to avoid late fees and legal action. Finovert renews your license on time, every year, with proactive reminders.",
    keywords: ["trade license renewal online", "renew trade license", "trade license late fee"],
    timeline: "3–10 working days",
  },
  {
    slug: "municipal-trade-license",
    name: "Municipal Trade License",
    category: "Trade License",
    description:
      "A Municipal Trade License is issued by your city's municipal corporation for trades operating within its limits, with categories for shops, factories, and food establishments. Finovert manages municipality-specific requirements across India.",
    keywords: ["municipal trade license", "corporation trade license", "city business license"],
  },
  {
    slug: "state-trade-license",
    name: "State Trade License",
    category: "Trade License",
    description:
      "Certain trades require state-level licensing beyond municipal permits, depending on the activity and state regulations. Finovert identifies and obtains the correct state trade license for your business.",
    keywords: ["state trade license", "state business license india"],
  },
  {
    slug: "trade-license-amendment",
    name: "Trade License Amendment",
    category: "Trade License",
    description:
      "A Trade License Amendment updates your existing license for changes in business name, trade category, premises, or ownership. Finovert files the amendment with the municipal authority so your license stays valid and accurate.",
    keywords: ["trade license amendment", "change trade license details", "trade license name change"],
    timeline: "5–10 working days",
  },

  // ---------- BIS ----------
  {
    slug: "bis-certification",
    name: "BIS Certification",
    category: "BIS Registration",
    description:
      "BIS certification from the Bureau of Indian Standards certifies that products conform to Indian Standards, and is mandatory for many categories such as electronics, cement, and steel. Finovert manages testing, documentation, and license grant.",
    keywords: ["bis certification online", "bureau of indian standards", "bis license india"],
  },
  {
    slug: "bis-crs-registration",
    name: "BIS CRS Registration",
    category: "BIS Registration",
    description:
      "BIS CRS (Compulsory Registration Scheme) registration is mandatory for electronics and IT products like LED lights, mobile batteries, and power adapters sold in India. Finovert coordinates lab testing and files your CRS application.",
    keywords: ["bis crs", "crs registration electronics", "compulsory registration scheme"],
  },
  {
    slug: "isi-mark-certification",
    name: "ISI Mark Certification",
    category: "BIS Registration",
    description:
      "The ISI mark certifies products conform to Indian Standards under the BIS product certification scheme and is compulsory for items like cement, packaged water, and electrical appliances. Finovert manages the complete ISI licensing process including factory audit.",
    keywords: ["isi mark", "isi certification", "isi license india"],
  },
  {
    slug: "bis-license-renewal",
    name: "BIS License Renewal",
    category: "BIS Registration",
    description:
      "BIS licenses are valid for 1–2 years and must be renewed before expiry with updated test reports and fees to keep selling certified products. Finovert tracks validity and renews your BIS license without production disruption.",
    keywords: ["bis renewal", "bis license renewal online", "renew isi license"],
    timeline: "15–30 working days",
  },
  {
    slug: "product-certification",
    name: "Product Certification",
    category: "BIS Registration",
    description:
      "Product certification validates that your product meets applicable Indian or international standards — BIS/ISI, CE, or industry-specific marks. Finovert identifies the right certification and manages testing and approval end to end.",
    keywords: ["product certification india", "product testing certification", "quality certification"],
  },
  {
    slug: "hallmark-registration",
    name: "Hallmark Registration",
    category: "BIS Registration",
    description:
      "BIS Hallmark registration is mandatory for jewellers selling gold and silver jewellery in India, certifying purity to customers. Finovert registers your jewellery outlet with BIS and guides you on HUID compliance.",
    keywords: ["hallmark registration", "bis hallmark jeweller", "gold hallmarking license"],
    timeline: "15–30 working days",
  },

  // ---------- International Business Setup ----------
  {
    slug: "branch-office-registration",
    name: "Branch Office Registration",
    category: "International Business Setup",
    description:
      "A Branch Office lets a foreign company conduct business activities in India like export/import, consultancy, and research, with RBI approval through an AD bank. Finovert manages the approval, MCA registration, and tax setup.",
    keywords: ["branch office india", "foreign branch office registration", "rbi branch office approval"],
  },
  {
    slug: "liaison-office-registration",
    name: "Liaison Office Registration",
    category: "International Business Setup",
    description:
      "A Liaison Office acts as a communication channel for a foreign company in India — it can promote business and gather market information but cannot earn income. Finovert handles RBI approval and registration end to end.",
    keywords: ["liaison office india", "representative office india", "liaison office rbi"],
  },
  {
    slug: "project-office-registration",
    name: "Project Office Registration",
    category: "International Business Setup",
    description:
      "A Project Office allows a foreign company to execute a specific project in India, typically backed by a contract with an Indian entity. Finovert sets up your project office with RBI/AD bank reporting and tax registrations.",
    keywords: ["project office india", "foreign project office", "project office rbi approval"],
  },
  {
    slug: "foreign-direct-investment",
    name: "Foreign Direct Investment (FDI)",
    category: "International Business Setup",
    description:
      "FDI advisory covers structuring investments into India under the automatic or government approval route, sectoral caps, and mandatory RBI reporting like FC-GPR. Finovert ensures your investment is fully FEMA compliant.",
    keywords: ["fdi in india", "fdi compliance", "fc-gpr filing", "foreign investment india"],
  },
  {
    slug: "fema-compliance",
    name: "FEMA Compliance",
    category: "International Business Setup",
    description:
      "FEMA compliance covers all Reserve Bank of India reporting for foreign transactions — FC-GPR, FC-TRS, ODI, ECB returns, and the annual FLA return. Finovert manages your complete FEMA calendar and filings.",
    keywords: ["fema compliance", "fema consultant", "fla return", "rbi reporting"],
    timeline: "Ongoing / per filing",
  },
  {
    slug: "international-trade-setup",
    name: "International Trade Setup",
    category: "International Business Setup",
    description:
      "International trade setup prepares your business for cross-border commerce — IEC, AD code registration, GST LUT, export incentives, and banking setup. Finovert gets you export-import ready in days.",
    keywords: ["export import setup", "international trade india", "ad code registration", "export business setup"],
    timeline: "1–2 weeks",
  },

  // ---------- Other Services ----------
  {
    slug: "virtual-cfo-services",
    name: "Virtual CFO Services",
    category: "Other Services",
    description:
      "Virtual CFO services give startups and SMEs access to senior finance leadership — budgeting, MIS, cash-flow management, fundraising support, and investor reporting — at a fraction of a full-time CFO's cost. Finovert's CA-led team acts as your finance department.",
    keywords: ["virtual cfo services", "outsourced cfo india", "cfo services for startups"],
  },
  {
    slug: "accounting-bookkeeping",
    name: "Accounting & Bookkeeping",
    category: "Other Services",
    description:
      "Professional accounting and bookkeeping keeps your books accurate, GST-reconciled, and audit-ready with monthly P&L and balance sheet reporting. Finovert manages your books on cloud software with a dedicated accountant.",
    keywords: ["accounting services", "bookkeeping services india", "online accounting for business"],
  },
  {
    slug: "payroll-management",
    name: "Payroll Management",
    category: "Other Services",
    description:
      "Payroll management covers salary processing, payslips, TDS on salaries, PF, ESI, and professional tax compliance — accurately and on time every month. Finovert runs end-to-end payroll so your team is always paid right.",
    keywords: ["payroll services india", "payroll outsourcing", "salary processing pf esi"],
  },
  {
    slug: "annual-compliance",
    name: "Annual Compliance",
    category: "Other Services",
    description:
      "Annual compliance for companies and LLPs includes ROC filings (AOC-4, MGT-7, Form 11, Form 8), ITR, audit coordination, and statutory registers. Finovert manages your complete annual calendar so you never miss a deadline.",
    keywords: ["annual compliance company", "roc annual filing", "company annual return", "llp annual compliance"],
  },
  {
    slug: "income-tax-filing",
    name: "Income Tax Filing",
    category: "Other Services",
    description:
      "Income tax filing for businesses, professionals, and individuals with CA review — the right ITR form, maximum eligible deductions, and error-free filing before the due date. Finovert files ITRs with expert review and post-filing support.",
    keywords: ["income tax filing", "itr filing online", "business itr", "tax return filing india"],
    timeline: "1–3 working days",
  },
  {
    slug: "tds-return-filing",
    name: "TDS Return Filing",
    category: "Other Services",
    description:
      "TDS return filing (24Q, 26Q, 27Q) is due quarterly for every deductor; errors cause defaults and notices. Finovert prepares, validates, and files your TDS returns and generates Form 16/16A.",
    keywords: ["tds return filing", "tds filing online", "form 24q 26q", "tds compliance"],
    timeline: "1–3 working days per quarter",
  },
  {
    slug: "roc-compliance",
    name: "ROC Compliance",
    category: "Other Services",
    description:
      "ROC compliance covers all Registrar of Companies filings — annual returns, director KYC (DIR-3), charge filings, and event-based forms like PAS-3 and SH-7. Finovert keeps your company MCA-compliant year-round.",
    keywords: ["roc compliance", "roc filing", "mca compliance", "director kyc dir-3"],
  },
  {
    slug: "business-valuation",
    name: "Business Valuation",
    category: "Other Services",
    description:
      "Business valuation determines the fair value of your company for fundraising, ESOPs, mergers, or regulatory needs, using DCF, market multiples, and NAV methods. Finovert delivers registered-valuer-backed valuation reports.",
    keywords: ["business valuation services", "company valuation india", "startup valuation report"],
    timeline: "5–10 working days",
  },
  {
    slug: "due-diligence",
    name: "Due Diligence",
    category: "Other Services",
    description:
      "Due diligence is a structured review of a company's financial, legal, tax, and compliance health before an investment, acquisition, or partnership. Finovert's experts deliver clear red-flag reports for confident decisions.",
    keywords: ["due diligence services", "financial due diligence", "legal due diligence india"],
    timeline: "1–3 weeks",
  },
];

/* ------------------------------------------------------------------ */
/* Lookup helpers & content builder                                    */
/* ------------------------------------------------------------------ */

export const SERVICE_CATEGORIES: string[] = [
  ...new Set(SERVICES.map((s) => s.category)),
];

const BY_SLUG = new Map(SERVICES.map((s) => [s.slug, s]));

function normalizeName(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

/** Find a service slug from a display name (used for internal linking). */
export function findServiceSlugByName(name: string): string | null {
  const query = normalizeName(name);
  const exact = SERVICES.find((s) => normalizeName(s.name) === query);
  if (exact) return exact.slug;
  const prefixMatches = SERVICES.filter((s) =>
    normalizeName(s.name).startsWith(query)
  ).sort((a, b) => a.name.length - b.name.length);
  return prefixMatches[0]?.slug ?? null;
}

export function getServicesByCategory(category: string): ServiceSeoEntry[] {
  return SERVICES.filter((s) => s.category === category);
}

/** Build the complete landing-page content for a service. */
export function getServiceContent(slug: string): ServiceContent | null {
  const entry = BY_SLUG.get(slug);
  if (!entry) return null;

  const defaults = CATEGORY_DEFAULTS[entry.category];
  const timeline = entry.timeline || defaults.timeline;
  const pricingNote = entry.pricingNote || defaults.pricingNote;

  const faqs: ServiceFAQ[] = [
    {
      question: `What is ${entry.name}?`,
      answer: entry.description,
    },
    {
      question: `How long does ${entry.name} take in India?`,
      answer: `${entry.name} typically takes ${timeline} with Finovert, provided all documents are in order. Our experts track your application and keep you updated at every stage.`,
    },
    {
      question: `What documents are required for ${entry.name}?`,
      answer: `Commonly required documents include: ${defaults.documents.slice(0, 4).join("; ")}. Our team shares a precise checklist for your case during the free consultation.`,
    },
    {
      question: `How much does ${entry.name} cost?`,
      answer: pricingNote,
    },
    {
      question: `Can I complete ${entry.name} online through Finovert?`,
      answer: `Yes. Finovert handles ${entry.name} 100% online — document collection, drafting, government filing, and follow-ups — with CA-backed expert support. Book a free consultation to get started.`,
    },
    ...(entry.extraFaqs ?? []),
  ];

  const related = SERVICES.filter(
    (s) => s.category === entry.category && s.slug !== entry.slug
  ).slice(0, 6);

  const metaTitle = `${entry.name} in India | Process, Documents, Fees | Finovert`;
  const metaDescription =
    entry.description.length > 158
      ? `${entry.description.slice(0, 155)}...`
      : entry.description;

  return {
    ...entry,
    timeline,
    pricingNote,
    benefits: defaults.benefits,
    eligibility: defaults.eligibility,
    documents: defaults.documents,
    process: defaults.process,
    commonMistakes: defaults.commonMistakes,
    faqs,
    related,
    metaTitle,
    metaDescription,
    allKeywords: [
      entry.name.toLowerCase(),
      `${entry.name.toLowerCase()} online`,
      `${entry.name.toLowerCase()} in india`,
      ...(entry.keywords ?? []),
      ...defaults.keywords,
    ],
  };
}
