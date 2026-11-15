// Source for data/financial-accounting-principles.json — run: node content/build.js
const tw = (head, rows) => `<div class="tablewrap"><table><tr>${head.map(h => `<th>${h}</th>`).join("")}</tr>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</table></div>`;

const notes = {
dep: `
<p><span class="k">Depreciation</span> is an estimate of the fall in value of a non-current asset (machines, motor vehicles, buildings). Causes: wear and tear, usage, time, technology (obsolescence).</p>
<p>This year's charge goes to the <span class="k">P&amp;L</span> as an expense. The running total sits in the <span class="k">SOFP</span> under non-current assets as <span class="k">accumulated depreciation</span>: Cost − Acc dep = NBV.</p>
<div class="formula">Straight line (SL):      Cost × rate                      (same every year)
Reducing balance (RB):   (Cost − Acc dep) × rate          (= NBV × rate, falls every year)</div>
<p><span class="k">Read the policy line first.</span> Mags uses two:</p>
<ul><li><b>"Full year in the year of purchase, none in the year of sale"</b>: every past paper uses this one. Count financial years, not months.</li>
<li><b>"One month's ownership means one month's depreciation"</b> (Q25.1A, Q25.2A): charge × months owned ÷ 12.</li></ul>
<div class="trap"><b>Trap:</b> with RB, the charge is on the NBV of the assets <i>still held</i> at year end: (closing cost − acc dep of the assets you still have) × rate. Take the sold asset's acc dep out first.</div>`,

steps: `
<p>Mags's 7 steps (from the depreciation solutions file). Follow them in this order every time:</p>
<ol style="margin:0;padding-left:20px">
<li>Enter the <b>opening balances</b> in the Cost a/c (Dr) and Acc Dep a/c (Cr).</li>
<li>Enter <b>purchases</b> for the year in the Cost a/c (Dr bank).</li>
<li>For a <b>disposal</b>: Cr Cost a/c with the asset's <i>cost</i> (Dr Disposal), and Dr Acc Dep a/c with <i>its</i> accumulated depreciation (Cr Disposal).</li>
<li><b>Balance the Cost account.</b> This gives the closing cost.</li>
<li>Calculate <b>this year's depreciation</b> (Cr Acc Dep, Dr P&amp;L).</li>
<li>Finish the <b>Disposal account</b>: Cr proceeds or trade-in. The balancing figure is profit (Dr side) or loss (Cr side).</li>
<li><b>Balance the Acc Dep account.</b></li></ol>
<div class="formula">Disposal a/c
Dr  Cost of asset sold                 Cr  Acc dep on asset sold
Dr  Profit on disposal (→ P&L income)  Cr  Proceeds / trade-in allowance
                                       Cr  Loss on disposal (→ P&L expense)</div>
<p><span class="k">Trade-in:</span> proceeds = trade-in allowance = new asset's cost − cash paid. The new asset still goes into the Cost a/c at its <b>full cost</b>: Dr Cost (full price), Cr Bank (cash paid), Cr Disposal (allowance).</p>
<p><span class="k">Over-depreciated</span> (NBV &lt; proceeds) → profit on disposal. <span class="k">Under-depreciated</span> (NBV &gt; proceeds) → loss.</p>`,

worked: `
<p><span class="k">Craig Ltd</span> (Tutorial week 2). Y/E 31 Oct 2026. Full year in year of purchase, none in year of sale.</p>
<p><b>Equipment (15% SL)</b>: opening cost €310,000, acc dep €102,000, additions €47,000. Disposed: cost €35,000 (bought Y/E 2021), proceeds €12,000.</p>
${tw(["Step", "Working", "€"], [
  ["Acc dep on disposal", "35,000 × 15% × 5 yrs (2021–2025)", "26,250"],
  ["Closing cost", "310,000 + 47,000 − 35,000", "322,000"],
  ["Charge for year", "322,000 × 15%", "48,300"],
  ["Closing acc dep", "102,000 − 26,250 + 48,300", "124,050"],
  ["Disposal", "NBV 8,750 vs proceeds 12,000", "Profit 3,250"]])}
<p><b>Motor vehicles (25% RB)</b>: opening cost €256,000, acc dep €86,000, additions €18,000. Disposed: cost €14,000 (bought Y/E 2024), proceeds €6,500.</p>
${tw(["Step", "Working", "€"], [
  ["Acc dep on disposal", "Y/E 24: 14,000 × 25% = 3,500 · Y/E 25: 10,500 × 25% = 2,625", "6,125"],
  ["Closing cost", "256,000 + 18,000 − 14,000", "260,000"],
  ["Acc dep on assets kept", "86,000 − 6,125", "79,875"],
  ["Charge for year", "(260,000 − 79,875) × 25%", "45,031"],
  ["Closing acc dep", "79,875 + 45,031", "124,906"],
  ["Disposal", "NBV 7,875 vs proceeds 6,500", "Loss 1,375"]])}
<p><span class="k">Spray Ltd</span> (Winter 2025 exam). Y/E 30 June. Machines 15% SL, vans 20% RB.</p>
${tw(["", "Year 1 (to 30/6/24)", "Year 2 (to 30/6/25)"], [
  ["Machine cost c/d", "X 90,000 + Y 85,000 = 175,000", "175,000 − 90,000 (X) + 105,000 (Z) = 190,000"],
  ["Machine dep (P&L)", "175,000 × 15% = 26,250", "190,000 × 15% = 28,500"],
  ["Disposal X", "", "Acc dep 13,500 (1 yr) · NBV 76,500 · sold 79,000 → profit 2,500"],
  ["Van cost c/d", "G 58,000", "58,000 − 58,000 (G) + 64,000 (H) = 64,000"],
  ["Van dep (P&L)", "58,000 × 20% = 11,600", "(64,000 − 0) × 20% = 12,800"],
  ["Trade-in G", "", "Allowance 64,000 − 22,000 = 42,000 · NBV 46,400 → loss 4,400"]])}`,

de: `
<p>Every transaction has a debit and an equal credit. <span class="k">Debit</span> the account that <b>receives</b> value, <span class="k">credit</span> the account that <b>gives</b> value.</p>
<div class="formula">DEBIT increases:  Assets · Expenses · Drawings
CREDIT increases: Capital · Liabilities · Income (sales, purchases returns, discount received)</div>
${tw(["Transaction", "Debit", "Credit"], [
  ["Owner lodges savings", "Bank", "Capital"],
  ["Machine bought on credit from Wing Ltd", "Machinery", "Wing Ltd (payable)"],
  ["Goods bought on credit from Foley Ltd", "Purchases", "Foley Ltd"],
  ["Goods sold on credit to Shiny Ltd", "Shiny Ltd (receivable)", "Sales"],
  ["We return goods to Foley", "Foley Ltd", "Purchases returns"],
  ["Shiny returns goods to us", "Sales returns", "Shiny Ltd"],
  ["Paid wages by cheque", "Wages", "Bank"],
  ["Owner takes cash / stock for private use", "Drawings", "Bank / Purchases"],
  ["Received cheque from Shiny", "Bank", "Shiny Ltd"],
  ["Insurance €1,500, 40% private", "Insurance 900 + Drawings 600", "Bank 1,500"]])}
<div class="trap"><b>Trap:</b> "in full settlement" for less than the balance means the difference is a <b>discount</b>. Paying a payable less: Cr Discount received. A receivable paying us less: Dr Discount allowed.</div>
<p>Balance each account: the bigger side's total goes on both sides, and the gap is <b>bal c/d</b>, carried to the opposite side as <b>bal b/d</b>.</p>`,

daybooks: `
<p>Credit transactions with VAT (23%) are listed first in <span class="k">day books</span>, then the totals are posted to the nominal ledger.</p>
${tw(["Day book", "Posting of totals"], [
  ["Sales day book (Net · VAT · Total)", "Dr Receivables control (total) · Cr Sales (net) · Cr VAT (VAT)"],
  ["Purchases day book", "Dr Purchases (net) · Dr VAT (VAT) · Cr Payables control (total)"],
  ["Sales returns day book", "Dr Sales returns (net) · Dr VAT · Cr Receivables control"],
  ["Purchases returns day book", "Dr Payables control · Cr Purchases returns (net) · Cr VAT"],
  ["Cash receipts book", "Dr Bank · Cr Receivables control"],
  ["Cheque payments book", "Dr Payables control · Cr Bank"]])}
<div class="formula">Net = units × price      VAT = Net × 23%      Total = Net + VAT
e.g. 987 × €4.89 = €4,826.43 → VAT €1,110.08 → Total €5,936.51</div>
<p>VAT a/c: VAT on sales and purchases returns on the <b>Cr</b> side (owed to Revenue), VAT on purchases and sales returns on the <b>Dr</b> side. A credit balance is a current liability.</p>
<p><span class="k">Part C (6 marks):</span> why users care about the accounts. Bank: can they repay the loan and interest, is there security, would they qualify for a future loan. Employee: job security, wages paid, future prospects. Revenue: correct income tax, VAT, PAYE/PRSI/USC paid.</p>`,

users: `
<p><span class="k">Qualities</span> of financial information: accurate and timely, clear and concise, relevant, comparable.</p>
${tw(["User", "What they want to know"], [
  ["Owner (sole trader)", "Is it profitable, liquid, and what's its future potential"],
  ["Investors", "Is it a good investment, share price, retained earnings for dividends"],
  ["Revenue Commissioners", "All taxes paid: VAT, PAYE/PRSI/USC, income tax, corporation tax"],
  ["Banks and lenders", "Loan repayments and interest can be paid, security on the loan"],
  ["Payables (suppliers)", "Will they be paid on time"],
  ["Customers", "Guarantee on products, future after-care service"],
  ["Employees", "Wages paid, job security, future prospects and promotion"],
  ["Competitors", "How they compare, and whether they can take market share"],
  ["Management and directors", "Is the business thriving, liquid and competitive"]])}
<p><span class="k">Revenue expenditure</span>: day-to-day running costs (stock, wages, electricity, insurance). All of it goes to the P&amp;L in the year it occurs.</p>
<p><span class="k">Capital expenditure</span>: benefits the business for more than a year (equipment, buildings, vehicles). It's capitalised in the SOFP and sent to the P&amp;L gradually through depreciation, e.g. a €100,000 machine with a 5-year life sends €20,000 a year.</p>`,

pl: `
<p>Section A, compulsory, <b>40 marks</b>: P&amp;L (25) and SOFP (15) from a trial balance, with two adjustments: <b>closing inventory</b> and <b>depreciation</b>.</p>
<div class="formula">Sales − Sales returns                         = Net sales
Opening inv + Purchases − Purchases returns
  + Carriage inwards − Closing inv           = Cost of sales
Net sales − Cost of sales                     = Gross profit
+ Discount received (and other income)
− Expenses (incl. depreciation, carriage outwards,
  discount allowed, loan interest)            = Net profit / (loss)</div>
<p><span class="k">Paul Daly (Winter 2025) worked:</span> net sales 919,040 · cost of sales 257,648 · GP 661,392 · + discount received 9,443 · − expenses 698,813 (incl. dep equipment 220,000 × 15% = 33,000 and dep MV (85,000 − 30,600) × 20% = 10,880) = <b>net loss 27,978</b>.</p>
${tw(["SOFP (Paul Daly)", "Cost", "Acc dep", "NBV"], [
  ["Equipment", "220,000", "132,000", "88,000"], ["Motor vehicles", "85,000", "41,480", "43,520"],
  ["Current assets: inventory 156,900 + receivables 49,300", "", "", "206,200"], ["Total assets", "", "", "337,720"],
  ["Capital 190,000 − loss 27,978 − drawings 52,000", "", "", "110,022"],
  ["Non-current liability: loan (repayable 2032)", "", "", "80,000"],
  ["Current liabilities: VAT 58,760 + payables 20,600 + PAYE 6,740 + bank o/d 61,598", "", "", "147,698"],
  ["Total capital and liabilities", "", "", "337,720"]])}
<div class="trap"><b>Trap:</b> closing inventory appears twice: deducted in cost of sales <i>and</i> as a current asset. The new acc dep (opening + this year's charge) goes in the SOFP. A bank balance on the credit side of the TB is an overdraft, so it's a current liability.</div>`,
};

