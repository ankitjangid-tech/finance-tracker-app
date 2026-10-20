import React from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardView } from './components/dashboard/DashboardView';
import { TransactionsView } from './components/transactions/TransactionsView';
import { BudgetsView } from './components/budgets/BudgetsView';
import { SavingsGoalsView } from './components/goals/SavingsGoalsView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { TransactionModal } from './components/transactions/TransactionModal';
import { GoalContributionModal } from './components/goals/GoalContributionModal';

const AppContent = () => {
  const {
    activeTab,
    activeModal,
    closeModal,
    addTransaction,
    updateTransaction,
    contributeToGoal,
  } = useFinance();

  const handleSaveTransaction = (txData) => {
    if (txData.id) {
      updateTransaction(txData.id, txData);
    } else {
      addTransaction(txData);
    }
  };

  return (
    <AppLayout>
      {/* Tab Router */}
      {activeTab === 'dashboard' && <DashboardView />}
      {activeTab === 'transactions' && <TransactionsView />}
      {activeTab === 'budgets' && <BudgetsView />}
      {activeTab === 'goals' && <SavingsGoalsView />}
      {activeTab === 'reports' && <ReportsView />}
      {activeTab === 'settings' && <SettingsView />}

      {/* Global Transaction Modal */}
      <TransactionModal
        isOpen={activeModal.type === 'transaction'}
        onClose={closeModal}
        onSave={handleSaveTransaction}
        initialData={activeModal.data}
      />

      {/* Global Goal Contribution Modal */}
      <GoalContributionModal
        isOpen={activeModal.type === 'goalContribution'}
        onClose={closeModal}
        goal={activeModal.data}
        onContribute={contributeToGoal}
      />
    </AppLayout>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}
