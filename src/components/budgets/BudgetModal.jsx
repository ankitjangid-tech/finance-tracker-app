import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { EXPENSE_CATEGORIES } from '../../data/categories';

export const BudgetModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  existingBudgets = [],
}) => {
  const isEditing = Boolean(initialData && initialData.id);

  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setCategory(initialData.category || '');
        setLimit(String(initialData.limit || ''));
      } else {
        // Find first expense category not yet budgeted
        const budgetedCats = new Set(existingBudgets.map((b) => b.category.toLowerCase()));
        const available = EXPENSE_CATEGORIES.find(
          (c) => !budgetedCats.has(c.name.toLowerCase())
        );
        setCategory(available ? available.name : EXPENSE_CATEGORIES[0].name);
        setLimit('');
      }
      setErrors({});
    }
  }, [isOpen, initialData, existingBudgets]);

  const validate = () => {
    const newErrors = {};
    const numLimit = Number(limit);

    if (!limit || isNaN(numLimit) || numLimit <= 0) {
      newErrors.limit = 'Please enter a valid monthly limit greater than 0';
    }
    if (!category) {
      newErrors.category = 'Please choose an expense category';
    }

    // Duplicate check if adding
    if (!isEditing) {
      const isDuplicate = existingBudgets.some(
        (b) => b.category.toLowerCase() === category.toLowerCase()
      );
      if (isDuplicate) {
        newErrors.category = `A budget for ${category} already exists.`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id: initialData?.id,
      category,
      limit: Number(limit),
      period: 'monthly',
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit ${initialData?.category} Budget` : 'Create Category Budget'}
      subtitle="Set monthly spending thresholds to protect your cash reserves"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category */}
        <Select
          label="Expense Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={EXPENSE_CATEGORIES.map((c) => ({ value: c.name, label: c.name }))}
          error={errors.category}
          disabled={isEditing}
          required
        />

        {/* Monthly Limit */}
        <Input
          label="Monthly Spending Limit"
          type="number"
          step="any"
          prefix="₹"
          placeholder="e.g., 10000"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          error={errors.limit}
          helperText="Maximum allowed spending for this category in a calendar month."
          required
        />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit">
            {isEditing ? 'Save Changes' : 'Create Budget'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
