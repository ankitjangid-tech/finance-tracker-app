/**
 * Versioned LocalStorage persistence layer with error handling and fallback sanity.
 */
import {
  getDemoTransactions,
  getDemoBudgets,
  getDemoSavingsGoals,
  getDemoSettings,
} from '../data/demoData';

export const STORAGE_KEYS = {
  TRANSACTIONS: 'finora_transactions_v1',
  BUDGETS: 'finora_budgets_v1',
  GOALS: 'finora_savings_goals_v1',
  SETTINGS: 'finora_settings_v1',
};

/**
 * Safely parse JSON from localStorage
 */
export const loadFromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    const parsed = JSON.parse(raw);
    return parsed !== null ? parsed : fallback;
  } catch (err) {
    console.error(`[Finora Storage] Error reading key "${key}":`, err);
    return fallback;
  }
};

/**
 * Safely write JSON to localStorage
 */
export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`[Finora Storage] Error saving key "${key}":`, err);
    return false;
  }
};

/**
 * Initialize storage with seed data if keys don't exist yet
 */
export const initializeStorage = () => {
  const hasTransactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) !== null;
  const hasBudgets = localStorage.getItem(STORAGE_KEYS.BUDGETS) !== null;
  const hasGoals = localStorage.getItem(STORAGE_KEYS.GOALS) !== null;
  const hasSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS) !== null;

  if (!hasTransactions) {
    saveToStorage(STORAGE_KEYS.TRANSACTIONS, getDemoTransactions());
  }
  if (!hasBudgets) {
    saveToStorage(STORAGE_KEYS.BUDGETS, getDemoBudgets());
  }
  if (!hasGoals) {
    saveToStorage(STORAGE_KEYS.GOALS, getDemoSavingsGoals());
  }
  if (!hasSettings) {
    saveToStorage(STORAGE_KEYS.SETTINGS, getDemoSettings());
  }
};

/**
 * Restore realistic seed demo data
 */
export const resetToDemoData = () => {
  const transactions = getDemoTransactions();
  const budgets = getDemoBudgets();
  const goals = getDemoSavingsGoals();
  const settings = getDemoSettings();

  saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
  saveToStorage(STORAGE_KEYS.BUDGETS, budgets);
  saveToStorage(STORAGE_KEYS.GOALS, goals);
  saveToStorage(STORAGE_KEYS.SETTINGS, settings);

  return { transactions, budgets, goals, settings };
};

/**
 * Completely wipe all Finora data
 */
export const clearAllStorageData = () => {
  const emptyTransactions = [];
  const emptyBudgets = [];
  const emptyGoals = [];
  const defaultSettings = {
    openingBalance: 0,
    currency: 'INR',
    currencySymbol: '₹',
    dateFormat: 'DD/MM/YYYY',
    isDemoActive: false,
  };

  saveToStorage(STORAGE_KEYS.TRANSACTIONS, emptyTransactions);
  saveToStorage(STORAGE_KEYS.BUDGETS, emptyBudgets);
  saveToStorage(STORAGE_KEYS.GOALS, emptyGoals);
  saveToStorage(STORAGE_KEYS.SETTINGS, defaultSettings);

  return {
    transactions: emptyTransactions,
    budgets: emptyBudgets,
    goals: emptyGoals,
    settings: defaultSettings,
  };
};

/**
 * Get storage usage stats for Settings page
 */
export const getStorageStats = () => {
  let totalChars = 0;
  for (const key of Object.values(STORAGE_KEYS)) {
    const item = localStorage.getItem(key);
    if (item) totalChars += item.length;
  }
  const kb = (totalChars * 2) / 1024; // approx UTF-16 bytes
  return {
    sizeKB: Math.round(kb * 10) / 10,
    keys: Object.values(STORAGE_KEYS),
  };
};
