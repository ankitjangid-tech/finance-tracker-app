import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Card, CardHeader } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ConfirmModal } from '../ui/ConfirmModal';
import { formatCurrency } from '../../utils/currency';
import {
  exportTransactionsToCSV,
  exportBudgetsToCSV,
  exportGoalsToCSV,
} from '../../utils/csvExport';
import { getStorageStats } from '../../utils/storage';
import { Select } from '../ui/Select';
import {
  ShieldCheck,
  Download,
  RotateCcw,
  Trash2,
  Coins,
  CheckCircle,
  Smartphone,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const SettingsView = () => {
  const { isStandalone, isOnline } = usePWAInstall();
  const {
    settings,
    updateSettings,
    transactions,
    budgets,
    savingsGoals,
    restoreDemo,
    clearAll,
    showToast,
  } = useFinance();

  const [openingBalance, setOpeningBalance] = useState(
    String(settings.openingBalance || 0)
  );
  const [dateFormat, setDateFormat] = useState(settings.dateFormat || 'DD/MM/YYYY');
  const [isSaved, setIsSaved] = useState(false);

  // Modals for confirmation
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  const storageStats = getStorageStats();

  const handleSavePreferences = (e) => {
    e.preventDefault();
    const num = Number(openingBalance) || 0;
    updateSettings({
      openingBalance: num,
      dateFormat,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleExportAll = async () => {
    const res = await exportTransactionsToCSV(transactions, 'all');
    if (res.success) {
      showToast({
        title: 'All Transactions Exported',
        message: `Saved ${res.count} transactions to ${res.filename}`,
        type: 'success',
      });
    }
  };

  const handleExportBudgets = async () => {
    const res = await exportBudgetsToCSV(budgets);
    if (res.success) {
      showToast({
        title: 'Budgets Exported',
        message: `Exported ${res.count} monthly budgets.`,
        type: 'success',
      });
    }
  };

  const handleExportGoals = async () => {
    const res = await exportGoalsToCSV(savingsGoals);
    if (res.success) {
      showToast({
        title: 'Savings Goals Exported',
        message: `Exported ${res.count} savings goals.`,
        type: 'success',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-lg font-bold text-slate-900 m-0">Settings & Data Management</h2>
        <p className="text-xs text-slate-500 mt-0.5 m-0">
          Configure financial baselines, manage browser storage, and export ledger archives
        </p>
      </div>

      {/* Financial Preferences Card */}
      <Card>
        <CardHeader
          title="Financial Preferences"
          subtitle="Configure default balances and regional currency settings"
        />

        <form onSubmit={handleSavePreferences} className="space-y-4 max-w-md">
          <Input
            label="Initial Opening Balance"
            type="number"
            step="any"
            prefix="₹"
            placeholder="0"
            value={openingBalance}
            onChange={(e) => setOpeningBalance(e.target.value)}
            helperText="Starting balance before any transactions. Included in Total Balance on Dashboard."
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Default Currency Display
            </label>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-900">
                  Indian Rupee (INR - ₹)
                </span>
              </div>
              <span className="text-slate-500 font-medium">Lakhs & Crores Format</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Format preview: {formatCurrency(125000)}
            </p>
          </div>

          <Select
            label="Date Display Format"
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
            options={[
              { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (e.g., 20/10/2026)' },
              { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (e.g., 10/20/2026)' },
              { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (e.g., 2026-10-20)' },
            ]}
          />

          <div className="pt-2">
            <Button
              variant="primary"
              size="sm"
              type="submit"
              icon={isSaved ? CheckCircle : undefined}
            >
              {isSaved ? 'Preferences Saved!' : 'Save Financial Preferences'}
            </Button>
          </div>
        </form>
      </Card>

      {/* CSV Data Exports */}
      <Card>
        <CardHeader
          title="Data Export & Backups"
          subtitle="Download RFC 4180 compliant CSV archives formatted for Excel & Google Sheets"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Transactions Ledger</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {transactions.length} records in history
              </p>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={handleExportAll}
              icon={Download}
              className="mt-3 w-full"
            >
              Export CSV
            </Button>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Category Budgets</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {budgets.length} configured budgets
              </p>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={handleExportBudgets}
              icon={Download}
              className="mt-3 w-full"
            >
              Export CSV
            </Button>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Savings Goals</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {savingsGoals.length} tracked targets
              </p>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={handleExportGoals}
              icon={Download}
              className="mt-3 w-full"
            >
              Export CSV
            </Button>
          </div>
        </div>
      </Card>

      {/* Progressive Web App (PWA) & Offline Experience */}
      <Card>
        <CardHeader
          title="Progressive Web App (PWA) & Offline Access"
          subtitle="Install Finora to your home screen or desktop for fast, offline-ready financial tracking"
        />

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 text-xs">
            <div>
              <span className="text-slate-400 font-medium text-[11px]">Installation State</span>
              <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                {isStandalone ? 'Installed (Standalone)' : 'Running in Browser'}
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium text-[11px]">Network Status</span>
              <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-1.5">
                {isOnline ? (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-amber-700">Offline (Local Mode)</span>
                  </>
                )}
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium text-[11px]">Service Worker Cache</span>
              <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Precached (Workbox)</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <p className="text-xs text-slate-500 max-w-xl">
              When installed, Finora opens instantly with zero browser address bar distractions. All offline transactions, budget alterations, and CSV exports remain fully operational.
            </p>
            <PWAInstallButton variant="settings" />
          </div>
        </div>
      </Card>

      {/* LocalStorage Inspector & Data Reset */}
      <Card>
        <CardHeader
          title="Browser Storage & Data Management"
          subtitle="All application records reside exclusively inside your current browser"
        />

        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 text-xs">
            <div>
              <span className="text-slate-400 font-medium text-[11px]">Storage Engine</span>
              <p className="font-bold text-slate-800 mt-0.5">LocalStorage v1</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium text-[11px]">Transactions</span>
              <p className="font-bold text-slate-800 mt-0.5">{transactions.length}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium text-[11px]">Budgets / Goals</span>
              <p className="font-bold text-slate-800 mt-0.5">{budgets.length} / {savingsGoals.length}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium text-[11px]">Storage Footprint</span>
              <p className="font-bold text-emerald-600 mt-0.5">~{storageStats.sizeKB} KB</p>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200/60 rounded-xl flex items-start gap-3 text-xs text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">100% Private & Device-Local</p>
              <p className="text-emerald-700 leading-relaxed">
                Finora does not transmit your financial transactions to any remote server or third-party database. All calculations, categorizations, and records execute strictly in your local browser environment.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRestoreModal(true)}
              icon={RotateCcw}
            >
              Restore Realistic Demo Data
            </Button>

            <Button
              variant="dangerOutline"
              size="sm"
              onClick={() => setShowClearModal(true)}
              icon={Trash2}
            >
              Reset All Application Data
            </Button>
          </div>
        </div>
      </Card>

      {/* Restore Demo Confirmation */}
      <ConfirmModal
        isOpen={showRestoreModal}
        onClose={() => setShowRestoreModal(false)}
        onConfirm={() => {
          restoreDemo();
          setShowRestoreModal(false);
        }}
        title="Restore Demo Data?"
        message="This will overwrite current records with realistic Indian sample transactions, budgets, and savings goals. Are you sure?"
        confirmLabel="Restore Demo Data"
        confirmVariant="primary"
      />

      {/* Clear All Confirmation */}
      <ConfirmModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={() => {
          clearAll();
          setShowClearModal(false);
        }}
        title="Reset All Application Data?"
        message="Are you sure you want to permanently clear all stored transactions, budgets, and savings goals? This action cannot be undone."
        confirmLabel="Clear Everything"
        confirmVariant="danger"
      />
    </div>
  );
};
