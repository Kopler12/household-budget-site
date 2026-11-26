[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)

# HearthLedger — Household Budget

A calm, fast, fully client-side household budget planner. Track income and
spending, set monthly budgets per category, save toward goals, keep recurring
bills on schedule, and see where the money actually goes — all in one place,
with no account, no server, and no network requests.

## What it does

- **Dashboard** — this month at a glance: income, spending, saved, and
  balance; a spending-by-category donut, a six-month income-vs-spending
  trend, recent transactions, and budget alerts.
- **Transactions** — every transaction in a searchable, filterable table.
  Add a transaction (date, description, category, amount, income/expense),
  delete one, and watch every figure on the site update instantly.
- **Budgets** — a monthly limit for each spending category, with a progress
  bar, remaining amount, and an over-budget warning. Edit any limit inline.
- **Goals** — savings goals with progress bars and an "add money" control
  that moves money toward the goal and records it as a transfer.
- **Bills** — recurring bills with due dates and amounts; toggle each bill
  paid/unpaid for the month.
- **Reports** — monthly income vs spending bars, top spending categories,
  and plain-language insights computed from your real numbers.

## How it works

HearthLedger is a static site: plain HTML, CSS, and vanilla JavaScript, no
frameworks and no network requests. On first load it seeds a realistic
example household (November 2026) so every page is alive immediately. Every
change you make — a new transaction, an edited budget, a goal contribution,
a paid bill — is saved in your browser's `localStorage` and survives reloads.
Use **Reset demo data** in the sidebar footer any time to restore the seed.

## Run it locally

```sh
python3 -m http.server 8080 --directory app
# open http://localhost:8080
```

Or with Node:

```sh
node serve.ts
# open http://localhost:8080
```

## Project layout

```
app/
  index.html        shell, navigation, page mount
  style.css         full design system (light, warm palette)
  js/
    data.js         seed household: transactions, budgets, goals, bills
    store.js        state, localStorage persistence, derived figures
    charts.js       canvas donut + bar charts (no libraries)
    views.js        page renderers for all six routes
    app.js          hash router, init, global actions
screenshots/        real renders of the running site
main.ts             build script: copies app/ + screenshots/ to the
                    output dir and writes dossier.json
vendor/             vendored make.fun dossier builder (unchanged)
```

## License

MIT — see [LICENSE](LICENSE).
