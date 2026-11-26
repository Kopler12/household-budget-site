// HearthLedger — seed data for the demo household (November 2026).
// All figures are USD. Categories carry a colour used across the site.

export const CATEGORIES = [
  { id: 'housing', label: 'Housing', color: '#2f6f5e' },
  { id: 'groceries', label: 'Groceries', color: '#4d9e6a' },
  { id: 'dining', label: 'Dining Out', color: '#e07840' },
  { id: 'transport', label: 'Transport', color: '#4a7fb5' },
  { id: 'utilities', label: 'Utilities', color: '#7a6bb5' },
  { id: 'entertainment', label: 'Entertainment', color: '#c25b7a' },
  { id: 'health', label: 'Health', color: '#3ba7a0' },
  { id: 'shopping', label: 'Shopping', color: '#b5892e' },
  { id: 'income', label: 'Income', color: '#2f6f5e' },
  { id: 'other', label: 'Other', color: '#8a8f98' },
];

export const MONTH = '2026-11';
export const MONTH_LABEL = 'November 2026';

export const SEED = {
  version: 1,
  household: 'The Alvarez Family',
  members: 4,
  monthlyIncomeTarget: 6850,
  openingBalance: 12480,

  budgets: [
    { category: 'housing', limit: 1850 },
    { category: 'groceries', limit: 720 },
    { category: 'dining', limit: 320 },
    { category: 'transport', limit: 380 },
    { category: 'utilities', limit: 310 },
    { category: 'entertainment', limit: 180 },
    { category: 'health', limit: 240 },
    { category: 'shopping', limit: 260 },
  ],

  goals: [
    { id: 'g-emergency', name: 'Emergency Fund', target: 12000, saved: 8450, note: '6 months of essentials, kept in a high-yield savings account.' },
    { id: 'g-vacation', name: 'Family Vacation — Oregon Coast', target: 2400, saved: 1630, note: 'A week by the coast next July. Flights booked, cabin next.' },
    { id: 'g-car', name: 'Replace the Old Sedan', target: 9000, saved: 3120, note: 'Trading in the 2012 Civic. Target: a used hybrid by spring.' },
    { id: 'g-kitchen', name: 'Kitchen Refresh', target: 3500, saved: 940, note: 'New counters and a dishwasher that actually dries.' },
  ],

  bills: [
    { id: 'b-rent', name: 'Rent — Maple Street Apt 4B', amount: 1650, dueDay: 1, category: 'housing', autopay: true, paid: true },
    { id: 'b-electric', name: 'City Electric', amount: 118, dueDay: 8, category: 'utilities', autopay: true, paid: true },
    { id: 'b-internet', name: 'Fiber Internet 500 Mbps', amount: 65, dueDay: 12, category: 'utilities', autopay: true, paid: true },
    { id: 'b-water', name: 'Water & Sewer', amount: 54, dueDay: 15, category: 'utilities', autopay: false, paid: true },
    { id: 'b-phone', name: 'Mobile — Family Plan (4 lines)', amount: 132, dueDay: 18, category: 'utilities', autopay: true, paid: false },
    { id: 'b-insurance', name: 'Car Insurance', amount: 148, dueDay: 21, category: 'transport', autopay: true, paid: false },
    { id: 'b-gym', name: 'Gym Membership', amount: 42, dueDay: 25, category: 'health', autopay: false, paid: false },
    { id: 'b-streaming', name: 'Streaming Bundle', amount: 24, dueDay: 27, category: 'entertainment', autopay: true, paid: false },
  ],

  transactions: [
    { id: 't-001', date: '2026-11-01', description: 'Paycheck — Meridian Logistics', category: 'income', amount: 3425, type: 'income' },
    { id: 't-002', date: '2026-11-01', description: 'Rent — Maple Street Apt 4B', category: 'housing', amount: 1650, type: 'expense' },
    { id: 't-003', date: '2026-11-02', description: 'GreenMart Weekly Groceries', category: 'groceries', amount: 142.60, type: 'expense' },
    { id: 't-004', date: '2026-11-03', description: 'Shell — Gas Fill-Up', category: 'transport', amount: 48.20, type: 'expense' },
    { id: 't-005', date: '2026-11-04', description: 'Farmers Market — Produce', category: 'groceries', amount: 36.75, type: 'expense' },
    { id: 't-006', date: '2026-11-05', description: 'Bella Trattoria — Family Dinner', category: 'dining', amount: 86.40, type: 'expense' },
    { id: 't-007', date: '2026-11-06', description: 'City Electric', category: 'utilities', amount: 118, type: 'expense' },
    { id: 't-008', date: '2026-11-07', description: 'Cinema — Movie Night (4 tickets)', category: 'entertainment', amount: 52, type: 'expense' },
    { id: 't-009', date: '2026-11-08', description: 'GreenMart Weekly Groceries', category: 'groceries', amount: 128.35, type: 'expense' },
    { id: 't-010', date: '2026-11-09', description: 'Pharmacy — Prescriptions', category: 'health', amount: 34.50, type: 'expense' },
    { id: 't-011', date: '2026-11-10', description: 'Kids Shoes — Shoe Barn', category: 'shopping', amount: 74.99, type: 'expense' },
    { id: 't-012', date: '2026-11-11', description: 'Uber — Airport Run', category: 'transport', amount: 28.40, type: 'expense' },
    { id: 't-013', date: '2026-11-12', description: 'Fiber Internet 500 Mbps', category: 'utilities', amount: 65, type: 'expense' },
    { id: 't-014', date: '2026-11-13', description: 'Sushi Night — Takeout', category: 'dining', amount: 64.20, type: 'expense' },
    { id: 't-015', date: '2026-11-14', description: 'GreenMart Weekly Groceries', category: 'groceries', amount: 151.80, type: 'expense' },
    { id: 't-016', date: '2026-11-15', description: 'Paycheck — Meridian Logistics', category: 'income', amount: 3425, type: 'income' },
    { id: 't-017', date: '2026-11-15', description: 'Water & Sewer', category: 'utilities', amount: 54, type: 'expense' },
    { id: 't-018', date: '2026-11-16', description: 'Shell — Gas Fill-Up', category: 'transport', amount: 51.75, type: 'expense' },
    { id: 't-019', date: '2026-11-17', description: 'Dentist — Checkup & Cleaning', category: 'health', amount: 120, type: 'expense' },
    { id: 't-020', date: '2026-11-18', description: 'Pizza Friday — Delivery', category: 'dining', amount: 38.90, type: 'expense' },
    { id: 't-021', date: '2026-11-19', description: 'Bookstore — Kids Reading Books', category: 'shopping', amount: 42.30, type: 'expense' },
    { id: 't-022', date: '2026-11-20', description: 'Freelance — Weekend Design Work', category: 'income', amount: 480, type: 'income' },
    { id: 't-023', date: '2026-11-21', description: 'GreenMart Weekly Groceries', category: 'groceries', amount: 139.40, type: 'expense' },
    { id: 't-024', date: '2026-11-22', description: 'Concert Tickets — Local Jazz Night', category: 'entertainment', amount: 68, type: 'expense' },
    { id: 't-025', date: '2026-11-23', description: 'Target — Household Essentials', category: 'shopping', amount: 96.45, type: 'expense' },
    { id: 't-026', date: '2026-11-24', description: 'Bus Pass — Monthly', category: 'transport', amount: 55, type: 'expense' },
    { id: 't-027', date: '2026-11-25', description: 'GreenMart Weekly Groceries', category: 'groceries', amount: 118.90, type: 'expense' },
    { id: 't-028', date: '2026-11-25', description: 'Coffee Shop — Morning Coffee', category: 'dining', amount: 12.50, type: 'expense' },
    { id: 't-029', date: '2026-11-26', description: 'Gym Membership', category: 'health', amount: 42, type: 'expense' },
    { id: 't-030', date: '2026-11-26', description: 'Sold Old Bike — Marketplace', category: 'income', amount: 150, type: 'income' },

    // Previous months, for the trend chart and reports.
    { id: 't-101', date: '2026-06-15', description: 'Paycheck — June (summary)', category: 'income', amount: 6650, type: 'income' },
    { id: 't-102', date: '2026-06-28', description: 'June spending (summary)', category: 'other', amount: 3980, type: 'expense' },
    { id: 't-103', date: '2026-07-15', description: 'Paycheck — July (summary)', category: 'income', amount: 6720, type: 'income' },
    { id: 't-104', date: '2026-07-28', description: 'July spending (summary)', category: 'other', amount: 4210, type: 'expense' },
    { id: 't-105', date: '2026-08-15', description: 'Paycheck — August (summary)', category: 'income', amount: 6800, type: 'income' },
    { id: 't-106', date: '2026-08-28', description: 'August spending (summary)', category: 'other', amount: 3890, type: 'expense' },
    { id: 't-107', date: '2026-09-15', description: 'Paycheck — September (summary)', category: 'income', amount: 6850, type: 'income' },
    { id: 't-108', date: '2026-09-28', description: 'September spending (summary)', category: 'other', amount: 4350, type: 'expense' },
    { id: 't-109', date: '2026-10-15', description: 'Paycheck — October (summary)', category: 'income', amount: 6850, type: 'income' },
    { id: 't-110', date: '2026-10-28', description: 'October spending (summary)', category: 'other', amount: 4020, type: 'expense' },
  ],
};
