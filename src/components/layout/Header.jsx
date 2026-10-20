import React from 'react';
import { Menu, Download, Plus, Calendar } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { DATE_PERIODS } from '../../utils/dates';
import { exportTransactionsToCSV } from '../../utils/csvExport';
import { Button } from '../ui/Button';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

export const Header = ({ onOpenMobileMenu }) => {
  const {
    activeTab,
    selectedPeriod,
    setSelectedPeriod,
    openModal,
    transactions,
    showToast,
  } = useFinance();

  const getPageInfo = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Financial Dashboard',
          subtitle: 'Live summary of your net worth, expenses, and cash flow',
          showDateFilter: true,
          showExport: true,
        };
      case 'transactions':
        return {
          title: 'Transactions',
          subtitle: 'Full financial ledger with smart categorization and search',
          showDateFilter: true,
          showExport: true,
        };
      case 'budgets':
        return {
          title: 'Monthly Budgets',
          subtitle: 'Track category spending limits and prevent overspending',
          showDateFilter: false,
          showExport: false,
        };
      case 'goals':
        return {
          title: 'Savings Goals',
          subtitle: 'Plan, fund, and track progress toward your milestones',
          showDateFilter: false,
          showExport: false,
        };
      case 'reports':
        return {
          title: 'Reports & Analytics',
          subtitle: 'In-depth breakdown of cash flow patterns and category habits',
          showDateFilter: true,
          showExport: true,
        };
      case 'settings':
        return {
          title: 'Settings & Preferences',
          subtitle: 'Manage local storage, opening balance, and export archives',
          showDateFilter: false,
          showExport: false,
        };
      default:
        return { title: 'Finora', subtitle: '', showDateFilter: false, showExport: false };
    }
  };

  const pageInfo = getPageInfo();

  const handleExportCSV = async () => {
    try {
      const raw = localStorage.getItem('finora_transactions_v1');
      const allParsed = raw ? JSON.parse(raw) : transactions;
      const listToExport =
        selectedPeriod === 'all_time'
          ? allParsed
          : allParsed.filter((t) => isDateInPeriod(t.date, selectedPeriod));

      const result = await exportTransactionsToCSV(
        listToExport,
        selectedPeriod !== 'all_time' ? selectedPeriod : ''
      );
      if (result.success) {
        showToast({
          title: 'CSV Export Successful',
          message: `Exported ${result.count} transactions. Check your downloads or share dialog.`,
          type: 'success',
        });
      } else {
        showToast({
          title: 'Export Notice',
          message: result.message || 'No records to export.',
          type: 'info',
        });
      }
    } catch (err) {
      console.error(err);
      await exportTransactionsToCSV(transactions, 'all');
    }
  };

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 px-3 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-2.5">
      {/* Left title & mobile menu toggle */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer shrink-0"
          aria-label="Open navigation menu"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5 text-slate-800" />
        </button>

        <div>
          <h1 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight leading-tight m-0">
            {pageInfo.title}
          </h1>
          <p className="hidden md:block text-xs text-slate-500 mt-0.5 m-0">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right controls: Date Filter, CSV Export, Quick Add */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {pageInfo.showDateFilter && (
          <div className="flex items-center gap-1 bg-slate-100/90 hover:bg-slate-100 px-2 sm:px-2.5 py-1.5 rounded-lg border border-slate-200/60 transition-colors">
            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-transparent text-[11px] sm:text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
              aria-label="Select date range"
            >
              {DATE_PERIODS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Primary Export to CSV on Dashboard, or secondary on other pages */}
        {pageInfo.showExport && (
          <Button
            variant={activeTab === 'dashboard' ? 'primary' : 'outline'}
            size="sm"
            onClick={handleExportCSV}
            icon={Download}
            className={`cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs'
                : 'hidden sm:inline-flex'
            }`}
            title="Parse localStorage and download .csv"
          >
            <span className="hidden xs:inline">Export</span> to CSV
          </Button>
        )}

        <PWAInstallButton variant="header" />

        <Button
          variant="primary"
          size="sm"
          onClick={() => openModal('transaction')}
          icon={Plus}
          className="shadow-xs font-bold"
        >
          <span className="hidden sm:inline">Add</span> Transaction
        </Button>
      </div>
    </header>
  );
};
