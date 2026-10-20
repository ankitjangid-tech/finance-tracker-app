import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/currency';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export const GoalContributionModal = ({
  isOpen,
  onClose,
  goal,
  onContribute,
}) => {
  const [mode, setMode] = useState('deposit'); // 'deposit' | 'withdraw'
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMode('deposit');
      setAmount('');
      setError('');
    }
  }, [isOpen]);

  if (!goal) return null;

  const currentSavings = Number(goal.currentAmount) || 0;
  const numAmount = Number(amount) || 0;
  const projectedBalance =
    mode === 'deposit'
      ? currentSavings + numAmount
      : Math.max(0, currentSavings - numAmount);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid positive amount');
      return;
    }

    if (mode === 'withdraw' && numAmount > currentSavings) {
      setError(`Cannot withdraw more than current balance of ${formatCurrency(currentSavings)}`);
      return;
    }

    const success = onContribute(goal.id, numAmount, mode === 'withdraw');
    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${mode === 'deposit' ? 'Add Funds to' : 'Withdraw from'} ${goal.name}`}
      subtitle="Adjust your savings goal progress balance"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mode selector */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl gap-1">
          <button
            type="button"
            onClick={() => {
              setMode('deposit');
              setError('');
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'deposit'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowDownRight className="w-3.5 h-3.5" />
            Deposit Funds
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('withdraw');
              setError('');
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'withdraw'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            Withdraw Funds
          </button>
        </div>

        {/* Current status display */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 font-medium">Current Balance</span>
            <p className="text-sm font-bold text-slate-900">{formatCurrency(currentSavings)}</p>
          </div>
          <div className="text-right">
            <span className="text-slate-500 font-medium">Target</span>
            <p className="text-sm font-bold text-indigo-600">{formatCurrency(goal.targetAmount)}</p>
          </div>
        </div>

        {/* Amount Input */}
        <Input
          label={mode === 'deposit' ? 'Deposit Amount' : 'Withdrawal Amount'}
          type="number"
          step="any"
          prefix="₹"
          placeholder="e.g., 5000"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setError('');
          }}
          error={error}
          required
        />

        {/* Projected balance preview */}
        {numAmount > 0 && (
          <div className="p-2.5 bg-slate-100/70 rounded-lg text-xs flex justify-between items-center text-slate-600">
            <span>Projected New Balance:</span>
            <span className="font-bold text-slate-900">{formatCurrency(projectedBalance)}</span>
          </div>
        )}

        <p className="text-[11px] text-slate-400 italic">
          Note: Goal contributions are independent planning balances and do not automatically debit external bank accounts.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={mode === 'deposit' ? 'primary' : 'secondary'}
            size="sm"
            type="submit"
          >
            {mode === 'deposit' ? 'Confirm Deposit' : 'Confirm Withdrawal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