const topics = [
  { id: "dep", name: "Depreciation: methods and rules", modes: ["sheet", "calc", "cards"], why: "Thursday's test. Learn the two methods and the policy wording, then drill the numbers.", notes: notes.dep },
  { id: "disp", name: "Ledger accounts and disposals", modes: ["calc", "written", "sheet"], why: "This is where the marks are: cost, acc dep and disposal accounts. Follow the 7 steps until they're automatic.", notes: notes.steps + notes.worked },
  { id: "pl", name: "P&L and SOFP (Section A, 40 marks)", modes: ["calc", "written", "notes"], why: "Compulsory in December. Learn the layout and practise building it from a trial balance.", notes: notes.pl },
  { id: "de", name: "Double entry", modes: ["cards", "drill"], why: "Fast debit/credit decisions. Flashcards and quick questions until you don't hesitate.", notes: notes.de },
  { id: "db", name: "Day books and VAT", modes: ["calc", "written"], why: "Mechanical: net, VAT at 23%, total, then post the totals. Accuracy beats speed.", notes: notes.daybooks },
  { id: "users", name: "Users of accounts and expenditure", modes: ["cards", "drill"], why: "Easy marks in Part C questions. Memorise who wants what.", notes: notes.users },
];

const Q = (t, q, o, a, e) => ({ t, q, o, a, e });
const questions = [
  Q("dep", "Depreciation is best described as:", ["The cash set aside to replace an asset", "An estimate of the fall in value of a non-current asset", "The market value of an asset", "A current liability"], 1, "It's an estimate. You only find out how accurate it was when you sell the asset."),
  Q("dep", "Which is NOT a cause of depreciation?", ["Wear and tear", "Obsolescence (technology)", "Passage of time", "Inflation"], 3, "Mags's list: wear and tear, usage, time, technology."),
  Q("dep", "A machine costs €40,000. Depreciation is 15% straight line. The annual charge is:", ["€4,000", "€6,000", "€5,100", "€34,000"], 1, "SL: cost × rate = 40,000 × 15% = €6,000 every year."),
  Q("dep", "A van costs €20,000. Depreciation is 25% reducing balance. The charge in year 2 is:", ["€5,000", "€3,750", "€3,000", "€2,812.50"], 1, "Year 1: 5,000 → NBV 15,000. Year 2: 15,000 × 25% = €3,750."),
  Q("dep", "Under reducing balance, the depreciation charge:", ["Is the same every year", "Falls every year", "Rises every year", "Is zero in the first year"], 1, "It's a % of a shrinking NBV."),
  Q("dep", "This year's depreciation charge is recorded:", ["Dr Acc dep, Cr P&L", "Dr P&L, Cr Acc dep", "Dr Cost a/c, Cr Bank", "Dr Bank, Cr Acc dep"], 1, "Expense in the P&L (Dr), built up in the accumulated depreciation account (Cr)."),
  Q("dep", "Policy: 'one month's ownership means one month's depreciation'. A €1,400 computer is bought on 1 July, 20% p.a., year end 31 December. First-year charge:", ["€280", "€140", "€116.67", "€0"], 1, "1,400 × 20% × 6/12 = €140 (Q25.1A)."),
  Q("dep", "Policy: 'full year in year of purchase, none in year of sale'. A machine bought in Y/E 2021 is sold in Y/E 2026. Years of depreciation charged:", ["6", "5", "4", "Depends on the month"], 1, "2021, 2022, 2023, 2024, 2025 = 5 years. None in 2026 (year of sale)."),
  Q("dep", "Net book value (NBV) equals:", ["Cost + accumulated depreciation", "Cost − accumulated depreciation", "Proceeds − cost", "Cost × rate"], 1, "Shown in the SOFP: Cost | Acc dep | NBV."),
  Q("disp", "An asset with cost €35,000 and acc dep €26,250 is sold for €12,000. The result is:", ["Loss €8,750", "Profit €3,250", "Loss €3,250", "Profit €12,000"], 1, "NBV = 8,750. Proceeds 12,000 > NBV, so profit 3,250 (Craig Ltd)."),
  Q("disp", "A profit on disposal means the asset was:", ["Under-depreciated", "Over-depreciated", "Correctly depreciated", "Revalued"], 1, "You charged more depreciation than the real fall in value, so NBV < proceeds."),
  Q("disp", "On disposal, the asset's accumulated depreciation is transferred:", ["Dr Disposal, Cr Acc dep", "Dr Acc dep, Cr Disposal", "Dr P&L, Cr Disposal", "Dr Bank, Cr Acc dep"], 1, "Step 3: take it out of the acc dep account (Dr) into the disposal account (Cr)."),
  Q("disp", "On disposal, the asset's original cost is transferred:", ["Dr Disposal, Cr Cost a/c", "Dr Cost a/c, Cr Disposal", "Dr Disposal, Cr Bank", "Dr Bank, Cr Cost a/c"], 0, "Cost leaves the cost account (Cr) and goes into the disposal account (Dr)."),
  Q("disp", "New van costs €64,000, acquired for €22,000 cash after a trade-in. The trade-in allowance is:", ["€22,000", "€42,000", "€64,000", "€86,000"], 1, "Allowance = 64,000 − 22,000 = €42,000. This goes on the Cr side of the disposal account as proceeds (Spray Ltd)."),
  Q("disp", "With a trade-in, the new asset is entered in the cost account at:", ["The cash paid", "Its full cost price", "Cost minus trade-in", "The old asset's NBV"], 1, "Dr Cost a/c with the full €64,000: Cr Bank €22,000 and Cr Disposal €42,000."),
  Q("disp", "Year-end cost of vehicles still held €260,000, their acc dep €79,875, RB 25%. This year's charge:", ["€65,000", "€45,031", "€19,969", "€52,500"], 1, "(260,000 − 79,875) × 25% = €45,031 (Craig Ltd)."),
  Q("disp", "Under RB, before calculating this year's charge, you must:", ["Add back the disposal's acc dep", "Remove the disposed asset's acc dep from the opening balance", "Ignore disposals", "Use the opening cost"], 1, "The charge is on the NBV of assets still held at year end."),
  Q("disp", "A loss on disposal appears in the disposal account on the:", ["Debit side", "Credit side", "Either side", "It isn't shown"], 1, "It's the balancing figure on the Cr side, then Dr P&L as an expense."),
  Q("disp", "A machine costing €90,000 (15% SL) is held for one year and sold for €79,000. Profit or loss?", ["Loss €11,000", "Profit €2,500", "Loss €2,500", "Profit €13,500"], 1, "Acc dep 13,500 → NBV 76,500. Sold 79,000 → profit 2,500 (Spray Ltd)."),
  Q("pl", "Cost of sales equals:", ["Opening inv + purchases + closing inv", "Opening inv + purchases − purchases returns + carriage in − closing inv", "Sales − gross profit − expenses", "Purchases − sales returns"], 1, "Carriage inwards is part of cost of sales. Carriage outwards is an expense."),
  Q("pl", "Carriage outwards is shown as:", ["Part of cost of sales", "An expense in the P&L", "A current asset", "A deduction from sales"], 1, "Delivering goods to customers is a selling expense."),
  Q("pl", "Closing inventory appears:", ["Only in the P&L", "Only in the SOFP", "In cost of sales AND as a current asset", "As a current liability"], 2, "It's one of the two adjustments."),
  Q("pl", "A bank balance on the credit side of the trial balance is:", ["A current asset", "An overdraft, a current liability", "Capital", "Income"], 1, "Paul Daly's bank €61,598 Cr goes under current liabilities."),
  Q("pl", "A loan repayable in 2032 is a:", ["Current liability", "Non-current liability", "Current asset", "Expense"], 1, "Repayable in more than 12 months, so non-current."),
  Q("pl", "Drawings are:", ["An expense in the P&L", "Deducted from capital in the SOFP", "Added to capital", "A current liability"], 1, "Capital + profit (or − loss) − drawings."),
  Q("pl", "Discount received is:", ["An expense", "Added to gross profit as income", "Deducted from sales", "Part of cost of sales"], 1, "Discount allowed is the expense."),
  Q("pl", "Which item is NOT a P&L expense?", ["Loan interest paid", "Depreciation", "Drawings", "Light and heat"], 2, "Drawings reduce capital. They aren't a business expense."),
  Q("pl", "Equipment cost €220,000, opening acc dep €99,000, 15% SL. The SOFP shows acc dep of:", ["€99,000", "€132,000", "€33,000", "€121,000"], 1, "99,000 + 33,000 (220,000 × 15%) = 132,000. NBV 88,000."),
  Q("de", "The owner lodges €35,000 of savings into the business bank account:", ["Dr Capital, Cr Bank", "Dr Bank, Cr Capital", "Dr Bank, Cr Sales", "Dr Drawings, Cr Bank"], 1, "Bank receives, the owner (capital) gives."),
  Q("de", "Goods bought on credit from Foley Ltd:", ["Dr Foley, Cr Purchases", "Dr Purchases, Cr Foley", "Dr Purchases, Cr Bank", "Dr Inventory, Cr Sales"], 1, "Purchases receives the goods, Foley (payable) gives."),
  Q("de", "Shiny Ltd returns goods we sold them on credit:", ["Dr Shiny, Cr Sales returns", "Dr Sales returns, Cr Shiny", "Dr Purchases returns, Cr Shiny", "Dr Sales, Cr Bank"], 1, "Sales returns (returns in) is debited, and the receivable goes down."),
  Q("de", "We return goods to Foley Ltd:", ["Dr Purchases returns, Cr Foley", "Dr Foley, Cr Purchases returns", "Dr Foley, Cr Purchases", "Dr Purchases, Cr Foley"], 1, "Our debt to Foley falls (Dr). Returns out is credited."),
  Q("de", "Machine bought on credit from Wing Ltd:", ["Dr Purchases, Cr Wing", "Dr Machinery, Cr Wing", "Dr Machinery, Cr Bank", "Dr Wing, Cr Machinery"], 1, "Non-current assets never go through purchases. Purchases is for goods for resale only."),
  Q("de", "The owner takes €165 of stock for personal use:", ["Dr Purchases, Cr Drawings", "Dr Drawings, Cr Purchases", "Dr Drawings, Cr Sales", "Dr Capital, Cr Bank"], 1, "Drawings up, purchases (goods for resale) down."),
  Q("de", "Insurance of €1,500 is paid by cheque; 40% is for the owner's house:", ["Dr Insurance 1,500, Cr Bank", "Dr Insurance 900, Dr Drawings 600, Cr Bank 1,500", "Dr Drawings 1,500, Cr Bank", "Dr Insurance 600, Dr Drawings 900, Cr Bank"], 1, "Only the business part (60%) is an expense."),
  Q("de", "Kelly Ltd is owed €26,700 and is paid €26,450 'in full settlement'. The €250 is:", ["Discount allowed", "Discount received", "A bad debt", "A purchases return"], 1, "We paid less than we owed, so we received a discount (income)."),
  Q("de", "Which account normally has a CREDIT balance?", ["Purchases", "Drawings", "Capital", "Receivables"], 2, "Capital, liabilities and income are credit balances."),
  Q("db", "VAT at 23% on a net amount of €4,826.43 is:", ["€1,110.08", "€902.47", "€5,936.51", "€1,206.61"], 0, "4,826.43 × 0.23 = 1,110.08. Total 5,936.51."),
  Q("db", "The sales day book total (net) is posted to:", ["Dr Sales", "Cr Sales", "Dr Bank", "Cr Receivables"], 1, "Dr Receivables control (total), Cr Sales (net), Cr VAT."),
  Q("db", "VAT on purchases is posted to the VAT account on the:", ["Debit side (reclaimable)", "Credit side", "It isn't posted", "P&L"], 0, "Input VAT can be reclaimed, so it's a debit."),
  Q("db", "A cheque received from a credit customer is recorded in the:", ["Sales day book", "Cash receipts book", "Cheque payments book", "Purchases returns book"], 1, "Then Dr Bank, Cr Receivables control."),
  Q("users", "Revenue expenditure is:", ["Spending on non-current assets", "Day-to-day running costs, charged to the P&L in the year", "Owner's drawings", "Loan repayments"], 1, "Stock, wages, electricity, phone, insurance."),
  Q("users", "Buying a delivery van is:", ["Revenue expenditure", "Capital expenditure", "Drawings", "Cost of sales"], 1, "Benefits more than one year, so it's capitalised and depreciated."),
  Q("users", "Which user is MAINLY interested in whether loan repayments and interest can be met?", ["Employees", "Banks and lending institutions", "Competitors", "Customers"], 1, "Also whether there's security for the loan."),
  Q("users", "The Revenue Commissioners are interested in the accounts to check:", ["Market share", "That income tax, VAT and PAYE/PRSI/USC are correctly paid", "Job security", "After-sales service"], 1, ""),
];

