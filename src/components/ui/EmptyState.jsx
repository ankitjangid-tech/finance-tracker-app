import React from 'react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 border-2 border-dashed border-slate-200 rounded-2xl bg-white/50 ${className}`}>
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3.5 shadow-xs">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 max-w-sm mt-1 mb-5">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction} icon={actionIcon}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
