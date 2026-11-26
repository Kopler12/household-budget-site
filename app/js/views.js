// HearthLedger — page renderers. Every view reads live figures from the
// store, so an edit anywhere is reflected everywhere on the next render.

import { store, money, money0, pct, fmtDate, esc } from './store.js';
import { CATEGORIES, MONTH_LABEL } from './data.js';
import { drawDonut, drawBars } from './charts.js';

const TITLES = {
  dashboard: 'Dashboard',
  transactions: 'Transactions',
  budgets: 'Budgets',
  goals: 'Savings Goals',
  bills: 'Bills',
  reports: 'Reports',
};

export function titleFor(route) { return TITLES[route] || 'Dashboard'; }

// --- shared bits -----------------------------------------------------------
function alertCard(a) {
  const cls = a.level === 'over' ? 'alert-over' : a.level === 'warn' ? 'alert-warn' : a.level === 'bill' ? 'alert-bill' : 'alert-good';
  const mark = a.level === 'over' ? '⚠' : a.level === 'warn' ? '◷' : a.level === 'bill' ? '▤' : '✓';
  return `<div class="alert ${cls}"><span class="alert-mark" aria-hidden="true">${mark}</span><span>${esc(a.text)}</span></div>`;
}

function bar(p, color) {
  const w = Math.max(0, Math.min(100, p * 100));
  return `<div class="progress"><span style="width:${w.toFixed(1)}%;background:${color}"></span></div>`;
}

function txRow(t) {
  const c = store.category(t.category);
  const sign = t.type === 'income' ? '+' : '−';
  return `<tr>
    <td>${fmtDate(t.date)}</td>
    <td>${esc(t.description)}</td>
    <td><span class="chip"><span class="dot" style="background:${c.color}"></span>${esc(c.label)}</span></td>
    <td class="num ${t.type}">${sign}${money(t.amount)}</td>
    <td><button class="btn btn-ghost btn-small" data-delete-tx="${t.id}" type="button" aria-label="Delete ${esc(t.description)}">Delete</button></td>
  </tr>`;
}

// --- Dashboard -------------------------------------------------------------
export function viewDashboard() {
  const t = store.totals();
  const cats = store.byCategory();
  const alerts = store.alerts();
  const recent = store.monthTx().slice().sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 8);
  const savingsRate = t.income > 0 ? t.saved / t.income : 0;
  const top = cats[0];

  return `
  <section class="stat-grid">
    <div class="stat"><span class="stat-label">Income · ${MONTH_LABEL}</span><strong class="stat-value income">${money(t.income)}</strong><span class="stat-sub">2 paychecks + freelance &amp; sales</span></div>
    <div class="stat"><span class="stat-label">Spending · ${MONTH_LABEL}</span><strong class="stat-value expense">${money(t.spending)}</strong><span class="stat-sub">${top ? `Biggest: ${esc(top.label)} ${money(top.amount)}` : ''}</span></div>
    <div class="stat"><span class="stat-label">Saved this month</span><strong class="stat-value ${t.saved >= 0 ? 'income' : 'expense'}">${money(t.saved)}</strong><span class="stat-sub">Savings rate ${pct(savingsRate)} of income</span></div>
    <div class="stat"><span class="stat-label">Balance</span><strong class="stat-value">${money(t.balance)}</strong><span class="stat-sub">Opening ${money(store.data.openingBalance)} + saved</span></div>
  </section>

  <section class="alerts" aria-label="Budget alerts">${alerts.map(alertCard).join('')}</section>

  <section class="grid-2">
    <div class="card">
      <div class="card-head"><h2>Where the money went</h2><a class="link" href="#/budgets">Manage budgets →</a></div>
      <canvas id="donut" role="img" aria-label="Spending by category chart"></canvas>
      <ul class="legend">
        ${cats.map((c) => `<li><span class="dot" style="background:${c.color}"></span>${esc(c.label)}<strong>${money(c.amount)}</strong><span class="muted">${pct(c.amount / Math.max(1, t.spending))}</span></li>`).join('')}
      </ul>
    </div>
    <div class="card">
      <div class="card-head"><h2>Income vs spending · Jun – Nov</h2><a class="link" href="#/reports">Full report →</a></div>
      <canvas id="trend" role="img" aria-label="Monthly income versus spending chart"></canvas>
      <p class="card-note">November is the strongest saving month yet: <strong>${money(t.saved)}</strong> kept from ${money(t.income)} of income.</p>
    </div>
  </section>

  <section class="grid-2">
    <div class="card">
      <div class="card-head"><h2>Recent transactions</h2><a class="link" href="#/transactions">See all →</a></div>
      <table class="table"><thead><tr><th>Date</th><th>Description</th><th>Category</th><th class="num">Amount</th></tr></thead>
      <tbody>${recent.map((x) => txRow(x).replace(/<td><button[^]*?<\/td>/, '')).join('')}</tbody></table>
    </div>
    <div class="card">
      <div class="card-head"><h2>Goals at a glance</h2><a class="link" href="#/goals">All goals →</a></div>
      ${store.data.goals.slice(0, 3).map((g) => `
        <div class="goal-mini">
          <div class="goal-mini-head"><strong>${esc(g.name)}</strong><span>${money(g.saved)} of ${money0(g.target)}</span></div>
          ${bar(g.saved / g.target, '#2f6f5e')}
          <span class="muted">${pct(g.saved / g.target)} funded · ${money(g.target - g.saved)} to go</span>
        </div>`).join('')}
      <p class="card-note">Total saved toward goals: <strong>${money(store.goalsTotal())}</strong> across ${store.data.goals.length} goals.</p>
    </div>
  </section>`;
}

