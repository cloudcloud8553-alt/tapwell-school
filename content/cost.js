// Source for data/cost-accounting-core.json
const tw = (head, rows) => `<div class="tablewrap"><table><tr>${head.map(h => `<th>${h}</th>`).join("")}</tr>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</table></div>`;

const notes = {
class: `
<p>Costs are classified by <span class="k">nature</span> (materials, labour, expenses), <span class="k">behaviour</span> (fixed, variable, semi-variable) and <span class="k">function</span> (production, administration, selling and distribution).</p>
<ul><li><b>Direct</b> costs can be traced to a unit (direct materials, direct labour, direct expenses). <b>Indirect</b> costs can't, so they're overheads.</li>
<li><b>Prime cost</b> = all direct costs. <b>Conversion cost</b> = direct labour + direct expenses + production overheads.</li>
<li><b>Product costs</b> (materials, labour, factory overheads) vs <b>period costs</b> (marketing, admin).</li>
<li><b>Fixed</b>: constant within the relevant range (depreciation, rent). <b>Variable</b>: change with activity (materials). <b>Mixed / semi-variable</b>: both (phone: line rental + calls).</li>
<li><b>Sunk</b> costs are already incurred and unrecoverable, so they're irrelevant to decisions. <b>Opportunity</b> cost is the benefit forgone. <b>Relevant</b> costs are future and differ between options.</li>
<li><b>Cost centre</b>: a location or function costs are collected for (a department). <b>Cost unit</b>: a unit of product or service costed (a widget, a batch).</li></ul>`,
price: `
<div class="formula">Direct materials
+ Direct labour
+ Direct expenses
= PRIME COST
+ Production overheads
= PRODUCTION COST
+ Administration overheads
+ Selling & distribution overheads
= TOTAL COST
+ Profit (mark-up on total cost)
= SELLING PRICE</div>
<p><span class="k">TUS Widget (Q1):</span> materials 3m × €5 = 15 · labour: machine ½ hr × €20 = 10 + man 3 hrs × €12 = 36 · direct expenses 8 → <b>prime cost 69</b>. Production OH 20% of prime = 13.80 → <b>production cost 82.80</b>. Admin 10% of production = 8.28, S&amp;D 12.5% of production = 10.35 → <b>total cost 101.43</b>. Profit 25% = 25.36 → <b>selling price €126.79</b>.</p>
<div class="trap"><b>Trap:</b> read what each % is "of": prime cost, production cost, direct labour, materials, or a rate per machine hour. Each question mixes them on purpose.</div>
<p><span class="k">Production overheads:</span> factory rent, insurance, light and heat, rates, security, supervisors' wages, factory depreciation. <span class="k">Admin:</span> stationery, computers, postage, audit fees, clerical and managers' wages. <span class="k">S&amp;D:</span> sales wages, advertising, commission, discounts, transport, customs.</p>`,
inv: `
<p><span class="k">Why hold inventory:</span> meet expected demand, buffer between processes, cover future shortages, bulk discounts, seasonal swings, smooth production, maturing (cheese, alcohol), hedge against inflation.</p>
<p>Three types: raw materials, work in progress, finished goods. Holding costs: rent, security, insurance, light, staff, shelving, transport, refrigeration, interest on capital tied up, obsolescence, deterioration. <span class="k">Stockout costs:</span> lost contribution, lost future sales, lost goodwill, production stoppages, labour frustration, urgent small orders.</p>
<div class="formula">Re-order level   = Max usage × Max lead time
Minimum level    = ROL − (Normal usage × Normal lead time)
Maximum level    = ROL − (Min usage × Min lead time) + Re-order quantity
Average inventory = Minimum level + ½ × Re-order quantity
EOQ              = √(2 × Co × D ÷ Ch)
   Co = cost per order · D = annual demand · Ch = holding cost per unit</div>
<p>Normal lead time = the average of the min and max (11–15 days → 13). <b>Worked (Q1, Part SF525):</b> ROL 6,300 · min 6,300 − 350 × 13 = 1,750 · max 6,300 − 180 × 11 + 6,500 = 10,820.</p>
<p>Minimum level warns management that stock is dangerously low. Maximum level warns that stock is reaching a wasteful level.</p>
<p><span class="k">FIFO</span>: issues come from the oldest stock, so closing stock is valued at the most recent prices. <span class="k">LIFO</span>: issues come from the newest stock, so closing stock is at the oldest prices. <span class="k">Weighted average</span>: recalculate the average cost after each receipt (total value ÷ total units) and issue at that.</p>
${tw(["When prices are rising", "FIFO", "LIFO", "Weighted avg"], [["Closing stock value", "Highest", "Lowest", "Middle"], ["Cost of sales", "Lowest", "Highest", "Middle"], ["Gross profit", "Highest", "Lowest", "Middle"]])}
<p><span class="k">JIT</span> (Japanese philosophy): hold no inventory, suppliers deliver exactly when needed, aim for zero defects. Needs a few reliable suppliers, frequent small deliveries, quality materials. Benefits: frees cash and space, faster throughput, fewer defects (Dell). Risk: one supply disruption stops production (Toyota's brake-part fire). Hard and expensive to introduce.</p>`,
lab: `
<p><span class="k">Direct labour</span> is traceable to a product (assembler, toy painter). <span class="k">Indirect labour</span> isn't (supervisor, worker moving parts between products).</p>
<div class="formula">Time rate:  hours × rate
Piece rate: units × rate per unit (quality units only)
Overtime:   basic hours × rate + overtime hours × rate      → direct labour
            + premium: hrs × rate × 0.5 (time-and-a-half), hrs × rate × 1 (double) → normally production overhead
Labour turnover % = leavers replaced ÷ average workforce × 100
Average workforce = (opening + closing) ÷ 2</div>
<p><b>Overtime premium</b> is direct only if the customer asked for the rush job. Otherwise (inefficiency, another department's delay, general policy) it's an overhead, so overtime products don't look dearer.</p>
<p><b>Idle time</b>: controllable (machine breakdown, slept in, didn't turn machines on) → production overhead. Uncontrollable (power cut) → direct labour.</p>
<p><span class="k">Kevin Hennessy:</span> 52 hrs at €10, 7 Sat at time-and-a-half, 5 Sun at double. Basic 400 + overtime 120 + premium 35 + 50 = <b>€605</b>.</p>
<p><span class="k">Differential piecework:</span> pay higher rates on higher output bands. Samantha: 97 units → 80 × €1 + 10 × €1.20 + 7 × €1.30 = <b>€101.10</b>. <span class="k">Duggan Co. turnover:</span> 46 ÷ ((200 + 196) ÷ 2) × 100 = <b>23.23%</b>.</p>
<p>A good incentive scheme has clear attainable objectives, simple rules, full acceptance (including unions), is fair to both sides, is well communicated, pays promptly, and rewards only those who made the effort.</p>`,
ovh: `
<p>An <span class="k">overhead</span> is an indirect cost that can't be traced to a unit. It must still be charged to products so the total cost and selling price are right.</p>
<ul><li><b>Allocation</b>: charge a whole cost to the one cost centre that caused it.</li>
<li><b>Apportionment</b>: share a cost between centres on a fair basis.</li>
<li><b>Reapportionment</b>: move service department costs (stores, maintenance) into production departments.</li>
<li><b>Absorption</b>: charge production overheads to units with an absorption rate.</li></ul>
${tw(["Overhead", "Basis of apportionment"], [["Rent, rates, insurance, security, building depreciation", "Floor area"], ["Supervisors' salaries, PRSI, overtime premium, idle time", "Number of employees"], ["Machine depreciation, machine insurance", "Machine value or machine hours"], ["Power", "Machine hours / kWh"], ["Canteen", "Number of employees"]])}
<div class="formula">Overhead absorption rate (OAR) = Budgeted overheads ÷ Budgeted activity (labour hrs or machine hrs)
Absorbed = Actual activity × OAR
Absorbed < Actual overheads → UNDER-absorbed → Dr P&L (expense)
Absorbed > Actual overheads → OVER-absorbed  → Cr P&L (gain)</div>
<p><span class="k">X Ltd:</span> OAR €2 per labour hour, actual hours 220,000 → absorbed 440,000. Actual overheads 480,000 → <b>under-absorbed €40,000</b>.</p>
<p>Use labour hours for a labour-intensive department and machine hours for a machine-intensive one.</p>`,
};

