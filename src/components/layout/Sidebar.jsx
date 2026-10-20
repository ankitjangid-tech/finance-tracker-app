import React from 'react';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Target,
  BarChart3,
  Settings,
  ShieldCheck,
  PlusCircle,
  Database,
} from 'lucide-react';
import { BRANDING } from '../../config/branding';
import { useFinance } from '../../context/FinanceContext';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'budgets', label: 'Budgets', icon: PieChart },
  { id: 'goals', label: 'Savings Goals', icon: Target },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar = ({ className = '', onItemClick }) => {
  const { activeTab, setActiveTab, openModal, transactions } = useFinance();

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (onItemClick) onItemClick();
  };

  return (
    <aside
      className={`w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 h-screen select-none ${className}`}
    >
      {/* Top brand header */}
      <div>
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black shadow-xs">
              <span className="text-base tracking-tighter">₹</span>
            </div>
            <div>
              <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                {BRANDING.name}
              </span>
              <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/50">
                MVP
              </span>
            </div>
          </div>
        </div>

        {/* Quick Add CTA in Sidebar */}
        <div className="px-4 pt-4 pb-2">
          <button
            onClick={() => openModal('transaction')}
            className="w-full flex items-center justify-center gap-2 py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all duration-150 cursor-pointer active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>

        {/* Navigation list */}
        <nav className="px-3 py-3 space-y-1">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer text-left ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 font-semibold shadow-xs border border-emerald-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span className="flex-1">{item.label}</span>
                {item.id === 'transactions' && transactions.length > 0 && (
                  <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                    {transactions.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* PWA Install Banner */}
      <PWAInstallButton variant="sidebar" />

      {/* Bottom info section */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2.5 text-xs text-slate-500 mb-2">
          <Database className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium">Local Browser Storage</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50/80 px-2.5 py-1.5 rounded-md border border-emerald-200/50 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Offline ready & 100% Private</span>
        </div>
      </div>
    </aside>
  );
};
