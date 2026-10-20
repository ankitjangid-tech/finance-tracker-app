import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../data/categories';
import { suggestCategory } from '../../utils/categorization';
import { toInputDateFormat } from '../../utils/dates';
import { Sparkles, Check, Edit2 } from 'lucide-react';

export const TransactionModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
}) => {
  const isEditing = Boolean(initialData && initialData.id);

  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(toInputDateFormat());
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({});
  const [suggested, setSuggested] = useState(null);
  const [hasManuallySelectedCategory, setHasManuallySelectedCategory] = useState(false);

  // Sync state when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setType(initialData.type || 'expense');
        setAmount(String(initialData.amount || ''));
        setDate(initialData.date ? initialData.date.split('T')[0] : toInputDateFormat());
        setCategory(initialData.category || '');
        setNote(initialData.note || '');
        setHasManuallySelectedCategory(true);
      } else {
        setType('expense');
        setAmount('');
        setDate(toInputDateFormat());
        setCategory(EXPENSE_CATEGORIES[0].name);
        setNote('');
        setHasManuallySelectedCategory(false);
      }
      setErrors({});
      setSuggested(null);
    }
  }, [isOpen, initialData]);

  // When note or type changes, evaluate smart categorization (only for new transactions)
  useEffect(() => {
    if (!isOpen || isEditing) return;

    if (note && note.length >= 2) {
      const match = suggestCategory(note, type);
      if (match && match.category !== category) {
        setSuggested(match);
        // If the user hasn't explicitly chosen a category yet, auto-suggest it
        if (!hasManuallySelectedCategory) {
          setCategory(match.category);
        }
      } else {
        setSuggested(null);
      }
    } else {
      setSuggested(null);
    }
  }, [note, type, category, hasManuallySelectedCategory, isEditing, isOpen]);

  // Handle Type switch
  const handleTypeChange = (newType) => {
    setType(newType);
    const categories = newType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    setCategory(categories[0].name);
    setHasManuallySelectedCategory(true);
    setSuggested(null);
  };

  const validate = () => {
    const newErrors = {};
    const numAmount = Number(amount);

    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Please enter a valid positive amount greater than 0';
    }
    if (!date) {
      newErrors.date = 'Please select a valid date';
    }
    if (!category) {
      newErrors.category = 'Please choose a category';
    }
    if (!note.trim()) {
      newErrors.note = 'Please enter a description or note';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id: initialData?.id,
      type,
      amount: Number(amount),
      date,
      category,
      note: note.trim(),
    });

    onClose();
  };

  const applySuggestedCategory = () => {
    if (suggested) {
      setCategory(suggested.category);
      setHasManuallySelectedCategory(true);
      setSuggested(null);
    }
  };

  // Ensure category is always included in options even if custom
  const availableCategories = useMemo(() => {
    const base = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    if (category && !base.some((c) => c.name.toLowerCase() === category.toLowerCase())) {
      return [{ id: category, name: category }, ...base];
    }
    return base;
  }, [type, category]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Transaction' : 'Record Transaction'}
      subtitle={
        isEditing
          ? 'Update the amount, category, date, or note for this transaction'
          : 'Add a new income or expense to your financial ledger'
      }
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Edit Mode Notice Banner */}
        {isEditing && (
          <div className="p-2.5 bg-blue-50 border border-blue-200/80 rounded-xl flex items-center gap-2 text-xs text-blue-800">
            <Edit2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              You are editing an existing record. Changes update all dashboard totals instantly.
            </span>
          </div>
        )}

        {/* Transaction Type Segmented Toggle */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Transaction Type
          </label>
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                type === 'expense'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Income
            </button>
          </div>
        </div>

        {/* Amount Input */}
        <Input
          label="Amount"
          type="number"
          step="any"
          prefix="₹"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={errors.amount}
          required
        />

        {/* Category Select */}
        <Select
          label="Category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setHasManuallySelectedCategory(true);
          }}
          options={availableCategories.map((c) => ({ value: c.name, label: c.name }))}
          error={errors.category}
          required
        />

        {/* Date Input */}
        <Input
          label="Transaction Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          error={errors.date}
          required
        />

        {/* Note / Description */}
        <Input
          label="Description / Note"
          placeholder={
            type === 'expense'
              ? 'e.g., Blinkit groceries, Swiggy dinner, Uber cab'
              : 'e.g., Monthly salary, Client invoice, Dividend'
          }
          value={note}
          onChange={(e) => setNote(e.target.value)}
          error={errors.note}
          required
        />

        {/* Smart Suggestion Notification (Only when adding) */}
        {!isEditing && suggested && suggested.category !== category && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center justify-between gap-2 text-xs animate-in fade-in duration-150">
            <div className="flex items-center gap-2 text-emerald-800">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Smart match: <strong>{suggested.category}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={applySuggestedCategory}
              className="text-[11px] font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Check className="w-3 h-3" />
              Apply
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit">
            {isEditing ? 'Update Transaction' : 'Record Transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
