"use strict";
const { eur, num, store, esc } = TW;
const LEVELS = [
  { name: "Open the cart", story: "You've got a coffee cart outside the library. The pitch costs €300 a week and each coffee costs you €1.10 in beans, milk and cups. Charge too much and nobody buys.", F: 300, v: 1.10, a: 800, b: 130, goal: { type: "profit", min: 0 }, goalText: "Break even: profit of at least €0 a week" },
  { name: "Make €400 a week", story: "Same cart, same costs. Rent is due. Find a price that makes at least €400 profit a week.", F: 300, v: 1.10, a: 800, b: 130, goal: { type: "profit", min: 400 }, goalText: "Profit of at least €400 a week" },
  { name: "Rent goes up", story: "The college doubled your pitch fee to €600. Your bank wants a cushion: sales must be at least 25% above break-even.", F: 600, v: 1.10, a: 800, b: 130, goal: { type: "mos", min: 25 }, goalText: "Margin of safety of at least 25%" },
  { name: "Campus pitch", story: "You've moved to the busiest spot on campus. A bean grinder would cost €100 a week to lease but cut your cost per cup by €0.60. Is it worth it?", F: 600, v: 1.10, a: 1000, b: 150, upgrade: { F: 100, v: -0.60, label: "Lease the grinder (+€100/week, −€0.60/cup)" }, goal: { type: "profit", min: 700 }, goalText: "Profit of at least €700 a week" },
  { name: "Squeeze every euro", story: "Grinder in, fixed costs now €700 a week, €0.50 a cup. Find the sweet spot.", F: 700, v: 0.50, a: 1000, b: 150, goal: { type: "profit", min: 720 }, goalText: "Profit of at least €720 a week" },
];
const RANK = [[0, "Market trader"], [5, "Café owner"], [9, "Coffee chain manager"], [12, "Franchise boss"], [15, "Coffee tycoon"]];
const el = document.getElementById("game");
let stars = store.get("be.stars", [0, 0, 0, 0, 0]);
let L = 0, P = 2, up = false, tries = 0;
const st = () => { const lv = LEVELS[L], F = lv.F + (up && lv.upgrade ? lv.upgrade.F : 0), v = +(lv.v + (up && lv.upgrade ? lv.upgrade.v : 0)).toFixed(2), Q = Math.max(0, Math.round(lv.a - lv.b * P)), cpu = P - v, C = cpu * Q, profit = C - F, be = cpu > 0 ? F / cpu : Infinity, mos = Q > 0 && isFinite(be) ? (Q - be) / Q * 100 : -Infinity; return { lv, F, v, Q, cpu, C, profit, be, mos }; };
const met = s => s.lv.goal.type === "profit" ? s.profit >= s.lv.goal.min : s.mos >= s.lv.goal.min;
const starTxt = n => "★".repeat(n) + "☆".repeat(3 - n);
const unlocked = i => i === 0 || stars[i - 1] > 0;

