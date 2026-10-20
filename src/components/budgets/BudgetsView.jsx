import React, { useState, useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { BudgetCard } from './BudgetCard';
import { BudgetModal } from './BudgetModal';
import { ConfirmModal } from '../ui/ConfirmModal';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { ProgressBar } from '../ui/ProgressBar';
import { formatCurrency } from '../../utils/currency';
import { formatMonthLabel } from '../../utils/dates';
import {
  Plus,
  AlertOctagon,
  PieChart as PieChartIcon,
  Calendar,
} from 'lucide-react';

export const BudgetsView = () => {
  const {
    budgets,
    budgetMetrics,
    addBudget,
    updateBudget,
    deleteBudget,
    selectedMonth,
    setSelectedMonth,
  } = useFinance();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState(null);
  const [budgetToDelete, setBudgetToDelete] = useState(null);

  const handleOpenAdd = () => {
    setBudgetToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (budget) => {
    setBudgetToEdit(budget);
    setIsModalOpen(true);
  };

  const handleSaveBudget = (data) => {
    if (data.id) {
      updateBudget(data.id, data);
    } else {
      addBudget(data);
    }
  };

  // Generate selectable months (current month + 5 previous months)
  const availableMonths = useMemo(() => {
    const list = [];
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const key = `${y}-${m}`;
      list.push({ key, label: formatMonthLabel(key) });
    }
    return list;
  }, []);

  const { items = [], totalBudgeted, totalSpent, totalRemaining, overallUtilization, hasOverspending } =
    budgetMetrics;

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 m-0">Monthly Budgets</h2>
          <p className="text-xs text-slate-500 mt-0.5 m-0">
            Set and track spending limits by category for {formatMonthLabel(selectedMonth)}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Calendar Month Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              {availableMonths.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <Button variant="primary" size="sm" onClick={handleOpenAdd} icon={Plus}>
            Create Budget
          </Button>
        </div>
      </div>

      {/* Overspending Banner Alert */}
      {hasOverspending && (
        <div className="p-4 bg-rose-50 border border-rose-200/80 rounded-xl flex items-start gap-3.5 text-xs text-rose-800">
          <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-sm text-rose-900">
              Budget Alert: Spending Limit Exceeded
            </p>
            <p className="text-rose-700 leading-relaxed">
              One or more categories have exceeded their monthly allocation. Review your high-utilization categories below and consider adjusting discretionary expenses.
            </p>
          </div>
        </div>
      )}

      {/* Aggregate Overview Card */}
      <Card padding="p-5 sm:p-6" className="bg-linear-to-br from-white to-slate-50/50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Budgeted</span>
            <p className="text-2xl font-black text-slate-900 mt-0.5">
              {formatCurrency(totalBudgeted)}
            </p>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Spent</span>
            <p className="text-2xl font-black text-rose-600 mt-0.5">
              {formatCurrency(totalSpent)}
            </p>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Remaining</span>
            <p
              className={`text-2xl font-black mt-0.5 ${
                totalRemaining >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {formatCurrency(totalRemaining)}
            </p>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Overall Utilization</span>
            <p className="text-2xl font-black text-indigo-600 mt-0.5">
              {overallUtilization}%
            </p>
          </div>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <div className="flex justify-between items-center text-xs text-slate-600 font-medium">
            <span>Overall Monthly Budget Progress</span>
            <span className="font-bold">{overallUtilization}%</span>
          </div>
          <ProgressBar
            percentage={overallUtilization}
            variant="budget"
            height="h-3"
          />
        </div>
      </Card>

      {/* Category Budgets Grid */}
      {!items.length ? (
        <EmptyState
          icon={PieChartIcon}
          title="No budgets configured yet"
          description="Create spending limits for key categories like Groceries, Dining, and Rent to keep your finances on track."
          actionLabel="Create Budget"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onEdit={handleOpenEdit}
              onDelete={setBudgetToDelete}
            />
          ))}
        </div>
      )}

      {/* Budget Modal */}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBudget}
        initialData={budgetToEdit}
        existingBudgets={budgets}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(budgetToDelete)}
        onClose={() => setBudgetToDelete(null)}
        onConfirm={() => {
          if (budgetToDelete) {
            deleteBudget(budgetToDelete.id);
            setBudgetToDelete(null);
          }
        }}
        title="Delete Budget?"
        message={`Are you sure you want to delete the ${budgetToDelete?.category} monthly budget? Your recorded transactions will not be deleted.`}
        confirmLabel="Delete Budget"
        confirmVariant="danger"
      />
    </div>
  );
};
