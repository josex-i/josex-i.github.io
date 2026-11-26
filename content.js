/* =====================================================================
   EDIT THIS FILE: it holds ALL the words, links and pictures on your site.
   You never need to touch index.html, styles.css or script.js.

   Rules: keep the "quotes" around text and the commas at line ends.
   Anything left as "" (empty) is hidden on the site.
   Figures are as at 13 October 2026 (from the live workbooks).
   ===================================================================== */

const CONTENT = {
  /* ---------- 1. ABOUT YOU ---------- */
  name: "Joseph Omondi Otieno",
  initials: "JO",
  heroFirst: "JOSEPH",          // big outlined word at the top
  heroLast: "OTIENO",           // big solid word at the top
  heroDisplay: "Joseph Otieno",  // the big italic name at the bottom of the hero
  heroRole: "Finance & Administration",
  heroLine: "Counting, banking, reconciling and reporting a cathedral's money, with Excel toolkits I designed to keep every figure right.",
  role: "Bookkeeper / Treasurer · Administrative Secretary",
  headline: "I keep a cathedral's money counted, banked, reconciled and reported, to the shilling.",
  intro:
    "Bookkeeper and Administrative Secretary at St. Theresa's Cathedral, Kibuye (Archdiocese of Kisumu), " +
    "one of the largest Catholic cathedrals in Western Kenya, serving about 2,000 people each Sunday. " +
    "I count the parish's cash, prepare all of its financial reports and design the Excel toolkits that keep the figures right. " +
    "CAMS graduate (KASNEB) with QuickBooks experience.",
  location: "Kisumu, Kenya",
  portrait: "assets/photos/headshot-cutout.png",   // transparent background version
  cv: "",                       // put a CV PDF in assets/docs and write e.g. "assets/docs/Joseph-Omondi-Otieno-CV.pdf"
  availability: "Open to finance & administration roles",

  /* Headline numbers (hero) */
  stats: [
    { value: "116%", label: "Roof appeal vs. the KSh 1M target I set" },
    { value: "10 / 10", label: "Ledger integrity checks passing" },
    { value: "10 min", label: "Weekly report, down from 30–35" },
    { value: "19,017", label: "M-Pesa payments reconciled in 12 months" },
  ],
  ticker: [
    "ROOF APPEAL KSh 1,161,928", "TARGET REACHED 116%", "VARIANCE KSh 0",
    "INTEGRITY CHECKS 10/10 PASS", "PAYBILL ROWS SORTED 2,478", "QUOTATIONS TRACKED KSh 6,902,897",
    "ARREARS MADE VISIBLE KSh 1,230,500", "DOUBLE COUNT PREVENTED KSh 224,880", "TOOLKITS IN USE 15",
  ],

  about: [
    "I sit where money, records and people meet. I count every collection myself, bank it, reconcile it against M-Pesa and the bank statement, and report weekly to the Cathedral Administrator, who approves every payment from my figures.",
    "Hand-built documents were slow and easy to get wrong, so I designed a family of Excel toolkits to replace them. I decide what each one must record, check and print; Claude AI writes the formulas and VBA to my specification; I test every result against real cash counts and bank records, and I run them with live data every week.",
    "Alongside finance, I run the cathedral office, which receives visiting bishops, the Apostolic Nuncio and senior government officials, and I have led audio-visual production and ICT for the parish since 2019.",
  ],

  /* ---------- 2. CONTACT ---------- */
  contact: {
    email: "omondijose58@gmail.com",
    phone: "+254 740 339 124",
    linkedin: "https://www.linkedin.com/in/joseph-omondi-otieno",
    youtube: "https://www.youtube.com/@TheSpectorPodcast",
    github: "",
    whatsapp: "",
  },

  /* ---------- 3. CORE COMPETENCIES ---------- */
  expertise: [
    {
      id: "finance", title: "Finance",
      summary: "Cash control, reconciliation and reporting.",
      skills: ["Cash counting & banking", "M-Pesa Paybill vs. bank reconciliation", "Weekly & monthly income and expenditure", "Budget monitoring, projected vs. actual", "Payroll schedule: NSSF, NITA, Housing Levy", "Receivables aging & arrears control"],
      tools: ["Excel + VBA", "QuickBooks", "M-Pesa Paybill"],
    },
    {
      id: "admin", title: "Administration",
      summary: "Running a busy cathedral office.",
      skills: ["Office management for the resident priest", "Hosting bishops, the Nuncio & officials", "Contractor quotations & procurement records", "Stall rent register (43 stalls)", "Reports to the Parish Pastoral Council"],
      tools: ["Word", "Excel", "PDF"],
    },
    {
      id: "visual", title: "Audio-visual & ICT",
      summary: "Production for five Sunday Masses.",
      skills: ["AV lead for five Sunday Masses", "Outdoor worship under tents during 2025 construction", "Event video & photography", "Sole ICT support for the parish office", "Website design (cathedral site)"],
      tools: ["Canon EOS 60D", "Linux", "Networking"],
    },
    {
      id: "ai", title: "AI-assisted building",
      summary: "Specify, test, operate.",
      skills: ["Writing precise specifications for AI tools", "Testing outputs against real cash & bank records", "Turning manual documents into searchable systems"],
      tools: ["Claude AI", "ChatGPT", "Google Gemini"],
    },
  ],

  /* ---------- 4. CASE STUDIES (the centrepiece) ----------
     exhibit: optional screenshot in assets/exhibits (names already removed). */
  caseStudies: [
    {
      code: "01", name: "Kibuye Parish Finance Toolkit", area: "Excel + VBA · Mission & PPC accounts",
      result: "KSh 224,880 double count prevented",
      problem: "Each kind of money lived in its own workbook: weekly statements, tithe, brown envelopes, stipend, stall rent and the budget. The same figure was typed in several places and the budget was updated by hand.",
      does: ["Seven entry forms, each entry saved once and reloadable", "Eight reports for the parish priest, print or PDF in one click", "M-Pesa statement import, sorted to income lines by keyword, duplicates left out", "Every entry posts live to the budget and dashboard", "Search, pre-print checks and an automatic daily backup"],
      outcome: "Holds 295 expense lines, 369 stipend lines and 2,478 Paybill rows, and tracks Mission income at 87.8% of projection. Its checks caught 16 register lines worth KSh 224,880 already in the stipend, so nothing was counted twice.",
      role: "I designed how money flows from entry to report to budget. Claude AI wrote the formulas and about 1,100 lines of VBA to my specification. I enter every record and check every report.",
      exhibit: "assets/exhibits/finance-toolkit-checks.png", exhibitCaption: "Checks run before every report",
    },
    {
      code: "02", name: "Weekly Income & Expenditure + Monthly Consolidation", area: "Excel · Mission Account",
      result: "Report time cut to 10 min",
      problem: "Monthly totals meant adding weekly files by hand, where one wrong formula could carry through unseen.",
      does: ["One tab per week, about 37 income sources", "Cash at hand calculated; my count must agree with it", "Monthly summary linked live to every week", "A completeness check that must read zero"],
      outcome: "Weekly report preparation fell from 30–35 minutes to 10, printing included. Building the August summary exposed a formula counting the Paybill subtotal twice: cash at hand showed −KSh 260,990 when the correct figure was KSh 50,753.",
      role: "I count the collections, key every week and present the statement. The Administrator decides payments from it.",
    },
    {
      code: "03", name: "Stall Rent Ledger", area: "Excel · 43 market stalls",
      result: "KSh 1,230,500 arrears made visible",
      problem: "Rent for 43 stalls was kept in Word documents. Nobody could see who owed what, or for how long.",
      does: ["Chart of accounts, general ledger, trial balance", "Receivables aging and an arrears watchlist", "Executive brief for the Parish Pastoral Council", "10 tie-out checks: every figure built two ways"],
      outcome: "All 10 checks pass. 64.9% of 2026 rent collected to date, and the full KSh 1,230,500 still owed was shown to the council, stall by stall, for the first time.",
      role: "I specified the ledger, built the tenant register, entered all the data and report to the council.",
      exhibit: "assets/exhibits/stall-ledger-integrity-checks.png", exhibitCaption: "Integrity & audit checks: 10 of 10 pass",
    },
    {
      code: "04", name: "Tithe Envelopes", area: "Excel · monthly tithe Sunday",
      result: "5 months banked with nil variance",
      problem: "Tithe arrives in named and nameless envelopes and through Paybill. The priest needs one figure, and the bank deposit must match the count.",
      does: ["12 pre-dated count sheets", "Priest's report rewrites itself for any month", "Bank slip: notes banked, coins recorded", "Each month marked RECONCILED, VARIANCE or NOT BANKED"],
      outcome: "KSh 4,560,101 tithe recorded January–October 2026, 78% through Paybill. From June to October every note counted was banked, with nil variance.",
      role: "I count the envelopes, bank the notes, enter every figure and present the report.",
    },
    {
      code: "05", name: "Cathedral Budget: Projected vs. Actual", area: "Excel · 159 lines, two accounts",
      result: "Tracked line by line all year",
      problem: "The annual budget sat apart from actual figures, so nobody could tell mid-year how income and spending were tracking.",
      does: ["Mission (91 lines) and PPC (68 lines), January–December", "Actuals posted monthly from statements, stipend and stall ledger", "Plain-language summary: green for good news, red for bad"],
      outcome: "Combined 2026 projection of KSh 80.7M income against KSh 80.3M expenditure, tracked line by line. 87% of Mission income received by October.",
      role: "I extended both accounts through December, fixed the formula errors and post every actual.",
    },
    {
      code: "06", name: "Fundraising Appeal Trackers", area: "Excel · roof & tiles appeals",
      result: "116% of target · KSh 0 variance",
      problem: "Money for the rectory roof came through five Sunday Masses, weekday Sadaka and Paybill, and the congregation wanted progress every week.",
      does: ["Mass-by-mass entry, Paybill vs. cash", "Denomination counts feed the registers, nothing typed twice", "Dashboard driven by two inputs: price per sheet and target", "Variance line that must read nil before any report"],
      outcome: "KSh 1,161,928 raised against the KSh 1,000,000 target I set: 116%, or 1,161 Decra sheets. The design was reused for the Tiles Appeal, which raised KSh 336,235 in its first eight days.",
      role: "I set the target, counted and banked all the cash, checked every Paybill transaction and gave the weekly updates.",
      exhibit: "assets/exhibits/roof-appeal-dashboard.png", exhibitCaption: "Roof renovation appeal: campaign dashboard",
    },
    {
      code: "07", name: "Contractor Quotations System", area: "Excel + VBA · procurement",
      result: "27 quotes · KSh 6.9M tracked to payment",
      problem: "Contractors sent quotations as separate files in their own layouts. Finding one or checking what was unpaid meant opening file after file.",
      does: ["One-click save with automatic numbering (QT-2026-0001)", "Print on the contractor's letterhead with a PDF in the same step", "Search by contractor, job, status or date", "Arithmetic check flags quantity × rate mismatches"],
      outcome: "27 quotations and 395 item lines worth KSh 6,902,897, all recorded as paid with a nil balance.",
      role: "I specified the workflow, moved every original file into the system and keep each status current.",
      exhibit: "assets/exhibits/quotations-dashboard.png", exhibitCaption: "Quotations dashboard (contractor names replaced A–E)",
    },
    {
      code: "08", name: "Stipend & Bills", area: "Excel · monthly payroll & utilities",
      result: "Every line traceable to its cheque",
      problem: "Salaries, statutory deductions, utilities and allowances were listed by hand each month, with no running view of billed against paid.",
      does: ["Utilities, salaries, allowances, clergy allowances, additional payments", "NSSF employer contribution, NITA levy, Housing Levy", "Billed, paid by cheque and outstanding, every month"],
      outcome: "KSh 6,414,128 billed and KSh 4,855,906 paid by cheque, January–September 2026, every line traceable to its cheque.",
      role: "I prepare the schedule each month and record each cheque; cheques are signed by the authorised signatories.",
    },
  ],

  /* Dashboard figures for each case study, keyed by its code.
     kpis = headline tiles · meter = one % bar · bars = one small bar chart */
  dashboards: {
    "01": { kpis: [["7", "entry forms"], ["8", "reports for the priest"], ["2,478", "Paybill rows sorted"], ["KSh 224,880", "double count prevented"]],
            meter: { label: "Mission income vs. 2026 projection", pct: 87.8, note: "KSh 16.45M of 18.74M" } },
    "02": { kpis: [["10 min", "per weekly report (was 30–35)"], ["~37", "income sources a week"], ["KSh 260,990", "source error exposed"]],
            bars: { title: "Monthly income, Mission account", unit: "KSh", data: [["Aug (5 wks)", 2213923], ["Sep", 1600148]] } },
    "03": { kpis: [["43", "stalls on the ledger"], ["10 / 10", "integrity checks pass"], ["KSh 1,230,500", "arrears made visible"]],
            meter: { label: "2026 rent collected to date", pct: 64.9, note: "KSh 2.28M of 3.51M due" } },
    "04": { kpis: [["KSh 4.56M", "tithe, Jan–Oct 2026"], ["5 months", "banked with nil variance"], ["12", "pre-dated count sheets"]],
            meter: { label: "Tithe received through Paybill", pct: 78, note: "the rest in envelopes" } },
    "05": { kpis: [["159", "budget lines"], ["2", "accounts: Mission & PPC"], ["KSh 80.7M", "income projected for 2026"]],
            meter: { label: "Mission income received by October", pct: 87, note: "tracked line by line" } },
    "06": { kpis: [["KSh 1,161,928", "raised for the roof"], ["1,161", "Decra sheets funded"], ["KSh 0", "variance"], ["KSh 336,235", "tiles appeal, first 8 days"]],
            meter: { label: "Roof appeal vs. KSh 1,000,000 target", pct: 116.2, note: "target passed" },
            bars: { title: "Where the roof money came from", unit: "KSh", data: [["Sunday Masses", 1052838], ["Weekday Sadaka", 109090]] } },
    "07": { kpis: [["27", "quotations registered"], ["395", "item lines"], ["KSh 6.9M", "works tracked to payment"], ["KSh 0", "balance unpaid"]],
            bars: { title: "Quotations registered per month, 2026", unit: "", data: [["Mar", 13], ["Apr", 5], ["May", 1], ["Jun", 1], ["Jul", 3], ["Aug", 1], ["Sep", 1], ["Oct", 2]] } },
    "08": { kpis: [["KSh 6.41M", "billed, Jan–Sep 2026"], ["KSh 4.86M", "paid by cheque"], ["3", "statutory deductions"]],
            meter: { label: "Bills paid by cheque vs. billed", pct: 75.7, note: "every line traceable to its cheque" } },
  },

  /* ---------- FILMS (Google Drive videos; each must be shared as "Anyone with the link") ---------- */
  films: [
    { id: "1Et_isAUNUVD9XtQwAe4Kb1ncZnZJMY8Y", title: "The Upriser", note: "Taekwondo tournament coverage" },
    { id: "1N41iroiaGLKeuxLlFVFPzeQcSH9mu18J", title: "St. Charles Lwanga Secondary School", note: "School feature" },
    { id: "1egX0rsHbaJr1X_xFKYcUoyRNUpqpLumt", title: "Jaramogi Oginga Odinga Teaching & Referral Hospital", note: "Hospital feature" },
  ],

  furtherWork: [
    { title: "M-Pesa Paybill Reconciliation", text: "Reads the SMS backup, removes duplicates, sorts 898 spellings of account names into income lines and compares each month with the bank.", figure: "19,017 payments · KSh 9.05M" },
    { title: "Brown Envelope Collections", text: "Count log by denomination and a bank slip that writes the amount in words.", figure: "KSh 499,809 · six counts" },
    { title: "Church Dues & SAWO Registers", text: "Three linked workbooks for 52 Small Christian Communities, part payments flagged in amber.", figure: "1,497 members" },
    { title: "Parish Annual Expenditure Budget", text: "Six departments and 43 lines, each costed from unit price, quantity and period.", figure: "KSh 8.2M" },
  ],

  /* Built into the toolkits */
  controls: [
    { title: "Guided entry", text: "Forms with pick lists and validation, so figures go in once, correctly." },
    { title: "Checks before printing", text: "Mismatches, unbanked cash and missing lines are flagged before a report goes out." },
    { title: "Tie-outs", text: "Key totals are built two ways and must agree to the shilling." },
    { title: "Daily backup", text: "A dated backup copy is saved automatically." },
    { title: "Audit trail", text: "A change log records who changed what, and when." },
    { title: "One-click reports", text: "Print or PDF, amounts in words, ready to sign." },
  ],
  workbooksNote: "Original workbooks can be shown at interview, with personal details hidden. Names of members, tenants, contractors, staff and donors are withheld here.",

  /* Administration highlights (counts only, no personal data) */
  admin: [
    { value: "40", label: "Sunday & feast-day announcements written in 2026" },
    { value: "16", label: "Recommendation letters: schools, universities, banks, SACCOs and sponsors" },
    { value: "11", label: "Sets of meeting minutes: councils, associations, choir and Small Christian Communities" },
    { value: "19", label: "Marriage files in 2026: banns, registers & letters to the Attorney" },
    { value: "3", label: "Sacrament ceremonies prepared in November 2026: adult baptism, First Holy Communion and confirmation (candidate lists, budgets and reports)" },
    { value: "2026", label: "ADOK parish & deanery elections: election forms, guidelines and returns" },
    { value: "27", label: "Contractor quotations registered for the 2026 renovation works" },
    { value: "43", label: "Market stalls on the rent register I built" },
    { value: "3", label: "Countries' bishops hosted (Uganda, Rwanda, Nigeria), plus the Apostolic Nuncio" },
  ],
  adminAlso: ["Death announcements to neighbouring parishes", "Harambee invitation letters & guest register", "Bank signatory change letters", "Holy Week & Corpus Christi programmes", "Department handover reports", "Catechist programmes & allowances"],

  /* ---------- 5. MEDIA & VISUAL ---------- */
  media: {
    company: "Assistant camera operator",
    featureNote: "capturing a live liturgical event for editing, April 2022",
    blurb: "I started behind the camera as an assistant camera operator, capturing live events for the edit. Today I run the cathedral's sound and video desk for Sunday Masses and big celebrations, and I cover live liturgies on camera.",
    feature: "assets/photos/on-set-01.jpg",
  },

  /* The cathedral's sound & video desk (shown as captioned cards) */
  avTitle: "The sound & video desk I run",
  avPhotos: [
    { src: "assets/av/live-coverage.jpg", caption: "Covering a live liturgy celebrated by the Archdiocese of Kisumu's priests and two bishops" },
    { src: "assets/av/sound-desk.jpg", caption: "At the desk: Midas M32 digital console and the TASSO equipment rack" },
    { src: "assets/av/midas-console.jpg", caption: "Midas M32 digital mixing console" },
    { src: "assets/av/midas-rear.jpg", caption: "Rear of the Midas M32: microphone inputs and speaker outputs" },
    { src: "assets/av/equipment-rack.jpg", caption: "TASSO wireless-mic receivers, MagnImage LED screen processor, 8-channel power control and DSP controller" },
    { src: "assets/av/amplifiers.jpg", caption: "Three TASSO PA3250 four-channel amplifiers driving the cathedral speakers" },
    { src: "assets/av/team.jpg", caption: "With the TASSO engineers, a colleague and the contractor in the control room" },
  ],
  projects: [
    {
      title: "St. Theresa's Cathedral Website",
      category: "visual",
      image: "assets/projects/cathedral-website.png",
      description: "Designed and built a modern, mobile-friendly website for the cathedral: Mass times, office hours, contacts and directions.",
      outcome: "Parishioners find service times and directions on any phone.",
      link: "",
    },
  ],
  photos: [
    { src: "assets/photos/on-set-02.jpg", caption: "Assistant camera operator at a live liturgical event, April 2022" },
    { src: "assets/photos/photo-01.jpg", caption: "The Marian grotto" },
    { src: "assets/photos/photo-04.jpg", caption: "Statue of the Baptism of Jesus" },
    { src: "assets/photos/on-set-03.jpg", caption: "Behind the camera, April 2022" },
    { src: "assets/photos/photo-02.jpg", caption: "St. Theresa's Cathedral, Kibuye" },
    { src: "assets/photos/photo-05.jpg", caption: "The church chandelier" },
    { src: "assets/photos/photo-06.jpg", caption: "The sanctuary" },
  ],
  audio: [],

  /* ---------- 6. EXPERIENCE (newest first) ---------- */
  experience: [
    {
      role: "Bookkeeper / Treasurer",
      org: "St. Theresa's Cathedral, Kibuye Catholic Church · Kisumu",
      period: "Aug 2023 — Present",
      points: [
        "Sole preparer of the cathedral's financial reports; the Cathedral Administrator approves every payment from my figures.",
        "Count every collection and report weekly to the parish priest and Administrator; monthly income and expenditure across six departments.",
        "Reconcile M-Pesa Paybill against the bank statement: 19,017 payments worth KSh 9,047,607 in 12 months.",
        "Set the KSh 1,000,000 roof appeal target and tracked every shilling; the appeal closed at KSh 1,161,928 (116%).",
        "Merged separate finance workbooks into one Excel/VBA system: 7 entry forms, 8 reports, M-Pesa import, live budget posting.",
        "Prepare the monthly payroll and bills schedule with NSSF, NITA and Housing Levy: KSh 6,414,128 billed Jan–Sep 2026.",
        "Built the parish annual expenditure budget: KSh 8,217,625 across six departments and 43 costed lines.",
      ],
    },
    {
      role: "Administrative Secretary",
      org: "St. Theresa's Cathedral, Kibuye Catholic Church · Kisumu",
      period: "Oct 2022 — Present",
      points: [
        "Run the cathedral office for the resident priest; the office receives the Apostolic Nuncio, visiting bishops from Uganda, Rwanda and Nigeria, and senior government officials.",
        "Moved stall rent from Word into an Excel ledger for 43 stalls with 10 automatic checks, showing the Parish Pastoral Council KSh 1,230,500 of unpaid rent for the first time.",
        "Registered 27 contractor quotations worth KSh 6,902,897 for the 2026 renovation works, each numbered and tracked to payment.",
      ],
    },
    {
      role: "Head of AV / ICT",
      org: "St. Theresa's Cathedral, Kibuye Catholic Church · Kisumu",
      period: "Oct 2019 — Present",
      points: [
        "Sole ICT support for the parish office.",
        "Lead audio-visual production for five Sunday Masses, including nine months of outdoor worship under tents during the 2025 cathedral construction.",
      ],
    },
    {
      role: "Accounts & ICT duties",
      org: "Exuviance Professionals · Nairobi",
      period: "Sep 2021 — Feb 2022",
      points: [
        "Generated receipts, keyed client purchases and produced monthly financial reports in QuickBooks.",
        "Built the marketing team's client record system and stock-expiry tracking in Excel.",
      ],
    },
  ],
  education: [
    { title: "Certificate in Accounting and Management Skills (CAMS): Graduate", org: "KASNEB · Level I May 2021, Level II April 2022", period: "2022" },
    { title: "Operating Systems using Linux Server Environment", org: "East Africa Institute of Certified Studies", period: "2021" },
    { title: "Cisco CCNA Routing & Switching: coursework, three modules", org: "KCA University", period: "2018–19" },
    { title: "Kenya Certificate of Secondary Education (KCSE)", org: "St. Charles Lwanga Secondary School", period: "2016" },
    { title: "Police Clearance Certificate", org: "Directorate of Criminal Investigations · available on request", period: "Oct 2026" },
  ],
  languages: "English, Kiswahili, Dholuo",
};
