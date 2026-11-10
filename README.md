# Tapwell School

Study library for US845 Accounting & Finance at TUS Moylish. Live at **school.tapwell.ie**.

Plain static site: no build step. Netlify deploys `main` automatically.

## Structure

| Path | What it is |
|---|---|
| `index.html` | Page shell and all styles |
| `app.js` | Routing, study modes, calculation generators |
| `data/modules.json` | Every module by semester, plus test dates shown on the home page |
| `data/<slug>.json` | A module's study pack (only modules with `"pack": true`) |
| `netlify/edge-functions/gate.js` | Shared-password login |

## Adding a study pack

1. Create `data/<slug>.json` with `topics`, `questions`, `cards`, `calc`, `written`, `tests` (copy `econ06029.json` as the template).
2. In `modules.json`, set `"pack": true` on that module and list its `tests` (id, title, date `YYYY-MM-DD` or `YYYY-MM`, weight).
3. Commit to `main`.

Each topic says which study modes suit it (`modes`) and why (`why`). Each test picks which tabs it shows (`modes`): `mock`, `drill`, `cards`, `calc`, `written`, `notes`. Calculation drills are generators in `app.js` (`GEN`), referenced by id from a pack's `calc` list.

## Password

Set `SITE_PASSWORD` under Netlify → Site configuration → Environment variables, then redeploy. Changing it logs everyone out. If it's unset, the site is open. `/logout` signs you out.
