import React from 'react';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { formatCurrency } from '../../utils/currency';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const BudgetOverview = ({ budgetMetrics, onManageBudgets }) => {
  const { items = [], hasOverspending } = budgetMetrics || {};
  const { setActiveTab } = useFinance();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader
        title="Budget Utilization"
        subtitle="Current month spending limits"
        action={
          <Button
            variant="ghost"
            size="xs"
            onClick={onManageBudgets || (() => setActiveTab('budgets'))}
            icon={ArrowRight}
            iconPosition="right"
          >
            Manage
          </Button>
        }
      />

      <div className="flex-1 space-y-4">
        {hasOverspending && (
          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200/60 flex items-center gap-2 text-xs text-rose-700 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>One or more category budgets have exceeded their limit.</span>
          </div>
        )}

        {!items.length ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No budgets configured for this month.
          </div>
        ) : (
          <div className="space-y-3.5">
            {items.slice(0, 5).map((budget) => (
              <div key={budget.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">
                    {budget.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-600 font-medium">
                      {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                        budget.isOver
                          ? 'bg-rose-100 text-rose-700'
                          : budget.isApproaching
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {budget.utilization}%
                    </span>
                  </div>
                </div>

                <ProgressBar
                  percentage={budget.utilization}
                  variant="budget"
                  height="h-2"
                />

                {budget.isOver && (
                  <p className="text-[10px] text-rose-600 font-semibold text-right">
                    Over by {formatCurrency(budget.overAmount)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
