import React from 'react';
import ExpenseItem from './ExpenseItem';

// Skeleton loader row
const SkeletonRow = () => (
  <div className="flex items-center px-5 py-3.5 animate-pulse">
    <div className="w-10 h-10 bg-gray-200 rounded-xl mr-4 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-gray-200 rounded w-1/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-2 bg-gray-100 rounded w-1/6" />
    </div>
    <div className="ml-4 w-16 h-5 bg-gray-200 rounded" />
  </div>
);

export default function ExpenseList({ expenses, loading }) {
  // Loading state: show skeletons
  if (loading) {
    return (
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="h-5 w-28 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="divide-y divide-gray-50">
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
      <div className="card p-12 text-center">
        <div className="text-5xl mb-4">📭</div>
        <p className="text-gray-700 font-semibold text-lg">No expenses found</p>
        <p className="text-gray-400 text-sm mt-1">
          Add your first expense using the form on the left.
        </p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      {/* List header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">
          Transactions
        </h2>
        <span className="text-xs font-medium bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full">
          {expenses.length} {expenses.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      {/* Items */}
      <div className="divide-y divide-gray-50">
        {expenses.map((expense) => (
          <ExpenseItem key={expense._id} expense={expense} />
        ))}
      </div>
    </div>
  );
}
