/**
 * Pure, deterministic accounting and financial calculation utilities.
 */

/**
 * Calculate basic financial summary for a set of transactions
 * @param {Array} periodTransactions - transactions in the active period
 * @param {Array} allTransactions - all stored transactions (for balance)
 * @param {number} openingBalance - configurable opening balance
 */
export const calculateFinancialSummary = (periodTransactions = [], allTransactions = [], openingBalance = 0) => {
  // Period metrics
  let totalIncome = 0;
  let totalExpenses = 0;

  for (const t of periodTransactions) {
    const amt = Number(t.amount) || 0;
    if (t.type === 'income') {
      totalIncome += amt;
    } else {
      totalExpenses += amt;
    }
  }

  const netCashFlow = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.max(0, ((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

  // All-time balance: openingBalance + allIncome - allExpenses
  let allTimeIncome = 0;
  let allTimeExpenses = 0;

  for (const t of allTransactions) {
    const amt = Number(t.amount) || 0;
    if (t.type === 'income') {
      allTimeIncome += amt;
    } else {
      allTimeExpenses += amt;
    }
  }

  const totalBalance = Number(openingBalance || 0) + allTimeIncome - allTimeExpenses;

  return {
    totalBalance,
    totalIncome,
    totalExpenses,
    netCashFlow,
    savingsRate: Math.round(savingsRate * 10) / 10,
    transactionCount: periodTransactions.length,
    averageExpense: totalExpenses > 0 && periodTransactions.filter(t => t.type === 'expense').length > 0
      ? totalExpenses / periodTransactions.filter(t => t.type === 'expense').length
      : 0,
  };
};

/**
 * Calculate category-wise spending breakdown
 * @param {Array} transactions - expense transactions
 */
export const calculateCategoryBreakdown = (transactions = []) => {
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  const totals = {};
  let totalExpenseAmount = 0;

  for (const t of expenseTransactions) {
    const amt = Number(t.amount) || 0;
    const cat = t.category || 'Other';
    totals[cat] = (totals[cat] || 0) + amt;
    totalExpenseAmount += amt;
  }

  const result = Object.entries(totals)
    .map(([category, amount]) => ({
      name: category,
      category,
      amount,
      percentage: totalExpenseAmount > 0 ? Math.round((amount / totalExpenseAmount) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  return {
    categories: result,
    totalExpenseAmount,
  };
};

/**
 * Calculate monthly or daily cash flow series for charts
 * @param {Array} transactions
 */
export const calculateCashFlowSeries = (transactions = []) => {
  if (!transactions.length) return [];

  // Group by YYYY-MM or YYYY-MM-DD
  const groupMap = {};

  // Sort chronologically
  const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

  for (const t of sorted) {
    // Format as YYYY-MM or MMM YYYY for grouping
    const d = new Date(t.date);
    if (isNaN(d.getTime())) continue;

    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });

    if (!groupMap[key]) {
      groupMap[key] = { key, label, income: 0, expense: 0, net: 0 };
    }

    const amt = Number(t.amount) || 0;
    if (t.type === 'income') {
      groupMap[key].income += amt;
    } else {
      groupMap[key].expense += amt;
    }
    groupMap[key].net = groupMap[key].income - groupMap[key].expense;
  }

  return Object.values(groupMap);
};

/**
 * Calculate budget metrics for each configured category
 * @param {Array} budgets
 * @param {Array} transactions
 * @param {string} monthKey - YYYY-MM
 */
export const calculateBudgetMetrics = (budgets = [], transactions = [], monthKey) => {
  const monthExpenses = transactions.filter(
    (t) => t.type === 'expense' && t.date.startsWith(monthKey)
  );

  // Sum spending by category
  const spendingByCategory = {};
  for (const t of monthExpenses) {
    const cat = t.category || 'Other';
    spendingByCategory[cat] = (spendingByCategory[cat] || 0) + (Number(t.amount) || 0);
  }

  let totalBudgeted = 0;
  let totalSpent = 0;

  const categoryMetrics = budgets.map((b) => {
    const limit = Number(b.limit) || 0;
    const spent = spendingByCategory[b.category] || 0;
    const remaining = limit - spent;
    const rawUtilization = limit > 0 ? (spent / limit) * 100 : 0;
    const utilization = Math.round(rawUtilization);
    const isOver = spent > limit;
    const isApproaching = utilization >= 75 && !isOver;

    totalBudgeted += limit;
    totalSpent += spent;

    return {
      ...b,
      spent,
      remaining,
      utilization,
      isOver,
      isApproaching,
      overAmount: isOver ? spent - limit : 0,
    };
  });

  const totalRemaining = totalBudgeted - totalSpent;
  const overallUtilization = totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0;

  return {
    items: categoryMetrics,
    totalBudgeted,
    totalSpent,
    totalRemaining,
    overallUtilization,
    hasOverspending: categoryMetrics.some((c) => c.isOver),
  };
};
