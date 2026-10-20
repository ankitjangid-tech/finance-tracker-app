import React from 'react';
import { Button } from './Button';
import { PlusCircle, RotateCcw } from 'lucide-react';

export const EmptyStateIllustration = ({
  title = 'No transactions yet. Start tracking!',
  description = 'Your ledger is currently empty. Record your first income or expense to see real-time cash flow charts, category breakdowns, and monthly budget progress.',
  actionLabel = 'Add Your First Transaction',
  onAction,
  actionIcon: ActionIcon = PlusCircle,
  isFilterReset = false,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-xs p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-2xl mx-auto my-4 ${className}`}
    >
      {/* Decorative Modern SVG Illustration */}
      <div className="relative w-44 h-44 mb-6 select-none">
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Subtle Background Glow Circle */}
          <circle cx="100" cy="100" r="85" fill="#f0fdf4" />
          <circle cx="100" cy="100" r="70" fill="#ecfdf5" stroke="#d1fae5" strokeWidth="2" strokeDasharray="6 6" />

          {/* Floating Receipt Document */}
          <g transform="translate(110, 25) rotate(12)">
            <rect width="65" height="90" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="12" y1="20" x2="53" y2="20" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
            <line x1="12" y1="32" x2="45" y2="32" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="12" y1="44" x2="50" y2="44" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="12" y1="56" x2="38" y2="56" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="48" cy="72" r="7" fill="#10b981" />
            <path d="M45 72L47 74L51 70" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* Primary Sleek Leather Wallet */}
          <g transform="translate(30, 65)">
            {/* Wallet Back */}
            <rect x="0" y="5" width="115" height="75" rx="14" fill="#0f172a" />
            {/* Wallet Front Pocket */}
            <rect x="0" y="20" width="115" height="60" rx="14" fill="#1e293b" />
            <path d="M0 32C25 32 35 38 60 38C85 38 95 32 115 32V80H0V32Z" fill="#334155" opacity="0.4" />
            {/* Wallet Flap with Clasp */}
            <rect x="80" y="38" width="40" height="24" rx="8" fill="#047857" />
            <circle cx="106" cy="50" r="4.5" fill="#34d399" />
          </g>

          {/* Golden Floating Coins with Indian Rupee (₹) Symbol */}
          {/* Coin 1 */}
          <g transform="translate(42, 40) rotate(-10)">
            <circle cx="18" cy="18" r="18" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="18" cy="18" r="14" fill="#fde68a" />
            <text
              x="18"
              y="23"
              fontSize="16"
              fontWeight="bold"
              fill="#b45309"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              ₹
            </text>
          </g>

          {/* Coin 2 */}
          <g transform="translate(132, 110)">
            <circle cx="15" cy="15" r="15" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
            <circle cx="15" cy="15" r="11" fill="#fef3c7" />
            <text
              x="15"
              y="19"
              fontSize="13"
              fontWeight="bold"
              fill="#b45309"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              ₹
            </text>
          </g>

          {/* Small Sparkles */}
          <path d="M40 25L42 30L47 32L42 34L40 39L38 34L33 32L38 30Z" fill="#10b981" />
          <path d="M165 65L166.5 69L170.5 70.5L166.5 72L165 76L163.5 72L159.5 70.5L163.5 69Z" fill="#f59e0b" />
          <path d="M25 125L26.5 129L30.5 130.5L26.5 132L25 136L23.5 132L19.5 130.5L23.5 129Z" fill="#6366f1" />
        </svg>
      </div>

      {/* Heading */}
      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed mb-6">
        {description}
      </p>

      {/* CTA Button */}
      {onAction && actionLabel && (
        <Button
          variant={isFilterReset ? 'outline' : 'primary'}
          size="md"
          onClick={onAction}
          icon={isFilterReset ? RotateCcw : ActionIcon}
          className="shadow-sm hover:shadow"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
