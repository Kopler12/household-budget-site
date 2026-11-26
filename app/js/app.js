// HearthLedger — hash router, init, and global actions.
// Routes: #/dashboard #/transactions #/budgets #/goals #/bills #/reports

import { store, money } from './store.js';
import * as views from './views.js';

const viewEl = document.getElementById('view');
const titleEl = document.getElementById('page-title');
const miniBalanceEl = document.getElementById('mini-balance');

let txFilter = { q: '', category: 'all' };

function route() {
  const hash = (location.hash || '#/dashboard').replace(/^#\//, '');
  const name = ['dashboard', 'transactions', 'budgets', 'goals', 'bills', 'reports'].includes(hash) ? hash : 'dashboard';
  document.querySelectorAll('.nav a').forEach((a) => {
    a.classList.toggle('active', a.dataset.route === name);
  });
  titleEl.textContent = views.titleFor(name);
  if (name === 'dashboard') {
    viewEl.innerHTML = views.viewDashboard();
    views.afterDashboard();
  } else if (name === 'transactions') {
    viewEl.innerHTML = views.viewTransactions(txFilter);
    bindTransactions();
  } else if (name === 'budgets') {
    viewEl.innerHTML = views.viewBudgets();
    bindBudgets();
  } else if (name === 'goals') {
    viewEl.innerHTML = views.viewGoals();
    bindGoals();
  } else if (name === 'bills') {
    viewEl.innerHTML = views.viewBills();
  } else if (name === 'reports') {
    viewEl.innerHTML = views.viewReports();
    views.afterReports();
  }
  miniBalanceEl.textContent = money(store.totals().balance);
  window.scrollTo(0, 0);
}

function rerender() { route(); }

// --- Transactions bindings -------------------------------------------------
function bindTransactions() {
  const form = document.getElementById('tx-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const amount = Number(fd.get('amount'));
    const description = String(fd.get('description') || '').trim();
    if (!description || !(amount > 0)) {
      document.getElementById('tx-msg').textContent = 'Please enter a description and an amount above $0.';
      return;
    }
    store.addTransaction({
      date: String(fd.get('date')),
      description,
      category: String(fd.get('category')),
      amount,
      type: String(fd.get('type')),
    });
    // rerender() rebuilds the form, so keep the confirmation and re-apply
    // it to the fresh message element afterwards.
    const note = `Added “${description}” — ${money(amount)}.`;
    form.reset();
    form.querySelector('input[name="date"]').value = '2026-11-26';
    rerender();
    const msgEl = document.getElementById('tx-msg');
    if (msgEl) msgEl.textContent = note;
  });

  const search = document.getElementById('tx-search');
  search.addEventListener('input', () => { txFilter.q = search.value; refreshTxTable(); });
  const filter = document.getElementById('tx-filter');
  filter.addEventListener('change', () => { txFilter.category = filter.value; rerender(); });
}

function refreshTxTable() {
  // Live search: re-render only the table body + count, keep focus in the box.
  const html = views.viewTransactions(txFilter);
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const newTable = tmp.querySelector('.table-wrap');
  const oldTable = document.querySelector('.table-wrap');
  if (newTable && oldTable) oldTable.replaceWith(newTable);
  const newHead = tmp.querySelector('.count');
  const oldHead = document.querySelector('.count');
  if (newHead && oldHead) oldHead.textContent = newHead.textContent;
}

// --- Budgets bindings ------------------------------------------------------
function bindBudgets() {
  document.querySelectorAll('[data-budget-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const limit = Number(new FormData(form).get('limit'));
      if (!(limit >= 0)) return;
      store.setBudgetLimit(form.dataset.budgetForm, limit);
      rerender();
    });
  });
}

// --- Goals bindings --------------------------------------------------------
function bindGoals() {
  document.querySelectorAll('[data-goal-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const amount = Number(new FormData(form).get('amount'));
      if (!(amount > 0)) return;
      const g = store.addToGoal(form.dataset.goalForm, amount);
      if (g) {
        const msg = document.getElementById('goal-msg-' + g.id);
        if (msg) msg.textContent = `Added ${money(amount)} to ${g.name}. New total: ${money(g.saved)}.`;
      }
      rerender();
    });
  });
}

// --- Global delegated actions (delete tx, bill toggle, reset) --------------
document.addEventListener('click', (e) => {
  const del = e.target.closest('[data-delete-tx]');
  if (del) {
    store.deleteTransaction(del.dataset.deleteTx);
    rerender();
    return;
  }
  const bill = e.target.closest('[data-bill-toggle]');
  if (bill) {
    store.toggleBill(bill.dataset.billToggle);
    rerender();
    return;
  }
});

document.getElementById('reset-demo').addEventListener('click', () => {
  store.reset();
  txFilter = { q: '', category: 'all' };
  rerender();
});

window.addEventListener('hashchange', route);
window.addEventListener('resize', () => {
  // Redraw charts so they fit the new width.
  if (location.hash.includes('dashboard')) views.afterDashboard();
  if (location.hash.includes('reports')) views.afterReports();
});

route();
