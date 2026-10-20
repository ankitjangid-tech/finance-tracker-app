import React from 'react';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { formatCurrency } from '../../utils/currency';
import { ArrowRight, PlusCircle, CheckCircle2 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const SavingsGoalsPreview = ({ goals = [] }) => {
  const { setActiveTab, openModal } = useFinance();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader
        title="Savings Goals"
        subtitle="Progress towards active targets"
        action={
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setActiveTab('goals')}
            icon={ArrowRight}
            iconPosition="right"
          >
            Manage
          </Button>
        }
      />

      <div className="flex-1 space-y-4">
        {!goals.length ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No savings goals created yet.
          </div>
        ) : (
          <div className="space-y-4">
            {goals.slice(0, 4).map((goal) => {
              const target = Number(goal.targetAmount) || 0;
              const current = Number(goal.currentAmount) || 0;
              const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
              const isCompleted = current >= target;

              return (
                <div
                  key={goal.id}
                  className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/50 space-y-2 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {goal.name}
                        </span>
                        {isCompleted && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {goal.category || 'General'}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-slate-900">
                        {formatCurrency(current)}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        of {formatCurrency(target)} ({pct}%)
                      </div>
                    </div>
                  </div>

                  <ProgressBar percentage={pct} variant="goal" height="h-1.5" />

                  <div className="pt-1 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">
                      {isCompleted ? 'Goal reached!' : `${formatCurrency(target - current)} to go`}
                    </span>
                    <button
                      onClick={() => openModal('goalContribution', goal)}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <PlusCircle className="w-3 h-3" />
                      Add money
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};
