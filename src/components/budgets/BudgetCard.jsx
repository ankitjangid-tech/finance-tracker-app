import React from 'react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { formatCurrency } from '../../utils/currency';
import { getCategoryMeta } from '../../data/categories';
import { Edit2, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';

export const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const meta = getCategoryMeta(budget.category, 'expense');
  const isOver = budget.isOver;
  const isApproaching = budget.isApproaching;

  return (
    <Card hoverEffect padding="p-5" className="relative flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
              style={{ backgroundColor: meta.hex }}
            >
              <span className="text-sm font-bold">{budget.category.charAt(0)}</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                {budget.category}
              </h3>
              <p className="text-[11px] text-slate-500 capitalize">
                {budget.period} budget
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(budget)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Edit budget limit"
              aria-label="Edit budget"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(budget)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Delete budget"
              aria-label="Delete budget"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Financial metrics row */}
        <div className="grid grid-cols-2 gap-2 my-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
          <div>
            <span className="text-slate-500 font-medium text-[11px]">Spent</span>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5">
              {formatCurrency(budget.spent)}
            </p>
          </div>
          <div>
            <span className="text-slate-500 font-medium text-[11px]">Monthly Limit</span>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5">
              {formatCurrency(budget.limit)}
            </p>
          </div>
        </div>

        {/* Progress Bar & Status */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600">Utilization</span>
            <span
              className={`font-bold px-1.5 py-0.2 rounded text-[11px] ${
                isOver
                  ? 'bg-rose-100 text-rose-700'
                  : isApproaching
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {budget.utilization}%
            </span>
          </div>

          <ProgressBar
            percentage={budget.utilization}
            variant="budget"
            height="h-2.5"
          />
        </div>
      </div>

      {/* Footer warning or status */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        {isOver ? (
          <div className="flex items-center gap-1.5 text-rose-600 font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>Overspent by {formatCurrency(budget.overAmount)}</span>
          </div>
        ) : isApproaching ? (
          <div className="flex items-center gap-1.5 text-amber-600 font-medium">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{formatCurrency(budget.remaining)} remaining</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-slate-500">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>{formatCurrency(budget.remaining)} left</span>
          </div>
        )}
      </div>
    </Card>
  );
};