const topics = [
  { id: "inv", name: "Inventory: valuation and control", modes: ["calc", "cards", "drill"], why: "The biggest topic on Moodle. FIFO/LIFO/WA and the stock-level formulas are pure method, so drill the numbers.", notes: notes.inv },
  { id: "lab", name: "Labour", modes: ["calc", "cards"], why: "Overtime, idle time, piecework and turnover all have one right method. Practise until the overhead split is automatic.", notes: notes.lab },
  { id: "ovh", name: "Overheads and absorption", modes: ["calc", "written", "cards"], why: "Apportionment bases are memory work. OAR and under/over absorption are calculations.", notes: notes.ovh },
  { id: "price", name: "Cost and selling price", modes: ["calc", "drill"], why: "One build-up layout. Get the order right and read what each % is of.", notes: notes.price },
  { id: "class", name: "Cost classification", modes: ["cards", "drill"], why: "Definitions. Flashcards are the fastest way.", notes: notes.class },
];

const Q = (t, q, o, a, e) => ({ t, q, o, a, e });
const questions = [
  Q("class", "Prime cost is:", ["Direct materials + direct labour + direct expenses", "Total production cost", "Fixed costs + variable costs", "Materials only"], 0, "All direct costs."),
  Q("class", "Wages of a supervisor in the production department are:", ["Direct labour", "Indirect labour (production overhead)", "Administration overhead", "Prime cost"], 1, "Can't be traced to a specific unit."),
  Q("class", "A cost that stays constant within the relevant range of output is:", ["Variable", "Fixed", "Semi-variable", "Direct"], 1, "e.g. depreciation, rent."),
  Q("class", "A phone bill with line rental plus call charges is:", ["Fixed", "Variable", "Semi-variable (mixed)", "Sunk"], 2, "Fixed part plus variable part."),
  Q("class", "A cost already incurred that can't be recovered is a:", ["Sunk cost", "Opportunity cost", "Relevant cost", "Variable cost"], 0, "Ignore sunk costs in decisions."),
  Q("class", "Conversion cost equals:", ["Materials + labour", "Direct labour + direct expenses + production overheads", "Prime cost + admin", "Total cost − profit"], 1, "The cost of converting raw materials into finished goods."),
  Q("class", "A 'cost unit' is:", ["A department costs are collected for", "A unit of product or service that's costed", "The accountant's office", "An overhead"], 1, "A cost centre is a location or department."),
  Q("price", "Production cost equals:", ["Prime cost + production overheads", "Prime cost + all overheads", "Total cost + profit", "Materials + labour"], 0, "Admin and S&D overheads come after production cost."),
  Q("price", "TUS Widget: prime cost €69, production overhead 20% of prime cost. Production cost:", ["€82.80", "€69.00", "€13.80", "€86.25"], 0, "69 + 13.80 = 82.80."),
  Q("price", "Total cost €101.43, mark-up 25% of cost. Selling price:", ["€126.79", "€125.00", "€135.24", "€76.07"], 0, "101.43 × 1.25 = 126.79."),
  Q("price", "Advertising is classified as:", ["Production overhead", "Administration overhead", "Selling and distribution overhead", "Direct expense"], 2, ""),
  Q("price", "Audit and accountancy fees are:", ["Production overhead", "Administration overhead", "S&D overhead", "Prime cost"], 1, ""),
  Q("inv", "Re-order level formula:", ["Normal usage × normal lead time", "Max usage × max lead time", "Min usage × min lead time", "EOQ ÷ 2"], 1, "Order when stock hits this, so you can't run out even in the worst case."),
  Q("inv", "Minimum (safety) level =", ["ROL − (normal usage × normal lead time)", "ROL + ROQ", "Max usage × max lead time", "ROL − (min usage × min lead time) + ROQ"], 0, "Normal lead time = average of min and max."),
  Q("inv", "Maximum level =", ["ROL + ROQ", "ROL − (min usage × min lead time) + ROQ", "ROL − (normal usage × normal lead time)", "Min level + ½ ROQ"], 1, ""),
  Q("inv", "Average inventory =", ["(Max + min) ÷ 2", "Minimum level + ½ × re-order quantity", "ROL ÷ 2", "EOQ × 2"], 1, ""),
  Q("inv", "ROL 6,300; normal usage 350/day; lead time 11–15 days. Minimum level:", ["1,750", "2,450", "4,550", "6,300"], 0, "6,300 − 350 × 13 = 1,750."),
  Q("inv", "EOQ with Co €32, D 25,000, Ch €6.40:", ["250", "500", "1,000", "5,000"], 1, "√(2 × 32 × 25,000 ÷ 6.40) = √250,000 = 500."),
  Q("inv", "In EOQ, 'Ch' is:", ["Cost of each order", "Holding cost per unit per year", "Annual demand", "Purchase price"], 1, "Co = ordering cost, D = demand."),
  Q("inv", "When prices are rising, which method gives the HIGHEST closing stock value?", ["FIFO", "LIFO", "Weighted average", "All the same"], 0, "FIFO leaves the newest (dearest) stock on hand."),
  Q("inv", "When prices are rising, LIFO gives:", ["Highest profit", "Lowest closing stock and lowest profit", "Highest closing stock", "Same profit as FIFO"], 1, "Issues at the latest (highest) prices → higher cost of sales."),
  Q("inv", "Under JIT, inventory levels are:", ["High to avoid stockouts", "Close to zero", "Set by EOQ", "Seasonal"], 1, "Goods arrive just as they're needed."),
  Q("inv", "The main risk of JIT is:", ["High storage costs", "Production stops if one supplier fails", "Obsolete stock", "Bulk discounts lost"], 1, "Toyota's brake-part fire."),
  Q("inv", "Which is a holding cost?", ["Lost sales", "Insurance on stock", "Urgent small orders", "Loss of goodwill"], 1, "The others are stockout costs."),
  Q("inv", "Which is a stockout cost?", ["Rent of warehouse", "Loss of customer goodwill", "Refrigeration", "Interest on capital tied up"], 1, ""),
  Q("lab", "Overtime premium is normally charged to:", ["Direct labour", "Production overhead", "Admin overhead", "The customer"], 1, "Unless the customer requested the overtime for their job."),
  Q("lab", "Overtime worked at the customer's special request: the premium is:", ["Production overhead", "A direct labour cost of that job", "Admin overhead", "Ignored"], 1, ""),
  Q("lab", "Idle time from a machine breakdown is:", ["Uncontrollable → direct labour", "Controllable → production overhead", "Ignored", "Admin overhead"], 1, "Controllable idle time goes to overhead."),
  Q("lab", "Idle time from a power cut is:", ["Controllable → overhead", "Uncontrollable → direct labour", "Deducted from wages", "S&D overhead"], 1, ""),
  Q("lab", "40 basic hrs at €10, plus 7 Saturday hrs (time-and-a-half) and 5 Sunday hrs (double). Gross wages:", ["€520", "€605", "€585", "€640"], 1, "400 + 120 + 35 + 50 = 605."),
  Q("lab", "Labour turnover: 46 leavers replaced, 200 employees at the start, 196 at the end:", ["23.00%", "23.23%", "25.25%", "23.47%"], 1, "46 ÷ 198 × 100."),
  Q("lab", "A differential piecework scheme pays:", ["A flat rate for all units", "Higher rates for higher output bands", "Hourly only", "A bonus to supervisors"], 1, ""),
  Q("lab", "A problem with straight piece rate is that workers:", ["Are paid for faulty units", "Only get paid for units meeting quality, even if rejects weren't their fault", "Earn too little", "Can't increase pay"], 1, "Poor materials or tools cause rejects, but the worker pays."),
  Q("ovh", "Sharing rent between departments on floor area is:", ["Allocation", "Apportionment", "Absorption", "Reapportionment"], 1, ""),
  Q("ovh", "Moving stores department costs into production departments is:", ["Allocation", "Absorption", "Reapportionment", "Apportionment"], 2, "Service department costs must end up in production departments."),
  Q("ovh", "The best basis for apportioning supervisors' salaries:", ["Floor area", "Number of employees", "Machine hours", "Value of machinery"], 1, ""),
  Q("ovh", "Budgeted overheads €500,000, budgeted labour hours 250,000. OAR:", ["€0.50", "€2.00", "€2.50", "€5.00"], 1, ""),
  Q("ovh", "OAR €2/hr, actual hours 220,000, actual overheads €480,000. Result:", ["€40,000 over-absorbed", "€40,000 under-absorbed", "€80,000 under-absorbed", "No difference"], 1, "Absorbed 440,000 < actual 480,000."),
  Q("ovh", "Under-absorbed overhead is:", ["Credited to the P&L as a gain", "Debited to the P&L as an expense", "Added to inventory", "Ignored"], 1, "We under-charged customers, which reduces profit."),
  Q("ovh", "A machine-intensive department should absorb overheads using:", ["Labour hours", "Machine hours", "Floor area", "Number of units sold"], 1, ""),
];