function levelBar() {
  return `<div class="chips">${LEVELS.map((lv, i) => `<button class="chip${i === L ? " on" : ""}" data-l="${i}" ${unlocked(i) ? "" : "disabled style='opacity:.4'"}>${i + 1}. ${unlocked(i) ? starTxt(stars[i]) : "locked"}</button>`).join("")}</div>`;
}
function play(i) {
  L = i; P = 2; up = false; tries = 0;
  const lv = LEVELS[L];
  el.innerHTML = `${levelBar()}
  <div class="sheet" style="display:flex;flex-direction:column;gap:12px">
    <div class="qtag">Level ${L + 1} of ${LEVELS.length}</div><h2>${esc(lv.name)}</h2><p>${esc(lv.story)}</p>
    <div class="explain" id="goal" style="margin:0"></div>
  </div>
  <div class="sheet" style="display:flex;flex-direction:column;gap:14px">
    <div class="ctl"><div class="ch"><span>Price per coffee</span><b id="pv" style="font-size:26px;font-family:var(--display)"></b></div><input type="range" id="pr" min="1" max="7" step="0.05" value="${P}"></div>
    ${lv.upgrade ? `<label style="display:flex;gap:10px;align-items:center;font-size:14.5px;cursor:pointer"><input type="checkbox" id="upg" style="width:20px;height:20px;accent-color:var(--accent)"> ${esc(lv.upgrade.label)}</label>` : ""}
    <div class="stats" id="kp"></div>
    <div class="chartbox" style="height:220px"><canvas id="cv"></canvas></div>
    <p class="note"><span style="color:var(--accent)">━</span> Revenue &nbsp; <span style="color:var(--demand)">━</span> Total cost &nbsp; ● break-even &nbsp; ┆ your sales</p>
    <button class="btn big" id="lock">Lock it in</button>
  </div>
  <div id="quiz"></div>`;
  el.querySelector(".chips").onclick = e => { const b = e.target.closest(".chip"); if (b && !b.disabled) play(+b.dataset.l); };
  const pr = document.getElementById("pr"); pr.oninput = () => { P = +pr.value; update(); };
  if (lv.upgrade) document.getElementById("upg").onchange = e => { up = e.target.checked; update(); };
  document.getElementById("lock").onclick = lock;
  update();
}
function update() {
  const s = st(), ok = met(s);
  document.getElementById("pv").textContent = eur(P, 2);
  document.getElementById("kp").innerHTML = [
    ["Coffees sold a week", num(s.Q)], ["Contribution per cup", eur(s.cpu, 2)], ["Total contribution", eur(s.C)], ["Fixed costs", eur(s.F)],
    ["Profit a week", eur(s.profit), `var(--${s.profit >= 0 ? "good" : "bad"})`], ["Margin of safety", isFinite(s.mos) ? `${s.mos.toFixed(1)}%` : "—"],
  ].map(k => `<div class="stat"><span>${k[0]}</span><b${k[2] ? ` style="color:${k[2]}"` : ""}>${k[1]}</b></div>`).join("");
  const g = document.getElementById("goal");
  g.className = "explain" + (ok ? "" : " miss"); g.style.margin = "0";
  g.innerHTML = `<b class="${ok ? "ok" : "no"}">${ok ? "Goal hit." : "Goal:"}</b> ${esc(s.lv.goalText)}`;
  document.getElementById("lock").disabled = !ok;
  draw(s);
}
function draw(s) {
  const cv = document.getElementById("cv"), box = cv.parentElement, dpr = window.devicePixelRatio || 1, w = box.clientWidth, h = box.clientHeight;
  cv.width = w * dpr; cv.height = h * dpr; cv.style.width = w + "px"; cv.style.height = h + "px";
  const x = cv.getContext("2d"); x.scale(dpr, dpr);
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const pad = { l: 46, r: 24, t: 10, b: 24 }, W = w - pad.l - pad.r, H = h - pad.t - pad.b;
  const xmax = Math.max(100, Math.ceil(Math.max(s.Q * 1.5, isFinite(s.be) ? s.be * 1.3 : 0, s.lv.a / 2) / 50) * 50);
  const ymax = Math.max(P * xmax, s.F + s.v * xmax) * 1.05;
  const X = q => pad.l + q / xmax * W, Y = v => pad.t + H - v / ymax * H;
  x.font = "11px " + css("--mono"); x.fillStyle = css("--muted"); x.strokeStyle = css("--line"); x.lineWidth = 1;
  for (let i = 0; i <= 4; i++) { const v = ymax / 4 * i, yy = Y(v); x.beginPath(); x.moveTo(pad.l, yy); x.lineTo(w - pad.r, yy); x.stroke(); x.fillText("€" + num(Math.round(v / 10) * 10), 2, yy + 4); }
  for (let i = 0; i <= 4; i++) { const q = xmax / 4 * i; x.fillText(Math.round(q), X(q) - 8, h - 6); }
  const line = (f, c) => { x.strokeStyle = c; x.lineWidth = 2.5; x.beginPath(); x.moveTo(X(0), Y(f(0))); x.lineTo(X(xmax), Y(f(xmax))); x.stroke(); };
  line(q => s.F + s.v * q, css("--demand")); line(q => P * q, css("--accent"));
  x.setLineDash([4, 4]); x.strokeStyle = css("--ink"); x.lineWidth = 1; x.beginPath(); x.moveTo(X(s.Q), pad.t); x.lineTo(X(s.Q), pad.t + H); x.stroke(); x.setLineDash([]);
  if (isFinite(s.be) && s.be <= xmax) { x.fillStyle = css("--ink"); x.beginPath(); x.arc(X(s.be), Y(P * s.be), 5, 0, 7); x.fill(); }
}
function lock() {
  const s = st(); tries = 0;
  document.getElementById("lock").disabled = true; document.getElementById("pr").disabled = true; const u = document.getElementById("upg"); if (u) u.disabled = true;
  const q = document.getElementById("quiz");
  q.innerHTML = `<div class="sheet qcard"><div class="qtag">Quick check to level up</div><div class="qprompt">At ${eur(P, 2)} a cup, how many coffees a week do you need to sell to break even? (Round up to a whole cup.)</div>
    <form class="ansrow" id="bf" autocomplete="off"><input id="bi" inputmode="numeric" placeholder="Cups" aria-label="Break-even cups"><span class="affix">cups</span><button class="btn">Check</button></form><div id="bfb"></div></div>`;
  q.scrollIntoView({ behavior: "smooth", block: "start" });
  const target = Math.ceil(s.be - 1e-9);
  document.getElementById("bf").onsubmit = e => {
    e.preventDefault();
    const v = parseFloat(document.getElementById("bi").value); const fb = document.getElementById("bfb");
    if (isNaN(v)) { fb.innerHTML = `<p class="note" style="color:var(--bad)">Enter a number first.</p>`; return; }
    tries++;
    const ok = Math.abs(v - target) <= 1, work = `<div class="working">Break-even = fixed costs ÷ contribution per cup<br>= ${eur(s.F)} ÷ (${eur(P, 2)} − ${eur(s.v, 2)}) = ${eur(s.F)} ÷ ${eur(s.cpu, 2)} = ${s.be.toFixed(1)} → <b>${num(target)} cups</b></div>`;
    if (!ok && tries < 2) { fb.innerHTML = `<div class="explain miss"><b class="no">Not quite.</b> Hint: divide fixed costs by the contribution each cup makes. One more go.</div>`; document.getElementById("bi").value = ""; return; }
    const earned = ok ? (tries === 1 ? 3 : 2) : 1;
    stars[L] = Math.max(stars[L], earned); store.set("be.stars", stars);
    document.getElementById("bi").disabled = true;
    const last = L === LEVELS.length - 1;
    fb.innerHTML = `<div class="explain${ok ? "" : " miss"}"><b class="${ok ? "ok" : "no"}">${ok ? "Correct." : "Here's how."}</b> <span class="stars">${starTxt(earned)}</span>${work}<p class="note">Margin of safety: you sell ${num(s.Q)}, so sales could drop ${num(Math.max(0, s.Q - target))} cups (${s.mos.toFixed(1)}%) before you make a loss.</p></div>
      <button class="btn big" id="nl">${last ? "See your results" : "Next level →"}</button>`;
    document.getElementById("nl").onclick = () => last ? finish() : play(L + 1);
  };
}
function finish() {
  const total = stars.reduce((a, b) => a + b, 0), rank = RANK.reduce((r, x) => total >= x[0] ? x[1] : r, "");
  el.innerHTML = `${levelBar()}<div class="sheet gend"><div class="eyebrow">All levels done</div><div class="bigscore">${total}/15</div><div class="stars" style="text-align:center">stars</div><div class="rank">${rank}</div>
    <p class="note" style="text-align:center">Replay any level to get 3 stars. Your best stars are saved on this device.</p><div class="row" style="justify-content:center"><button class="btn" id="rp">Replay level 1</button></div></div>`;
  el.querySelector(".chips").onclick = e => { const b = e.target.closest(".chip"); if (b && !b.disabled) play(+b.dataset.l); };
  document.getElementById("rp").onclick = () => play(0);
}
window.addEventListener("resize", () => { if (document.getElementById("cv")) draw(st()); });
play(Math.max(0, stars.findIndex(s => s === 0) === -1 ? 0 : stars.findIndex(s => s === 0)));
