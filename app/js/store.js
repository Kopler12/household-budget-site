// HearthLedger — state, persistence, and derived figures.
// The store owns one plain object, saved to localStorage on every change.

import { SEED, CATEGORIES, MONTH } from './data.js';

const KEY = 'hearthledger-v1';

function clone(x) { return JSON.parse(JSON.stringify(x)); }

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data && data.version === 1 && Array.isArray(data.transactions)) return data;
    }
  } catch (e) { /* corrupted storage: fall through to the seed */ }
  const fresh = clone(SEED);
  try { localStorage.setItem(KEY, JSON.stringify(fresh)); } catch (e) { /* private mode */ }
  return fresh;
}

export const store = {
  data: load(),

  save() {
    try { localStorage.setItem(KEY, JSON.stringify(this.data)); } catch (e) { /* ignore */ }
  },

  reset() {
    this.data = clone(SEED);
    this.save();
  },

  // --- lookups -------------------------------------------------------------
  category(id) {
    return CATEGORIES.find((c) => c.id === id) || { id, label: id, color: '#8a8f98' };
  },

  monthTx(month = MONTH) {
    return this.data.transactions.filter((t) => t.date.startsWith(month));
  },

  // --- derived figures -----------------------------------------------------
  totals(month = MONTH) {
    const txs = this.monthTx(month);
    let income = 0, spending = 0;
    for (const t of txs) {
      if (t.type === 'income') income += t.amount;
      else spending += t.amount;
    }
    const saved = income - spending;
    return { income, spending, saved, balance: this.data.openingBalance + saved };
  },

  byCategory(month = MONTH) {
    const out = new Map();
    for (const t of this.monthTx(month)) {
      if (t.type !== 'expense') continue;
      out.set(t.category, (out.get(t.category) || 0) + t.amount);
    }
    return [...out.entries()]
      .map(([category, amount]) => ({ category, amount, ...this.category(category) }))
      .sort((a, b) => b.amount - a.amount);
  },

  monthlySeries() {
    // Jun–Nov 2026, income vs spending per month.
    const months = ['2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11'];
    const labels = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
    return months.map((m, i) => ({ month: m, label: labels[i], ...this.totals(m) }));
  },

  budgetStatus() {
    const spent = new Map(this.byCategory().map((c) => [c.category, c.amount]));
    return this.data.budgets.map((b) => {
      const used = spent.get(b.category) || 0;
      const pct = b.limit > 0 ? used / b.limit : 0;
      return { ...b, ...this.category(b.category), spent: used, remaining: b.limit - used, pct };
    });
  },

  alerts() {
    const out = [];
    for (const b of this.budgetStatus()) {
      if (b.pct >= 1) out.push({ level: 'over', text: `${b.label} is over budget by ${money(b.spent - b.limit)} — ${money(b.spent)} spent of ${money(b.limit)}.` });
      else if (b.pct >= 0.85) out.push({ level: 'warn', text: `${b.label} is at ${Math.round(b.pct * 100)}% of its budget — ${money(b.remaining)} left for the month.` });
    }
    const unpaid = this.data.bills.filter((b) => !b.paid);
    const dueSoon = unpaid.filter((b) => b.dueDay <= 30);
    if (dueSoon.length) {
      out.push({ level: 'bill', text: `${dueSoon.length} bill${dueSoon.length > 1 ? 's' : ''} still unpaid this month (${money(dueSoon.reduce((s, b) => s + b.amount, 0))} total). Next: ${dueSoon[0].name}, due Nov ${dueSoon[0].dueDay}.` });
    }
    if (!out.length) out.push({ level: 'good', text: 'All budgets on track and every bill paid. Nice work this month.' });
    return out;
  },

  goalsTotal() {
    return this.data.goals.reduce((s, g) => s + g.saved, 0);
  },

  billsTotal() {
    return this.data.bills.reduce((s, b) => s + b.amount, 0);
  },

  // --- mutations -----------------------------------------------------------
  addTransaction({ date, description, category, amount, type }) {
    const tx = {
      id: 't-' + Date.now().toString(36),
      date, description: description.trim(), category,
      amount: Math.round(amount * 100) / 100, type,
    };
    this.data.transactions.push(tx);
    this.data.transactions.sort((a, b) => (a.date < b.date ? 1 : -1));
    this.save();
    return tx;
  },

  deleteTransaction(id) {
    this.data.transactions = this.data.transactions.filter((t) => t.id !== id);
    this.save();
  },

  setBudgetLimit(category, limit) {
    const b = this.data.budgets.find((x) => x.category === category);
    if (b) b.limit = Math.max(0, Math.round(limit));
    else this.data.budgets.push({ category, limit: Math.max(0, Math.round(limit)) });
    this.save();
  },

  addToGoal(id, amount) {
    const g = this.data.goals.find((x) => x.id === id);
    if (!g) return null;
    const add = Math.round(amount * 100) / 100;
    g.saved = Math.round((g.saved + add) * 100) / 100;
    this.data.transactions.push({
      id: 't-' + Date.now().toString(36),
      date: MONTH + '-26',
      description: `Transfer to goal — ${g.name}`,
      category: 'other', amount: add, type: 'expense',
    });
    this.save();
    return g;
  },

  toggleBill(id) {
    const b = this.data.bills.find((x) => x.id === id);
    if (b) { b.paid = !b.paid; this.save(); }
    return b;
  },
};

// --- formatting helpers ----------------------------------------------------
export function money(n) {
  const v = Math.round(n * 100) / 100;
  return (v < 0 ? '-$' : '$') + Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function money0(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

export function pct(n) { return Math.round(n * 100) + '%'; }

export function fmtDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
