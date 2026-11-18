"use strict";
const { R, pick, eur, num, shuffle } = TW;
const W = rows => `<div class="working">${rows.join("<br>")}</div>`;
const FA = v => v >= 0 ? "F" : "A";
const lbl = v => `${eur(Math.abs(v))} ${FA(v)}`;
function opts(right, wrongs) {
  const set = [right, -right, ...wrongs, ...wrongs.map(w => -w)].filter((v, i, a) => v !== 0 && a.findIndex(x => Math.round(x) === Math.round(v)) === i);
  const pickd = [right, -right, ...shuffle(set.filter(v => Math.round(v) !== Math.round(right) && Math.round(v) !== Math.round(-right))).slice(0, 2)];
  while (pickd.length < 4) pickd.push(right * (pickd.length + 0.5));
  const sh = shuffle(pickd);
  return { choices: sh.map(lbl), correct: sh.indexOf(right), cols: 2 };
}
function materials(kind) {
  const units = R(4, 20) * 100, sq = R(2, 6), sp = R(8, 40) / 4, aq = Math.round(units * sq * R(88, 112) / 100), ap = Math.round(sp * R(85, 115)) / 100 * 1;
  const SQ = units * sq;
  const facts = `<table class="mini"><tr><td>Output</td><td>${num(units)} units</td></tr><tr><td>Standard</td><td>${sq} kg per unit at ${eur(sp, 2)}/kg</td></tr><tr><td>Actual</td><td>${num(aq)} kg bought and used, costing ${eur(aq * ap, 2)}</td></tr></table>`;
  if (kind === "price") {
    const v = (sp - ap) * aq;
    if (Math.round(v) === 0) return materials(kind);
    return { tag: "Material price variance", prompt: `What's the material price variance?${facts}`, ...opts(v, [(sp - ap) * SQ, (ap - sp) * units]),
      explain: `Actual price was ${eur(ap, 2)}/kg against a standard of ${eur(sp, 2)}, so you paid ${ap < sp ? "less" : "more"}: ${ap < sp ? "favourable" : "adverse"}.` + W([`Actual price = ${eur(aq * ap, 2)} ÷ ${num(aq)} = ${eur(ap, 2)}/kg`, `(SP − AP) × AQ = (${eur(sp, 2)} − ${eur(ap, 2)}) × ${num(aq)} = <b>${lbl(v)}</b>`]) + `<p class="note">Price variances use the actual quantity, not the standard.</p>`,
      short: "Material price variance", answerText: lbl(v) };
  }
  const v = (SQ - aq) * sp;
  if (Math.round(v) === 0) return materials(kind);
  return { tag: "Material usage variance", prompt: `What's the material usage variance?${facts}`, ...opts(v, [(SQ - aq) * ap, (units * sq - aq) * sp * 0.5 + 37]),
    explain: `You should have used ${num(SQ)} kg for ${num(units)} units but used ${num(aq)}: ${aq < SQ ? "less, so favourable" : "more, so adverse"}.` + W([`Standard quantity = ${num(units)} × ${sq} = ${num(SQ)} kg`, `(SQ − AQ) × SP = (${num(SQ)} − ${num(aq)}) × ${eur(sp, 2)} = <b>${lbl(v)}</b>`]) + `<p class="note">Usage variances are valued at the standard price.</p>`,
    short: "Material usage variance", answerText: lbl(v) };
}
function labour(kind) {
  const units = R(5, 30) * 100, sh = R(1, 4) / 2, sr = R(26, 44) / 2, ah = Math.round(units * sh * R(88, 112) / 100), ar = Math.round(sr * R(90, 110)) / 100;
  const SH = units * sh;
  const facts = `<table class="mini"><tr><td>Output</td><td>${num(units)} units</td></tr><tr><td>Standard</td><td>${sh} hours per unit at ${eur(sr, 2)}/hour</td></tr><tr><td>Actual</td><td>${num(ah)} hours paid, costing ${eur(ah * ar, 2)}</td></tr></table>`;
  if (kind === "rate") {
    const v = (sr - ar) * ah;
    if (Math.round(v) === 0) return labour(kind);
    return { tag: "Labour rate variance", prompt: `What's the labour rate variance?${facts}`, ...opts(v, [(sr - ar) * SH, (sr - ar) * units]),
      explain: `Staff cost ${eur(ar, 2)}/hour against a standard of ${eur(sr, 2)}: ${ar < sr ? "cheaper, so favourable" : "dearer, so adverse"}.` + W([`Actual rate = ${eur(ah * ar, 2)} ÷ ${num(ah)} = ${eur(ar, 2)}/hour`, `(SR − AR) × AH = (${eur(sr, 2)} − ${eur(ar, 2)}) × ${num(ah)} = <b>${lbl(v)}</b>`]),
      short: "Labour rate variance", answerText: lbl(v) };
  }
  const v = (SH - ah) * sr;
  if (Math.round(v) === 0) return labour(kind);
  return { tag: "Labour efficiency variance", prompt: `What's the labour efficiency variance?${facts}`, ...opts(v, [(SH - ah) * ar, (SH - ah) * sr / 2]),
    explain: `${num(units)} units should take ${num(SH)} hours. They took ${num(ah)}: ${ah < SH ? "quicker, so favourable" : "slower, so adverse"}.` + W([`Standard hours = ${num(units)} × ${sh} = ${num(SH)}`, `(SH − AH) × SR = (${num(SH)} − ${num(ah)}) × ${eur(sr, 2)} = <b>${lbl(v)}</b>`]) + `<p class="note">Efficiency variances are valued at the standard rate.</p>`,
    short: "Labour efficiency variance", answerText: lbl(v) };
}
function sales(kind) {
  const bu = R(20, 60) * 100, sp = R(20, 80), vc = Math.round(sp * R(40, 70) / 100), au = Math.round(bu * R(85, 115) / 100), ap = sp + (R(0, 1) ? 1 : -1) * R(1, 6);
  const facts = `<table class="mini"><tr><td>Budget</td><td>${num(bu)} units at ${eur(sp)}</td></tr><tr><td>Standard variable cost</td><td>${eur(vc)} per unit</td></tr><tr><td>Actual</td><td>${num(au)} units sold for ${eur(au * ap)}</td></tr></table>`;
  if (kind === "price") {
    const v = (ap - sp) * au;
    return { tag: "Sales price variance", prompt: `What's the sales price variance?${facts}`, ...opts(v, [(ap - sp) * bu, (ap - sp) * (au - bu) + 50]),
      explain: `You sold at ${eur(ap)} against a standard ${eur(sp)}: ${ap > sp ? "higher, so favourable" : "lower, so adverse"}.` + W([`Actual price = ${eur(au * ap)} ÷ ${num(au)} = ${eur(ap)}`, `(AP − SP) × actual units = (${eur(ap)} − ${eur(sp)}) × ${num(au)} = <b>${lbl(v)}</b>`]),
      short: "Sales price variance", answerText: lbl(v) };
  }
  if (au === bu) return sales(kind);
  const v = (au - bu) * (sp - vc);
  return { tag: "Sales volume variance (contribution)", prompt: `What's the sales volume variance, valued at standard contribution?${facts}`, ...opts(v, [(au - bu) * sp, (au - bu) * vc]),
    explain: `You sold ${num(Math.abs(au - bu))} ${au > bu ? "more" : "fewer"} units than budgeted: ${au > bu ? "favourable" : "adverse"}.` + W([`Standard contribution = ${eur(sp)} − ${eur(vc)} = ${eur(sp - vc)}`, `(Actual − budget units) × std contribution = (${num(au)} − ${num(bu)}) × ${eur(sp - vc)} = <b>${lbl(v)}</b>`]) + `<p class="note">Trap: under marginal costing, volume variances use contribution per unit, not the selling price.</p>`,
    short: "Sales volume variance", answerText: lbl(v) };
}
const KINDS = [() => materials("price"), () => materials("usage"), () => labour("rate"), () => labour("eff"), () => sales("price"), () => sales("volume")];
let bag = [];
TW.game({
  id: "variances", title: "Variance Hunter", kind: "rounds", rounds: 10,
  how: `<p>Budget vs reality. Hunt down each variance and say whether it's <b>F</b>avourable or <b>A</b>dverse.</p><ul><li>Price and rate variances use the actual quantity</li><li>Usage and efficiency variances use the standard price</li><li>Faster answers earn bonus points</li></ul>`,
  ranks: [[0, "Intern"], [500, "Cost clerk"], [1200, "Variance spotter"], [2200, "Management accountant"], [3200, "Financial controller"], [4200, "CFO"]],
  next() { if (!bag.length) bag = shuffle([0, 1, 2, 3, 4, 5]); return KINDS[bag.pop()](); },
});
