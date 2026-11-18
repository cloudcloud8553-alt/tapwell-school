"use strict";
// [name, category, explanation if tricky, debit-balance override]
const ITEMS = [
  ["Delivery van", "Asset"], ["Premises", "Asset"], ["Closing inventory", "Asset"], ["Trade receivables", "Asset", "Customers owe you this money, so it's an asset."],
  ["Cash at bank", "Asset"], ["Petty cash", "Asset"], ["Prepaid insurance", "Asset", "Paid in advance, so the business is owed future cover. That's an asset."],
  ["Office equipment", "Asset"], ["Goodwill", "Asset", "Goodwill is an intangible non-current asset."], ["Machinery", "Asset"], ["Rent paid in advance", "Asset", "A prepayment is an asset: you're owed future use of the property."],
  ["Land", "Asset"], ["Computer equipment", "Asset"], ["Investments", "Asset"],
  ["Trade payables", "Liability", "You owe suppliers this money."], ["Bank overdraft", "Liability", "An overdraft is money owed to the bank, so it's a liability."], ["Bank loan (5 years)", "Liability"],
  ["Accrued wages", "Liability", "Wages earned by staff but not yet paid are owed, so they're a liability."], ["VAT owed to Revenue", "Liability"], ["PAYE owed to Revenue", "Liability"],
  ["Mortgage", "Liability"], ["Rent received in advance", "Liability", "Received in advance means you still owe the tenant the property. That's a liability, not income yet."],
  ["Accrued electricity", "Liability", "Electricity used but not yet billed or paid is owed, so it's a liability."], ["Lease liability", "Liability"],
  ["Capital", "Equity", "Capital is the owner's stake in the business."], ["Share capital", "Equity"], ["Retained earnings", "Equity", "Profits kept in the business belong to the owners, so they're equity."],
  ["Drawings", "Equity", "Drawings reduce the owner's capital, so they sit in equity, with a debit balance.", "Debit"], ["Share premium", "Equity"], ["Revaluation reserve", "Equity"],
  ["Sales", "Income"], ["Rent received", "Income"], ["Interest received", "Income"], ["Discount received", "Income", "A discount you receive from a supplier saves you money, so it's income."],
  ["Commission received", "Income"], ["Profit on disposal", "Income"],
  ["Wages", "Expense"], ["Rent paid", "Expense"], ["Electricity", "Expense"], ["Insurance", "Expense"], ["Depreciation", "Expense", "Depreciation is the cost of using up an asset, so it's an expense."],
  ["Bad debts", "Expense", "Debts you can't collect are a cost to the business."], ["Carriage outwards", "Expense", "Delivering goods to customers is a selling expense."], ["Advertising", "Expense"],
  ["Bank charges", "Expense"], ["Discount allowed", "Expense", "A discount you give a customer costs you money, so it's an expense."], ["Loss on disposal", "Expense"],
  ["Purchases", "Expense", "Purchases of goods for resale go to cost of sales, an expense with a debit balance."], ["Carriage inwards", "Expense", "Carriage inwards is added to the cost of purchases, so it's an expense."],
  ["Repairs", "Expense"], ["Audit fees", "Expense"],
];
const CATS = ["Asset", "Liability", "Equity", "Income", "Expense"];
const HINT = { Asset: "something the business owns or is owed", Liability: "something the business owes", Equity: "the owner's stake in the business", Income: "money earned", Expense: "a cost of running the business" };
const art = c => /^[AEIOU]/.test(c) ? "an" : "a";
const bal = it => it[3] || (it[1] === "Asset" || it[1] === "Expense" ? "Debit" : "Credit");
let bag = [];
TW.game({
  id: "account-sort", title: "Account Sort", kind: "speed", seconds: 60,
  how: `<p>An account name flashes up. Sort it into the right box, fast.</p><ul><li>Assets, liabilities, equity, income or expenses</li><li>Or switch modes and call its normal balance: debit or credit</li></ul>`,
  modes: [["cat", "Five categories", "Asset, liability, equity, income or expense."], ["bal", "Debit or credit?", "Which side does this account normally sit on? Remember DEAD CLIC: Debits are Expenses, Assets, Drawings. Credits are Liabilities, Income, Capital."]],
  ranks: [[0, "Intern"], [800, "Bookkeeper"], [2000, "Accounts clerk"], [3500, "Junior accountant"], [5500, "Senior accountant"], [8000, "CFO"]],
  next(mode) {
    if (!bag.length) bag = TW.shuffle(ITEMS);
    const it = bag.pop();
    if (mode === "bal") {
      const ans = bal(it);
      return { tag: "Debit or credit?", prompt: `<span class="big">${TW.esc(it[0])}</span>`, choices: ["Debit", "Credit"], correct: ans === "Debit" ? 0 : 1, cols: 2,
        explain: `${TW.esc(it[0])} has a ${ans.toLowerCase()} balance. ${it[2] || `It's ${art(it[1])} ${it[1].toLowerCase()}, and ${it[1].toLowerCase()} accounts normally sit on the ${ans.toLowerCase()} side.`}`,
        short: it[0], answerText: ans };
    }
    return { tag: "Which category?", prompt: `<span class="big">${TW.esc(it[0])}</span>`, choices: CATS, correct: CATS.indexOf(it[1]), cols: 2,
      explain: it[2] || `${TW.esc(it[0])} is ${art(it[1])} ${it[1].toLowerCase()}: ${HINT[it[1]]}.`,
      short: it[0], answerText: it[1] };
  },
});
