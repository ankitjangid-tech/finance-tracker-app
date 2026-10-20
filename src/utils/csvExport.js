import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

/**
 * RFC 4180 compliant CSV export utility with UTF-8 BOM
 * Compatible with Excel, Google Sheets, Numbers, and LibreOffice.
 * Supports Native Android/iOS via Capacitor Filesystem + Share Sheet,
 * Web Share API on mobile browsers, and direct anchor download on desktop.
 */

/**
 * Escape a single CSV cell value
 */
const escapeCell = (val) => {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  // If string contains comma, quote, or newline, wrap in quotes and escape quotes
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
};

/**
 * Trigger file download via a temporary anchor (Desktop browser fallback)
 */
const triggerDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
};

/**
 * Deliver CSV file using the best available platform mechanism:
 * 1. Native Capacitor (Android APK / iOS): writes file and opens Android share dialog (Sheets, WhatsApp, Drive, Save to device)
 * 2. Web Share API (Mobile Browsers): shares CSV file directly
 * 3. Standard anchor download (Desktop browsers)
 */
const deliverCSV = async (csvContent, filename) => {
  const fullContent = '\uFEFF' + csvContent;

  // 1. Capacitor Native Platform (Android / iOS app)
  if (Capacitor.isNativePlatform()) {
    try {
      const fileResult = await Filesystem.writeFile({
        path: filename,
        data: fullContent,
        directory: Directory.Cache,
        encoding: Encoding.UTF8
      });

      await Share.share({
        title: filename,
        text: `Finora export: ${filename}`,
        url: fileResult.uri,
        dialogTitle: 'Save or Share CSV'
      });

      return { method: 'native-share', uri: fileResult.uri };
    } catch (err) {
      console.warn('Native Capacitor share failed, attempting fallback:', err);
    }
  }

  // 2. Web Share API fallback (if supported and can share files)
  if (typeof navigator !== 'undefined' && navigator.share && typeof File !== 'undefined') {
    try {
      const blob = new Blob([fullContent], { type: 'text/csv;charset=utf-8;' });
      const file = new File([blob], filename, { type: 'text/csv;charset=utf-8;' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: filename,
          text: `Finora export: ${filename}`
        });
        return { method: 'web-share' };
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn('Web Share API failed, falling back to download:', err);
      } else {
        return { method: 'web-share-cancelled' };
      }
    }
  }

  // 3. Desktop / Browser download fallback
  const blob = new Blob([fullContent], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, filename);
  return { method: 'browser-download' };
};

/**
 * Export transactions to CSV
 * @param {Array} transactions
 * @param {string} suffix - optional filename suffix
 */
export const exportTransactionsToCSV = async (transactions = [], suffix = '') => {
  if (!transactions || transactions.length === 0) {
    return { success: false, message: 'No transactions available to export.' };
  }

  const headers = ['ID', 'Date', 'Amount', 'Type', 'Category', 'Note', 'Created At'];
  const rows = transactions.map((t) => [
    t.id,
    t.date,
    t.amount,
    t.type,
    t.category,
    t.note || '',
    t.createdAt || ''
  ]);

  const csvContent = [
    headers.map(escapeCell).join(','),
    ...rows.map((row) => row.map(escapeCell).join(','))
  ].join('\r\n');

  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `finora-transactions${suffix ? `-${suffix}` : ''}-${dateStr}.csv`;

  await deliverCSV(csvContent, filename);
  return { success: true, count: transactions.length, filename };
};

/**
 * Export budgets to CSV
 */
export const exportBudgetsToCSV = async (budgets = []) => {
  if (!budgets || budgets.length === 0) {
    return { success: false, message: 'No budgets available to export.' };
  }

  const headers = ['ID', 'Category', 'Monthly Limit (INR)', 'Period'];
  const rows = budgets.map((b) => [b.id, b.category, b.limit, b.period]);

  const csvContent = [
    headers.map(escapeCell).join(','),
    ...rows.map((row) => row.map(escapeCell).join(','))
  ].join('\r\n');

  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `finora-budgets-${dateStr}.csv`;

  await deliverCSV(csvContent, filename);
  return { success: true, count: budgets.length, filename };
};

/**
 * Export savings goals to CSV
 */
export const exportGoalsToCSV = async (goals = []) => {
  if (!goals || goals.length === 0) {
    return { success: false, message: 'No savings goals available to export.' };
  }

  const headers = ['ID', 'Goal Name', 'Category', 'Target Amount (INR)', 'Current Amount (INR)', 'Target Date', 'Completion %'];
  const rows = goals.map((g) => {
    const pct = g.targetAmount > 0 ? Math.round((g.currentAmount / g.targetAmount) * 100) : 0;
    return [g.id, g.name, g.category || 'General', g.targetAmount, g.currentAmount, g.targetDate || '', `${pct}%`];
  });

  const csvContent = [
    headers.map(escapeCell).join(','),
    ...rows.map((row) => row.map(escapeCell).join(','))
  ].join('\r\n');

  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `finora-savings-goals-${dateStr}.csv`;

  await deliverCSV(csvContent, filename);
  return { success: true, count: goals.length, filename };
};
