// Builds data/<slug>.json for each content module. Usage: node content/build.js
const fs = require("fs");
const path = require("path");
for (const f of ["finacct", "cost", "busmgmt", "buscomms", "marketing"]) {
  const m = require(`./${f}.js`);
  const out = path.join(__dirname, "..", "data", `${m.slug}.json`);
  fs.writeFileSync(out, JSON.stringify(m));
  console.log(m.slug, "· questions", m.questions.length, "· cards", m.cards.length, "· written", m.written.length, "· calc", m.calc.length);
}
