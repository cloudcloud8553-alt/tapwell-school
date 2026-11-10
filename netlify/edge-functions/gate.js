// Shared-password gate for school.tapwell.ie.
// Set SITE_PASSWORD in Netlify → Site configuration → Environment variables.
// Changing the password logs everyone out (the cookie is a hash of it).
const COOKIE = "ts_auth";
const DAYS = 120;
const PUBLIC = new Set(["/favicon.svg", "/apple-touch-icon.png", "/favicon.ico"]);

async function token(pw) {
  const data = new TextEncoder().encode("tapwell-school:" + pw);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, "0")).join("");
}

function page(error) {
  return new Response(`<!doctype html><html lang="en-IE"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>Tapwell School</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png">
<style>
:root{--bg:#F2F5F8;--card:#fff;--ink:#16202F;--muted:#5A6577;--line:#D6DEE8;--accent:#2453D6;--accent-ink:#fff;--mint:#12A57C;--bad:#B42336}
@media (prefers-color-scheme:dark){:root{--bg:#10151E;--card:#171E2A;--ink:#E6ECF4;--muted:#97A3B6;--line:#2A3445;--accent:#7EA2FF;--accent-ink:#0E1320;--mint:#3FDDB0;--bad:#FF7A8A;color-scheme:dark}}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--bg);color:var(--ink);font:15px/1.5 system-ui,"Segoe UI",sans-serif;padding:16px}
form{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:28px;width:100%;max-width:360px;display:flex;flex-direction:column;gap:14px}
h1{margin:0;font-size:26px;letter-spacing:-.02em}.dot{color:var(--mint)}
small{font:500 11px ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-left:6px}
p{margin:0;color:var(--muted)}.err{color:var(--bad)}
input{font:inherit;padding:11px 12px;border-radius:8px;border:1.5px solid var(--line);background:var(--card);color:var(--ink)}
button{font:inherit;font-weight:600;padding:11px;border-radius:8px;border:0;background:var(--accent);color:var(--accent-ink);cursor:pointer}
</style></head><body>
<form method="post" action="/login">
<h1>tapwell<span class="dot">.</span><small>school</small></h1>
<p>Enter the class password to open the study library.</p>
${error ? '<p class="err">That password isn\'t right. Ask whoever sent you the link.</p>' : ""}
<input type="password" name="password" aria-label="Password" placeholder="Password" autofocus required>
<button>Open library</button>
</form></body></html>`, { status: error ? 401 : 200, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
}

export default async (req, context) => {
  const pw = Netlify.env.get("SITE_PASSWORD");
  if (!pw) return context.next(); // no password set: site is open

  const url = new URL(req.url);
  if (PUBLIC.has(url.pathname)) return context.next(); // icons show on the login page too
  const expected = await token(pw);
  const cookies = req.headers.get("cookie") || "";
  const has = cookies.split(/;\s*/).some(c => c === `${COOKIE}=${expected}`);

  if (url.pathname === "/login" && req.method === "POST") {
    const form = await req.formData();
    if (form.get("password") === pw) {
      return new Response(null, { status: 303, headers: {
        location: "/",
        "set-cookie": `${COOKIE}=${expected}; Path=/; Max-Age=${DAYS * 86400}; HttpOnly; Secure; SameSite=Lax`,
      } });
    }
    return page(true);
  }
  if (url.pathname === "/logout") {
    return new Response(null, { status: 303, headers: { location: "/", "set-cookie": `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax` } });
  }
  if (has) return context.next();
  return page(false);
};

export const config = { path: "/*" };
