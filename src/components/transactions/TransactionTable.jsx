import React from 'react';
import { formatSignedCurrency } from '../../utils/currency';
import { formatDateFriendly } from '../../utils/dates';
import { getCategoryMeta } from '../../data/categories';
import { Edit2, Trash2, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { EmptyStateIllustration } from '../ui/EmptyStateIllustration';

export const TransactionTable = ({
  transactions = [],
  totalAllTransactions = 0,
  hasActiveFilters = false,
  onEdit,
  onDelete,
  onAddFirst,
  onClearFilters,
}) => {
  // Empty State Handling
  if (!transactions.length) {
    if (hasActiveFilters && totalAllTransactions > 0) {
      return (
        <EmptyStateIllustration
          title="No matching transactions found"
          description="We couldn't find any transactions matching your current search or filter criteria. Try adjusting your search term or clearing the active filters."
          actionLabel="Clear All Filters"
          onAction={onClearFilters}
          isFilterReset={true}
        />
      );
    }

    return (
      <EmptyStateIllustration
        title="No transactions yet. Start tracking!"
        description="Your financial ledger is currently empty. Add your first income or expense to see live cash flow charts, category breakdowns, and monthly budget tracking."
        actionLabel="Add Your First Transaction"
        onAction={onAddFirst}
        isFilterReset={false}
      />
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Desktop Table View (Hidden on mobile) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {transactions.map((tx) => {
              const meta = getCategoryMeta(tx.category, tx.type);
              const signed = formatSignedCurrency(tx.amount, tx.type);
              const isIncome = tx.type === 'income';

              return (
                <tr
                  key={tx.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Date */}
                  <td className="py-3.5 px-4 text-xs font-medium text-slate-500 whitespace-nowrap">
                    {formatDateFriendly(tx.date)}
                  </td>

                  {/* Description */}
                  <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">
                    {tx.note || tx.category}
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: meta.hex }}
                      />
                      {tx.category}
                    </span>
                  </td>

                  {/* Type */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                        isIncome
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <ArrowUpRight className="w-3 h-3 text-rose-600" />
                      )}
                      {tx.type}
                    </span>
                  </td>

                  {/* Amount */}
                  <td
                    className={`py-3.5 px-4 text-right font-bold whitespace-nowrap ${signed.colorClass}`}
                  >
                    {signed.text}
                  </td>

                  {/* Actions: Explicit, prominent, high-affordance buttons */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEdit(tx)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200/60 rounded-md transition-all duration-150 cursor-pointer shadow-2xs active:scale-[0.97]"
                        title="Edit amount, category, or note"
                        aria-label={`Edit ${tx.note || tx.category}`}
                      >
                        <Edit2 className="w-3 h-3 text-slate-500" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => onDelete(tx)}
                        className="inline-flex items-center gap-1 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                        title="Delete transaction"
                        aria-label={`Delete ${tx.note || tx.category}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View (Visible only on narrow screens) */}
      <div className="sm:hidden divide-y divide-slate-100">
        {transactions.map((tx) => {
          const meta = getCategoryMeta(tx.category, tx.type);
          const signed = formatSignedCurrency(tx.amount, tx.type);

          return (
            <div key={tx.id} className="p-4 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {tx.note || tx.category}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {formatDateFriendly(tx.date)}
                  </p>
                </div>
                <div className={`text-base font-extrabold shrink-0 ${signed.colorClass}`}>
                  {signed.text}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: meta.hex }}
                  />
                  {tx.category}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(tx)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-lg text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3 text-slate-500" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => onDelete(tx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    aria-label="Delete transaction"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
