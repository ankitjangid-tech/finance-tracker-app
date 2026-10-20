/**
 * Date utility helpers for Finora finance tracker.
 */

export const DATE_PERIODS = [
  { id: 'this_month', label: 'This Month' },
  { id: 'last_month', label: 'Last Month' },
  { id: 'last_3_months', label: 'Last 3 Months' },
  { id: 'this_year', label: 'This Year' },
  { id: 'all_time', label: 'All Time' },
];

/**
 * Format ISO or YYYY-MM-DD date into friendly readable format
 * e.g., "20 Oct 2026"
 */
export const formatDateFriendly = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Format date to standard ISO YYYY-MM-DD for form inputs
 */
export const toInputDateFormat = (d = new Date()) => {
  const date = d instanceof Date ? d : new Date(d);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get current year-month key "YYYY-MM"
 */
export const getCurrentMonthKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Format a YYYY-MM string to "October 2026"
 */
export const formatMonthLabel = (monthKey) => {
  if (!monthKey || !monthKey.includes('-')) return monthKey;
  const [year, month] = monthKey.split('-').map(Number);
  const d = new Date(year, month - 1, 1);
  return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
};

/**
 * Get date range bounds [startDate, endDate] for a given period ID
 * relative to reference date (default: now)
 */
export const getDateRangeForPeriod = (periodId, refDate = new Date()) => {
  const now = new Date(refDate);
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  switch (periodId) {
    case 'this_month': {
      const start = new Date(currentYear, currentMonth, 1);
      const end = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);
      return { start, end };
    }
    case 'last_month': {
      const start = new Date(currentYear, currentMonth - 1, 1);
      const end = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);
      return { start, end };
    }
    case 'last_3_months': {
      const start = new Date(currentYear, currentMonth - 2, 1);
      const end = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);
      return { start, end };
    }
    case 'this_year': {
      const start = new Date(currentYear, 0, 1);
      const end = new Date(currentYear, 11, 31, 23, 59, 59, 999);
      return { start, end };
    }
    case 'all_time':
    default:
      return { start: null, end: null };
  }
};

/**
 * Check if a date string falls inside the given period
 */
export const isDateInPeriod = (dateStr, periodId, refDate = new Date()) => {
  if (periodId === 'all_time') return true;
  const { start, end } = getDateRangeForPeriod(periodId, refDate);
  if (!start || !end) return true;

  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return false;
  // Normalize target time to midday to avoid timezone edge cases
  target.setHours(12, 0, 0, 0);

  return target >= start && target <= end;
};

/**
 * Check if a date string falls in a specific calendar month 'YYYY-MM'
 */
export const isDateInMonth = (dateStr, monthKey) => {
  if (!dateStr || !monthKey) return false;
  return dateStr.startsWith(monthKey);
};
