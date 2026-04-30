import React, { useState } from 'react';
import ExpenseItem from './ExpenseItem';
import { deleteExpense as deleteExpenseAPI } from '../services/api';

// Skeleton loader row
const SkeletonRow = () => (
  <div className="flex items-center px-5 py-4 animate-pulse">
    <div className="w-11 h-11 bg-white/[0.06] rounded-xl mr-4 shrink-0" />
    <div className="flex-1 space-y-2.5">
      <div className="h-3 bg-white/[0.06] rounded w-1/4" />
      <div className="h-3 bg-white/[0.04] rounded w-1/2" />
      <div className="h-2 bg-white/[0.03] rounded w-1/6" />
    </div>
    <div className="ml-4 w-16 h-5 bg-white/[0.06] rounded" />
  </div>
);

export default function ExpenseList({ expenses, loading, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const handleDelete = async (id) => {
    if (confirmId !== id) {
      setConfirmId(id);
      // Auto-cancel confirmation after 3s
      setTimeout(() => setConfirmId(null), 3000);
      return;
    }

    setDeleting(id);
    try {
      await deleteExpenseAPI(id);
      setConfirmId(null);
      onDelete();
    } catch (err) {
      console.error('Delete failed:', err.message);
    } finally {
      setDeleting(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="glass overflow-hidden animate-fade-in">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <div className="h-5 w-28 bg-white/[0.06] rounded animate-pulse" />
        </div>
        <div className="divide-y divide-white/[0.04]">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (expenses.length === 0) {
    return (
      <div className="glass p-14 text-center animate-scale-in">
        <div className="text-5xl mb-4">📭</div>
        <p className="text-gray-300 font-semibold text-lg">No expenses found</p>
        <p className="text-gray-600 text-sm mt-1">
          Add your first expense using the form
        </p>
      </div>
    );
  }

  return (
    <div className="glass overflow-hidden animate-slide-up">
      {/* List header */}
      <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">Transactions</h2>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.1))',
                       color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          {expenses.length} {expenses.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      {/* Delete confirmation banner */}
      {confirmId && (
        <div className="px-5 py-2.5 bg-rose-500/[0.08] border-b border-rose-500/20 flex items-center justify-between animate-slide-down">
          <span className="text-sm text-rose-400">Click delete again to confirm</span>
          <button onClick={() => setConfirmId(null)} className="text-xs text-gray-500 hover:text-gray-300">
            Cancel
          </button>
        </div>
      )}

      {/* Items */}
      <div className="divide-y divide-white/[0.04]">
        {expenses.map((expense, i) => (
          <ExpenseItem
            key={expense._id}
            expense={expense}
            index={i}
            onEdit={onEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