const C = (t, f, b) => ({ t, f, b });
const cards = [
  C("class", "Prime cost", "Direct materials + direct labour + direct expenses."),
  C("class", "Conversion cost", "Direct labour + direct expenses + production overheads."),
  C("class", "Three ways to classify costs", "Nature (materials, labour, expenses) · behaviour (fixed, variable, semi-variable) · function (production, admin, S&D)."),
  C("class", "Fixed vs variable vs semi-variable", "Constant within relevant range · changes with activity · both parts."),
  C("class", "Product vs period costs", "Manufacturing costs (in inventory until sold) vs marketing and admin (expensed now)."),
  C("class", "Sunk / opportunity / relevant", "Already spent and irrelevant · benefit forgone · future costs that differ between options."),
  C("class", "Cost centre vs cost unit", "Department where costs are collected vs unit of output that's costed."),
  C("price", "Selling price build-up", "Prime cost → + production OH = production cost → + admin + S&D = total cost → + profit = selling price."),
  C("price", "Examples of production overheads", "Factory rent, insurance, light and heat, rates, security, supervisors' wages, factory depreciation."),
  C("price", "Examples of admin overheads", "Stationery, computers, postage, audit fees, clerical and managers' wages."),
  C("price", "Examples of S&D overheads", "Sales wages, advertising, promotion, commission, discounts, transport, customs."),
  C("inv", "Re-order level", "Max usage × max lead time."),
  C("inv", "Minimum level", "ROL − (normal usage × normal lead time)."),
  C("inv", "Maximum level", "ROL − (min usage × min lead time) + re-order quantity."),
  C("inv", "Average inventory", "Minimum level + ½ re-order quantity."),
  C("inv", "EOQ", "√(2 × Co × D ÷ Ch). Co = order cost, D = annual demand, Ch = holding cost per unit."),
  C("inv", "Normal lead time", "Average of min and max (11–15 days → 13)."),
  C("inv", "FIFO", "Issue the oldest first. Closing stock at the latest prices. Highest profit when prices rise."),
  C("inv", "LIFO", "Issue the newest first. Closing stock at the oldest prices. Lowest profit when prices rise."),
  C("inv", "Weighted average", "Recalculate the average cost after every receipt. Issues at that average."),
  C("inv", "Reasons to hold inventory (5)", "Meet demand, buffer between processes, bulk discounts, seasonal fluctuations, smooth production (also maturing, inflation hedge)."),
  C("inv", "Holding costs", "Rent, security, insurance, staff, shelving, refrigeration, interest on capital, obsolescence, deterioration."),
  C("inv", "Stockout costs", "Lost contribution, lost future sales, lost goodwill, production stoppages, labour frustration, urgent small orders."),
  C("inv", "JIT characteristics", "Few reliable suppliers, good relationships, frequent small deliveries, quality materials, near-zero stock, zero defects."),
  C("inv", "JIT advantages and disadvantages", "Frees cash and space, faster throughput, fewer defects · supply disruption halts production, expensive to introduce."),
  C("inv", "Periodic vs continuous stocktaking", "Count everything once or twice a year (disruptive, inaccurate) vs random/selective checks all year (finds problems faster, deters theft)."),
  C("lab", "Direct vs indirect labour", "Traceable to the product (assembler) vs not (supervisor, materials handler)."),
  C("lab", "Overtime premium goes to…", "Production overhead, unless the customer requested the overtime (then direct)."),
  C("lab", "Controllable idle time", "Machine breakdown, late start → production overhead."),
  C("lab", "Uncontrollable idle time", "Power cut → direct labour."),
  C("lab", "Labour turnover", "Leavers replaced ÷ average workforce × 100. Average = (opening + closing) ÷ 2."),
  C("lab", "Conditions for a good incentive scheme", "Clear attainable objectives, simple rules, accepted by all, fair, communicated, paid promptly, rewards only extra effort."),
  C("lab", "Time rate vs piece rate", "Hours × rate vs good units × rate per unit."),
  C("ovh", "Allocation", "Whole cost charged to the one cost centre that caused it."),
  C("ovh", "Apportionment", "Cost shared between cost centres on a fair basis."),
  C("ovh", "Reapportionment", "Service department costs moved into production departments."),
  C("ovh", "Absorption", "Charging production overheads to units with an OAR (per unit, labour hour or machine hour)."),
  C("ovh", "Basis for rent, rates, insurance", "Floor area."),
  C("ovh", "Basis for supervisors, PRSI, canteen", "Number of employees."),
  C("ovh", "Under-absorbed overhead", "Absorbed < actual → Dr P&L (expense)."),
  C("ovh", "Over-absorbed overhead", "Absorbed > actual → Cr P&L (gain)."),
];