export function afterDashboard() {
  drawDonut(document.getElementById('donut'), store.byCategory());
  drawBars(document.getElementById('trend'), store.monthlySeries());
}

// --- Transactions ----------------------------------------------------------
export function viewTransactions(filter = {}) {
  const q = (filter.q || '').toLowerCase();
  const cat = filter.category || 'all';
  let rows = store.data.transactions.slice().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  if (cat !== 'all') rows = rows.filter((t) => t.category === cat);
  if (q) rows = rows.filter((t) => t.description.toLowerCase().includes(q) || store.category(t.category).label.toLowerCase().includes(q));
  const shown = rows.filter((t) => t.date.startsWith('2026-11'));
  const shownIncome = shown.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const shownSpend = shown.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return `
  <section class="card">
    <div class="card-head"><h2>Add a transaction</h2><span class="muted">Saved instantly, stored in this browser</span></div>
    <form id="tx-form" class="form-grid">
      <label>Date<input type="date" name="date" value="2026-11-26" required></label>
      <label class="span-2">Description<input type="text" name="description" placeholder="e.g. GreenMart Weekly Groceries" maxlength="80" required></label>
      <label>Category
        <select name="category">
          ${CATEGORIES.filter((c) => c.id !== 'income').map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join('')}
          <option value="income">Income</option>
        </select>
      </label>
      <label>Amount (USD)<input type="number" name="amount" min="0.01" step="0.01" placeholder="0.00" required></label>
      <label>Type
        <select name="type"><option value="expense">Expense</option><option value="income">Income</option></select>
      </label>
      <div class="form-actions"><button class="btn btn-primary" type="submit">Add transaction</button></div>
    </form>
    <p class="form-msg" id="tx-msg" role="status"></p>
  </section>

  <section class="card">
    <div class="card-head"><h2>All transactions <span class="count">${rows.length}</span></h2>
      <span class="muted">November: <strong class="income">+${money(shownIncome)}</strong> · <strong class="expense">−${money(shownSpend)}</strong></span></div>
    <div class="filters">
      <input type="search" id="tx-search" placeholder="Search transactions…" value="${esc(filter.q || '')}" aria-label="Search transactions">
      <select id="tx-filter" aria-label="Filter by category">
        <option value="all">All categories</option>
        ${CATEGORIES.map((c) => `<option value="${c.id}" ${cat === c.id ? 'selected' : ''}>${esc(c.label)}</option>`).join('')}
      </select>
    </div>
    <div class="table-wrap"><table class="table">
      <thead><tr><th>Date</th><th>Description</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>
      <tbody>${rows.length ? rows.map(txRow).join('') : `<tr><td colspan="5" class="empty">No transactions match. Try a different search or filter.</td></tr>`}</tbody>
    </table></div>
  </section>`;
}

