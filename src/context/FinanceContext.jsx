import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  STORAGE_KEYS,
  initializeStorage,
  loadFromStorage,
  saveToStorage,
  resetToDemoData,
  clearAllStorageData,
} from '../utils/storage';
import {
  getDemoTransactions,
  getDemoBudgets,
  getDemoSavingsGoals,
  getDemoSettings,
} from '../data/demoData';
import { isDateInPeriod, getCurrentMonthKey } from '../utils/dates';
import {
  calculateFinancialSummary,
  calculateCategoryBreakdown,
  calculateCashFlowSeries,
  calculateBudgetMetrics,
} from '../utils/financeCalculations';

// Initialize storage right away
initializeStorage();

const FinanceContext = createContext(null);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

// Reliable UUID generator
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
};

export const FinanceProvider = ({ children }) => {
  // Navigation & Filter state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthKey());

  // Modal & Toast state
  const [activeModal, setActiveModal] = useState({ type: null, data: null });
  const [toasts, setToasts] = useState([]);

  // Data state loaded from LocalStorage
  const [transactions, setTransactions] = useState(() =>
    loadFromStorage(STORAGE_KEYS.TRANSACTIONS, getDemoTransactions())
  );
  const [budgets, setBudgets] = useState(() =>
    loadFromStorage(STORAGE_KEYS.BUDGETS, getDemoBudgets())
  );
  const [savingsGoals, setSavingsGoals] = useState(() =>
    loadFromStorage(STORAGE_KEYS.GOALS, getDemoSavingsGoals())
  );
  const [settings, setSettings] = useState(() =>
    loadFromStorage(STORAGE_KEYS.SETTINGS, getDemoSettings())
  );

  // Sync to LocalStorage on change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
  }, [transactions]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.BUDGETS, budgets);
  }, [budgets]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.GOALS, savingsGoals);
  }, [savingsGoals]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SETTINGS, settings);
  }, [settings]);

  // Toast notifier
  const showToast = useCallback((toast) => {
    const id = generateId();
    setToasts((prev) => [...prev, { id, ...toast }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Modal helpers
  const openModal = useCallback((type, data = null) => {
    setActiveModal({ type, data });
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal({ type: null, data: null });
  }, []);

  // Transaction CRUD
  const addTransaction = useCallback(
    (txData) => {
      const now = new Date().toISOString();
      const newTx = {
        id: generateId(),
        date: txData.date,
        amount: Number(txData.amount) || 0,
        type: txData.type,
        category: txData.category,
        note: (txData.note || '').trim(),
        createdAt: now,
        updatedAt: now,
      };

      setTransactions((prev) => [newTx, ...prev]);
      showToast({
        title: 'Transaction Added',
        message: `${newTx.type === 'income' ? 'Income' : 'Expense'} of ₹${newTx.amount.toLocaleString('en-IN')} recorded.`,
        type: 'success',
      });
      return newTx;
    },
    [showToast]
  );

  const updateTransaction = useCallback(
    (id, updatedFields) => {
      let finalItem = null;
      setTransactions((prev) =>
        prev.map((t) => {
          if (t.id === id) {
            finalItem = {
              ...t,
              ...updatedFields,
              amount: Number(updatedFields.amount !== undefined ? updatedFields.amount : t.amount) || 0,
              updatedAt: new Date().toISOString(),
            };
            return finalItem;
          }
          return t;
        })
      );
      if (finalItem) {
        showToast({
          title: 'Transaction Updated',
          message: `${finalItem.category} updated to ₹${finalItem.amount.toLocaleString('en-IN')}.`,
          type: 'success',
        });
      }
    },
    [showToast]
  );

  const deleteTransaction = useCallback(
    (id) => {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      showToast({
        title: 'Transaction Deleted',
        message: 'Transaction removed from records.',
        type: 'info',
      });
    },
    [showToast]
  );

  // Budget CRUD
  const addBudget = useCallback(
    (budgetData) => {
      // Check for duplicate category
      const exists = budgets.some(
        (b) => b.category.toLowerCase() === budgetData.category.toLowerCase()
      );
      if (exists) {
        showToast({
          title: 'Budget Already Exists',
          message: `A budget for ${budgetData.category} is already configured. You can edit it instead.`,
          type: 'error',
        });
        return false;
      }

      const now = new Date().toISOString();
      const newBudget = {
        id: generateId(),
        category: budgetData.category,
        limit: Number(budgetData.limit) || 0,
        period: budgetData.period || 'monthly',
        createdAt: now,
        updatedAt: now,
      };

      setBudgets((prev) => [...prev, newBudget]);
      showToast({
        title: 'Budget Created',
        message: `Monthly budget of ₹${newBudget.limit.toLocaleString('en-IN')} set for ${newBudget.category}.`,
        type: 'success',
      });
      return true;
    },
    [budgets, showToast]
  );

  const updateBudget = useCallback(
    (id, updatedFields) => {
      setBudgets((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                ...updatedFields,
                limit: Number(updatedFields.limit !== undefined ? updatedFields.limit : b.limit) || 0,
                updatedAt: new Date().toISOString(),
              }
            : b
        )
      );
      showToast({
        title: 'Budget Updated',
        message: 'Budget limit updated successfully.',
        type: 'success',
      });
    },
    [showToast]
  );

  const deleteBudget = useCallback(
    (id) => {
      setBudgets((prev) => prev.filter((b) => b.id !== id));
      showToast({
        title: 'Budget Removed',
        message: 'Budget deleted.',
        type: 'info',
      });
    },
    [showToast]
  );

  // Savings Goal CRUD
  const addSavingsGoal = useCallback(
    (goalData) => {
      const now = new Date().toISOString();
      const newGoal = {
        id: generateId(),
        name: goalData.name.trim(),
        targetAmount: Number(goalData.targetAmount) || 0,
        currentAmount: Number(goalData.currentAmount) || 0,
        targetDate: goalData.targetDate || '',
        category: goalData.category || 'General',
        createdAt: now,
        updatedAt: now,
      };

      setSavingsGoals((prev) => [...prev, newGoal]);
      showToast({
        title: 'Savings Goal Created',
        message: `Goal "${newGoal.name}" targeting ₹${newGoal.targetAmount.toLocaleString('en-IN')} created.`,
        type: 'success',
      });
    },
    [showToast]
  );

  const updateSavingsGoal = useCallback(
    (id, updatedFields) => {
      setSavingsGoals((prev) =>
        prev.map((g) =>
          g.id === id
            ? {
                ...g,
                ...updatedFields,
                targetAmount: Number(updatedFields.targetAmount ?? g.targetAmount) || 0,
                currentAmount: Number(updatedFields.currentAmount ?? g.currentAmount) || 0,
                updatedAt: new Date().toISOString(),
              }
            : g
        )
      );
      showToast({
        title: 'Goal Updated',
        message: 'Goal details updated.',
        type: 'success',
      });
    },
    [showToast]
  );

  const deleteSavingsGoal = useCallback(
    (id) => {
      setSavingsGoals((prev) => prev.filter((g) => g.id !== id));
      showToast({
        title: 'Goal Deleted',
        message: 'Savings goal removed.',
        type: 'info',
      });
    },
    [showToast]
  );

  const contributeToGoal = useCallback(
    (id, deltaAmount, isWithdrawal = false) => {
      const amount = Math.abs(Number(deltaAmount) || 0);
      if (amount <= 0) return false;

      let goalUpdated = null;
      let reachedTarget = false;

      setSavingsGoals((prev) =>
        prev.map((g) => {
          if (g.id !== id) return g;
          let newAmount = isWithdrawal ? g.currentAmount - amount : g.currentAmount + amount;
          if (newAmount < 0) newAmount = 0;

          if (!isWithdrawal && g.currentAmount < g.targetAmount && newAmount >= g.targetAmount) {
            reachedTarget = true;
          }

          goalUpdated = {
            ...g,
            currentAmount: newAmount,
            updatedAt: new Date().toISOString(),
          };
          return goalUpdated;
        })
      );

      if (goalUpdated) {
        if (reachedTarget) {
          showToast({
            title: '🎉 Target Achieved!',
            message: `Congratulations! You reached 100% of your goal "${goalUpdated.name}"!`,
            type: 'success',
          });
        } else {
          showToast({
            title: isWithdrawal ? 'Funds Withdrawn' : 'Savings Contributed',
            message: `${isWithdrawal ? 'Withdrew' : 'Added'} ₹${amount.toLocaleString('en-IN')} ${isWithdrawal ? 'from' : 'to'} "${goalUpdated.name}".`,
            type: 'success',
          });
        }
        return true;
      }
      return false;
    },
    [showToast]
  );

  // Settings
  const updateSettings = useCallback(
    (newSettings) => {
      setSettings((prev) => ({ ...prev, ...newSettings }));
      showToast({
        title: 'Settings Saved',
        message: 'Preferences updated successfully.',
        type: 'success',
      });
    },
    [showToast]
  );

  // Reset actions
  const restoreDemo = useCallback(() => {
    const data = resetToDemoData();
    setTransactions(data.transactions);
    setBudgets(data.budgets);
    setSavingsGoals(data.goals);
    setSettings(data.settings);
    showToast({
      title: 'Demo Data Restored',
      message: 'Realistic transactions, budgets, and goals loaded.',
      type: 'info',
    });
  }, [showToast]);

  const clearAll = useCallback(() => {
    const data = clearAllStorageData();
    setTransactions(data.transactions);
    setBudgets(data.budgets);
    setSavingsGoals(data.goals);
    setSettings(data.settings);
    showToast({
      title: 'All Data Cleared',
      message: 'All records have been reset.',
      type: 'info',
    });
  }, [showToast]);

  // Derived filtered transactions based on selected period
  const periodTransactions = useMemo(() => {
    return transactions.filter((t) => isDateInPeriod(t.date, selectedPeriod));
  }, [transactions, selectedPeriod]);

  // Derived financial summary
  const summary = useMemo(() => {
    return calculateFinancialSummary(periodTransactions, transactions, settings.openingBalance);
  }, [periodTransactions, transactions, settings.openingBalance]);

  // Derived category breakdown
  const categoryBreakdown = useMemo(() => {
    return calculateCategoryBreakdown(periodTransactions);
  }, [periodTransactions]);

  // Derived cash flow series for charts
  const cashFlowSeries = useMemo(() => {
    return calculateCashFlowSeries(transactions);
  }, [transactions]);

  // Derived budget metrics for the selected month
  const budgetMetrics = useMemo(() => {
    return calculateBudgetMetrics(budgets, transactions, selectedMonth);
  }, [budgets, transactions, selectedMonth]);

  const value = {
    // State
    activeTab,
    setActiveTab,
    selectedPeriod,
    setSelectedPeriod,
    selectedMonth,
    setSelectedMonth,
    activeModal,
    openModal,
    closeModal,
    toasts,
    showToast,
    removeToast,
    // Data
    transactions,
    periodTransactions,
    budgets,
    savingsGoals,
    settings,
    summary,
    categoryBreakdown,
    cashFlowSeries,
    budgetMetrics,
    // CRUD
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addBudget,
    updateBudget,
    deleteBudget,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    contributeToGoal,
    updateSettings,
    restoreDemo,
    clearAll,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};
