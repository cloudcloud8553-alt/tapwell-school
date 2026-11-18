"use strict";
// Each: text(amount) , debit, credit, why
const T = [
  [a => `Bought goods for resale on credit, ${a}`, "Purchases", "Trade payables", "Purchases go up (debit). You owe the supplier (credit payables)."],
  [a => `Paid a supplier ${a} by bank transfer`, "Trade payables", "Bank", "You owe less (debit payables). Money leaves the bank (credit bank)."],
  [a => `Sold goods for cash, ${a}, lodged to the bank`, "Bank", "Sales", "Money comes in (debit bank). Sales income goes up (credit sales)."],
  [a => `Sold goods on credit to a customer, ${a}`, "Trade receivables", "Sales", "The customer owes you (debit receivables). Sales go up (credit sales)."],
  [a => `A customer paid their ${a} bill by bank`, "Bank", "Trade receivables", "Money in (debit bank). The customer owes less (credit receivables)."],
  [a => `The owner took ${a} from the bank for personal use`, "Drawings", "Bank", "Drawings go up (debit). Money leaves the bank (credit)."],
  [a => `The owner put ${a} of their own money into the business bank account`, "Bank", "Capital", "Money in (debit bank). The owner's stake goes up (credit capital)."],
  [a => `Bought a delivery van for ${a}, paid with a bank loan`, "Motor vehicles", "Bank loan", "A new asset (debit vehicles). You owe the bank (credit loan)."],
  [a => `Paid rent of ${a} by bank`, "Rent", "Bank", "An expense goes up (debit rent). Money leaves the bank (credit)."],
  [a => `Returned faulty goods worth ${a} to a supplier`, "Trade payables", "Purchases returns", "You owe less (debit payables). Purchases returns go up (credit)."],
  [a => `A customer returned goods worth ${a}`, "Sales returns", "Trade receivables", "Sales returns go up (debit). The customer owes less (credit receivables)."],
  [a => `Charged depreciation of ${a} on machinery`, "Depreciation expense", "Accumulated depreciation", "The expense goes up (debit). Accumulated depreciation, which reduces the asset, goes up (credit)."],
  [a => `Wrote off a customer's ${a} debt as bad`, "Bad debts", "Trade receivables", "An expense (debit bad debts). The customer no longer owes it (credit receivables)."],
  [a => `Received bank interest of ${a}`, "Bank", "Interest received", "Money in (debit bank). Income goes up (credit interest received)."],
  [a => `The owner took goods costing ${a} for their own use`, "Drawings", "Purchases", "Drawings go up (debit). Those goods are no longer business purchases (credit purchases)."],
  [a => `Paid wages of ${a} by bank`, "Wages", "Bank", "An expense goes up (debit wages). Money leaves the bank (credit)."],
  [a => `Bought office equipment for ${a} on credit`, "Office equipment", "Trade payables", "A new asset (debit equipment). You owe the supplier (credit payables)."],
  [a => `Repaid ${a} of the bank loan`, "Bank loan", "Bank", "You owe the bank less (debit loan). Money leaves the bank (credit)."],
  [a => `Paid ${a} cash into the bank from the till`, "Bank", "Cash", "Bank goes up (debit). Cash goes down (credit)."],
  [a => `Received rent of ${a} from a tenant by bank`, "Bank", "Rent received", "Money in (debit bank). Income goes up (credit rent received)."],
];
const label = (d, c) => `<span>Dr ${d}<br>Cr ${c}</span>`;
let bag = [];
TW.game({
  id: "double-entry", title: "Double Entry Dash", kind: "speed", seconds: 90,
  how: `<p>A transaction comes in. Pick the right double entry before the clock runs out.</p><ul><li>Every transaction has a debit and a credit</li><li>Watch out for the reversed entry. It's always one of the options.</li></ul>`,
  ranks: [[0, "Intern"], [800, "Bookkeeper"], [2000, "Accounts clerk"], [3500, "Junior accountant"], [5500, "Senior accountant"], [8000, "Double-entry legend"]],
  next() {
    if (!bag.length) bag = TW.shuffle(T.map((_, i) => i));
    const t = T[bag.pop()], amt = TW.eur(TW.R(4, 120) * 50);
    const right = [t[1], t[2]];
    const opts = [right, [t[2], t[1]]];
    while (opts.length < 4) {
      const o = TW.pick(T), cand = TW.pick([[o[1], t[2]], [t[1], o[2]], [o[1], o[2]]]);
      if (cand[0] !== cand[1] && !opts.some(x => x[0] === cand[0] && x[1] === cand[1])) opts.push(cand);
    }
    const sh = TW.shuffle(opts);
    return { tag: "Pick the double entry", prompt: TW.esc(t[0](amt)), choices: sh.map(o => label(o[0], o[1])), correct: sh.findIndex(o => o === right), cols: 2,
      explain: t[3], short: t[0](amt), answerText: `Dr ${t[1]} / Cr ${t[2]}` };
  },
});
