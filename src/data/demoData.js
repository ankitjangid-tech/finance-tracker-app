/**
 * Realistic seed demo data for Finora with Indian Rupee values.
 * Populates recent transactions, category budgets, and savings goals.
 */

// Helper to format dynamic YYYY-MM-DD relative to today
const getRelativeDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getDemoTransactions = () => [
  {
    id: 'tx-seed-1',
    date: getRelativeDate(1),
    amount: 125000,
    type: 'income',
    category: 'Salary',
    note: 'Monthly salary from TechCorp India',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-seed-2',
    date: getRelativeDate(2),
    amount: 28000,
    type: 'expense',
    category: 'Housing & Rent',
    note: 'Apartment rent transfer to landlord',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-seed-3',
    date: getRelativeDate(3),
    amount: 5400,
    type: 'expense',
    category: 'Groceries',
    note: 'Blinkit weekly organic grocery delivery',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-seed-4',
    date: getRelativeDate(4),
    amount: 1850,
    type: 'expense',
    category: 'Food & Dining',
    note: 'Dinner with colleagues at Toit Brewery',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-seed-5',
    date: getRelativeDate(5),
    amount: 3200,
    type: 'expense',
    category: 'Bills & Utilities',
    note: 'BESCOM electricity bill payment',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-seed-6',
    date: getRelativeDate(6),
    amount: 35000,
    type: 'income',
    category: 'Freelance',
    note: 'UI design consulting milestone payment',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-seed-7',
    date: getRelativeDate(7),
    amount: 15000,
    type: 'expense',
    category: 'Investments',
    note: 'Nifty 50 Index Fund Monthly SIP',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-seed-8',
    date: getRelativeDate(8),
    amount: 2400,
    type: 'expense',
    category: 'Transportation',
    note: 'Petrol refill at Shell bunks',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-seed-9',
    date: getRelativeDate(10),
    amount: 1199,
    type: 'expense',
    category: 'Subscriptions',
    note: 'Netflix 4K Ultra annual tier',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-seed-10',
    date: getRelativeDate(12),
    amount: 3800,
    type: 'expense',
    category: 'Shopping',
    note: 'Myntra festival season apparel',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-seed-11',
    date: getRelativeDate(14),
    amount: 1650,
    type: 'expense',
    category: 'Healthcare',
    note: 'Apollo Pharmacy routine vitamins',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-seed-12',
    date: getRelativeDate(16),
    amount: 950,
    type: 'expense',
    category: 'Food & Dining',
    note: 'Swiggy lunch delivery order',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-seed-13',
    date: getRelativeDate(20),
    amount: 4200,
    type: 'expense',
    category: 'Groceries',
    note: 'Nature Basket monthly staples',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-seed-14',
    date: getRelativeDate(25),
    amount: 1450,
    type: 'expense',
    category: 'Transportation',
    note: 'Uber premier airport commute',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-seed-15',
    date: getRelativeDate(32),
    amount: 125000,
    type: 'income',
    category: 'Salary',
    note: 'Previous month TechCorp salary credit',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-seed-16',
    date: getRelativeDate(35),
    amount: 28000,
    type: 'expense',
    category: 'Housing & Rent',
    note: 'Previous month apartment rent',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-seed-17',
    date: getRelativeDate(38),
    amount: 12000,
    type: 'expense',
    category: 'Groceries',
    note: 'D-Mart bulk household shopping',
    createdAt: new Date().toISOString(),
  },
];

export const getDemoBudgets = () => [
  {
    id: 'bg-seed-1',
    category: 'Housing & Rent',
    limit: 30000,
    period: 'monthly',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'bg-seed-2',
    category: 'Groceries',
    limit: 15000,
    period: 'monthly',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'bg-seed-3',
    category: 'Food & Dining',
    limit: 8000,
    period: 'monthly',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'bg-seed-4',
    category: 'Transportation',
    limit: 6000,
    period: 'monthly',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'bg-seed-5',
    category: 'Bills & Utilities',
    limit: 5000,
    period: 'monthly',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'bg-seed-6',
    category: 'Shopping',
    limit: 8000,
    period: 'monthly',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'bg-seed-7',
    category: 'Healthcare',
    limit: 4000,
    period: 'monthly',
    createdAt: new Date().toISOString(),
  },
];

export const getDemoSavingsGoals = () => {
  const currentYear = new Date().getFullYear();
  return [
    {
      id: 'gl-seed-1',
      name: 'Emergency Fund',
      targetAmount: 300000,
      currentAmount: 215000,
      targetDate: `${currentYear + 1}-03-31`,
      category: 'Emergency Fund',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'gl-seed-2',
      name: 'New MacBook Pro M3',
      targetAmount: 180000,
      currentAmount: 140000,
      targetDate: `${currentYear}-12-15`,
      category: 'Gadgets',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'gl-seed-3',
      name: 'Japan Autumn Trip',
      targetAmount: 250000,
      currentAmount: 85000,
      targetDate: `${currentYear + 1}-10-15`,
      category: 'Travel',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'gl-seed-4',
      name: 'Apartment Down Payment',
      targetAmount: 1500000,
      currentAmount: 620000,
      targetDate: `${currentYear + 2}-06-30`,
      category: 'Real Estate',
      createdAt: new Date().toISOString(),
    },
  ];
};

export const getDemoSettings = () => ({
  openingBalance: 65000,
  currency: 'INR',
  currencySymbol: '₹',
  dateFormat: 'DD/MM/YYYY',
  isDemoActive: true,
});