const C = (t, f, b) => ({ t, f, b });
const cards = [
  C("dep", "Straight line formula", "Cost × rate. The same charge every year."),
  C("dep", "Reducing balance formula", "(Cost − acc dep) × rate = NBV × rate. Falls every year."),
  C("dep", "Causes of depreciation", "Wear and tear, usage, time, technology (obsolescence)."),
  C("dep", "Where does this year's depreciation go?", "Dr P&L (expense), Cr accumulated depreciation account."),
  C("dep", "Where does accumulated depreciation go?", "SOFP, non-current assets: Cost − Acc dep = NBV."),
  C("dep", "'Full year in year of purchase, none in year of sale'", "Count financial years held, ignoring months. Bought Y/E 2021, sold Y/E 2026 → 5 years."),
  C("dep", "'One month's ownership = one month's depreciation'", "Annual charge × months owned ÷ 12. Bought 1 July with Dec year end → 6/12."),
  C("disp", "The 7 steps", "1 Opening balances · 2 Purchases into cost · 3 Disposal: cost out (Cr), its acc dep out (Dr) · 4 Balance cost a/c · 5 This year's dep · 6 Disposal a/c · 7 Balance acc dep a/c."),
  C("disp", "Disposal account: debit side", "Cost of the asset sold (+ profit on disposal as the balancing figure)."),
  C("disp", "Disposal account: credit side", "Acc dep on the asset sold + proceeds or trade-in (+ loss as the balancing figure)."),
  C("disp", "Profit on disposal means…", "Over-depreciated: NBV < proceeds. Goes to the P&L as income."),
  C("disp", "Loss on disposal means…", "Under-depreciated: NBV > proceeds. Goes to the P&L as an expense."),
  C("disp", "Trade-in allowance", "New asset cost − cash paid. Credit it to the disposal account as proceeds."),
  C("disp", "Trade-in: new asset in cost account at…", "Its FULL cost. Cr Bank (cash) and Cr Disposal (allowance)."),
  C("disp", "RB charge when there's been a disposal", "(Closing cost − acc dep of assets still held) × rate. Take the sold asset's acc dep out first."),
  C("disp", "SL charge when there's been a disposal", "Closing cost × rate (the cost account balance after additions and disposals)."),
  C("pl", "Cost of sales", "Opening inv + purchases − purchases returns + carriage inwards − closing inv."),
  C("pl", "Gross profit", "(Sales − sales returns) − cost of sales."),
  C("pl", "Two adjustments in Section A", "Closing inventory (cost of sales AND current asset) and depreciation (P&L expense AND SOFP acc dep)."),
  C("pl", "Carriage inwards vs outwards", "Inwards → cost of sales. Outwards → expense."),
  C("pl", "Capital section of the SOFP", "Opening capital + net profit (or − loss) − drawings."),
  C("pl", "Credit bank balance in the TB", "Overdraft → current liability."),
  C("pl", "Current liabilities in a TB", "Payables, VAT (Cr), PAYE/PRSI, bank overdraft."),
  C("de", "Debit rule", "Debit the account that RECEIVES value. Assets, expenses and drawings increase on the debit side."),
  C("de", "Credit rule", "Credit the account that GIVES value. Capital, liabilities and income increase on the credit side."),
  C("de", "Goods for resale vs a machine", "Goods → Purchases a/c. Machine → Machinery (asset) a/c. Never mix them."),
  C("de", "Owner takes stock", "Dr Drawings, Cr Purchases."),
  C("de", "Paid less than owed 'in full settlement'", "Difference = discount received (Cr, income)."),
  C("de", "Customer pays less 'in full settlement'", "Difference = discount allowed (Dr, expense)."),
  C("db", "Sales day book posting", "Dr Receivables control (total) · Cr Sales (net) · Cr VAT."),
  C("db", "Purchases day book posting", "Dr Purchases (net) · Dr VAT · Cr Payables control (total)."),
  C("db", "VAT a/c credit balance", "Owed to Revenue → current liability."),
  C("users", "Qualities of financial information", "Accurate and timely, clear and concise, relevant, comparable."),
  C("users", "Bank's interest in the accounts", "Can they repay the loan and interest, is there security, would they qualify for a future loan."),
  C("users", "Employee's interest", "Wages paid, job security, future prospects and promotion."),
  C("users", "Revenue's interest", "Correct income tax, VAT, PAYE/PRSI/USC and corporation tax paid."),
  C("users", "Revenue vs capital expenditure", "Revenue = day-to-day, to the P&L now. Capital = benefits > 1 year, to the SOFP and depreciated."),
];

