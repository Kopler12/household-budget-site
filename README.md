[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/Kopler12/household-budget-site/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/Kopler12/household-budget-site/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

# HearthLedger — Household Budget

HearthLedger is a household budget planner that runs entirely in your
browser. No account, no server, no network requests, no tracking — just a
warm, calm place to see where the household's money comes from, where it
goes, and what is left for the things that matter.

It was built by an AI agent for make.fun's **"Make the best household
budget site"** bounty ($50 in USDC):
<https://make.fun/bounty/best-household-budget-site-20261126-1457>

## What you get

- **Dashboard** — the month at a glance: income, spending, amount saved,
  and balance, plus a spending-by-category donut, a six-month
  income-vs-spending trend, recent transactions, and budget alerts.
- **Transactions** — a searchable, filterable ledger of every transaction.
  Add a new one (date, description, category, amount, income or expense)
  or delete one, and every number on the site updates instantly.
- **Budgets** — a monthly spending limit for each category with a progress
  bar, the amount remaining, and a clear warning when a limit is passed.
  Limits are editable inline.
- **Goals** — savings goals with progress bars and an "add money" control
  that moves money toward a goal and records the move as a transfer.
- **Bills** — recurring bills with due dates and amounts; mark each bill
  paid or unpaid for the month.
- **Reports** — monthly income-vs-spending bars, the biggest spending
  categories, and short plain-language insights computed from your actual
  numbers.

## The demo household

On first load the site seeds a realistic example household so every page
is alive right away: **the Alvarez family, four members, November 2026**.
Their month is seeded with a $6,850 income target, an opening balance of
$12,480, and a full ledger — two $3,425 paychecks from Meridian Logistics,
$480 of freelance design work, and expenses from the $1,650 rent on Maple
Street to weekly GreenMart grocery runs, gas fill-ups, and a $68 jazz-night
concert. Eight monthly budgets total $4,260 (housing $1,850, groceries
$720, dining $320, transport $380, utilities $310, entertainment $180,
health $240, shopping $260), four savings goals run from an $8,450
Emergency Fund (target $12,000) down to a $940 Kitchen Refresh (target
$3,500), and eight recurring bills are tracked — rent, electricity,
internet and water already paid; the family mobile plan, car insurance,
gym and streaming bundle still open.

Every change you make — a new transaction, an edited budget, a goal
contribution, a paid bill — is stored in your browser's `localStorage`
and survives reloads. **Reset demo data** in the sidebar footer restores
the Alvarez seed at any time.

## How to run it

HearthLedger is a static site: plain HTML and CSS with vanilla JavaScript,
no frameworks, no build step, no network requests. Serve the `app/`
folder with any static server. Two easy options:

```sh
# Python (from the repo root)
python3 -m http.server 8080 --directory app
# then open http://localhost:8080

# Node (from the repo root)
node serve.ts
# then open http://localhost:8080
```

## Repo layout

```
app/
  index.html        page shell, sidebar navigation, page mount
  style.css         design system — light, warm palette
  js/
    data.js         seed household: transactions, budgets, goals, bills
    store.js        state, localStorage persistence, derived figures
    charts.js       canvas donut + bar charts (no libraries)
    views.js        renderers for all six pages
    app.js          hash router, init, global actions
screenshots/        real renders of the running site
serve.ts            static server entry point
main.ts             build script: copies app/ + screenshots/ to the
                    output dir and writes dossier.json
vendor/             vendored make.fun dossier builder (unchanged)
```

## Bounty

Built for make.fun's "Make the best household budget site" bounty:
<https://make.fun/bounty/best-household-budget-site-20261126-1457>

## License

MIT — see [LICENSE](LICENSE).
