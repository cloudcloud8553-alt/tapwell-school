"use strict";
const { R, pick, eur, num, shuffle } = TW;
// Irish 2026 rates: single PAYE employee, no other credits. PRSI at 4.35% (rate from 1 Oct 2026).
const SRCOP = 44000, CREDITS = 4000, PRSI = 0.0435;
const USC = [[12012, 0.005], [28700, 0.02], [70044, 0.03], [Infinity, 0.08]];
function calc(g) {
  const paye = Math.max(0, 0.2 * Math.min(g, SRCOP) + 0.4 * Math.max(0, g - SRCOP) - CREDITS);
  let usc = 0, lo = 0;
  if (g > 13000) for (const [hi, r] of USC) { usc += Math.max(0, Math.min(g, hi) - lo) * r; lo = hi; if (g <= hi) break; }
  const prsi = g / 52 > 352 ? g * PRSI : 0;
  return { g, paye, usc, prsi, net: g - paye - usc - prsi };
}
const JOBS = [["Barista, full-time on minimum wage (€14.15/hr)", 28697], ["Retail assistant", 30500], ["Graduate accountant", 34000], ["Primary teacher, starting", 41500], ["Nurse", 46000], ["Software developer", 62000],
  ["Trainee chartered accountant, year 3", 38000], ["Electrician", 52000], ["Financial analyst", 58000], ["Garda", 44000], ["Trading desk analyst", 85000], ["Senior manager", 110000], ["Quant trader", 150000], ["Bank teller", 33000]];
function bar(c) {
  const parts = [["Take-home", c.net, "var(--good)"], ["Income tax", c.paye, "var(--accent)"], ["USC", c.usc, "var(--flag)"], ["PRSI", c.prsi, "var(--demand)"]];
  return `<div style="display:flex;height:16px;border-radius:8px;overflow:hidden;margin:6px 0">${parts.map(p => `<i style="width:${p[1] / c.g * 100}%;background:${p[2]}"></i>`).join("")}</div>
    <table class="mini">${parts.map(p => `<tr><td><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${p[2]};margin-right:6px"></span>${p[0]}</td><td>${eur(p[1])}</td></tr>`).join("")}</table>`;
}
function working(c) {
  const lines = [`Income tax: 20% × ${eur(Math.min(c.g, SRCOP))}${c.g > SRCOP ? ` + 40% × ${eur(c.g - SRCOP)}` : ""} − ${eur(CREDITS)} credits = ${eur(c.paye)}`];
  let lo = 0, parts = [];
  for (const [hi, r] of USC) { const amt = Math.max(0, Math.min(c.g, hi) - lo); if (amt > 0) parts.push(`${(r * 100).toFixed(1).replace(".0", "")}% × ${eur(amt)}`); lo = hi; if (c.g <= hi) break; }
  lines.push(`USC: ${parts.join(" + ")} = ${eur(c.usc)}`, `PRSI: 4.35% × ${eur(c.g)} = ${eur(c.prsi)}`);
  return `<div class="working">${lines.join("<br>")}</div>`;
}
function slider(box, min, max, step, start, label, onLock) {
  box.innerHTML = `<div class="ctl"><div class="ch"><span>${label}</span><b id="gv" style="font-size:22px;font-family:var(--display)"></b></div>
    <input type="range" id="gr" min="${min}" max="${max}" step="${step}" value="${start}"><div class="ch"><span>${eur(min)}</span><span>${eur(max)}</span></div></div>
    <button class="btn big" id="lk" style="margin-top:6px">Lock it in</button>`;
  const gr = box.querySelector("#gr"), gv = box.querySelector("#gv"), show = () => gv.textContent = eur(+gr.value);
  gr.oninput = show; show();
  box.querySelector("#lk").onclick = () => { gr.disabled = true; box.querySelector("#lk").remove(); onLock(+gr.value); };
}
let bag = [];
TW.game({
  id: "take-home", title: "Take-home Pay", kind: "rounds", rounds: 6,
  how: `<p>How much of the salary actually lands in your account? Slide to guess, then see where the rest went.</p><ul><li>Irish 2026 rates for a single PAYE employee: income tax, USC and PRSI</li><li>Within 3% of the real figure counts as a hit and keeps your streak. Closer guesses score more.</li></ul>`,
  modes: [["net", "Guess the take-home", "A full salary. How much is left after tax?"], ["raise", "The pay rise", "You get a raise. How much more actually reaches your pocket?"]],
  ranks: [[0, "Payslip skimmer"], [600, "Payroll trainee"], [1200, "Payroll clerk"], [1800, "Tax technician"], [2400, "Tax consultant"], [3000, "Revenue's worst nightmare"]],
  next(mode) {
    if (!bag.length) bag = shuffle(JOBS);
    const [job, base] = bag.pop(), g = /minimum wage/.test(job) ? base : Math.round(base * R(95, 105) / 100 / 100) * 100;
    if (mode === "raise") {
      const raise = pick([2000, 3000, 5000, 8000, 10000]), a = calc(g), b = calc(g + raise), extra = b.net - a.net;
      return { tag: "The pay rise", prompt: `<b>${job}</b> on ${eur(g)} gets a <b>${eur(raise)}</b> raise. How much more do they take home a year?`,
        render(box, done) {
          slider(box, 0, raise, 10, Math.round(raise * 0.5 / 10) * 10, "Your guess", guess => {
            const err = Math.abs(guess - extra) / raise * 100, ok = err <= 3;
            done({ ok, pts: Math.max(0, Math.round(300 - err * 25)), answerText: eur(extra),
              explain: `They keep <b>${eur(extra)}</b> of the ${eur(raise)} (${Math.round(extra / raise * 100)}%). You guessed ${eur(guess)}.<div class="working">Take-home before: ${eur(a.net)}<br>Take-home after: ${eur(b.net)}<br>Tax on the raise: ${Math.round((1 - extra / raise) * 100)}%${g + raise > SRCOP ? " (higher-rate tax kicks in above €44,000)" : ""}</div>` });
          });
        }, short: `${eur(raise)} raise on ${eur(g)}` };
    }
    const c = calc(g);
    return { tag: "Guess the take-home", prompt: `<b>${job}</b> earning <b>${eur(g)}</b> a year. What's their take-home pay?`,
      render(box, done) {
        slider(box, Math.round(g * 0.4 / 100) * 100, g, 50, Math.round(g * 0.7 / 100) * 100, "Your guess (per year)", guess => {
          const err = Math.abs(guess - c.net) / g * 100, ok = err <= 3;
          done({ ok, pts: Math.max(0, Math.round(300 - err * 30)), answerText: `${eur(c.net)} a year`,
            explain: `Take-home is <b>${eur(c.net)}</b> a year, about ${eur(c.net / 12)} a month. You guessed ${eur(guess)}, ${err < 0.5 ? "almost exactly" : `${err.toFixed(1)}% of salary out`}.${bar(c)}${working(c)}<p class="note">Effective tax rate: ${((1 - c.net / g) * 100).toFixed(1)}%.</p>` });
        });
      }, short: `${job} on ${eur(g)}` };
  },
});