const W = (t, src, marks, q, points) => ({ t, src, marks, q, points });
const written = [
  W("disp", "Tutorial week 2 (Craig Ltd)", 35, "Craig Ltd, Y/E 31 Oct 2026. Equipment: cost €310,000, acc dep €102,000, 15% SL, additions €47,000, disposal cost €35,000 (bought Y/E 2021), proceeds €12,000. Motor vehicles: cost €256,000, acc dep €86,000, 25% RB, additions €18,000, disposal cost €14,000 (bought Y/E 2024), proceeds €6,500. Full year in year of purchase, none in year of sale. Prepare the cost, provision for depreciation and disposal accounts.", [
    "Equipment cost a/c: bal b/d 310,000 + bank 47,000, disposal 35,000 out → bal c/d 322,000",
    "MV cost a/c: 256,000 + 18,000 − 14,000 → bal c/d 260,000",
    "Equipment acc dep: disposal Dr 26,250 (35,000 × 15% × 5 yrs) · P&L Cr 48,300 (322,000 × 15%) · bal c/d 124,050",
    "MV acc dep: disposal Dr 6,125 (3,500 + 2,625) · P&L Cr 45,031 ((260,000 − 79,875) × 25%) · bal c/d 124,906",
    "Disposal equipment: Dr cost 35,000 + profit 3,250 = Cr acc dep 26,250 + bank 12,000",
    "Disposal MV: Dr cost 14,000 = Cr acc dep 6,125 + bank 6,500 + loss 1,375"]),
  W("disp", "Winter 2025 Q2 (Spray Ltd)", 30, "Spray Ltd started 1 July 2023 (Y/E 30 June). Bought Machine X €90,000 (Jul 2023), Van G €58,000 (Jul 2023), Machine Y €85,000 (May 2024). Year 2: Machine X sold for €79,000 and Machine Z bought for €105,000; Van G traded in for Van H (cost €64,000, acquired for €22,000 cash). Machines 15% SL, vans 20% RB. Full year in year of purchase, none in year of sale. Prepare the ledger accounts for both years.", [
    "Machine cost: Y1 bal c/d 175,000 · Y2 + Z 105,000 − X 90,000 → bal c/d 190,000",
    "Machine acc dep: Y1 P&L 26,250 · Y2 disposal Dr 13,500, P&L 28,500 (190,000 × 15%) → bal c/d 41,250",
    "Van cost: Y1 58,000 · Y2 bank 22,000 + disposal 42,000 = H at 64,000, G 58,000 out → bal c/d 64,000",
    "Van acc dep: Y1 11,600 · Y2 disposal Dr 11,600, P&L 12,800 (64,000 × 20%) → bal c/d 12,800",
    "Disposal X: Dr 90,000 + profit 2,500 = Cr acc dep 13,500 + bank 79,000",
    "Disposal G: Dr 58,000 = Cr acc dep 11,600 + trade-in 42,000 + loss 4,400"]),
  W("dep", "Q25.1A (intro questions)", 10, "A company started on 1 Jan 2000. Two computers bought for €1,200 each on 1 Jan, and one for €1,400 on 1 July. Depreciation 20% p.a., one month's ownership means one month's depreciation. Prepare the computers cost account and provision for depreciation for Y/E 31/12/00.", [
    "Cost a/c: bank 2,400 (Jan) + bank 1,400 (July) → bal c/d 3,800",
    "Jan computers: 2,400 × 20% × 12/12 = 480",
    "July computer: 1,400 × 20% × 6/12 = 140",
    "Acc dep a/c: Cr P&L 620 → bal c/d 620",
    "SOFP extract: computers cost 3,800, acc dep 620, NBV 3,180"]),
  W("pl", "Winter 2025 Q1 (Paul Daly)", 40, "Prepare a Statement of Profit or Loss and Statement of Financial Position for Paul Daly for Y/E 30 Nov 2025 (trial balance on Moodle). Closing inventory €156,900. Equipment 15% SL, motor vehicles 20% RB.", [
    "Net sales 986,540 − 67,500 = 919,040",
    "Cost of sales 112,430 + 312,000 − 31,770 + 21,888 − 156,900 = 257,648 → GP 661,392",
    "Add discount received 9,443",
    "Depreciation: equipment 33,000 · MV (85,000 − 30,600) × 20% = 10,880",
    "Total expenses 698,813 → net LOSS 27,978",
    "NCA NBV: equipment 88,000 + MV 43,520 = 131,520 · CA 206,200 · total assets 337,720",
    "Capital 190,000 − 27,978 − 52,000 = 110,022 · loan 80,000 · CL 147,698 (incl. bank o/d 61,598) → 337,720"]),
  W("de", "Winter 2025 (Mary Nolan)", 30, "Prepare the ledger accounts of Mary Nolan for March 2025: lodges €35,000; machine on credit €26,000 from Wing Ltd; inventory on credit €62,700 from Foley Ltd; sells on credit €41,880 to Shiny Ltd; withdraws €3,800; wages €2,600; returns €5,980 to Foley; Shiny returns €2,760; cheque from Shiny €39,000 in full; pays Foley €56,500 in full settlement.", [
    "Bank: Dr capital 35,000, Shiny 39,000 · Cr drawings 3,800, wages 2,600, Foley 56,500 → bal 11,100 Dr",
    "Purchases Dr 62,700 · Purchases returns Cr 5,980 · Sales Cr 41,880 · Sales returns Dr 2,760",
    "Machinery Dr 26,000 / Wing Ltd Cr 26,000 (balance owed)",
    "Foley: Cr 62,700 · Dr returns 5,980, bank 56,500, discount received 220",
    "Shiny: Dr 41,880 · Cr returns 2,760, bank 39,000, discount allowed 120",
    "Capital Cr 35,000 · Drawings Dr 3,800 · Wages Dr 2,600"]),
  W("db", "Autumn 2023 adjusted (Mr Flanagan)", 30, "Mr Flanagan, April 2026, VAT 23%: sold Lyons 987 units @ €4.89; bought Glen 1,340 @ €2.76; sold Smith 795 @ €4.95; bought Sharp 1,650 @ €2.55; Lyons returned 57 @ €4.89; returned to Sharp 135 @ €2.55; cheque from Lyons €5,593.67; paid Glen €4,549.03. Prepare the day books and the payables, receivables, VAT and bank accounts.", [
    "Sales day book: Lyons 4,826.43 + VAT 1,110.08 = 5,936.51 · Smith 3,935.25 + 905.11 = 4,840.36 · totals 8,761.68 / 2,015.19 / 10,776.87",
    "Purchases day book: Glen 3,698.40 + 850.63 = 4,549.03 · Sharp 4,207.50 + 967.73 = 5,175.23 · totals 7,905.90 / 1,818.36 / 9,724.26",
    "Sales returns: Lyons 278.73 + 64.11 = 342.84 · Purchases returns: Sharp 344.25 + 79.18 = 423.43",
    "Receivables control: 10,776.87 − 342.84 − 5,593.67 → bal 4,840.36 Dr",
    "Payables control: 9,724.26 − 423.43 − 4,549.03 → bal 4,751.80 Cr",
    "VAT: Cr 2,015.19 + 79.18 · Dr 1,818.36 + 64.11 → bal 211.90 Cr (owed to Revenue)",
    "Part C: bank (repayments, interest, security), employee (wages, job security), Revenue (taxes paid)"]),
];

