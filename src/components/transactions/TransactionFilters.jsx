import React from 'react';
import { Search, X } from 'lucide-react';
import { ALL_CATEGORIES } from '../../data/categories';
import { Button } from '../ui/Button';

export const TransactionFilters = ({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  sortBy,
  onSortChange,
  onClearFilters,
  hasActiveFilters,
  totalResults,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3.5">
      {/* Top Search & Type Filter (Stacked on mobile, side-by-side on tablet/desktop) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by note or category..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              aria-label="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Type Toggle: Full-width 3-col grid on mobile, inline pills on desktop */}
        <div className="grid grid-cols-3 sm:flex items-center gap-1 bg-slate-100 p-1 rounded-lg shrink-0 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'income', label: 'Income' },
            { id: 'expense', label: 'Expense' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onTypeFilterChange(item.id)}
              className={`py-1.5 px-3 text-xs font-bold rounded-md transition-all text-center cursor-pointer ${
                typeFilter === item.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Row 2: Category, Sorting, and Summary (Stacked vertically on mobile, row on desktop) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
        {/* Filters Group: Stacked on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex items-center gap-2.5 w-full sm:w-auto">
          {/* Category Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5 w-full sm:w-auto">
            <span className="text-slate-500 font-semibold text-[11px] sm:text-xs">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryFilterChange(e.target.value)}
              className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2.5 text-slate-800 font-medium focus:outline-none focus:border-emerald-500 cursor-pointer text-xs"
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              {ALL_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5 w-full sm:w-auto">
            <span className="text-slate-500 font-semibold text-[11px] sm:text-xs">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2.5 text-slate-800 font-medium focus:outline-none focus:border-emerald-500 cursor-pointer text-xs"
              aria-label="Sort transactions"
            >
              <option value="date_desc">Date: Newest First</option>
              <option value="date_asc">Date: Oldest First</option>
              <option value="amount_desc">Amount: Highest First</option>
              <option value="amount_asc">Amount: Lowest First</option>
            </select>
          </div>
        </div>

        {/* Count and Clear Action */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <span className="text-slate-500 font-medium text-[11px]">
            {totalResults} record{totalResults === 1 ? '' : 's'}
          </span>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="xs"
              onClick={onClearFilters}
              icon={X}
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold"
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
