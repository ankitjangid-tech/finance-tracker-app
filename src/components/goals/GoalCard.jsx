import React from 'react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/currency';
import { formatDateFriendly } from '../../utils/dates';
import { Edit2, Trash2, PlusCircle, CheckCircle2, Calendar } from 'lucide-react';

export const GoalCard = ({ goal, onEdit, onDelete, onContribute }) => {
  const target = Number(goal.targetAmount) || 0;
  const current = Number(goal.currentAmount) || 0;
  const pct = target > 0 ? Math.round((current / target) * 100) : 0;
  const isCompleted = current >= target;
  const remaining = Math.max(0, target - current);

  return (
    <Card hoverEffect padding="p-5" className="relative flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 truncate">
                {goal.name}
              </h3>
              {isCompleted && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Completed
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{goal.category || 'General Goal'}</p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(goal)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Edit goal"
              aria-label="Edit goal"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(goal)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Delete goal"
              aria-label="Delete goal"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 my-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
          <div>
            <span className="text-slate-500 font-medium text-[11px]">Saved</span>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5">
              {formatCurrency(current)}
            </p>
          </div>
          <div>
            <span className="text-slate-500 font-medium text-[11px]">Target</span>
            <p className="text-sm font-extrabold text-indigo-600 mt-0.5">
              {formatCurrency(target)}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
            <span>Progress</span>
            <span className={isCompleted ? 'text-emerald-600 font-bold' : ''}>
              {pct}%
            </span>
          </div>

          <ProgressBar percentage={pct} variant="goal" height="h-2.5" />
        </div>

        {/* Target date & remaining */}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>
            {isCompleted
              ? 'Target achieved!'
              : `${formatCurrency(remaining)} remaining`}
          </span>

          {goal.targetDate && (
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Calendar className="w-3 h-3" />
              <span>Target: {formatDateFriendly(goal.targetDate)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Contribution Action */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onContribute(goal)}
          icon={PlusCircle}
          className="w-full text-indigo-700 border-indigo-200 hover:bg-indigo-50/50"
        >
          Add / Withdraw Funds
        </Button>
      </div>
    </Card>
  );
};