const sheet = `
<h2>Depreciation: open-book sheet</h2>
<p class="muted">Financial Accounting Principles · Assignment 2 (15%) · Thursday 19 November, 1pm</p>
<h3>1. Read the policy line first</h3>
<ul><li><b>Full year in year of purchase, none in year of sale</b>: count financial years held.</li><li><b>One month's ownership = one month's depreciation</b>: × months ÷ 12.</li></ul>
<h3>2. Formulas</h3>
<div class="formula">SL charge = Closing cost × rate
RB charge = (Closing cost − acc dep of assets STILL HELD) × rate
NBV = Cost − Acc dep
Trade-in allowance = New asset cost − cash paid
Profit/(loss) on disposal = Proceeds − NBV</div>
<h3>3. The 7 steps</h3>
<ol><li>Opening balances: Cost a/c (Dr), Acc dep a/c (Cr)</li><li>Purchases → Dr Cost a/c (Cr Bank). Trade-in: full cost, split Cr Bank / Cr Disposal</li><li>Disposal: Cr Cost a/c with its cost → Dr Disposal · Dr Acc dep with its acc dep → Cr Disposal</li><li>Balance the Cost account</li><li>This year's charge: Dr P&amp;L, Cr Acc dep</li><li>Disposal a/c: Cr proceeds / trade-in → balancing figure = profit (Dr side) or loss (Cr side)</li><li>Balance the Acc dep account</li></ol>
<h3>4. RB: acc dep on a disposed asset</h3>
<div class="formula">Yr 1: Cost × r = D1          NBV1 = Cost − D1
Yr 2: NBV1 × r = D2          NBV2 = NBV1 − D2
Acc dep on disposal = D1 + D2 + … (years held, none in year of sale)</div>
<h3>5. Account layouts</h3>
<div class="tablewrap"><table class="taccount"><tr><th>Cost a/c — Dr</th><th>Cr</th></tr><tr><td>Bal b/d · Bank (additions) · Disposal (trade-in part)</td><td>Disposal (cost of asset sold) · Bal c/d</td></tr></table></div>
<div class="tablewrap"><table class="taccount"><tr><th>Acc dep a/c — Dr</th><th>Cr</th></tr><tr><td>Disposal (acc dep of asset sold) · Bal c/d</td><td>Bal b/d · P&amp;L (this year's charge)</td></tr></table></div>
<div class="tablewrap"><table class="taccount"><tr><th>Disposal a/c — Dr</th><th>Cr</th></tr><tr><td>Cost a/c (cost) · P&amp;L (profit)</td><td>Acc dep · Bank / trade-in · P&amp;L (loss)</td></tr></table></div>
<h3>6. Checks before you hand up</h3>
<ul><li>Dates on every entry, with "bal b/d" on the first day of each year</li><li>Both years done if asked for two years</li><li>RB: did you take the sold asset's acc dep out BEFORE calculating the charge?</li><li>Profit means over-depreciated, loss means under-depreciated</li><li>SOFP extract if asked: Cost | Acc dep | NBV</li></ul>`;

