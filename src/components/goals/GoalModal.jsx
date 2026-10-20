import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

const GOAL_CATEGORIES = [
  'Emergency Fund',
  'Real Estate',
  'Vehicle',
  'Travel',
  'Gadgets',
  'Education',
  'Investments',
  'Retirement',
  'Wedding',
  'General',
];

export const GoalModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
}) => {
  const isEditing = Boolean(initialData && initialData.id);

  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState(GOAL_CATEGORIES[0]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || '');
        setTargetAmount(String(initialData.targetAmount || ''));
        setCurrentAmount(String(initialData.currentAmount || '0'));
        setTargetDate(initialData.targetDate || '');
        setCategory(initialData.category || GOAL_CATEGORIES[0]);
      } else {
        setName('');
        setTargetAmount('');
        setCurrentAmount('0');
        setTargetDate('');
        setCategory(GOAL_CATEGORIES[0]);
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validate = () => {
    const newErrors = {};
    const numTarget = Number(targetAmount);
    const numCurrent = Number(currentAmount);

    if (!name.trim()) {
      newErrors.name = 'Please enter a name for this goal';
    }
    if (!targetAmount || isNaN(numTarget) || numTarget <= 0) {
      newErrors.targetAmount = 'Target amount must be a positive number';
    }
    if (isNaN(numCurrent) || numCurrent < 0) {
      newErrors.currentAmount = 'Current savings cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id: initialData?.id,
      name: name.trim(),
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount) || 0,
      targetDate,
      category,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Savings Goal' : 'Create Savings Goal'}
      subtitle="Set a financial milestone and track your accumulation progress"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Goal Name */}
        <Input
          label="Goal Name"
          placeholder="e.g., Emergency Fund, Japan Trip, Down Payment"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          required
        />

        {/* Category */}
        <Select
          label="Goal Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={GOAL_CATEGORIES.map((c) => ({ value: c, label: c }))}
        />

        {/* Target Amount */}
        <Input
          label="Target Amount"
          type="number"
          step="any"
          prefix="₹"
          placeholder="e.g., 200000"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          error={errors.targetAmount}
          required
        />

        {/* Current Starting Amount */}
        <Input
          label="Current Savings (Optional)"
          type="number"
          step="any"
          prefix="₹"
          placeholder="0"
          value={currentAmount}
          onChange={(e) => setCurrentAmount(e.target.value)}
          error={errors.currentAmount}
          helperText="Amount already accumulated towards this goal."
        />

        {/* Target Date */}
        <Input
          label="Target Completion Date (Optional)"
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          helperText="Desired timeline to complete this savings target."
        />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit">
            {isEditing ? 'Save Goal' : 'Create Goal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
