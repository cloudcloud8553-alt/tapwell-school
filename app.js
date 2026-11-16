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
function parseDate(s) { const [y, m, d] = s.split("-").map(Number); return { date: new Date(y, m - 1, d || 4), exact: !!d }; } // month-only = exam period, sorts after the 1st–3rd
function daysUntil(s) { const { date } = parseDate(s); const t = new Date(); t.setHours(0, 0, 0, 0); return Math.round((date - t) / 864e5); }
function dateLabel(s) { const { date, exact } = parseDate(s); return exact ? `${DAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}` : `${MONTHS[date.getMonth()]} ${date.getFullYear()}`; }
const tLabel = t => t.when || dateLabel(t.date);
function duePill(s, when, until) {
  const { exact } = parseDate(s); const d = daysUntil(s);
  if (until && d <= 0 && daysUntil(until) >= 0) return `<span class="pill soon">on now</span>`;
  if (!exact) return `<span class="pill later">${esc(when || dateLabel(s))}</span>`;
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
    .filter(x => !x.t.done && (daysUntil(x.t.until || x.t.date) >= 0 || !parseDate(x.t.date).exact))
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
        ${duePill(t.date, t.when, t.until)}</a>`;
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
  const next = (m.tests || []).filter(t => !t.done && (daysUntil(t.until || t.date) >= 0 || !parseDate(t.date).exact)).sort((a, b) => parseDate(a.date).date - parseDate(b.date).date)[0];
  return `<a class="mod${live ? "" : " empty"}" href="#${m.slug}">
    ${m.code ? `<span class="code">${esc(m.code)}</span>` : ""}
    <h3>${esc(m.name)}</h3>
    <span class="foot">${live ? `<span class="live">● ${m.tests.length} test${m.tests.length > 1 ? "s" : ""}</span>${next ? ` · ${esc(tLabel(next))}` : ""}` : m.note ? "Assignments only" : "No material yet"}</span>
  </a>`;
}

// ---------- module ----------
function renderModule(m, pack) {
  document.title = `${m.name} · Tapwell School`;
  const crumbs = [["Library", "home"], [m.sem.label], [m.name]];
  if (!pack) {
    app.innerHTML = topBar(crumbs) + `
      <section class="hero"><span class="eyebrow">${esc(m.code || m.sem.label)}</span><h1>${esc(m.name)}</h1></section>
      <div class="emptystate"><h3>${m.note ? "No exam to study for" : "No material yet"}</h3>
        <p class="muted">${m.note ? esc(m.note) : "This library fills up as the semester goes. Study packs are added about a week before each test, built from the Moodle slides, tutorial sheets and past papers."}</p></div>${footer}`;
    return;
  }
  app.innerHTML = topBar(crumbs) + `
    <section class="hero"><span class="eyebrow">${esc([m.code, m.lecturer].filter(Boolean).join(" · "))}</span><h1>${esc(m.name)}</h1>
      ${(() => { const bits = [[pack.questions.length, "practice questions"], [pack.cards.length, "flashcards"], [pack.written.length, "exam-style questions"], [pack.topics.length, "topics"]].filter(b => b[0]).map(b => `${b[0]} ${b[1]}`); return bits.length ? `<p class="muted">${bits.join(" · ")}</p>` : ""; })()}</section>
    <section class="stack"><h2>Tests</h2><div class="tests">${pack.tests.map(t => `
      <a class="test" href="#${m.slug}--${t.id}">
        <div class="row" style="justify-content:space-between"><span class="eyebrow">${esc(tLabel(t))} · ${esc(t.weight)}</span>${duePill(t.date, t.when, t.until)}</div>
        <h3>${esc(t.title)}</h3><span class="meta">${esc(t.format)}</span></a>`).join("")}</div></section>
    ${pack.topics.length ? `<section class="stack"><h2>Notes</h2>${notesHTML(pack)}</section>` : ""}
    <p class="muted" style="font-size:13px">Sources: ${esc(pack.sources)}</p>${footer}`;
}
function notesHTML(pack, only) {
  return pack.topics.filter(t => !only || only === t.id).map((t, i) =>
    `<details class="note" id="note-${t.id}" ${only || i === 0 ? "open" : ""}><summary><h3>${esc(t.name)}</h3></summary><div class="nb">${t.notes}</div></details>`).join("");
}

// ---------- test ----------
const MODE_LABEL = { info: "What to do", sheet: "Open-book sheet", mock: "Timed mock", drill: "Question drill", cards: "Flashcards", calc: "Calculations", written: "Exam questions", notes: "Notes" };
const TECH_LABEL = { sheet: "Open-book sheet", notes: "Read notes", drill: "Question drill", cards: "Flashcards", calc: "Calculations", written: "Exam questions" };

function renderTest(m, pack, test) {
  document.title = `${test.title} · ${m.name}`;
  if (test.topics) { // scope this test's page to its own topics
    const keep = x => test.topics.includes(x.t);
    pack = { ...pack, topics: pack.topics.filter(t => test.topics.includes(t.id)), questions: pack.questions.filter(keep),
      cards: pack.cards.filter(keep), calc: pack.calc.filter(keep), written: pack.written.filter(keep), _all: pack };
  }
  const ctx = { m, pack, test, topicName: id => (pack.topics.find(t => t.id === id) || {}).name || id };
  const modes = test.modes;
  app.innerHTML = topBar([["Library", "home"], [m.name, m.slug], [test.title]]) + `
    <section class="hero"><span class="eyebrow">${esc(m.name)}</span><h1>${esc(test.title)}</h1>
      <div class="chips"><span class="chip">${esc(tLabel(test))}</span><span class="chip">${esc(test.format)}</span><span class="chip"><strong>${esc(test.weight)}</strong> of the module</span></div></section>
    ${pack.topics.length && test.modes.some(x => x !== "info") ? `<section class="stack"><h2>How to study each topic</h2>
      <div class="plan">${pack.topics.map(t => {
        const usable = t.modes.filter(x => x === "notes" || modes.includes(x) || (x === "drill" && modes.includes("mock")));
        const list = usable.length ? usable : ["notes"];
        return `<div class="pt"><h3>${esc(t.name)}</h3><div class="tech">${list.map(x => `<button class="tbtn" data-mode="${x}" data-topic="${t.id}">${TECH_LABEL[x]}</button>`).join("")}</div><p class="why">${esc(t.why)}</p></div>`;
      }).join("")}</div></section>` : ""}
    <section class="stack" id="study">
      <nav class="tabs" role="tablist">${modes.map((x, i) => `<button class="tab" role="tab" id="tab-${x}" data-tab="${x}" aria-selected="${i === 0}">${MODE_LABEL[x]}</button>`).join("")}</nav>
      <div id="panel"></div>
    </section>${footer}`;
  const open = (mode, topic) => {
    if (mode === "drill" && !modes.includes("drill")) mode = "mock";
    app.querySelectorAll(".tab").forEach(b => b.setAttribute("aria-selected", b.dataset.tab === mode));
    if (cleanup) { cleanup(); cleanup = null; }
    const panel = document.getElementById("panel");
    ({ info: modeInfo, sheet: modeSheet, mock: modeMock, drill: modeDrill, cards: modeCards, calc: modeCalc, written: modeWritten, notes: modeNotes })[mode](panel, ctx, topic);
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
  if (gm) gm.onclick = () => runQuiz(panel, ctx, { items: shuffle(missed.map(i => (ctx.pack._all || ctx.pack).questions[i]).filter(q => q && ctx.pack.questions.includes(q)).filter(Boolean)), learn: true, missedMode: true });
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
  const bank = (ctx.pack._all || ctx.pack).questions; // full list, so missed-question ids stay stable
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
    panel.querySelector("#again").onclick = () => opt.learn ? modeDrill(panel, ctx) : runQuiz(panel, ctx, { ...opt, items: pickMock(ctx.pack.questions, opt.items.length) });
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
  // ----- Financial accounting -----
  "dep-sl": { name: "Straight line", make() {
    const cost = R(8, 90) * 1000, rate = pick([10, 12.5, 15, 20, 25]), n = R(1, 4), dep = cost * rate / 100;
    const kind = pick(["charge", "acc", "nbv"]);
    const val = kind === "charge" ? dep : kind === "acc" ? dep * n : cost - dep * n;
    return { prompt: `A machine cost €${fmt(cost)}. It's depreciated at ${rate}% straight line, with a full year's charge in the year of purchase. ${kind === "charge" ? "What is the annual depreciation charge?" : kind === "acc" ? `What is the accumulated depreciation after ${n} year${n > 1 ? "s" : ""}?` : `What is the net book value after ${n} year${n > 1 ? "s" : ""}?`}`,
      answer: r2(val), tol: 0.5,
      working: `Annual charge = ${fmt(cost)} × ${rate}% = ${fmt(dep)} (the same every year)${kind !== "charge" ? `<br>Acc dep after ${n} yr = ${fmt(dep)} × ${n} = ${fmt(dep * n)}` : ""}${kind === "nbv" ? `<br>NBV = ${fmt(cost)} − ${fmt(dep * n)} = <b>${fmt(val)}</b>` : ""}` };
  } },
  "dep-rb": { name: "Reducing balance", make() {
    const cost = R(8, 80) * 1000, rate = pick([15, 20, 25, 30]), n = R(2, 4);
    let nbv = cost; const rows = [];
    for (let y = 1; y <= n; y++) { const d = r2(nbv * rate / 100); rows.push([y, fmt(nbv), fmt(d), fmt(r2(nbv - d))]); nbv = r2(nbv - d); }
    const kind = pick(["charge", "nbv"]); const last = rows[n - 1];
    const val = kind === "charge" ? Number(last[2].replace(/,/g, "")) : nbv;
    return { prompt: `A vehicle cost €${fmt(cost)}, depreciated at ${rate}% reducing balance (full year in year of purchase). ${kind === "charge" ? `What is the depreciation charge in year ${n}?` : `What is the NBV at the end of year ${n}?`}`,
      answer: val, tol: 1,
      working: `Each year: NBV × ${rate}%<br>${rows.map(r => `Yr ${r[0]}: ${r[1]} × ${rate}% = ${r[2]} → NBV ${r[3]}`).join("<br>")}<br>Answer: <b>${fmt(val)}</b>` };
  } },
  "dep-months": { name: "Part-year (months owned)", make() {
    const cost = R(4, 60) * 100, rate = pick([10, 12.5, 15, 20, 25]), m = R(2, 12);
    const months = 12 - m + 1, val = r2(cost * rate / 100 * months / 12);
    return { prompt: `Policy: one month's ownership means one month's depreciation. An asset costing €${fmt(cost)} is bought on 1 ${MONTHS[m - 1]}. Year end is 31 December, rate ${rate}% straight line. What is the charge for the first year?`,
      answer: val, tol: 0.5,
      working: `Months owned: ${MONTHS[m - 1]}–Dec = ${months}<br>${fmt(cost)} × ${rate}% × ${months}/12 = <b>${fmt(val)}</b>` };
  } },
  "dep-disposal": { name: "Disposals (profit or loss)", make() {
    const sl = Math.random() < .55, cost = R(10, 90) * 1000, rate = sl ? pick([10, 15, 20]) : pick([20, 25]), k = R(1, sl ? 5 : 3);
    let acc = 0, nbv = cost; const lines = [];
    for (let y = 1; y <= k; y++) { const d = sl ? cost * rate / 100 : r2(nbv * rate / 100); acc = r2(acc + d); nbv = r2(cost - acc); lines.push(`Yr ${y}: ${fmt(d)}`); }
    const proceeds = Math.round(nbv * (0.7 + Math.random() * 0.6) / 50) * 50, pl = r2(proceeds - nbv);
    const kind = pick(["acc", "pl", "pl"]);
    return { prompt: `An asset cost €${fmt(cost)} and was depreciated at ${rate}% ${sl ? "straight line" : "reducing balance"}. It was held for ${k} full financial year${k > 1 ? "s" : ""} before the year of sale (full year in year of purchase, none in year of sale) and sold for €${fmt(proceeds)}. ${kind === "acc" ? "What is the accumulated depreciation on this asset at disposal?" : "What is the profit or loss on disposal? Enter a loss as a negative number."}`,
      answer: kind === "acc" ? acc : pl, tol: 1,
      working: `${lines.join(" · ")} → acc dep <b>${fmt(acc)}</b><br>NBV = ${fmt(cost)} − ${fmt(acc)} = ${fmt(nbv)}${kind === "pl" ? `<br>Proceeds ${fmt(proceeds)} − NBV ${fmt(nbv)} = <b>${pl >= 0 ? "profit " + fmt(pl) : "loss " + fmt(-pl)}</b> (${pl >= 0 ? "over" : "under"}-depreciated)` : ""}` };
  } },
  "trade-in": { name: "Trade-ins", make() {
    const newCost = R(25, 70) * 1000, cash = R(10, Math.floor(newCost / 1000) - 8) * 1000, allow = newCost - cash;
    const oldCost = R(20, 60) * 1000, acc = Math.round(oldCost * pick([0.2, 0.36, 0.488, 0.25, 0.4375]));
    const nbv = oldCost - acc, pl = allow - nbv, kind = pick(["allow", "pl"]);
    return { prompt: `A new van costing €${fmt(newCost)} is acquired for €${fmt(cash)} cash after trading in an old van (cost €${fmt(oldCost)}, accumulated depreciation €${fmt(acc)}). ${kind === "allow" ? "What is the trade-in allowance?" : "What is the profit or loss on the old van? Enter a loss as a negative number."}`,
      answer: kind === "allow" ? allow : pl, tol: 0.5,
      working: `Trade-in allowance = ${fmt(newCost)} − ${fmt(cash)} = <b>${fmt(allow)}</b> (Cr Disposal, Dr Cost a/c)${kind === "pl" ? `<br>Old van NBV = ${fmt(oldCost)} − ${fmt(acc)} = ${fmt(nbv)}<br>${fmt(allow)} − ${fmt(nbv)} = <b>${pl >= 0 ? "profit " + fmt(pl) : "loss " + fmt(-pl)}</b>` : ""}<br>The new van goes into the Cost a/c at its full €${fmt(newCost)}.` };
  } },
  "dep-charge-pool": { name: "Year-end charge after a disposal", make() {
    const sl = Math.random() < .5, rate = sl ? pick([10, 15, 20]) : pick([20, 25]);
    const open = R(15, 45) * 10000, accOpen = Math.round(open * (0.25 + Math.random() * 0.2) / 100) * 100;
    const add = R(10, 60) * 1000, dispCost = R(10, 40) * 1000, dispAcc = Math.round(dispCost * (0.3 + Math.random() * 0.3) / 25) * 25;
    const close = open + add - dispCost, base = sl ? close : close - (accOpen - dispAcc), val = r2(base * rate / 100);
    return { prompt: `Opening cost €${fmt(open)}, opening acc dep €${fmt(accOpen)}. Additions €${fmt(add)}. An asset costing €${fmt(dispCost)} (acc dep €${fmt(dispAcc)}) was sold. Depreciation is ${rate}% ${sl ? "straight line" : "reducing balance"} on assets held at year end. What is this year's depreciation charge?`,
      answer: val, tol: 1,
      working: `Closing cost = ${fmt(open)} + ${fmt(add)} − ${fmt(dispCost)} = ${fmt(close)}<br>${sl ? `SL: ${fmt(close)} × ${rate}% = <b>${fmt(val)}</b>` : `Acc dep on assets kept = ${fmt(accOpen)} − ${fmt(dispAcc)} = ${fmt(accOpen - dispAcc)}<br>RB: (${fmt(close)} − ${fmt(accOpen - dispAcc)}) × ${rate}% = <b>${fmt(val)}</b>`}` };
  } },
  "cost-of-sales": { name: "Cost of sales and gross profit", make() {
    const open = R(20, 120) * 1000, pur = R(150, 400) * 1000, ret = R(5, 30) * 1000, carr = R(5, 25) * 1000, close = R(20, 150) * 1000;
    const sales = R(500, 990) * 1000, rin = R(10, 60) * 1000, cos = open + pur - ret + carr - close, gp = sales - rin - cos;
    const kind = pick(["cos", "gp"]);
    return { prompt: `Opening inventory €${fmt(open)}, purchases €${fmt(pur)}, purchases returns €${fmt(ret)}, carriage inwards €${fmt(carr)}, closing inventory €${fmt(close)}${kind === "gp" ? `, sales €${fmt(sales)}, sales returns €${fmt(rin)}` : ""}. Calculate the ${kind === "cos" ? "cost of sales" : "gross profit"}.`,
      answer: kind === "cos" ? cos : gp, tol: 0.5,
      working: `Cost of sales = ${fmt(open)} + ${fmt(pur)} − ${fmt(ret)} + ${fmt(carr)} − ${fmt(close)} = ${fmt(cos)}${kind === "gp" ? `<br>Net sales = ${fmt(sales)} − ${fmt(rin)} = ${fmt(sales - rin)}<br>GP = ${fmt(sales - rin)} − ${fmt(cos)} = <b>${fmt(gp)}</b>` : ""}` };
  } },
  "vat-line": { name: "Day book lines (VAT 23%)", make() {
    const units = R(40, 1800), price = R(80, 650) / 100, net = r2(units * price), vat = r2(net * 0.23), tot = r2(net + vat);
    const kind = pick(["net", "vat", "total"]);
    return { prompt: `Sold ${fmt(units)} units @ €${price.toFixed(2)} each (exclusive of VAT at 23%). What is the ${kind === "net" ? "net amount" : kind === "vat" ? "VAT" : "total (incl. VAT)"}?`,
      answer: kind === "net" ? net : kind === "vat" ? vat : tot, tol: 0.015,
      working: `Net = ${fmt(units)} × ${price.toFixed(2)} = ${net.toFixed(2)}<br>VAT = ${net.toFixed(2)} × 23% = ${vat.toFixed(2)}<br>Total = ${tot.toFixed(2)}` };
  } },
  // ----- Cost accounting -----
  "stock-levels": { name: "Re-order, min, max and average levels", make() {
    const norm = R(10, 80) * 10, maxU = norm + R(2, 8) * 10, minU = norm - R(2, 6) * 10, lo = R(5, 12), hi = lo + 2 * R(1, 3), rq = R(10, 80) * 100;
    const nl = (lo + hi) / 2, rol = maxU * hi, mn = rol - norm * nl, mx = rol - minU * lo + rq, avg = mn + rq / 2;
    const kind = pick(["rol", "min", "max", "avg"]);
    const val = { rol, min: mn, max: mx, avg }[kind];
    return { prompt: `Usage per day: normal ${norm}, minimum ${minU}, maximum ${maxU}. Lead time ${lo}–${hi} days. Re-order quantity ${fmt(rq)}. Calculate the <b>${{ rol: "re-order level", min: "minimum (safety) level", max: "maximum level", avg: "average inventory" }[kind]}</b>.`,
      answer: val, tol: 0.5,
      working: `ROL = max usage × max lead time = ${maxU} × ${hi} = ${fmt(rol)}${kind !== "rol" ? `<br>Normal lead time = (${lo} + ${hi}) ÷ 2 = ${nl}` : ""}${kind === "min" || kind === "avg" ? `<br>Min = ${fmt(rol)} − (${norm} × ${nl}) = ${fmt(mn)}` : ""}${kind === "max" ? `<br>Max = ${fmt(rol)} − (${minU} × ${lo}) + ${fmt(rq)} = <b>${fmt(mx)}</b>` : ""}${kind === "avg" ? `<br>Average = ${fmt(mn)} + ½ × ${fmt(rq)} = <b>${fmt(avg)}</b>` : ""}` };
  } },
  "eoq": { name: "EOQ", make() {
    for (;;) {
      const e = R(2, 40) * 50, ch = pick([0.5, 1, 2, 4, 5, 8, 10]), co = pick([10, 20, 25, 32, 40, 50, 64, 80, 100]);
      const d = e * e * ch / (2 * co);
      if (Number.isInteger(d) && d >= 1000 && d <= 500000)
        return { prompt: `Ordering cost €${co} per order, annual demand ${fmt(d)} units, holding cost €${ch} per unit per year. Calculate the economic order quantity.`,
          answer: e, tol: 0.5, working: `EOQ = √(2 × Co × D ÷ Ch) = √(2 × ${co} × ${fmt(d)} ÷ ${ch}) = √${fmt(e * e)} = <b>${fmt(e)}</b>` };
    }
  } },
  "fifo-lifo-wa": { name: "FIFO, LIFO and weighted average", make() {
    const p0 = R(4, 12), ev = [];
    let qty = R(4, 10) * 10; ev.push({ type: "in", q: qty, p: p0 });
    let price = p0, held = qty;
    for (let i = 0; i < 4; i++) {
      if (i % 2 === 0) { const q = R(2, Math.max(2, Math.floor(held / 10) - 1)) * 10; ev.push({ type: "out", q }); held -= q; }
      else { price += R(1, 4); const q = R(3, 8) * 10; ev.push({ type: "in", q, p: price }); held += q; }
    }
    const method = pick(["FIFO", "LIFO", "Weighted average"]);
    // perpetual: layers for FIFO/LIFO, running average for WA
    let layers = [], wq = 0, wv = 0;
    for (const e of ev) {
      if (e.type === "in") { layers.push({ q: e.q, p: e.p }); wv += e.q * e.p; wq += e.q; }
      else {
        let need = e.q;
        while (need > 0) { const L = method === "FIFO" ? layers[0] : layers[layers.length - 1]; const take = Math.min(need, L.q); L.q -= take; need -= take; if (!L.q) method === "FIFO" ? layers.shift() : layers.pop(); }
        const avg = wv / wq; wv -= e.q * avg; wq -= e.q;
      }
    }
    const val = method === "Weighted average" ? r2(wv) : layers.reduce((a, L) => a + L.q * L.p, 0);
    const list = ev.map((e, i) => `${i + 1}. ${e.type === "in" ? `Received ${e.q} @ €${e.p}` : `Issued ${e.q}`}`).join("<br>");
    return { prompt: `${list}<br><br>Calculate the value of closing stock using <b>${method}</b>${method === "Weighted average" ? " (recalculate the average after each receipt; to 2 d.p.)" : ""}.`,
      answer: val, tol: method === "Weighted average" ? 1 : 0.5,
      working: method === "Weighted average" ? `Running average: recalculate total value ÷ units after each receipt, issue at that average.<br>Closing: ${wq} units, value <b>${fmt(val)}</b>`
        : `${method === "FIFO" ? "Issues come from the OLDEST layers, so what's left is the newest stock." : "Issues come from the NEWEST layers at the time of each issue."}<br>Closing layers: ${layers.map(L => `${L.q} @ €${L.p}`).join(" + ")} = <b>€${fmt(val)}</b>` };
  } },
  "overtime": { name: "Overtime and the premium", make() {
    const rate = R(8, 20), sat = R(2, 8), sun = R(0, 6), basic = 40;
    const ot = sat + sun, prem = r2(sat * rate * 0.5 + sun * rate), total = basic * rate + ot * rate + prem;
    const kind = pick(["total", "prem"]);
    return { prompt: `Normal week 40 hours at €${rate}/hr. The employee worked ${40 + ot} hours: ${sat} on Saturday (time-and-a-half)${sun ? ` and ${sun} on Sunday (double time)` : ""}, as general company policy. ${kind === "total" ? "What are total gross wages?" : "How much is charged to production overhead (the overtime premium)?"}`,
      answer: kind === "total" ? total : prem, tol: 0.01,
      working: `Basic 40 × ${rate} = ${fmt(basic * rate)}<br>Overtime ${ot} × ${rate} = ${fmt(ot * rate)} (direct)<br>Premium ${sat} × ${rate} × 0.5${sun ? ` + ${sun} × ${rate} × 1` : ""} = ${fmt(prem)} (production overhead)<br>Total = <b>${fmt(total)}</b>` };
  } },
  "diff-piece": { name: "Differential piecework", make() {
    const t1 = R(8, 20) * 10, t2 = t1 + R(1, 5) * 10, r1 = R(80, 200) / 100, r2v = r2(r1 + R(10, 50) / 100), r3 = r2(r2v + R(10, 50) / 100), u = t1 + R(-10, 12) * 5;
    const a = Math.min(u, t1), b = Math.max(0, Math.min(u, t2) - t1), c = Math.max(0, u - t2), pay = r2(a * r1 + b * r2v + c * r3);
    return { prompt: `Up to ${t1} units: €${r1.toFixed(2)} each. ${t1 + 1}–${t2} units: €${r2v.toFixed(2)} for each unit over ${t1}. Over ${t2}: €${r3.toFixed(2)} for each unit over ${t2}. An employee makes ${u} units. Calculate pay.`,
      answer: pay, tol: 0.01, working: `${a} × ${r1.toFixed(2)}${b ? ` + ${b} × ${r2v.toFixed(2)}` : ""}${c ? ` + ${c} × ${r3.toFixed(2)}` : ""} = <b>€${fmt(pay)}</b>` };
  } },
  "turnover": { name: "Labour turnover", make() {
    const open = R(40, 400), close = open + R(-20, 20), left = R(5, Math.floor(open / 3)), rep = left - R(0, Math.min(5, left - 1));
    const avg = (open + close) / 2, val = r2(rep / avg * 100);
    return { prompt: `${open} employees at the start of the year and ${close} at the end. ${left} left during the year and ${rep} of them were replaced. Calculate labour turnover % (2 d.p.).`,
      answer: val, tol: 0.015, working: `Average workforce = (${open} + ${close}) ÷ 2 = ${avg}<br>Turnover = ${rep} ÷ ${avg} × 100 = <b>${val.toFixed(2)}%</b> (use leavers REPLACED, not all leavers)` };
  } },
  "oar": { name: "OAR and under/over absorption", make() {
    const bh = R(20, 250) * 1000, oar = pick([1.5, 2, 2.5, 3, 4, 5, 6]), bo = bh * oar, ah = Math.round(bh * (0.85 + Math.random() * 0.3) / 1000) * 1000;
    const ao = Math.round(bo * (0.85 + Math.random() * 0.3) / 1000) * 1000, abs = ah * oar, diff = abs - ao;
    if (Math.random() < .35) return { prompt: `Budgeted production overheads €${fmt(bo)}, budgeted machine hours ${fmt(bh)}. Calculate the overhead absorption rate per machine hour.`, answer: oar, tol: 0.005, working: `OAR = ${fmt(bo)} ÷ ${fmt(bh)} = <b>€${oar}</b> per machine hour` };
    const ans = diff === 0 ? "Neither" : `${diff > 0 ? "Over" : "Under"}-absorbed €${fmt(Math.abs(diff))}`;
    const alt = `${diff > 0 ? "Under" : "Over"}-absorbed €${fmt(Math.abs(diff))}`, alt2 = `Under-absorbed €${fmt(Math.abs(ao - bo))}`, alt3 = `Over-absorbed €${fmt(Math.abs(ao - bo) + 1000)}`;
    return { prompt: `OAR €${oar} per labour hour. Actual hours ${fmt(ah)}, actual overheads €${fmt(ao)}. The overheads were:`,
      choices: shuffle([...new Set([ans, alt, alt2, alt3])]).slice(0, 4).concat([]), answer: ans,
      working: `Absorbed = ${fmt(ah)} × ${oar} = ${fmt(abs)}<br>Actual = ${fmt(ao)}<br>${abs < ao ? "Absorbed < actual → UNDER-absorbed → Dr P&L" : abs > ao ? "Absorbed > actual → OVER-absorbed → Cr P&L" : "No difference"}` };
  } },
  "selling-price": { name: "Selling price build-up", make() {
    const m = R(2, 6), mp = R(3, 12), lh = pick([0.5, 1, 1.5, 2, 3]), lr = R(10, 25), de = R(0, 12);
    const dm = m * mp, dl = lh * lr, prime = dm + dl + de, poh = pick([15, 20, 25, 40]), adm = pick([10, 12.5, 15]), sd = pick([10, 12.5, 15]), mu = pick([10, 20, 25, 30]);
    const pc = r2(prime * (1 + poh / 100)), tc = r2(pc + pc * adm / 100 + pc * sd / 100), sp = r2(tc * (1 + mu / 100));
    const kind = pick(["prime", "pc", "sp", "sp"]);
    return { prompt: `Materials ${m}m @ €${mp}/m. Labour ${lh} hrs @ €${lr}/hr. Direct expenses €${de}. Production overhead ${poh}% of prime cost. Admin ${adm}% and S&D ${sd}% of production cost. Profit ${mu}% of total cost. Calculate the <b>${{ prime: "prime cost", pc: "production cost", sp: "selling price" }[kind]}</b>.`,
      answer: { prime, pc, sp }[kind], tol: 0.02,
      working: `Prime = ${fmt(dm)} + ${fmt(dl)} + ${de} = ${fmt(prime)}<br>Production cost = ${fmt(prime)} + ${poh}% = ${fmt(pc)}<br>Total cost = ${fmt(pc)} + ${adm}% + ${sd}% = ${fmt(tc)}<br>Selling price = ${fmt(tc)} + ${mu}% = <b>${fmt(sp)}</b>` };
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
    <p class="muted">Exam-style questions, with the source of each one shown (past papers, tutorials, lecture slides). Write your answer or plan it in bullet points, then reveal the marking points and tick the ones you covered. Each point you miss is marks lost.</p>
    <div id="flt"></div><div class="stack" id="wl"></div></div>`;
  const draw = () => {
    const list = panel.querySelector("#wl"); list.innerHTML = "";
    items.forEach(w => {
      const i = (ctx.pack._all || ctx.pack).written.indexOf(w);
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

// ---------- printable open-book sheet ----------
function modeSheet(panel, ctx) {
  const src = (ctx.pack._all || ctx.pack).sheet;
  panel.innerHTML = `<div class="sheet stack printable">${src || "<p>No sheet for this test.</p>"}
    <div class="row noprint"><button class="btn" id="print">Print this sheet</button><span class="muted" style="font-size:13px">Printed notes are allowed in the test. Bring this plus your worked tutorial answers.</span></div></div>`;
  panel.querySelector("#print").onclick = () => { document.body.classList.add("printing"); window.print(); setTimeout(() => document.body.classList.remove("printing"), 500); };
}

// ---------- what to do (assignment / logistics info) ----------
function modeInfo(panel, ctx) {
  const src = ((ctx.pack._all || ctx.pack).info || {})[ctx.test.info];
  panel.innerHTML = `<div class="sheet stack infobox">${src || "<p>No details yet.</p>"}</div>`;
}

// ---------- notes ----------
function modeNotes(panel, ctx, topic) {
  panel.innerHTML = `<div class="stack">${notesHTML(ctx.pack, topic)}${topic ? `<button class="btn ghost" id="alln" style="align-self:flex-start">Show all topics</button>` : ""}</div>`;
  const a = panel.querySelector("#alln"); if (a) a.onclick = () => modeNotes(panel, ctx);
}

// ---------- boot ----------
fetch("data/modules.json").then(r => r.json()).then(c => { CAT = c; route(); })
  .catch(() => { app.innerHTML = topBar() + `<div class="emptystate"><h3>Couldn't load the library</h3><p class="muted">Check your connection and reload the page.</p></div>`; });
