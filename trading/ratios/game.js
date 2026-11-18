"use strict";
const { R, pick, eur, num, shuffle } = TW;
const W = rows => `<div class="working">${rows.join("<br>")}</div>`;
const NAMES = ["Shannon Bikes Ltd", "Corrib Coffee Ltd", "Moylish Motors Ltd", "Atlantic Apparel Ltd", "Burren Bakery Ltd", "Clare Cables Ltd", "Treaty Tech Ltd", "Portumna Paints Ltd"];
function company() {
  const rev = R(40, 200) * 10000, gm = R(20, 55) / 100, cos = Math.round(rev * (1 - gm) / 1000) * 1000, gp = rev - cos;
  const opex = Math.round(gp * R(40, 85) / 100 / 1000) * 1000, pbit = gp - opex, interest = Math.round(pbit * R(5, 20) / 100 / 100) * 100, np = pbit - interest;
  const inv = Math.round(cos * R(5, 25) / 100 / 1000) * 1000, rec = Math.round(rev * R(5, 20) / 100 / 1000) * 1000, cash = R(1, 40) * 1000;
  const cl = Math.round((inv + rec + cash) / (R(60, 220) / 100) / 1000) * 1000, ncl = Math.max(5000, Math.round(rev * (R(0, 1) ? R(20, 70) : R(3, 15)) / 100 / 5000) * 5000), eq = Math.max(20000, Math.round(rev * R(35, 90) / 100 / 5000) * 5000);
  return { name: pick(NAMES), rev, cos, gp, opex, pbit, interest, np, inv, rec, cash, ca: inv + rec + cash, cl, ncl, eq };
}
const table = c => `<table class="mini">
<tr><td>Revenue</td><td>${eur(c.rev)}</td></tr><tr><td>Cost of sales</td><td>${eur(c.cos)}</td></tr><tr class="sub"><td>Gross profit</td><td>${eur(c.gp)}</td></tr>
<tr><td>Operating expenses</td><td>${eur(c.opex)}</td></tr><tr class="sub"><td>Profit before interest and tax</td><td>${eur(c.pbit)}</td></tr><tr><td>Interest</td><td>${eur(c.interest)}</td></tr><tr class="sub"><td>Net profit</td><td>${eur(c.np)}</td></tr>
<tr><td>Inventory</td><td>${eur(c.inv)}</td></tr><tr><td>Trade receivables</td><td>${eur(c.rec)}</td></tr><tr><td>Cash</td><td>${eur(c.cash)}</td></tr><tr><td>Current liabilities</td><td>${eur(c.cl)}</td></tr>
<tr><td>Long-term loans</td><td>${eur(c.ncl)}</td></tr><tr><td>Equity</td><td>${eur(c.eq)}</td></tr></table>`;
const fmts = { ratio: v => `${v.toFixed(2)} : 1`, pct: v => `${v.toFixed(1)}%`, days: v => `${Math.round(v)} days` };
const RATIOS = [
  ["Current ratio", "ratio", c => c.ca / c.cl, c => [c.cl / c.ca, (c.ca - c.inv) / c.cl, (c.ca + c.cash) / c.cl], c => `Current assets ÷ current liabilities = ${eur(c.ca)} ÷ ${eur(c.cl)}`, v => v < 1 ? "Below 1 means it can't cover short-term debts from current assets. Worry." : v > 2.5 ? "Very high. Safe, but maybe too much cash or stock sitting idle." : "A comfortable range."],
  ["Acid test (quick) ratio", "ratio", c => (c.ca - c.inv) / c.cl, c => [c.ca / c.cl, c.cash / c.cl, c.cl / (c.ca - c.inv)], c => `(Current assets − inventory) ÷ current liabilities = (${eur(c.ca)} − ${eur(c.inv)}) ÷ ${eur(c.cl)}`, v => v < 1 ? "Under 1: without selling stock, it can't pay its short-term debts." : "Over 1: it can pay short-term debts without selling stock."],
  ["Gross profit margin", "pct", c => c.gp / c.rev * 100, c => [c.np / c.rev * 100, c.gp / c.cos * 100, c.pbit / c.rev * 100], c => `Gross profit ÷ revenue × 100 = ${eur(c.gp)} ÷ ${eur(c.rev)} × 100`, v => "Trap: dividing by cost of sales gives the mark-up, not the margin."],
  ["Net profit margin", "pct", c => c.np / c.rev * 100, c => [c.gp / c.rev * 100, c.np / c.cos * 100, c.pbit / c.rev * 100], c => `Net profit ÷ revenue × 100 = ${eur(c.np)} ÷ ${eur(c.rev)} × 100`, v => "Shows how much of each euro of sales is left after every cost."],
  ["Receivable days", "days", c => c.rec / c.rev * 365, c => [c.rec / c.cos * 365, c.rec / c.rev * 52, c.inv / c.rev * 365], c => `Receivables ÷ revenue × 365 = ${eur(c.rec)} ÷ ${eur(c.rev)} × 365`, v => v > 60 ? "Customers are slow to pay. Cash flow risk." : "Customers pay reasonably quickly."],
  ["Inventory days", "days", c => c.inv / c.cos * 365, c => [c.inv / c.rev * 365, c.rec / c.cos * 365, c.inv / c.cos * 52], c => `Inventory ÷ cost of sales × 365 = ${eur(c.inv)} ÷ ${eur(c.cos)} × 365`, v => "Trap: inventory is at cost, so divide by cost of sales, not revenue."],
  ["Return on capital employed (ROCE)", "pct", c => c.pbit / (c.eq + c.ncl) * 100, c => [c.np / (c.eq + c.ncl) * 100, c.pbit / c.eq * 100, c.pbit / c.rev * 100], c => `PBIT ÷ (equity + long-term loans) × 100 = ${eur(c.pbit)} ÷ ${eur(c.eq + c.ncl)} × 100`, v => "Capital employed includes long-term debt, so use profit before interest."],
  ["Gearing", "pct", c => c.ncl / (c.eq + c.ncl) * 100, c => [c.ncl / c.eq * 100, c.eq / (c.eq + c.ncl) * 100, (c.ncl + c.cl) / (c.eq + c.ncl) * 100], c => `Long-term debt ÷ (equity + long-term debt) × 100 = ${eur(c.ncl)} ÷ ${eur(c.eq + c.ncl)} × 100`, v => v > 50 ? "Over 50%: highly geared. Lenders own a big slice of the risk." : "Under 50%: low gearing. Mostly funded by the owners."],
];
let bag = [];
TW.game({
  id: "ratios", title: "Ratio Detective", kind: "rounds", rounds: 8,
  how: `<p>Every company has a secret. Read the accounts and crack the ratio.</p><ul><li>Liquidity, profitability, efficiency and gearing</li><li>The wrong answers are the classic exam mistakes, so read carefully</li><li>Faster answers earn bonus points</li></ul>`,
  ranks: [[0, "Intern"], [400, "Junior analyst"], [1000, "Credit analyst"], [1800, "Equity analyst"], [2600, "Senior analyst"], [3400, "Head of research"]],
  next() {
    if (!bag.length) bag = shuffle(RATIOS.map((_, i) => i));
    const r = RATIOS[bag.pop()], c = company(), f = fmts[r[1]], v = r[2](c);
    const labels = [f(v)];
    for (const w of r[3](c)) { const l = f(w); if (isFinite(w) && !labels.includes(l)) labels.push(l); }
    let k = 1; while (labels.length < 4) { const l = f(v * (1 + 0.25 * k++)); if (!labels.includes(l)) labels.push(l); }
    const sh = shuffle(labels.slice(0, 4));
    return { tag: r[0], prompt: `<b>${c.name}</b>: what's the ${r[0].toLowerCase()}?${table(c)}`, choices: sh, correct: sh.indexOf(f(v)), cols: 2,
      explain: W([`${r[4](c)} = <b>${f(v)}</b>`]) + `<p class="note">${r[5](v)}</p>`, short: `${r[0]} for ${c.name}`, answerText: f(v) };
  },
});
