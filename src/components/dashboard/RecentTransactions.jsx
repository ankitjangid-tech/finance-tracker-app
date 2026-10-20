import React from 'react';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatSignedCurrency } from '../../utils/currency';
import { formatDateFriendly } from '../../utils/dates';
import { ArrowUpRight, ArrowDownLeft, ArrowRight } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const RecentTransactions = ({ transactions = [], limit = 6 }) => {
  const { setActiveTab } = useFinance();
  const recent = transactions.slice(0, limit);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader
        title="Recent Transactions"
        subtitle="Latest ledger activities"
        action={
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setActiveTab('transactions')}
            icon={ArrowRight}
            iconPosition="right"
          >
            View all
          </Button>
        }
      />

      <div className="flex-1">
        {!recent.length ? (
          <div className="py-8 px-4 text-center flex flex-col items-center justify-center">
            <p className="text-xs font-bold text-slate-800">No transactions recorded yet.</p>
            <p className="text-[11px] text-slate-400 max-w-xs mt-1 mb-3">
              Start tracking by adding your first income or expense.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recent.map((tx) => {
              const signed = formatSignedCurrency(tx.amount, tx.type);
              const isIncome = tx.type === 'income';

              return (
                <div
                  key={tx.id}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/60 px-2 -mx-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isIncome ? 'bg-emerald-100/70 text-emerald-600' : 'bg-rose-100/70 text-rose-600'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {tx.note || tx.category}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-medium text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded text-[10px]">
                          {tx.category}
                        </span>
                        <span>•</span>
                        <span>{formatDateFriendly(tx.date)}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`text-sm font-bold shrink-0 ${signed.colorClass}`}>
                    {signed.text}
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
