import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Card, CardHeader } from '../ui/Card';
import { CashFlowChart } from '../dashboard/CashFlowChart';
import { ExpenseBreakdownChart } from '../dashboard/ExpenseBreakdownChart';
import { formatCurrency } from '../../utils/currency';
import { getCategoryMeta } from '../../data/categories';
import { DATE_PERIODS } from '../../utils/dates';
import {
  Scale,
  Receipt,
  Percent,
  Calculator,
} from 'lucide-react';

export const ReportsView = () => {
  const {
    summary,
    categoryBreakdown,
    cashFlowSeries,
    selectedPeriod,
  } = useFinance();

  const currentPeriod = DATE_PERIODS.find((p) => p.id === selectedPeriod) || {
    label: 'Selected Period',
  };

  const topCategories = categoryBreakdown.categories.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 m-0">Financial Analytics & Reports</h2>
        <p className="text-xs text-slate-500 mt-0.5 m-0">
          Historical cash flow trends, expense distributions, and key financial ratios for{' '}
          <strong>{currentPeriod.label}</strong>
        </p>
      </div>

      {/* KPI Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Net Cash Flow</span>
            <Scale className="w-4 h-4 text-slate-400" />
          </div>
          <p
            className={`text-xl font-black mt-2 ${
              summary.netCashFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {summary.netCashFlow >= 0 ? '+' : ''}
            {formatCurrency(summary.netCashFlow)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Income minus expenses</p>
        </Card>

        <Card padding="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Savings Rate</span>
            <Percent className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-xl font-black text-indigo-600 mt-2">
            {summary.totalIncome > 0 ? `${summary.savingsRate}%` : 'N/A'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Retained income ratio</p>
        </Card>

        <Card padding="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Average Expense</span>
            <Calculator className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-2">
            {formatCurrency(summary.averageExpense)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Per recorded expense item</p>
        </Card>

        <Card padding="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Recorded Volume</span>
            <Receipt className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-2">
            {summary.transactionCount}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Transactions in this period</p>
        </Card>
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

      {/* Top Spending Categories Table */}
      <Card>
        <CardHeader
          title="Top Spending Categories"
          subtitle="Highest expense outflows ranked for this period"
        />

        {!topCategories.length ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No expense data recorded in {currentPeriod.label}.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Total Outflow</th>
                  <th className="py-2.5 px-3 text-right">% of Total Expenses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {topCategories.map((cat, idx) => {
                  const meta = getCategoryMeta(cat.name, 'expense');
                  return (
                    <tr key={cat.name} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3 text-slate-400 font-bold">#{idx + 1}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: meta.hex }}
                          />
                          <span className="font-semibold text-slate-900">{cat.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-extrabold text-slate-900">
                        {formatCurrency(cat.amount)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md font-bold text-slate-700 bg-slate-100">
                          {cat.percentage}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
