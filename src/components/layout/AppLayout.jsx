import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { MobileDrawer } from './MobileDrawer';
import { Header } from './Header';
import { ToastContainer } from '../ui/Toast';
import { useFinance } from '../../context/FinanceContext';
import { OfflineIndicator } from '../pwa/OfflineIndicator';

export const AppLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toasts, removeToast } = useFinance();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Desktop fixed sidebar */}
      <Sidebar className="hidden lg:flex" />

      {/* Mobile drawer */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main flexible content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <OfflineIndicator />
        <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* Notification toasts */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
