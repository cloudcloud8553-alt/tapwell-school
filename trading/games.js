/* Tapwell game engine: intro + modes, score with streak multiplier, timer or rounds,
   end screen with rank, local high score and a mistakes review.
   A game calls TW.game({ id, title, how, kind: "speed"|"rounds", seconds, rounds, modes, next(mode), ranks }).
   next() returns a question:
     { tag, prompt, choices: [html], correct: i, cols, explain, answerText, short }   choice question
     { tag, prompt, input: { answer, tol, prefix, suffix }, explain, answerText }     number question
     { tag, prompt, render(box, done) }  custom; call done({ ok, pts, explain, answerText }) */
"use strict";
const TW = (() => {
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[R(0, a.length - 1)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const eur = (n, dp = 0) => (n < 0 ? "−" : "") + "€" + Math.abs(n).toLocaleString("en-IE", { minimumFractionDigits: dp, maximumFractionDigits: dp });
  const num = (n, dp = 0) => Number(n).toLocaleString("en-IE", { minimumFractionDigits: dp, maximumFractionDigits: dp });
  const store = {
    get(k, d) { try { const v = localStorage.getItem("tw." + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("tw." + k, JSON.stringify(v)); } catch (e) {} },
  };
  const strip = h => String(h).replace(/<table[\s\S]*?<\/table>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const RANKS = [[0, "Intern"], [600, "Accounts clerk"], [1500, "Junior accountant"], [3000, "Senior accountant"], [5000, "Financial controller"], [8000, "CFO"]];

  function game(cfg) {
    const el = document.getElementById("game");
    const speed = cfg.kind === "speed";
    let mode = cfg.modes ? cfg.modes[0][0] : "main";
    let S = null, timer = null, endAt = 0, qStart = 0, busy = false, cur = null, auto = null;
    const hsKey = () => `hs.${cfg.id}.${mode}`;

    function intro() {
      clearInterval(timer); clearTimeout(auto);
      const best = store.get(hsKey(), 0), m = cfg.modes && cfg.modes.find(x => x[0] === mode);
      el.innerHTML = `<div class="sheet gintro">
        <div class="how">${cfg.how}</div>
        ${cfg.modes ? `<div class="ctl"><div class="ch"><span>Mode</span></div><div class="chips" id="gm">${cfg.modes.map(x => `<button class="chip${x[0] === mode ? " on" : ""}" data-m="${x[0]}">${esc(x[1])}</button>`).join("")}</div>${m[2] ? `<p class="note">${esc(m[2])}</p>` : ""}</div>` : ""}
        <div class="ginfo"><span>${speed ? `${cfg.seconds} seconds, as many as you can` : `${cfg.rounds} rounds`}</span><span>Best: <b>${num(best)}</b></span></div>
        <button class="btn big" id="gs">Start</button>
        <p class="note">Answer streaks build a multiplier, up to ×5. On a keyboard, 1–5 pick answers and Enter moves on.</p></div>`;
      if (cfg.modes) document.getElementById("gm").onclick = e => { const b = e.target.closest(".chip"); if (b) { mode = b.dataset.m; intro(); } };
      document.getElementById("gs").onclick = start;
    }

    function start() {
      S = { score: 0, streak: 0, best: 0, right: 0, total: 0, round: 0, miss: [], over: false };
      el.innerHTML = `<div class="hud sheet"><div><span>Score</span><b id="h-s">0</b></div><div><span>Streak</span><b id="h-k">0</b></div><div><span>${speed ? "Time" : "Round"}</span><b id="h-t"></b></div></div>
        <div class="pbar"><i id="h-p"></i></div><div class="sheet qcard" id="qc"></div>`;
      if (speed) { endAt = performance.now() + cfg.seconds * 1000; timer = setInterval(tick, 100); }
      hud(); nextQ();
    }
    function tick() {
      const left = Math.max(0, endAt - performance.now());
      document.getElementById("h-t").textContent = Math.ceil(left / 1000) + "s";
      document.getElementById("h-t").classList.toggle("low", left < 10000);
      document.getElementById("h-p").style.width = (100 - left / (cfg.seconds * 10)) + "%";
      if (left <= 0) end();
    }
    function hud() {
      const mult = Math.min(5, 1 + Math.floor(S.streak / 3));
      document.getElementById("h-s").textContent = num(S.score);
      document.getElementById("h-k").innerHTML = S.streak + (mult > 1 ? ` <em>×${mult}</em>` : "");
      if (!speed) { document.getElementById("h-t").textContent = `${Math.min(S.round, cfg.rounds)}/${cfg.rounds}`; document.getElementById("h-p").style.width = (S.round / cfg.rounds * 100) + "%"; }
    }
    function nextQ() {
      clearTimeout(auto);
      if (S.over) return;
      if (!speed && S.round >= cfg.rounds) return end();
      S.round++; hud();
      cur = cfg.next(mode); qStart = performance.now(); busy = false;
      const qc = document.getElementById("qc");
      qc.classList.remove("shake");
      qc.innerHTML = `${cur.tag ? `<div class="qtag">${cur.tag}</div>` : ""}<div class="qprompt">${cur.prompt}</div><div id="qa"></div><div id="fb"></div>`;
      const qa = document.getElementById("qa");
      if (cur.choices) {
        qa.innerHTML = `<div class="opts${cur.cols ? " c" + cur.cols : ""}">${cur.choices.map((c, i) => `<button class="opt" data-i="${i}"><span class="k">${i + 1}</span><span>${c}</span></button>`).join("")}</div>`;
        qa.querySelector(".opts").onclick = e => { const b = e.target.closest(".opt"); if (b) choose(+b.dataset.i); };
      } else if (cur.input) {
        const n = cur.input;
        qa.innerHTML = `<form class="ansrow" id="af" autocomplete="off">${n.prefix ? `<span class="affix">${n.prefix}</span>` : ""}<input id="ai" inputmode="decimal" aria-label="Your answer" placeholder="Answer">${n.suffix ? `<span class="affix">${n.suffix}</span>` : ""}<button class="btn">Check</button></form>`;
        const ai = document.getElementById("ai"); setTimeout(() => ai.focus({ preventScroll: true }), 30);
        document.getElementById("af").onsubmit = e => {
          e.preventDefault(); if (busy) return;
          const v = parseFloat(ai.value.replace(/[€,%\s]/g, ""));
          if (isNaN(v)) { document.getElementById("fb").innerHTML = `<p class="note" style="color:var(--bad)">Enter a number first.</p>`; return; }
          ai.disabled = true; resolve(Math.abs(v - n.answer) <= (n.tol ?? 0.5));
        };
      } else if (cur.render) {
        cur.render(qa, r => { if (busy) return; resolve(r.ok, r); });
      }
    }
    function choose(i) {
      if (busy) return;
      const opts = [...document.querySelectorAll(".opt")];
      opts.forEach((b, j) => { b.disabled = true; if (j === cur.correct) b.classList.add("right"); else if (j === i) b.classList.add("wrong"); });
      resolve(i === cur.correct);
    }
    function resolve(ok, extra = {}) {
      busy = true; S.total++; const lostFrom = S.streak;
      const mult = Math.min(5, 1 + Math.floor(S.streak / 3));
      const explain = extra.explain || cur.explain || "";
      let pts = 0;
      if (extra.pts != null) { pts = Math.round(extra.pts * (ok ? mult : 1)); if (ok) { S.right++; S.streak++; } else S.streak = 0; }
      else if (ok) { S.right++; S.streak++; pts = 100 * mult; if (!speed) pts += Math.max(0, Math.round(60 - (performance.now() - qStart) / 1000 * 3)); }
      else S.streak = 0;
      const hadStreak = !ok && lostFrom > 0;
      S.best = Math.max(S.best, S.streak); S.score += pts;
      if (!ok) S.miss.push({ q: cur.short || strip(cur.prompt), a: extra.answerText || cur.answerText || (cur.choices ? strip(cur.choices[cur.correct]) : cur.input ? String(cur.input.answer) : "") });
      hud(); if (ok || pts || hadStreak) pop(pts, ok);
      const qc = document.getElementById("qc"); if (!ok) { void qc.offsetWidth; qc.classList.add("shake"); }
      const fb = document.getElementById("fb");
      const verdict = ok ? `<b class="ok">${pick(["Nice.", "Correct.", "Spot on.", "Yes!", "Nailed it."])}</b>` : `<b class="no">${pick(["Not quite.", "Close, but no.", "Nope.", "Careful."])}</b>`;
      if (speed && ok) { auto = setTimeout(nextQ, 300); return; }
      fb.innerHTML = `<div class="explain${ok ? "" : " miss"}">${verdict} ${explain}</div><button class="btn" id="nx">Next →</button>`;
      document.getElementById("nx").onclick = nextQ;
      if (speed) auto = setTimeout(nextQ, 2600);
      else document.getElementById("nx").focus({ preventScroll: true });
    }
    function pop(pts, ok) {
      const p = document.createElement("div"); p.className = "popscore" + (ok ? "" : " bad"); p.textContent = ok ? `+${pts}` : (pts ? `+${pts}` : "streak lost");
      document.getElementById("qc").appendChild(p); setTimeout(() => p.remove(), 900);
    }
    function end() {
      if (S.over) return; S.over = true; clearInterval(timer); clearTimeout(auto);
      const best = store.get(hsKey(), 0), isNew = S.score > best; if (isNew) store.set(hsKey(), S.score);
      const rank = (cfg.ranks || RANKS).reduce((r, x) => S.score >= x[0] ? x[1] : r, "");
      const acc = S.total ? Math.round(S.right / S.total * 100) : 0;
      el.innerHTML = `<div class="sheet gend">
        <div class="eyebrow">${isNew && S.score > 0 ? "New high score" : "Final score"}</div>
        <div class="bigscore">${num(S.score)}</div>
        <div class="rank">${esc(rank)}</div>
        <div class="endstats"><div><b>${acc}%</b><span>accuracy</span></div><div><b>${S.right}/${S.total}</b><span>correct</span></div><div><b>${S.best}</b><span>best streak</span></div></div>
        <div class="row" style="justify-content:center"><button class="btn" id="ga">Play again</button><button class="btn ghost" id="gi">${cfg.modes ? "Change mode" : "Back"}</button></div>
        ${S.miss.length ? `<details class="note2" open><summary>Review your misses (${S.miss.length})</summary><div class="nb"><ul class="misses">${S.miss.slice(0, 15).map(m => `<li><span>${esc(m.q)}</span><b>${esc(m.a)}</b></li>`).join("")}</ul></div></details>` : `<p class="note" style="text-align:center">Clean sheet. No misses.</p>`}
      </div>`;
      document.getElementById("ga").onclick = start; document.getElementById("gi").onclick = intro;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    document.addEventListener("keydown", e => {
      if (!S || S.over || e.target.tagName === "INPUT") { if (e.key === "Enter" && document.getElementById("nx") && e.target.tagName === "INPUT" && busy) { e.preventDefault(); nextQ(); } return; }
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= 9 && cur && cur.choices && n <= cur.choices.length) choose(n - 1);
      else if (e.key === "Enter" && document.getElementById("nx")) { e.preventDefault(); nextQ(); }
    });
    intro();
  }
  return { game, R, pick, shuffle, esc, eur, num, store };
})();