// --- Budgets ---------------------------------------------------------------
export function viewBudgets() {
  const status = store.budgetStatus();
  const totalLimit = status.reduce((s, b) => s + b.limit, 0);
  const totalSpent = status.reduce((s, b) => s + b.spent, 0);
  return `
  <section class="stat-grid">
    <div class="stat"><span class="stat-label">Total budgeted</span><strong class="stat-value">${money(totalLimit)}</strong><span class="stat-sub">Across ${status.length} categories</span></div>
    <div class="stat"><span class="stat-label">Total spent</span><strong class="stat-value expense">${money(totalSpent)}</strong><span class="stat-sub">${pct(totalSpent / Math.max(1, totalLimit))} of the plan</span></div>
    <div class="stat"><span class="stat-label">Remaining</span><strong class="stat-value income">${money(totalLimit - totalSpent)}</strong><span class="stat-sub">${status.filter((b) => b.pct < 1).length} of ${status.length} categories on track</span></div>
  </section>
  <section class="budget-grid">
    ${status.map((b) => {
      const over = b.pct >= 1;
      const warn = !over && b.pct >= 0.85;
      return `<article class="card budget-card ${over ? 'is-over' : warn ? 'is-warn' : ''}">
        <div class="card-head"><h2><span class="dot" style="background:${b.color}"></span> ${esc(b.label)}</h2>
        <span class="badge ${over ? 'badge-over' : warn ? 'badge-warn' : 'badge-ok'}">${over ? 'Over budget' : warn ? 'Almost there' : 'On track'}</span></div>
        <p class="budget-figures"><strong>${money(b.spent)}</strong> spent of ${money(b.limit)}</p>
        ${bar(b.pct, over ? '#c0392b' : warn ? '#d97706' : b.color)}
        <p class="muted">${over ? `${money(b.spent - b.limit)} over the limit` : `${money(b.remaining)} left · ${pct(b.pct)} used`}</p>
        <form class="budget-edit" data-budget-form="${b.category}">
          <label>Monthly limit <span class="muted">(USD)</span>
            <input type="number" name="limit" min="0" step="10" value="${b.limit}" required>
          </label>
          <button class="btn btn-primary btn-small" type="submit">Update limit</button>
        </form>
      </article>`;
    }).join('')}
  </section>
  <p class="card-note">Tip: a limit change applies to November immediately and is saved in this browser.</p>`;
}

// --- Goals -----------------------------------------------------------------
export function viewGoals() {
  const totalSaved = store.goalsTotal();
  const totalTarget = store.data.goals.reduce((s, g) => s + g.target, 0);
  return `
  <section class="stat-grid">
    <div class="stat"><span class="stat-label">Saved toward goals</span><strong class="stat-value income">${money(totalSaved)}</strong><span class="stat-sub">${pct(totalSaved / totalTarget)} of ${money0(totalTarget)} combined target</span></div>
    <div class="stat"><span class="stat-label">Goals</span><strong class="stat-value">${store.data.goals.length}</strong><span class="stat-sub">${store.data.goals.filter((g) => g.saved >= g.target).length} fully funded</span></div>
    <div class="stat"><span class="stat-label">Still to save</span><strong class="stat-value">${money(totalTarget - totalSaved)}</strong><span class="stat-sub">Across all goals</span></div>
  </section>
  <section class="goal-grid">
    ${store.data.goals.map((g) => {
      const p = g.saved / g.target;
      return `<article class="card goal-card">
        <div class="card-head"><h2>${esc(g.name)}</h2><span class="badge ${p >= 1 ? 'badge-ok' : 'badge-warn'}">${pct(p)} funded</span></div>
        <p class="muted">${esc(g.note)}</p>
        <p class="budget-figures"><strong>${money(g.saved)}</strong> saved of ${money0(g.target)}</p>
        ${bar(p, '#2f6f5e')}
        <p class="muted">${money(g.target - g.saved)} to go${p >= 1 ? ' — fully funded!' : ''}</p>
        <form class="goal-add" data-goal-form="${g.id}">
          <label>Add money (USD)
            <input type="number" name="amount" min="1" step="1" placeholder="100" required>
          </label>
          <button class="btn btn-primary btn-small" type="submit">Add to goal</button>
        </form>
        <p class="form-msg" id="goal-msg-${g.id}" role="status"></p>
      </article>`;
    }).join('')}
  </section>
  <p class="card-note">Adding money records a transfer in Transactions, so your spending and balance stay honest.</p>`;
}

// --- Bills -----------------------------------------------------------------
export function viewBills() {
  const bills = store.data.bills.slice().sort((a, b) => a.dueDay - b.dueDay);
  const paid = bills.filter((b) => b.paid);
  const unpaid = bills.filter((b) => !b.paid);
  const paidTotal = paid.reduce((s, b) => s + b.amount, 0);
  const unpaidTotal = unpaid.reduce((s, b) => s + b.amount, 0);
  const row = (b) => `
    <tr class="${b.paid ? 'is-paid' : ''}">
      <td><strong>${esc(b.name)}</strong><br><span class="muted">${esc(store.category(b.category).label)}${b.autopay ? ' · Autopay' : ''}</span></td>
      <td>Nov ${b.dueDay}</td>
      <td class="num">${money(b.amount)}</td>
      <td><span class="badge ${b.paid ? 'badge-ok' : 'badge-warn'}">${b.paid ? 'Paid' : 'Unpaid'}</span></td>
      <td><button class="btn ${b.paid ? 'btn-ghost' : 'btn-primary'} btn-small" data-bill-toggle="${b.id}" type="button">${b.paid ? 'Mark unpaid' : 'Mark paid'}</button></td>
    </tr>`;
  return `
  <section class="stat-grid">
    <div class="stat"><span class="stat-label">Bills this month</span><strong class="stat-value">${money(store.billsTotal())}</strong><span class="stat-sub">${bills.length} recurring bills</span></div>
    <div class="stat"><span class="stat-label">Paid</span><strong class="stat-value income">${money(paidTotal)}</strong><span class="stat-sub">${paid.length} of ${bills.length} bills</span></div>
    <div class="stat"><span class="stat-label">Still to pay</span><strong class="stat-value ${unpaidTotal ? 'expense' : 'income'}">${money(unpaidTotal)}</strong><span class="stat-sub">${unpaid.length} bill${unpaid.length === 1 ? '' : 's'} left</span></div>
  </section>
  <section class="card">
    <div class="card-head"><h2>Recurring bills · ${MONTH_LABEL}</h2><span class="muted">Tap a button to flip a bill paid or unpaid</span></div>
    <div class="table-wrap"><table class="table">
      <thead><tr><th>Bill</th><th>Due</th><th class="num">Amount</th><th>Status</th><th></th></tr></thead>
      <tbody>${bills.map(row).join('')}</tbody>
    </table></div>
  </section>`;
}

