import React from 'react';
import { Card } from '../ui/Card';

export const SummaryCard = ({
  label,
  value,
  subtext,
  icon: Icon,
  variant = 'neutral', // 'neutral' | 'positive' | 'negative' | 'accent'
}) => {
  const iconVariantStyles = {
    neutral: 'bg-slate-100 text-slate-600',
    positive: 'bg-emerald-100 text-emerald-700',
    negative: 'bg-rose-100 text-rose-700',
    accent: 'bg-indigo-100 text-indigo-700',
  };

  const valueVariantStyles = {
    neutral: 'text-slate-900',
    positive: 'text-emerald-600',
    negative: 'text-rose-600',
    accent: 'text-indigo-600',
  };

  return (
    <Card hoverEffect padding="p-5" className="relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {label}
          </p>
          <div className={`text-2xl font-extrabold tracking-tight ${valueVariantStyles[variant]}`}>
            {value}
          </div>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl shrink-0 ${iconVariantStyles[variant]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {subtext && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
          <span>{subtext}</span>
        </div>
      )}
    </Card>
  );
};
