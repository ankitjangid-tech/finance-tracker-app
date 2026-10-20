/**
 * Utilities for formatting currency with Indian numbering system (Lakhs, Crores).
 */

const defaultLocale = 'en-IN';
const defaultCurrency = 'INR';

/**
 * Format a number as Indian Rupee (e.g., ₹1,25,000.00)
 * @param {number} amount
 * @param {object} options
 * @returns {string}
 */
export const formatCurrency = (amount, options = {}) => {
  const num = Number(amount) || 0;
  const {
    decimals = 2,
    hideSymbol = false,
    compact = false,
  } = options;

  if (compact && Math.abs(num) >= 10000000) {
    // Crores
    const cr = (num / 10000000).toFixed(2);
    return `${hideSymbol ? '' : '₹'}${cr} Cr`;
  }
  if (compact && Math.abs(num) >= 100000) {
    // Lakhs
    const l = (num / 100000).toFixed(2);
    return `${hideSymbol ? '' : '₹'}${l} L`;
  }

  try {
    const formatter = new Intl.NumberFormat(defaultLocale, {
      style: hideSymbol ? 'decimal' : 'currency',
      currency: defaultCurrency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return formatter.format(num);
  } catch {
    return `${hideSymbol ? '' : '₹'}${num.toFixed(decimals)}`;
  }
};

/**
 * Format transaction amount with sign (+ for income, - for expense)
 * @param {number} amount
 * @param {'income'|'expense'} type
 * @returns {{ text: string, isPositive: boolean }}
 */
export const formatSignedCurrency = (amount, type = 'expense') => {
  const num = Math.abs(Number(amount) || 0);
  const formatted = formatCurrency(num);
  if (type === 'income') {
    return {
      text: `+${formatted}`,
      isPositive: true,
      colorClass: 'text-emerald-600',
    };
  }
  return {
    text: `-${formatted}`,
    isPositive: false,
    colorClass: 'text-rose-600',
  };
};
