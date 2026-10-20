import React, { useState, useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { TransactionFilters } from './TransactionFilters';
import { TransactionTable } from './TransactionTable';
import { ConfirmModal } from '../ui/ConfirmModal';
import { Button } from '../ui/Button';
import { Plus, Download } from 'lucide-react';
import { exportTransactionsToCSV } from '../../utils/csvExport';

export const TransactionsView = () => {
  const {
    periodTransactions,
    transactions,
    deleteTransaction,
    openModal,
    showToast,
    selectedPeriod,
  } = useFinance();

  // Local filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'income' | 'expense'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc'); // date_desc, date_asc, amount_desc, amount_asc

  // Delete modal state
  const [txToDelete, setTxToDelete] = useState(null);

  // Apply filters on periodTransactions (or transactions if all_time)
  const baseList = selectedPeriod === 'all_time' ? transactions : periodTransactions;

  const filtered = useMemo(() => {
    return baseList
      .filter((tx) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchNote = (tx.note || '').toLowerCase().includes(q);
          const matchCat = (tx.category || '').toLowerCase().includes(q);
          if (!matchNote && !matchCat) return false;
        }

        // Type filter
        if (typeFilter !== 'all' && tx.type !== typeFilter) {
          return false;
        }

        // Category filter
        if (categoryFilter !== 'all' && tx.category !== categoryFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date_desc') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'date_asc') return new Date(a.date) - new Date(b.date);
        if (sortBy === 'amount_desc') return Number(b.amount) - Number(a.amount);
        if (sortBy === 'amount_asc') return Number(a.amount) - Number(b.amount);
        return 0;
      });
  }, [baseList, searchQuery, typeFilter, categoryFilter, sortBy]);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) || typeFilter !== 'all' || categoryFilter !== 'all';

  const handleClearFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setSortBy('date_desc');
  };

  const handleExportFiltered = async () => {
    const result = await exportTransactionsToCSV(filtered, 'filtered');
    if (result.success) {
      showToast({
        title: 'CSV Exported',
        message: `Exported ${result.count} filtered transactions.`,
        type: 'success',
      });
    } else {
      showToast({
        title: 'Notice',
        message: result.message,
        type: 'info',
      });
    }
  };

  return (
    <div className="space-y-5">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 m-0">Transaction History</h2>
          <p className="text-xs text-slate-500 mt-0.5 m-0">
            View, search, filter, and audit all recorded financial ledger items
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportFiltered}
            icon={Download}
          >
            Export Filtered CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => openModal('transaction')}
            icon={Plus}
          >
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Filter toolbar */}
      <TransactionFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        totalResults={filtered.length}
      />

      {/* Main Table */}
      <TransactionTable
        transactions={filtered}
        totalAllTransactions={transactions.length}
        hasActiveFilters={hasActiveFilters}
        onEdit={(tx) => openModal('transaction', tx)}
        onDelete={(tx) => setTxToDelete(tx)}
        onAddFirst={() => openModal('transaction')}
        onClearFilters={handleClearFilters}
      />

      {/* Confirmation Modal for Delete */}
      <ConfirmModal
        isOpen={Boolean(txToDelete)}
        onClose={() => setTxToDelete(null)}
        onConfirm={() => {
          if (txToDelete) {
            deleteTransaction(txToDelete.id);
            setTxToDelete(null);
          }
        }}
        title="Delete Transaction?"
        message={`Are you sure you want to delete "${txToDelete?.note || txToDelete?.category}" of ₹${Number(
          txToDelete?.amount || 0
        ).toLocaleString('en-IN')}? This action will adjust all financial analytics.`}
        confirmLabel="Delete Transaction"
        confirmVariant="danger"
      />
    </div>
  );
};
