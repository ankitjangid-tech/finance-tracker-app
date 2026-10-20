import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { SummaryCard } from './SummaryCard';
import { CashFlowChart } from './CashFlowChart';
import { ExpenseBreakdownChart } from './ExpenseBreakdownChart';
import { RecentTransactions } from './RecentTransactions';
import { BudgetOverview } from './BudgetOverview';
import { SavingsGoalsPreview } from './SavingsGoalsPreview';
import { formatCurrency } from '../../utils/currency';
import { exportTransactionsToCSV } from '../../utils/csvExport';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Sparkles,
  ArrowRight,
  Download,
} from 'lucide-react';
import { DATE_PERIODS } from '../../utils/dates';

export const DashboardView = () => {
  const {
    summary,
    periodTransactions,
    transactions,
    categoryBreakdown,
    cashFlowSeries,
    budgetMetrics,
    savingsGoals,
    selectedPeriod,
    settings,
    openModal,
    setActiveTab,
    showToast,
  } = useFinance();

  const currentPeriodObj = DATE_PERIODS.find((p) => p.id === selectedPeriod) || {
    label: 'Selected Period',
  };

  // Determine Net Cash Flow sign label
  const netFlowFormatted = formatCurrency(Math.abs(summary.netCashFlow));
  const netFlowSubtext =
    summary.netCashFlow >= 0
      ? `+${netFlowFormatted} surplus in ${currentPeriodObj.label.toLowerCase()}`
      : `-${netFlowFormatted} deficit in ${currentPeriodObj.label.toLowerCase()}`;

  // Feature: Parse localStorage transactions and trigger CSV download
  const handleExportLocalStorageCSV = async () => {
    try {
      const raw = localStorage.getItem('finora_transactions_v1');
      const storedTransactions = raw ? JSON.parse(raw) : transactions;
      const res = await exportTransactionsToCSV(storedTransactions, 'all');
      if (res.success) {
        showToast({
          title: 'Export to CSV Successful',
          message: `Parsed ${res.count} transactions from local storage.`,
          type: 'success',
        });
      } else {
        showToast({
          title: 'Export Notice',
          message: res.message || 'No transactions found to export.',
          type: 'info',
        });
      }
    } catch (err) {
      console.error('Failed to parse localStorage transactions for CSV export:', err);
      await exportTransactionsToCSV(transactions, 'all');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Primary Action Banner */}
      <div className="bg-linear-to-r from-emerald-600 via-emerald-700 to-teal-800 rounded-2xl p-5 sm:p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-xs">
              <Sparkles className="w-3 h-3 text-emerald-200" />
              SaaS Financial Overview
            </span>
            <span className="text-emerald-100 text-xs">
              • Filter: <strong className="text-white">{currentPeriodObj.label}</strong>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white m-0">
            Welcome back to Finora
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm max-w-xl m-0">
            You have recorded {periodTransactions.length} transactions in this period.
            Total cash reserves stand at {formatCurrency(summary.totalBalance)}.
          </p>
        </div>

        {/* Top-Right Action Buttons: Primary Export to CSV + Quick Transaction */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportLocalStorageCSV}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all duration-150 cursor-pointer flex items-center gap-2 active:scale-[0.98]"
            title="Export all transactions from LocalStorage to CSV"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>Export to CSV</span>
          </button>

          <button
            onClick={() => openModal('transaction')}
            className="px-4 py-2 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-bold shadow-xs transition-all duration-150 cursor-pointer"
          >
            + Quick Transaction
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className="px-3.5 py-2 bg-emerald-700/60 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold border border-white/20 transition-all duration-150 cursor-pointer flex items-center gap-1"
          >
            Deep Dive
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <SummaryCard
          label="Total Balance"
          value={formatCurrency(summary.totalBalance)}
          subtext={`Includes ₹${(settings.openingBalance || 0).toLocaleString('en-IN')} opening balance`}
          icon={Wallet}
          variant="positive"
        />

        <SummaryCard
          label="Total Income"
          value={formatCurrency(summary.totalIncome)}
          subtext={currentPeriodObj.label}
          icon={TrendingUp}
          variant="positive"
        />

        <SummaryCard
          label="Total Expenses"
          value={formatCurrency(summary.totalExpenses)}
          subtext={`${periodTransactions.filter((t) => t.type === 'expense').length} expense entries`}
          icon={TrendingDown}
          variant="negative"
        />

        <SummaryCard
          label="Savings Rate"
          value={summary.totalIncome > 0 ? `${summary.savingsRate}%` : 'N/A'}
          subtext={netFlowSubtext}
          icon={PiggyBank}
          variant={summary.savingsRate >= 20 ? 'positive' : summary.savingsRate > 0 ? 'accent' : 'neutral'}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          <CashFlowChart data={cashFlowSeries} />
        </div>
        <div className="lg:col-span-5">
          <ExpenseBreakdownChart data={categoryBreakdown.categories} />
        </div>
      </div>

      {/* Bottom 3-column / 2-column detail grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div>
          <RecentTransactions transactions={transactions} limit={6} />
        </div>
        <div>
          <BudgetOverview budgetMetrics={budgetMetrics} />
        </div>
        <div className="md:col-span-2 lg:col-span-1">
          <SavingsGoalsPreview goals={savingsGoals} />
        </div>
      </div>
    </div>
  );
};
