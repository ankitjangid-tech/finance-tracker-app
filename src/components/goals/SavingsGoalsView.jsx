import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { GoalCard } from './GoalCard';
import { GoalModal } from './GoalModal';
import { GoalContributionModal } from './GoalContributionModal';
import { ConfirmModal } from '../ui/ConfirmModal';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { formatCurrency } from '../../utils/currency';
import { Target, Plus, Trophy, PiggyBank, Sparkles } from 'lucide-react';

export const SavingsGoalsView = () => {
  const {
    savingsGoals,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    contributeToGoal,
  } = useFinance();

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState(null);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [goalToContribute, setGoalToContribute] = useState(null);

  const handleOpenAdd = () => {
    setGoalToEdit(null);
    setIsGoalModalOpen(true);
  };

  const handleOpenEdit = (goal) => {
    setGoalToEdit(goal);
    setIsGoalModalOpen(true);
  };

  const handleSaveGoal = (goalData) => {
    if (goalData.id) {
      updateSavingsGoal(goalData.id, goalData);
    } else {
      addSavingsGoal(goalData);
    }
  };

  // High level metrics
  let totalTarget = 0;
  let totalCurrent = 0;
  let completedCount = 0;

  for (const g of savingsGoals) {
    const t = Number(g.targetAmount) || 0;
    const c = Number(g.currentAmount) || 0;
    totalTarget += t;
    totalCurrent += c;
    if (c >= t && t > 0) completedCount++;
  }

  const overallProgress =
    totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 m-0">Savings Goals</h2>
          <p className="text-xs text-slate-500 mt-0.5 m-0">
            Define financial milestones, track accumulation, and build wealth
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleOpenAdd} icon={Plus}>
          Create Savings Goal
        </Button>
      </div>

      {/* Top Aggregate Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Target</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900 mt-2">
            {formatCurrency(totalTarget)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Across {savingsGoals.length} goals</p>
        </Card>

        <Card padding="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Accumulated</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-emerald-600 mt-2">
            {formatCurrency(totalCurrent)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Total funded balance</p>
        </Card>

        <Card padding="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Overall Progress</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-indigo-600 mt-2">
            {overallProgress}%
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {formatCurrency(Math.max(0, totalTarget - totalCurrent))} remaining
          </p>
        </Card>

        <Card padding="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Completed Goals</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-amber-600 mt-2">
            {completedCount} of {savingsGoals.length}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Milestones fully reached</p>
        </Card>
      </div>

      {/* Goals Grid */}
      {!savingsGoals.length ? (
        <EmptyState
          icon={Target}
          title="No savings goals created yet"
          description="Create savings targets for emergency funds, vacations, or new equipment to track your savings journey."
          actionLabel="Create Savings Goal"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savingsGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleOpenEdit}
              onDelete={setGoalToDelete}
              onContribute={setGoalToContribute}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSave={handleSaveGoal}
        initialData={goalToEdit}
      />

      <GoalContributionModal
        isOpen={Boolean(goalToContribute)}
        onClose={() => setGoalToContribute(null)}
        goal={goalToContribute}
        onContribute={contributeToGoal}
      />

      <ConfirmModal
        isOpen={Boolean(goalToDelete)}
        onClose={() => setGoalToDelete(null)}
        onConfirm={() => {
          if (goalToDelete) {
            deleteSavingsGoal(goalToDelete.id);
            setGoalToDelete(null);
          }
        }}
        title="Delete Savings Goal?"
        message={`Are you sure you want to delete "${goalToDelete?.name}"? All tracked savings progress for this goal will be removed.`}
        confirmLabel="Delete Goal"
        confirmVariant="danger"
      />
    </div>
  );
};
