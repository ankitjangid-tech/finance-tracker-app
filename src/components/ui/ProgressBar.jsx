import React from 'react';

export const ProgressBar = ({
  percentage = 0,
  variant = 'default', // 'budget' | 'goal' | 'default'
  showLabel = false,
  height = 'h-2',
  className = '',
}) => {
  const numericPct = Number(percentage) || 0;
  const clampedPct = Math.min(100, Math.max(0, numericPct));

  // Determine bar color based on variant and percentage
  let barColor = 'bg-emerald-500';

  if (variant === 'budget') {
    if (numericPct >= 100) {
      barColor = 'bg-rose-500';
    } else if (numericPct >= 75) {
      barColor = 'bg-amber-500';
    } else {
      barColor = 'bg-emerald-500';
    }
  } else if (variant === 'goal') {
    if (numericPct >= 100) {
      barColor = 'bg-emerald-500';
    } else {
      barColor = 'bg-indigo-600';
    }
  }

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-600 mb-1">
          <span>Progress</span>
          <span className={numericPct > 100 ? 'text-rose-600 font-bold' : ''}>
            {numericPct}%
          </span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${barColor} ${height} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clampedPct}%` }}
          role="progressbar"
          aria-valuenow={numericPct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};