const W = (t, src, marks, q, points) => ({ t, src, marks, q, points });
const written = [
  W("price", "Cost + Selling Price Q1", 10, "TUS Co. makes a Widget: materials 3m @ €5; machine ½ hr @ €20; man hours 3 @ €12; direct expenses €8. Production overhead 20% of prime cost; admin 10% of production cost; S&D 12.5% of production cost; profit 25% of unit cost. Calculate the selling price.", [
    "Direct materials 15, direct labour 10 + 36 = 46, direct expenses 8",
    "Prime cost 69",
    "Production overhead 13.80 → production cost 82.80",
    "Admin 8.28 + S&D 10.35 → total cost 101.43",
    "Profit 25.36 → selling price €126.79"]),
  W("inv", "Re-order levels Q1 (Part SF525)", 10, "Normal consumption 350 units/day, minimum 180, maximum 420. Lead time 11–15 days. Re-order quantity 6,500; re-order level 6,300. Calculate the minimum and maximum inventory, and explain why both levels matter.", [
    "Normal lead time = (11 + 15) ÷ 2 = 13 days",
    "Minimum = 6,300 − (350 × 13) = 1,750 units",
    "Maximum = 6,300 − (180 × 11) + 6,500 = 10,820 units",
    "Minimum: warns management stock is dangerously low",
    "Maximum: warns stock is reaching a wasteful level (holding costs, obsolescence)"]),
  W("inv", "FIFO/LIFO/WA Q3 (Stephanie Muckell)", 15, "Outline the advantages and disadvantages of FIFO, LIFO and weighted average stock valuation.", [
    "FIFO: logical (matches physical flow), closing stock at up-to-date prices · but cost of sales at old prices, so profit is overstated when prices rise",
    "LIFO: cost of sales at current prices (realistic profit) · but closing stock at out-of-date prices, and not allowed under IAS 2 for financial statements",
    "WA: smooths price changes, easy to justify · but needs recalculating after every receipt, and issue prices aren't actual prices paid",
    "Rising prices: FIFO gives the highest profit and closing stock, LIFO the lowest",
    "Choice affects reported profit, tax and stock values in the SOFP"]),
  W("lab", "Labour notes, Example 3 (James Murphy)", 10, "Normal week 40 hrs at €5. James worked 52 hrs: 7 Saturday (time-and-a-half), 5 Sunday (double), as general company policy. 5 hours were lost to machine breakdowns. Calculate total wages, the direct labour charge and the production overhead charge.", [
    "Basic 40 × 5 = 200 · overtime 12 × 5 = 60",
    "Premium 7 × 5 × 0.5 = 17.50 + 5 × 5 × 1 = 25 → total wages 302.50",
    "Direct labour: (40 − 5 idle) × 5 = 175 + overtime 60 = 235",
    "Production overhead: controllable idle 25 + premium 42.50 = 67.50",
    "Check: 235 + 67.50 = 302.50"]),
  W("ovh", "Overheads notes", 12, "Explain allocation, apportionment, reapportionment and absorption of overheads, and give a suitable basis of apportionment for three overheads.", [
    "Allocation: whole cost to the one cost centre that caused it",
    "Apportionment: shared fairly between cost centres using a basis",
    "Reapportionment: service department costs moved to production departments",
    "Absorption: charged to units with an OAR (per unit, labour hour or machine hour)",
    "Bases: rent and insurance → floor area · supervisors → number of employees · machine depreciation → machine value"]),
];

module.exports = {
  slug: "cost-accounting-core",
  topics, questions, cards, written,
  calc: [
    { id: "stock-levels", t: "inv" }, { id: "eoq", t: "inv" }, { id: "fifo-lifo-wa", t: "inv" },
    { id: "overtime", t: "lab" }, { id: "diff-piece", t: "lab" }, { id: "turnover", t: "lab" },
    { id: "oar", t: "ovh" }, { id: "selling-price", t: "price" },
  ],
  tests: [
    { id: "final", title: "Christmas exam", date: "2026-12-11", when: "Fri 11 Dec · 9:30–11:30", weight: "70%",
      format: "Format TBC: check with Ali whether it's on paper or online on Moodle · bring a calculator",
      modes: ["calc", "written", "cards", "drill", "notes"] },
  ],
  sources: "Cost Accounting – Core Moodle: syllabus, inventory, JIT, labour, overheads, cost and selling price and cost classification notes, plus tutorial questions and solutions. No past exam papers are posted for this module.",
};