// --- Reports ---------------------------------------------------------------
export function viewReports() {
  const t = store.totals();
  const cats = store.byCategory();
  const series = store.monthlySeries();
  const best = series.reduce((a, b) => (b.saved > a.saved ? b : a), series[0]);
  const worst = cats[0];
  const avgSpend = series.reduce((s, m) => s + m.spending, 0) / series.length;
  const avgSave = series.reduce((s, m) => s + m.saved, 0) / series.length;
  const dining = cats.find((c) => c.category === 'dining');
  const groceries = cats.find((c) => c.category === 'groceries');

  return `
  <section class="stat-grid">
    <div class="stat"><span class="stat-label">Avg. monthly spending · Jun–Nov</span><strong class="stat-value expense">${money(avgSpend)}</strong><span class="stat-sub">November: ${money(t.spending)}</span></div>
    <div class="stat"><span class="stat-label">Avg. monthly saving · Jun–Nov</span><strong class="stat-value income">${money(avgSave)}</strong><span class="stat-sub">Best month: ${best.label} (${money(best.saved)})</span></div>
    <div class="stat"><span class="stat-label">Savings rate · November</span><strong class="stat-value">${pct(t.saved / Math.max(1, t.income))}</strong><span class="stat-sub">A common target is 20%</span></div>
  </section>
  <section class="grid-2">
    <div class="card">
      <div class="card-head"><h2>Income vs spending · Jun – Nov</h2></div>
      <canvas id="report-bars" role="img" aria-label="Monthly income versus spending chart"></canvas>
      <table class="table">
        <thead><tr><th>Month</th><th class="num">Income</th><th class="num">Spending</th><th class="num">Saved</th></tr></thead>
        <tbody>${series.map((m) => `<tr><td>${m.label} 2026</td><td class="num income">${money(m.income)}</td><td class="num expense">${money(m.spending)}</td><td class="num">${money(m.saved)}</td></tr>`).join('')}</tbody>
      </table>
    </div>
    <div class="card">
      <div class="card-head"><h2>Top spending · November</h2></div>
      ${cats.slice(0, 5).map((c, i) => `
        <div class="topcat"><span class="topcat-rank">${i + 1}</span>
          <div class="topcat-body"><div class="topcat-head"><strong>${esc(c.label)}</strong><span>${money(c.amount)} · ${pct(c.amount / Math.max(1, t.spending))}</span></div>
          ${bar(c.amount / Math.max(1, cats[0].amount), c.color)}</div>
        </div>`).join('')}
      <h2 class="insights-title">What the numbers say</h2>
      <ul class="insights">
        <li><strong>${esc(worst.label)}</strong> is the biggest November expense at ${money(worst.amount)} — ${pct(worst.amount / Math.max(1, t.spending))} of all spending, and it is mostly fixed (rent).</li>
        <li>Groceries came in at ${money(groceries ? groceries.amount : 0)} across five weekly shops — about ${money((groceries ? groceries.amount : 0) / 5)} per shop, steady all month.</li>
        <li>Dining out totalled ${money(dining ? dining.amount : 0)}. Cooking two more dinners at home a week would free roughly $120 a month.</li>
        <li>November spending (${money(t.spending)}) is ${t.spending < avgSpend ? money(avgSpend - t.spending) + ' below' : money(t.spending - avgSpend) + ' above'} the six-month average of ${money(avgSpend)}.</li>
        <li>At the current pace the Emergency Fund (${money(store.data.goals[0].saved)} of ${money0(store.data.goals[0].target)}) is fully funded in about ${Math.max(1, Math.ceil((store.data.goals[0].target - store.data.goals[0].saved) / Math.max(1, avgSave)))} months.</li>
      </ul>
    </div>
  </section>`;
}

export function afterReports() {
  drawBars(document.getElementById('report-bars'), store.monthlySeries());
}
