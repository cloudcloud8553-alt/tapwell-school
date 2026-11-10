/* Tapwell School: a static study library. Routes are plain hashes:
   #home · #<module-slug> · #<module-slug>--<test-id>                        */
"use strict";

// ---------- helpers ----------
const app = document.getElementById("app");
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const store = {
  get(k, d) { try { const v = localStorage.getItem("ts." + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem("ts." + k, JSON.stringify(v)); } catch (e) {} },
};
const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[R(0, a.length - 1)];
const r2 = x => Math.round(x * 100) / 100;
const fmt = n => Number(n).toLocaleString("en-IE", { maximumFractionDigits: 2 });
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function parseDate(s) { const [y, m, d] = s.split("-").map(Number); return { date: new Date(y, m - 1, d || 1), exact: !!d }; }
function daysUntil(s) { const { date } = parseDate(s); const t = new Date(); t.setHours(0, 0, 0, 0); return Math.round((date - t) / 864e5); }
function dateLabel(s) { const { date, exact } = parseDate(s); return exact ? `${DAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}` : `${MONTHS[date.getMonth()]} ${date.getFullYear()}`; }
function duePill(s) {
  const { exact } = parseDate(s); const d = daysUntil(s);
  if (!exact) return `<span class="pill later">${dateLabel(s)}</span>`;
  if (d < 0) return `<span class="pill later">done</span>`;
  if (d === 0) return `<span class="pill soon">today</span>`;
  if (d === 1) return `<span class="pill soon">tomorrow</span>`;
  return `<span class="pill${d <= 7 ? " soon" : ""}">in ${d} days</span>`;
}

let CAT = null;
const PACKS = {};
async function getPack(slug) {
  if (!(slug in PACKS)) {
    try { const r = await fetch(`data/${slug}.json`); PACKS[slug] = r.ok ? await r.json() : null; } catch (e) { PACKS[slug] = null; }
  }
  return PACKS[slug];
}
const allModules = () => CAT.semesters.flatMap(s => s.modules.map(m => ({ ...m, sem: s })));
const topBar = crumbs => `<div class="top"><a class="brand" href="#home">tapwell<span class="dot">.</span><small>school</small></a></div>` +
  (crumbs ? `<nav class="crumbs">${crumbs.map(c => c[1] ? `<a href="#${c[1]}">${esc(c[0])}</a>` : `<span>${esc(c[0])}</span>`).join("<span>/</span>")}</nav>` : "");
const footer = `<footer>Built from Moodle material for TUS students. Study aid only, not official course content.</footer>`;

// ---------- router ----------
let cleanup = null;
async function route() {
  if (cleanup) { cleanup(); cleanup = null; }
  const h = decodeURIComponent(location.hash.slice(1)) || "home";
  const [slug, testId] = h.split("--");
  const mod = allModules().find(m => m.slug === slug);
  if (!mod) return renderHome();
  const pack = mod.pack ? await getPack(mod.slug) : null;
  const test = pack && testId ? pack.tests.find(t => t.id === testId) : null;
  if (test) renderTest(mod, pack, test); else renderModule(mod, pack);
  window.scrollTo({ top: 0 });
}
window.addEventListener("hashchange", route);

// ---------- home ----------
function renderHome() {
  document.title = "Tapwell School";
  const upcoming = allModules().flatMap(m => (m.tests || []).map(t => ({ m, t })))
    .filter(x => daysUntil(x.t.date) >= 0 || !parseDate(x.t.date).exact)
    .sort((a, b) => parseDate(a.t.date).date - parseDate(b.t.date).date);
  const open = store.get("openShelves", [CAT.current]);
  app.innerHTML = topBar() + `
    <section class="hero">
      <span class="eyebrow">${esc(CAT.programme)}</span>
      <h1>Your module library</h1>
      <p class="muted">Every module gets a library. Material goes up about a week before each test, set up with the study method that suits each topic.</p>
    </section>
    ${upcoming.length ? `<section class="stack"><h2>Up next</h2><div class="upnext">${upcoming.map(({ m, t }) => {
      const { date, exact } = parseDate(t.date);
      return `<a class="un" href="#${m.slug}--${t.id}">
        <span class="when">${exact ? `${DAYS[date.getDay()]}<b>${date.getDate()}</b>${MONTHS[date.getMonth()]}` : `<b>${MONTHS[date.getMonth()]}</b>${date.getFullYear()}`}</span>
        <span class="what"><strong>${esc(t.title)}</strong><span>${esc(m.name)} · ${esc(t.weight)}</span></span>
        ${duePill(t.date)}</a>`;
    }).join("")}</div></section>` : ""}
    ${CAT.semesters.map(s => {
      const isOpen = s.id === CAT.current || open.includes(s.id);
      return `<section class="shelf${s.id === CAT.current ? " now" : ""}">
        <div class="shelf-head"><h2>${esc(s.label)}</h2>${s.id === CAT.current ? `<span class="eyebrow">this semester</span>` : `<button data-shelf="${s.id}" aria-expanded="${isOpen}">${isOpen ? "Hide" : "Show"} ${s.modules.length} modules</button>`}</div>
        <div class="grid" ${isOpen ? "" : "hidden"}>${s.modules.map(m => moduleCard(m)).join("")}</div>
      </section>`;
    }).join("")}
    ${footer}`;
  app.querySelectorAll("[data-shelf]").forEach(b => b.onclick = () => {
    const id = b.dataset.shelf; const set = new Set(store.get("openShelves", [CAT.current]));
    set.has(id) ? set.delete(id) : set.add(id); store.set("openShelves", [...set]); renderHome();
  });
}
function moduleCard(m) {
  const live = m.pack && (m.tests || []).length;
  const next = (m.tests || []).find(t => daysUntil(t.date) >= 0 || !parseDate(t.date).exact);
  return `<a class="mod${live ? "" : " empty"}" href="#${m.slug}">
    ${m.code ? `<span class="code">${esc(m.code)}</span>` : ""}
    <h3>${esc(m.name)}</h3>
    <span class="foot">${live ? `<span class="live">● ${m.tests.length} test${m.tests.length > 1 ? "s" : ""}</span>${next ? ` · next ${esc(dateLabel(next.date))}` : ""}` : "No material yet"}</span>
  </a>`;
}

// ---------- module ----------
function renderModule(m, pack) {
  document.title = `${m.name} · Tapwell School`;
  const crumbs = [["Library", "home"], [m.sem.label], [m.name]];
  if (!pack) {
    app.innerHTML = topBar(crumbs) + `
      <section class="hero"><span class="eyebrow">${esc(m.code || m.sem.label)}</span><h1>${esc(m.name)}</h1></section>
      <div class="emptystate"><h3>No material yet</h3>
        <p class="muted">This library fills up as the semester goes. Study packs are added about a week before each test, built from the Moodle slides, tutorial sheets and past papers.</p></div>${footer}`;
    return;
  }
  app.innerHTML = topBar(crumbs) + `
    <section class="hero"><span class="eyebrow">${esc([m.code, m.lecturer].filter(Boolean).join(" · "))}</span><h1>${esc(m.name)}</h1>
      <p class="muted">${pack.questions.length} practice questions · ${pack.cards.length} flashcards · ${pack.written.length} exam-style questions · ${pack.topics.length} topics</p></section>
    <section class="stack"><h2>Tests</h2><div class="tests">${pack.tests.map(t => `
      <a class="test" href="#${m.slug}--${t.id}">
        <div class="row" style="justify-content:space-between"><span class="eyebrow">${esc(dateLabel(t.date))} · ${esc(t.weight)}</span>${duePill(t.date)}</div>
        <h3>${esc(t.title)}</h3><span class="meta">${esc(t.format)}</span></a>`).join("")}</div></section>
    <section class="stack"><h2>Notes</h2>${notesHTML(pack)}</section>
    <p class="muted" style="font-size:13px">Sources: ${esc(pack.sources)}</p>${footer}`;
}
function notesHTML(pack, only) {
  return pack.topics.filter(t => !only || only === t.id).map((t, i) =>
    `<details class="note" id="note-${t.id}" ${only || i === 0 ? "open" : ""}><summary><h3>${esc(t.name)}</h3></summary><div class="nb">${t.notes}</div></details>`).join("");
}

// ---------- test ----------
const MODE_LABEL = { mock: "Timed mock", drill: "Question drill", cards: "Flashcards", calc: "Calculations", written: "Exam questions", notes: "Notes" };
const TECH_LABEL = { notes: "Read notes", drill: "Question drill", cards: "Flashcards", calc: "Calculations", written: "Exam questions" };

function renderTest(m, pack, test) {
  document.title = `${test.title} · ${m.name}`;
  const ctx = { m, pack, test, topicName: id => (pack.topics.find(t => t.id === id) || {}).name || id };
  const modes = test.modes;
  app.innerHTML = topBar([["Library", "home"], [m.name, m.slug], [test.title]]) + `
    <section class="hero"><span class="eyebrow">${esc(m.name)}</span><h1>${esc(test.title)}</h1>
      <div class="chips"><span class="chip">${esc(dateLabel(test.date))}</span><span class="chip">${esc(test.format)}</span><span class="chip"><strong>${esc(test.weight)}</strong> of the module</span></div></section>
    <section class="stack"><h2>How to study each topic</h2>
      <div class="plan">${pack.topics.map(t => {
        const usable = t.modes.filter(x => x === "notes" || modes.includes(x) || (x === "drill" && modes.includes("mock")));
        const list = usable.length ? usable : ["notes"];
        return `<div class="pt"><h3>${esc(t.name)}</h3><div class="tech">${list.map(x => `<button class="tbtn" data-mode="${x}" data-topic="${t.id}">${TECH_LABEL[x]}</button>`).join("")}</div><p class="why">${esc(t.why)}</p></div>`;
      }).join("")}</div></section>
    <section class="stack" id="study">
      <nav class="tabs" role="tablist">${modes.map((x, i) => `<button class="tab" role="tab" id="tab-${x}" data-tab="${x}" aria-selected="${i === 0}">${MODE_LABEL[x]}</button>`).join("")}</nav>
      <div id="panel"></div>
    </section>${footer}`;
  const open = (mode, topic) => {
    if (mode === "drill" && !modes.includes("drill")) mode = "mock";
    app.querySelectorAll(".tab").forEach(b => b.setAttribute("aria-selected", b.dataset.tab === mode));
    if (cleanup) { cleanup(); cleanup = null; }
    const panel = document.getElementById("panel");
    ({ mock: modeMock, drill: modeDrill, cards: modeCards, calc: modeCalc, written: modeWritten, notes: modeNotes })[mode](panel, ctx, topic);
  };
  app.querySelectorAll(".tab").forEach(b => b.onclick = () => open(b.dataset.tab));
  app.querySelectorAll(".tbtn").forEach(b => b.onclick = () => {
    open(b.dataset.mode, b.dataset.topic);
    document.getElementById("study").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  open(modes[0]);
}

// ---------- topic filter ----------
function topicFilter(ctx, counts, selected, onChange) {
  const wrap = document.createElement("div"); wrap.className = "filter";
  const draw = () => {
    wrap.innerHTML = ctx.pack.topics.filter(t => counts[t.id]).map(t =>
      `<button class="tchip" id="f-${t.id}" data-t="${t.id}" aria-pressed="${selected.has(t.id)}">${esc(t.name)}<span class="n">${counts[t.id]}</span></button>`).join("");
    wrap.querySelectorAll("button").forEach(b => b.onclick = () => { const t = b.dataset.t; selected.has(t) ? selected.delete(t) : selected.add(t); draw(); onChange(); });
  };
  draw(); return wrap;
}
const countBy = arr => arr.reduce((o, x) => (o[x.t] = (o[x.t] || 0) + 1, o), {});

// ---------- MCQ engine (mock + drill) ----------
function modeMock(panel, ctx) {
  const key = `${ctx.m.slug}.${ctx.test.id}`;
  const hist = store.get(`hist.${key}`, []);
  const missed = store.get(`missed.${ctx.m.slug}`, []);
  const { n, minutes } = ctx.test.mock;
  panel.innerHTML = `<div class="sheet stack">
    <span class="eyebrow">Exam conditions</span><h3>${n} questions · ${minutes} minutes</h3>
    <p class="muted">Questions are drawn across every topic in proportion to how much each was covered. No feedback until you submit, the same as the real thing. Every mock is a fresh draw from ${ctx.pack.questions.length} questions.</p>
    <div class="row"><button class="btn" id="go-mock">Start mock</button>${missed.length ? `<button class="btn ghost" id="go-missed">Retry ${missed.length} missed</button>` : ""}</div>
    ${hist.length ? `<p class="streak">Recent: ${hist.slice(-6).reverse().map(h => `${h.s}/${h.n} (${h.d})`).join(" · ")}</p>` : ""}
  </div>`;
  panel.querySelector("#go-mock").onclick = () => runQuiz(panel, ctx, { items: pickMock(ctx.pack.questions, n), minutes, learn: false, histKey: key });
  const gm = panel.querySelector("#go-missed");
  if (gm) gm.onclick = () => runQuiz(panel, ctx, { items: shuffle(missed.map(i => ctx.pack.questions[i]).filter(Boolean)), learn: true, missedMode: true });
}
function modeDrill(panel, ctx, topic) {
  const qs = ctx.pack.questions, counts = countBy(qs);
  const sel = new Set(topic ? [topic] : Object.keys(counts));
  panel.innerHTML = `<div class="sheet stack"><span class="eyebrow">Learn mode</span><h3>Question drill</h3>
    <p class="muted">Untimed. You see the answer and the reason after every question. Anything you get wrong goes into your missed pile.</p>
    <div id="flt"></div><div class="row"><button class="btn" id="go">Start drill</button><span class="streak" id="cnt"></span></div></div>`;
  const upd = () => { const c = qs.filter(q => sel.has(q.t)).length; panel.querySelector("#cnt").textContent = `${c} questions`; panel.querySelector("#go").disabled = !c; };
  panel.querySelector("#flt").appendChild(topicFilter(ctx, counts, sel, upd)); upd();
  panel.querySelector("#go").onclick = () => runQuiz(panel, ctx, { items: shuffle(qs.filter(q => sel.has(q.t))), learn: true });
}
function pickMock(bank, total) {
  const by = {}; bank.forEach(q => (by[q.t] = by[q.t] || []).push(q));
  const keys = Object.keys(by); const alloc = {};
  keys.forEach(k => alloc[k] = Math.max(2, Math.round(by[k].length / bank.length * total)));
  let sum = Object.values(alloc).reduce((a, b) => a + b, 0);
  while (sum > total) { const k = keys.slice().sort((a, b) => alloc[b] - alloc[a])[0]; alloc[k]--; sum--; }
  while (sum < total) { const k = keys.slice().sort((a, b) => by[b].length / alloc[b] - by[a].length / alloc[a])[0]; alloc[k]++; sum++; }
  return shuffle(keys.flatMap(k => shuffle(by[k]).slice(0, Math.min(alloc[k], by[k].length))));
}
function runQuiz(panel, ctx, opt) {
  const bank = ctx.pack.questions;
  const S = { items: opt.items.map(q => ({ q, order: shuffle(q.o.map((_, i) => i)), pick: null, flag: false })), i: 0, end: opt.minutes ? Date.now() + opt.minutes * 60000 : null };
  const missedKey = `missed.${ctx.m.slug}`;
  let tick = null;
  panel.innerHTML = `<div class="sheet stack">
    <div class="qtop"><span class="eyebrow" id="qcount"></span><span class="timer" id="timer"></span></div>
    <div class="bar"><i id="qbar"></i></div>
    <div class="qtopic" id="qtopic"></div><div class="qtext" id="qtext"></div>
    <div class="opts" id="opts"></div><div id="explain"></div>
    <div class="row" style="justify-content:space-between"><div class="row"><button class="btn ghost" id="prev">Previous</button><button class="btn ghost" id="flag">Flag</button></div>
      <div class="row"><button class="btn ghost" id="quit">Quit</button><button class="btn" id="next">Next</button></div></div>
    <div class="qnav" id="qnav"></div></div>`;
  const $ = id => panel.querySelector("#" + id);
  const timerUpd = () => {
    const t = $("timer"); if (!t) return;
    if (!S.end) { t.textContent = "untimed"; return; }
    const left = Math.max(0, S.end - Date.now()), mm = Math.floor(left / 60000), ss = Math.floor(left % 60000 / 1000);
    t.textContent = `${mm}:${String(ss).padStart(2, "0")}`; t.classList.toggle("low", left < 300000);
    if (left <= 0) finish();
  };
  const saveMissed = (id, wrong) => {
    const set = new Set(store.get(missedKey, []));
    wrong ? set.add(id) : set.delete(id); store.set(missedKey, [...set]);
  };
  const draw = () => {
    const it = S.items[S.i], q = it.q, n = S.items.length, answered = opt.learn && it.pick !== null;
    $("qcount").textContent = `Question ${S.i + 1} of ${n}`; $("qbar").style.width = ((S.i + 1) / n * 100) + "%";
    $("qtopic").textContent = ctx.topicName(q.t); $("qtext").textContent = q.q;
    const box = $("opts"); box.innerHTML = "";
    it.order.forEach((oi, pos) => {
      const b = document.createElement("button"); b.className = "opt"; b.id = `opt-${pos}`;
      b.innerHTML = `<span class="k">${"ABCD"[pos]}</span><span></span>`; b.lastChild.textContent = q.o[oi];
      if (it.pick === oi) b.classList.add("sel");
      if (answered) { b.disabled = true; if (oi === q.a) b.classList.add("right"); else if (oi === it.pick) b.classList.add("wrong"); }
      b.onclick = () => {
        if (answered) return; it.pick = oi;
        if (opt.learn) { const idx = bank.indexOf(q); if (oi !== q.a) saveMissed(idx, true); else if (opt.missedMode) saveMissed(idx, false); }
        draw();
      };
      box.appendChild(b);
    });
    const ex = $("explain"); ex.innerHTML = "";
    if (answered) { const ok = it.pick === q.a; ex.innerHTML = `<div class="explain ${ok ? "" : "miss"}"><b></b> <span></span></div>`; ex.querySelector("b").textContent = ok ? "Correct." : `Not quite. Answer: ${q.o[q.a]}.`; ex.querySelector("span").textContent = q.e; }
    $("prev").disabled = S.i === 0; $("flag").hidden = opt.learn; $("flag").textContent = it.flag ? "Unflag" : "Flag";
    $("next").textContent = S.i === n - 1 ? (opt.learn ? "Finish" : "Submit") : "Next";
    const nav = $("qnav"); nav.hidden = n > 60; nav.innerHTML = "";
    if (!nav.hidden) S.items.forEach((x, j) => { const b = document.createElement("button"); b.className = "qn" + (x.pick !== null ? " done" : "") + (j === S.i ? " cur" : "") + (x.flag ? " flag" : ""); b.textContent = j + 1; b.setAttribute("aria-label", `Question ${j + 1}`); b.onclick = () => { S.i = j; draw(); }; nav.appendChild(b); });
  };
  const finish = () => {
    clearInterval(tick); cleanup = null;
    const items = S.items, n = items.length, score = items.filter(x => x.pick === x.q.a).length, pct = Math.round(score / n * 100);
    if (!opt.learn) {
      const set = new Set(store.get(missedKey, [])); items.forEach(x => { if (x.pick !== x.q.a) set.add(bank.indexOf(x.q)); }); store.set(missedKey, [...set]);
      const d = new Date(); const h = store.get(`hist.${opt.histKey}`, []); h.push({ s: score, n, d: `${d.getDate()}/${d.getMonth() + 1}` }); store.set(`hist.${opt.histKey}`, h.slice(-20));
    }
    const by = {}; items.forEach(x => { const b = by[x.q.t] = by[x.q.t] || { r: 0, n: 0 }; b.n++; if (x.pick === x.q.a) b.r++; });
    const verdict = pct >= 85 ? "Exam-ready on this set. Take another mock to make sure it wasn't a lucky draw." : pct >= 70 ? "Solid. Drill the weakest topics below and you're in good shape." : pct >= 50 ? "Passing, but with clear gaps. Use the study method shown for each red topic, then mock again." : "Big gaps. Work through the topic plan above one topic at a time before another mock.";
    panel.innerHTML = `<div class="sheet stack">
      <span class="eyebrow">${opt.learn ? "Drill result" : "Mock result"}</span>
      <div class="row" style="align-items:baseline;gap:14px"><span class="score">${score}/${n}</span><span class="score" style="font-size:28px;color:var(--muted)">${pct}%</span></div>
      <p class="muted">${verdict}</p>
      <h3>By topic</h3><div class="tbars">${Object.entries(by).sort((a, b) => a[1].r / a[1].n - b[1].r / b[1].n).map(([k, b]) => { const p = b.r / b.n; const col = p >= .75 ? "var(--good)" : p >= .5 ? "var(--flag)" : "var(--bad)"; return `<div class="tb"><span>${esc(ctx.topicName(k))}</span><span class="track"><i style="width:${p * 100}%;background:${col}"></i></span><span class="v">${b.r}/${b.n}</span></div>`; }).join("")}</div>
      <div class="row"><button class="btn" id="again">${opt.learn ? "Back" : "New mock"}</button></div>
      <h3>${score === n ? "Nothing to review" : "Review what you missed"}</h3><div class="stack" id="review"></div></div>`;
    const rv = panel.querySelector("#review");
    items.filter(x => x.pick !== x.q.a).forEach(x => {
      const d = document.createElement("div"); d.className = "rv";
      d.innerHTML = `<span class="qtopic"></span><b></b><span class="yours"></span><span class="ans"></span><span class="muted"></span>`;
      d.children[0].textContent = ctx.topicName(x.q.t); d.children[1].textContent = x.q.q;
      d.children[2].textContent = "Your answer: " + (x.pick === null ? "(left blank)" : x.q.o[x.pick]);
      d.children[3].textContent = "Correct: " + x.q.o[x.q.a]; d.children[4].textContent = x.q.e; rv.appendChild(d);
    });
    panel.querySelector("#again").onclick = () => opt.learn ? modeDrill(panel, ctx) : runQuiz(panel, ctx, { ...opt, items: pickMock(bank, opt.items.length) });
    panel.scrollIntoView({ block: "start" });
  };
  $("prev").onclick = () => { if (S.i > 0) { S.i--; draw(); } };
  $("next").onclick = () => { if (S.i < S.items.length - 1) { S.i++; draw(); } else finish(); };
  $("flag").onclick = () => { const it = S.items[S.i]; it.flag = !it.flag; draw(); };
  $("quit").onclick = () => { clearInterval(tick); cleanup = null; opt.learn ? modeDrill(panel, ctx) : modeMock(panel, ctx); };
  if (S.end) tick = setInterval(timerUpd, 500);
  cleanup = () => clearInterval(tick);
  timerUpd(); draw(); panel.scrollIntoView({ block: "start" });
}

// ---------- flashcards (Leitner boxes) ----------
function modeCards(panel, ctx, topic) {
  const cards = ctx.pack.cards, counts = countBy(cards);
  const key = `boxes.${ctx.m.slug}`;
  const boxes = store.get(key, {});
  const id = c => c.f;
  const sel = new Set(topic ? [topic] : Object.keys(counts));
  let queue = [], cur = null, flipped = false;
  const build = () => {
    const pool = cards.filter(c => sel.has(c.t));
    // lowest box first, shuffled within each box
    queue = [0, 1, 2, 3, 4].flatMap(b => shuffle(pool.filter(c => (boxes[id(c)] || 0) === b)));
  };
  panel.innerHTML = `<div class="sheet stack"><span class="eyebrow">Spaced repetition</span><h3>Flashcards</h3>
    <p class="muted">Say the answer out loud, then flip. "Got it" moves a card up a box and "Again" sends it back to box 0. Cards in low boxes come up first, so you spend time on what you don't know yet.</p>
    <div id="flt"></div>
    <button class="card" id="card"></button>
    <div class="row" style="justify-content:space-between"><div class="row"><button class="btn ghost" id="again">Again</button><button class="btn" id="got">Got it</button></div>
      <div class="boxes" id="boxes" aria-label="Cards per box"></div></div>
    <p class="streak" id="left"></p></div>`;
  const $ = x => panel.querySelector("#" + x);
  const drawBoxes = () => {
    const pool = cards.filter(c => sel.has(c.t)); const n = [0, 0, 0, 0, 0]; pool.forEach(c => n[boxes[id(c)] || 0]++);
    const max = Math.max(1, ...n);
    $("boxes").innerHTML = n.map((v, i) => `<span><i style="height:${Math.round(v / max * 36) + 2}px"></i>${v}<em style="font-style:normal">b${i}</em></span>`).join("");
    const mastered = n[4]; $("left").textContent = `${mastered} of ${pool.length} cards in the top box`;
  };
  const show = () => {
    if (!queue.length) build();
    cur = queue.shift(); flipped = false;
    const c = $("card");
    if (!cur) { c.innerHTML = `<span class="front">No cards for this selection</span>`; return; }
    c.classList.remove("flipped");
    c.innerHTML = `<span class="qtopic">${esc(ctx.topicName(cur.t))}</span><span class="front">${esc(cur.f)}</span><span class="muted" style="font-size:13px">Tap to flip</span>`;
    drawBoxes();
  };
  $("card").onclick = () => {
    if (!cur) return; flipped = !flipped; const c = $("card"); c.classList.toggle("flipped", flipped);
    c.innerHTML = flipped ? `<span class="qtopic">${esc(cur.f)}</span><span class="back">${esc(cur.b)}</span>` : `<span class="qtopic">${esc(ctx.topicName(cur.t))}</span><span class="front">${esc(cur.f)}</span><span class="muted" style="font-size:13px">Tap to flip</span>`;
  };
  const grade = ok => {
    if (!cur) return;
    boxes[id(cur)] = ok ? Math.min(4, (boxes[id(cur)] || 0) + 1) : 0; store.set(key, boxes);
    if (!ok) queue.splice(Math.min(3, queue.length), 0, cur); // see it again soon
    show();
  };
  $("got").onclick = () => grade(true); $("again").onclick = () => grade(false);
  $("flt").appendChild(topicFilter(ctx, counts, sel, () => { build(); show(); }));
  const onKey = e => { if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return; if (e.key === " ") { e.preventDefault(); $("card").click(); } if (e.key === "ArrowRight") grade(true); if (e.key === "ArrowLeft") grade(false); };
  document.addEventListener("keydown", onKey); cleanup = () => document.removeEventListener("keydown", onKey);
  build(); show();
}

// ---------- calculation drills ----------
const tableHTML = (head, rows) => `<div class="tablewrap"><table><tr>${head.map(h => `<th>${h}</th>`).join("")}</tr>${rows.map(r => `<tr>${r.map(c => c === "?" ? `<td class="ask">?</td>` : `<td>${c}</td>`).join("")}</tr>`).join("")}</table></div>`;
const GEN = {
  "ped-arc": { name: "Arc PED", make() {
    const P1 = R(2, 20) * 5, dP = R(1, 4) * 5, P2 = P1 + dP, Q1 = R(20, 120) * 50, dQ = R(1, Math.max(1, Math.floor(Q1 / 50 * 0.6))) * 50, Q2 = Q1 - dQ;
    const slope = -dQ / dP, mid = (P1 + P2) / (Q1 + Q2), ped = slope * mid;
    return { prompt: `At €${P1}, ${fmt(Q1)} units are sold. When the price rises to €${P2}, ${fmt(Q2)} are sold. Calculate the price elasticity of demand using the arc (midpoint) method, to 2 decimal places.`,
      answer: r2(ped), tol: 0.02, signed: true,
      working: `ΔQ/ΔP = −${fmt(dQ)} / ${dP} = ${fmt(r2(slope))}<br>(P1+P2)/(Q1+Q2) = ${P1 + P2} / ${fmt(Q1 + Q2)} = ${mid.toFixed(4)}<br>PED = ${fmt(r2(slope))} × ${mid.toFixed(4)} = <b>${r2(ped).toFixed(2)}</b><br>|PED| ${Math.abs(ped) > 1 ? "> 1, so elastic" : "< 1, so inelastic"}. The negative sign means it follows the law of demand.` };
  } },
  "tr-rule": { name: "PED and total revenue", make() {
    const kind = pick(["elastic", "inelastic", "unit"]); const v = kind === "elastic" ? pick([-1.4, -2.3, -3.1, -1.8]) : kind === "inelastic" ? pick([-0.3, -0.64, -0.8, -0.15]) : -1;
    const up = Math.random() < .5;
    const ans = kind === "unit" ? "TR stays the same" : (kind === "elastic") === up ? "TR falls" : "TR rises";
    return { prompt: `A firm's PED is ${v}. It ${up ? "raises" : "cuts"} its price. What happens to total revenue?`,
      choices: ["TR rises", "TR falls", "TR stays the same"], answer: ans,
      working: `|PED| = ${Math.abs(v)} → ${kind === "unit" ? "unit elastic: % changes in P and Q cancel out" : kind}.<br>${kind === "elastic" ? "Elastic: quantity reacts more than price, so TR moves the opposite way to price." : kind === "inelastic" ? "Inelastic: quantity barely reacts, so TR moves the same way as price." : ""}` };
  } },
  "elas-type": { name: "YED and XED", make() {
    if (Math.random() < .5) {
      const v = pick([-1.2, -0.4, -0.7, 0.3, 0.6, 0.85, 1.4, 2.2, 3]);
      const ans = v < 0 ? "Inferior good" : v <= 1 ? "Normal necessity" : "Luxury good";
      return { prompt: `The income elasticity of demand for a good is ${v > 0 ? "+" : ""}${v}. The good is:`, choices: ["Inferior good", "Normal necessity", "Luxury good"], answer: ans,
        working: "YED < 0 → inferior · 0 to 1 → normal necessity · > 1 → luxury" };
    }
    const v = pick([-1.5, -0.8, -0.3, 0.4, 0.9, 2.1]);
    return { prompt: `The cross-price elasticity of demand between good A and good B is ${v > 0 ? "+" : ""}${v}. A and B are:`, choices: ["Substitutes", "Complements", "Unrelated"], answer: v > 0 ? "Substitutes" : "Complements",
      working: "XED > 0 → substitutes (B dearer, more A bought) · XED < 0 → complements (used together)" };
  } },
  "equilibrium": { name: "Equilibrium, shortage and surplus", make() {
    const Pe = R(4, 9) * 5, Qe = R(10, 40) * 10, b = R(1, 3) * 2, d = R(1, 3) * 2;
    const prices = [-15, -10, -5, 0, 5, 10].map(x => Pe + x).filter(p => p > 0);
    const qd = p => Qe - b * (p - Pe), qs = p => Math.max(0, Qe + d * (p - Pe));
    const rows = prices.map(p => [`€${p}`, fmt(qd(p)), fmt(qs(p))]);
    const head = ["Price", "Qty demanded", "Qty supplied"];
    const kind = pick(["price", "qty", "gap", "gap"]);
    if (kind === "price") return { prompt: "What is the equilibrium price (€)?" , table: tableHTML(head, rows), answer: Pe, tol: 0, working: `Equilibrium is where QD = QS: both are ${fmt(Qe)} at €${Pe}.` };
    if (kind === "qty") return { prompt: "What is the equilibrium quantity?", table: tableHTML(head, rows), answer: Qe, tol: 0, working: `QD = QS = ${fmt(Qe)} at €${Pe}.` };
    const p = pick(prices.filter(x => x !== Pe)); const gap = Math.abs(qd(p) - qs(p)); const short = qd(p) > qs(p);
    const alt = gap + (b + d) * 5; // the gap one €5 step further out: a plausible misread
    const choices = shuffle([`Shortage of ${fmt(gap)}`, `Surplus of ${fmt(gap)}`, `Shortage of ${fmt(alt)}`, `Surplus of ${fmt(alt)}`]);
    return { prompt: `At a price of €${p}, the market has:`, table: tableHTML(head, rows), choices, answer: `${short ? "Shortage" : "Surplus"} of ${fmt(gap)}`,
      working: `At €${p}: QD = ${fmt(qd(p))}, QS = ${fmt(qs(p))}.<br>${short ? "QD > QS → shortage" : "QS > QD → surplus"} of ${fmt(gap)}. The price will ${short ? "rise" : "fall"} toward €${Pe}.` };
  } },
  "cost-table": { name: "Cost tables (TC, MC, AC)", make() {
    const lr = Math.random() < .4;
    const FC = lr ? 0 : R(2, 6) * 5, base = R(4, 10) * 2;
    const mcs = [base + R(2, 5) * 2, base, base + R(0, 2) * 2, base + R(3, 6) * 2, base + R(8, 12) * 2];
    const TC = [FC]; mcs.forEach(m => TC.push(TC[TC.length - 1] + m));
    const VC = TC.map(t => t - FC);
    const kind = pick(lr ? ["mc", "ac", "ac"] : ["tc", "mc", "ac", "ac"]); const q = kind === "tc" ? R(1, 5) : R(1, 5);
    const val = kind === "tc" ? TC[q] : kind === "mc" ? mcs[q - 1] : r2(TC[q] / q);
    const rows = TC.map((t, i) => lr
      ? [i, fmt(t), kind === "mc" && i === q ? "?" : i ? "" : "–", kind === "ac" && i === q ? "?" : i ? "" : "–"]
      : [i, FC, fmt(VC[i]), kind === "tc" && i === q ? "?" : "", kind === "mc" && i === q ? "?" : i ? "" : "–", kind === "ac" && i === q ? "?" : i ? "" : "–"]);
    const head = lr ? ["Output", "Total cost (€)", "MC (€)", "AC (€)"] : ["Output", "Fixed (€)", "Variable (€)", "Total (€)", "MC (€)", "AC (€)"];
    const label = kind === "tc" ? `total cost at ${q} units` : kind === "mc" ? `marginal cost of unit ${q}` : `average cost at ${q} units (2 d.p. if needed)`;
    const work = kind === "tc" ? `TC = FC + VC = ${FC} + ${VC[q]} = <b>${TC[q]}</b>`
      : kind === "mc" ? `MC = TC(${q}) − TC(${q - 1}) = ${TC[q]} − ${TC[q - 1]} = <b>${mcs[q - 1]}</b>${lr ? "" : "<br>(Fixed cost doesn't affect MC: it's the change in variable cost.)"}`
      : `${lr ? "" : `TC(${q}) = ${FC} + ${VC[q]} = ${TC[q]}<br>`}AC = TC / Q = ${TC[q]} / ${q} = <b>${fmt(val)}</b>`;
    return { prompt: `${lr ? "Long-run total costs" : "Short-run costs"} for a firm. Find the <b>${label}</b>.`, table: tableHTML(head, rows), answer: val, tol: 0.01, working: work };
  } },
  "revenue-table": { name: "Revenue tables (TR, MR)", make() {
    const b = pick([1, 2]), a = b === 1 ? R(8, 14) : R(16, 22);
    const Q = [1, 2, 3, 4, 5, 6, 7].filter(q => a - b * q > 0);
    const P = q => a - b * q, TR = q => q * P(q);
    const kind = pick(["tr", "mr", "mr", "max"]); const q = kind === "mr" ? pick(Q.slice(1)) : pick(Q);
    const rows = Q.map(x => [x, P(x), kind === "tr" && x === q ? "?" : kind === "tr" ? "" : TR(x), kind === "mr" && x === q ? "?" : ""]);
    const head = ["Quantity", "Price = AR (€)", "TR (€)", "MR (€)"];
    if (kind === "max") {
      const best = Math.max(...Q.map(TR)); const at = Q.filter(x => TR(x) === best);
      return { prompt: "At what output is total revenue maximised?", table: tableHTML(head, Q.map(x => [x, P(x), TR(x), ""])), answer: at, tol: 0,
        working: `TR peaks at €${best} (Q = ${at.join(" or ")}). That's where MR hits 0, the unit-elastic point of the demand curve.` };
    }
    const val = kind === "tr" ? TR(q) : TR(q) - TR(q - 1);
    return { prompt: kind === "tr" ? `Find the <b>total revenue</b> at ${q} units.` : `Find the <b>marginal revenue</b> of unit ${q}.`, table: tableHTML(head, rows), answer: val, tol: 0,
      working: kind === "tr" ? `TR = P × Q = ${P(q)} × ${q} = <b>${val}</b>` : `MR = TR(${q}) − TR(${q - 1}) = ${TR(q)} − ${TR(q - 1)} = <b>${val}</b>${val < P(q) ? `<br>MR (${val}) < price (${P(q)}): to sell one more, the firm cuts the price on every unit.` : ""}` };
  } },
};
function modeCalc(panel, ctx, topic) {
  const gens = ctx.pack.calc.filter(g => GEN[g.id]);
  let chosen = topic ? gens.filter(g => g.t === topic).map(g => g.id) : gens.map(g => g.id);
  if (!chosen.length) chosen = gens.map(g => g.id);
  const stat = { right: 0, n: 0, streak: 0 };
  panel.innerHTML = `<div class="sheet stack"><span class="eyebrow">Fresh numbers every time</span><h3>Calculations</h3>
    <p class="muted">These come up as both MCQs and written questions. The numbers are random, so you can't memorise answers, only the method.</p>
    <div class="filter" id="gf">${gens.map(g => `<button class="tchip" data-g="${g.id}" aria-pressed="${chosen.includes(g.id)}">${GEN[g.id].name}</button>`).join("")}</div>
    <div class="calc-q" id="cq"></div><p class="streak" id="st"></p></div>`;
  const $ = x => panel.querySelector("#" + x);
  panel.querySelectorAll("#gf button").forEach(b => b.onclick = () => {
    const g = b.dataset.g; chosen = chosen.includes(g) ? chosen.filter(x => x !== g) : [...chosen, g];
    if (!chosen.length) chosen = [g];
    panel.querySelectorAll("#gf button").forEach(x => x.setAttribute("aria-pressed", chosen.includes(x.dataset.g))); next();
  });
  let cur = null, done = false;
  const next = () => {
    const gid = pick(chosen); cur = GEN[gid].make(); done = false;
    const topicId = (gens.find(g => g.id === gid) || {}).t;
    $("cq").innerHTML = `<span class="qtopic">${esc(ctx.topicName(topicId))} · ${esc(GEN[gid].name)}</span>${cur.table || ""}<p class="qtext">${cur.prompt}</p>
      ${cur.choices ? `<div class="opts">${cur.choices.map((c, i) => `<button class="opt" id="cc-${i}" data-c="${esc(c)}"><span class="k">${"ABCD"[i]}</span><span>${esc(c)}</span></button>`).join("")}</div>`
        : `<form class="ansrow" id="af"><input id="ans" inputmode="decimal" autocomplete="off" placeholder="Your answer" aria-label="Your answer"><button class="btn">Check</button></form>`}
      <div id="fb"></div>`;
    if (cur.choices) panel.querySelectorAll("#cq .opt").forEach(b => b.onclick = () => check(b.dataset.c, b));
    else { $("af").onsubmit = e => { e.preventDefault(); check($("ans").value); }; $("ans").focus({ preventScroll: true }); }
    $("st").textContent = stat.n ? `${stat.right}/${stat.n} correct · streak ${stat.streak}` : "";
  };
  const check = (raw, btn) => {
    if (done) return;
    let ok, note = "";
    if (cur.choices) {
      ok = raw === cur.answer;
      panel.querySelectorAll("#cq .opt").forEach(b => { b.disabled = true; if (b.dataset.c === cur.answer) b.classList.add("right"); else if (b === btn) b.classList.add("wrong"); });
    } else {
      const v = parseFloat(String(raw).replace(/[€,\s]/g, "").replace("−", "-"));
      if (isNaN(v)) { $("fb").innerHTML = `<p class="muted">Enter a number, e.g. ${Array.isArray(cur.answer) ? cur.answer[0] : cur.answer}.</p>`; return; }
      const answers = Array.isArray(cur.answer) ? cur.answer : [cur.answer];
      ok = answers.some(a => Math.abs(v - a) <= cur.tol + 1e-9);
      if (!ok && cur.signed && answers.some(a => Math.abs(-v - a) <= cur.tol + 1e-9)) note = " The size is right but the sign isn't. PED on a normal demand curve is negative, and the sign gets marks.";
      $("ans").disabled = true;
    }
    done = true; stat.n++; if (ok) { stat.right++; stat.streak++; } else stat.streak = 0;
    const ansText = Array.isArray(cur.answer) ? cur.answer.join(" or ") : cur.answer;
    $("fb").innerHTML = `<div class="explain ${ok ? "" : "miss"}"><b>${ok ? "Correct." : `Answer: ${esc(ansText)}.`}</b>${esc(note)}<div class="working" style="margin-top:8px">${cur.working}</div></div>
      <div class="row" style="margin-top:12px"><button class="btn" id="nx">Next question</button></div>`;
    $("nx").onclick = next; $("nx").focus({ preventScroll: true });
    $("st").textContent = `${stat.right}/${stat.n} correct · streak ${stat.streak}`;
  };
  next();
}

// ---------- written exam questions ----------
function modeWritten(panel, ctx, topic) {
  const items = ctx.pack.written, counts = countBy(items);
  const sel = new Set(topic ? [topic] : Object.keys(counts));
  const key = `written.${ctx.m.slug}`; const scores = store.get(key, {});
  panel.innerHTML = `<div class="sheet stack"><span class="eyebrow">Past-paper practice</span><h3>Exam questions</h3>
    <p class="muted">Real questions from the last three winter papers. Write your answer (or plan it in bullet points), then reveal the marking points and tick the ones you covered. Each point you miss is marks lost.</p>
    <div id="flt"></div><div class="stack" id="wl"></div></div>`;
  const draw = () => {
    const list = panel.querySelector("#wl"); list.innerHTML = "";
    items.forEach((w, i) => {
      if (!sel.has(w.t)) return;
      const best = scores[i];
      const d = document.createElement("details"); d.className = "note";
      d.innerHTML = `<summary><div><span class="qtopic">${esc(ctx.topicName(w.t))} · ${w.marks} marks</span><h3 style="margin-top:4px">${esc(w.q)}</h3></div></summary>
        <div class="nb wq"><span class="src">${esc(w.src)}${best != null ? ` · best ${best}/${w.points.length} points` : ""}</span>
        <textarea id="wa-${i}" placeholder="Write or plan your answer here…"></textarea>
        <div class="row"><button class="btn" id="wr-${i}">Show marking points</button></div><div id="wp-${i}"></div></div>`;
      list.appendChild(d);
      const ta = d.querySelector("textarea"); ta.value = store.get(`draft.${ctx.m.slug}.${i}`, "");
      ta.oninput = () => store.set(`draft.${ctx.m.slug}.${i}`, ta.value);
      d.querySelector(`#wr-${i}`).onclick = e => {
        e.target.hidden = true;
        const box = d.querySelector(`#wp-${i}`);
        box.innerHTML = `<ul class="points">${w.points.map((p, j) => `<li><label><input type="checkbox" id="wc-${i}-${j}"><span>${esc(p)}</span></label></li>`).join("")}</ul><p class="streak" id="ws-${i}">Tick the points your answer covered.</p>`;
        box.querySelectorAll("input").forEach(c => c.onchange = () => {
          const got = box.querySelectorAll("input:checked").length; scores[i] = Math.max(scores[i] || 0, got); store.set(key, scores);
          box.querySelector(`#ws-${i}`).textContent = `${got}/${w.points.length} points covered${got === w.points.length ? ". Full marks territory." : ""}`;
        });
      };
    });
  };
  panel.querySelector("#flt").appendChild(topicFilter(ctx, counts, sel, draw)); draw();
}

// ---------- notes ----------
function modeNotes(panel, ctx, topic) {
  panel.innerHTML = `<div class="stack">${notesHTML(ctx.pack, topic)}${topic ? `<button class="btn ghost" id="alln" style="align-self:flex-start">Show all topics</button>` : ""}</div>`;
  const a = panel.querySelector("#alln"); if (a) a.onclick = () => modeNotes(panel, ctx);
}

// ---------- boot ----------
fetch("data/modules.json").then(r => r.json()).then(c => { CAT = c; route(); })
  .catch(() => { app.innerHTML = topBar() + `<div class="emptystate"><h3>Couldn't load the library</h3><p class="muted">Check your connection and reload the page.</p></div>`; });
