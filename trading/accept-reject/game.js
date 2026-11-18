"use strict";
const { R, pick, eur, num } = TW;
const W = rows => `<div class="working">${rows.join("<br>")}</div>`;
const SCEN = [
  function specialOrder() {
    const units = R(4, 20) * 100, v = R(18, 60) / 2, fixedPer = R(4, 12), normal = Math.round((v + fixedPer) * 1.4);
    const extra = R(0, 1) ? R(5, 40) * 100 : 0;
    const breakEvenPrice = v + extra / units;
    const price = Math.round((breakEvenPrice + (R(0, 1) ? 1 : -1) * R(1, 6) / 2) * 2) / 2;
    const gain = (price - v) * units - extra, ok = gain > 0;
    return { tag: "Special order", prompt: `A customer offers <b>${eur(price, 2)}</b> each for a one-off order of <b>${num(units)}</b> units. Your normal price is ${eur(normal)}. Each unit costs ${eur(v, 2)} in variable costs plus ${eur(fixedPer)} of fixed overhead absorbed. ${extra ? `The order needs a special tool costing ${eur(extra)}.` : ""} You have spare capacity. Accept?`,
      choices: ["Accept", "Reject"], correct: ok ? 0 : 1, cols: 2,
      explain: `${ok ? "Accept" : "Reject"}: it ${ok ? "adds" : "loses"} ${eur(Math.abs(gain))}.` + W([`Contribution: (${eur(price, 2)} − ${eur(v, 2)}) × ${num(units)} = ${eur((price - v) * units)}`, extra ? `Less special tool: −${eur(extra)}` : "", `<b>Net effect: ${eur(gain)}</b>`].filter(Boolean)) + `<p class="note">Trap: the ${eur(fixedPer)} fixed overhead is irrelevant. It's paid anyway, order or no order. So is the normal price.</p>`,
      short: `Special order at ${eur(price, 2)}`, answerText: ok ? "Accept" : "Reject" };
  },
  function makeOrBuy() {
    const units = R(2, 12) * 1000, v = R(8, 30), avoid = R(0, 1) ? R(2, 20) * 1000 : 0, alloc = R(3, 10) * 1000;
    const makeCost = v * units + avoid, buyAt = Math.round((makeCost / units + (R(0, 1) ? 1 : -1) * R(1, 4) / 2) * 2) / 2, buyCost = buyAt * units;
    const make = makeCost < buyCost;
    return { tag: "Make or buy", prompt: `You need <b>${num(units)}</b> components. Making them costs ${eur(v)} each in variable costs${avoid ? `, plus ${eur(avoid)} for a supervisor you'd only hire to make them` : ""}. Head office also charges ${eur(alloc)} of general overhead to the department either way. A supplier quotes <b>${eur(buyAt, 2)}</b> each. Make or buy?`,
      choices: ["Make", "Buy"], correct: make ? 0 : 1, cols: 2,
      explain: `${make ? "Make" : "Buy"}. It's cheaper by ${eur(Math.abs(buyCost - makeCost))}.` + W([`Make: ${eur(v)} × ${num(units)}${avoid ? ` + ${eur(avoid)}` : ""} = ${eur(makeCost)}`, `Buy: ${eur(buyAt, 2)} × ${num(units)} = ${eur(buyCost)}`]) + `<p class="note">Trap: the ${eur(alloc)} head office overhead is charged either way, so leave it out.${avoid ? " The supervisor counts, because you'd only pay for one if you make." : ""}</p>`,
      short: `Make or buy at ${eur(buyAt, 2)}`, answerText: make ? "Make" : "Buy" };
  },
  function closeDept() {
    const sales = R(8, 30) * 10000, contrib = Math.round(sales * R(15, 40) / 100), avoid = Math.round(contrib * R(50, 140) / 100 / 1000) * 1000, unavoid = R(3, 12) * 5000;
    const profit = contrib - avoid - unavoid, keep = contrib - avoid > 0;
    return { tag: "Close a department?", prompt: `The garden centre section shows a ${profit < 0 ? "loss" : "profit"} of <b>${eur(Math.abs(profit))}</b>.<table class="mini"><tr><td>Contribution</td><td>${eur(contrib)}</td></tr><tr><td>Fixed costs you'd save by closing</td><td>${eur(avoid)}</td></tr><tr><td>Shared rent and admin (stays if you close)</td><td>${eur(unavoid)}</td></tr></table>Keep it open or close it?`,
      choices: ["Keep open", "Close"], correct: keep ? 0 : 1, cols: 2,
      explain: `${keep ? "Keep it open" : "Close it"}. ${keep ? "It still covers its own avoidable costs." : "It doesn't even cover the costs you'd save."}` + W([`Contribution − avoidable fixed = ${eur(contrib)} − ${eur(avoid)} = <b>${eur(contrib - avoid)}</b>`, `Closing ${keep ? "would make the business" : "makes the business"} ${eur(Math.abs(contrib - avoid))} ${keep ? "worse" : "better"} off.`]) + `<p class="note">Trap: the ${eur(unavoid)} shared cost stays either way. ${profit < 0 && keep ? "The \"loss\" is only there because of it." : ""}</p>`,
      short: "Close the department?", answerText: keep ? "Keep open" : "Close" };
  },
  function sunkCost() {
    const spent = R(5, 40) * 10000, more = R(2, 20) * 10000, rev = Math.round(more * (R(0, 1) ? R(110, 180) : R(55, 92)) / 100 / 1000) * 1000, go = rev > more;
    return { tag: "Sunk cost", prompt: `You've already spent <b>${eur(spent)}</b> developing a new app. Finishing it will cost another <b>${eur(more)}</b>, and it's expected to bring in <b>${eur(rev)}</b>. Overall that's ${rev - spent - more < 0 ? "a loss" : "a profit"} of ${eur(Math.abs(rev - spent - more))}. Finish it or abandon it?`,
      choices: ["Finish it", "Abandon it"], correct: go ? 0 : 1, cols: 2,
      explain: `${go ? "Finish it" : "Abandon it"}. Only future cash counts.` + W([`Future revenue − future cost = ${eur(rev)} − ${eur(more)} = <b>${eur(rev - more)}</b>`]) + `<p class="note">Trap: the ${eur(spent)} already spent is a sunk cost. It's gone whatever you decide.</p>`,
      short: "Finish the app?", answerText: go ? "Finish it" : "Abandon it" };
  },
  function limitingFactor() {
    const a = { n: "Deluxe", c: R(20, 60), h: R(2, 6) }, b = { n: "Standard", c: R(10, 40), h: R(1, 4) };
    if (a.c / a.h === b.c / b.h) b.c += 1;
    const best = a.c / a.h > b.c / b.h ? a : b, other = best === a ? b : a, highest = a.c > b.c ? a : b;
    return { tag: "Limiting factor", prompt: `Labour hours are scarce. Which product should get the hours first?<table class="mini"><tr><td></td><td>Contribution per unit</td><td>Labour hours per unit</td></tr><tr><td>${a.n}</td><td>${eur(a.c)}</td><td>${a.h}</td></tr><tr><td>${b.n}</td><td>${eur(b.c)}</td><td>${b.h}</td></tr></table>`,
      choices: [a.n, b.n], correct: best === a ? 0 : 1, cols: 2,
      explain: `${best.n}. Rank by contribution per scarce hour, not per unit.` + W([`${a.n}: ${eur(a.c)} ÷ ${a.h} = ${eur(a.c / a.h, 2)} per hour`, `${b.n}: ${eur(b.c)} ÷ ${b.h} = ${eur(b.c / b.h, 2)} per hour`]) + (highest !== best ? `<p class="note">Trap: ${highest.n} has the higher contribution per unit, but it eats more of the scarce hours.</p>` : ""),
      short: "Which product gets the hours?", answerText: best.n };
  },
];
let bag = [];
TW.game({
  id: "accept-reject", title: "Accept or Reject?", kind: "rounds", rounds: 10,
  how: `<p>You're the management accountant. Make the call on each business decision.</p><ul><li>Only <b>relevant costs</b> count: future cash flows that change with the decision</li><li>Sunk costs and fixed overheads that happen anyway are traps</li><li>Faster answers earn bonus points</li></ul>`,
  ranks: [[0, "Intern"], [500, "Cost clerk"], [1200, "Management accountant"], [2200, "Finance manager"], [3200, "Finance director"], [4200, "CFO"]],
  next() { if (!bag.length) bag = TW.shuffle([0, 1, 2, 3, 4, 0, 1, 2]); return SCEN[bag.pop()](); },
});