module.exports = {
  slug: "financial-accounting-principles",
  topics, questions, cards, written, sheet,
  calc: [
    { id: "dep-sl", t: "dep" }, { id: "dep-rb", t: "dep" }, { id: "dep-months", t: "dep" },
    { id: "dep-disposal", t: "disp" }, { id: "trade-in", t: "disp" }, { id: "dep-charge-pool", t: "disp" },
    { id: "cost-of-sales", t: "pl" }, { id: "vat-line", t: "db" },
  ],
  tests: [
    { id: "depreciation", title: "Depreciation assignment", date: "2026-11-19", when: "Thu 19 Nov · 1pm", weight: "15%",
      format: "In class · open book (printed notes allowed, no laptops or phones) · bring a calculator",
      modes: ["sheet", "calc", "written", "cards", "drill", "notes"], topics: ["dep", "disp"] },
    { id: "final", title: "Christmas exam", date: "2026-12", when: "From 4 Dec", weight: "70%",
      format: "Section A: P&L and SOFP, compulsory, 40 marks · Section B: any 2 of 3, 30 marks each",
      modes: ["written", "calc", "cards", "drill", "notes"] },
  ],
  sources: "Financial Accounting Principles Moodle: subject introduction, depreciation questions, tutorials and solutions, double entry, day books, P&L/SOFP questions and solutions, and Mags's announcement of the 19 Nov assignment.",
};
