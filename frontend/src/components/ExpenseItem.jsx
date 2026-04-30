import React from 'react';

const CATEGORY_META = {
  Food:          { icon: '🍔', color: '#f97316' },
  Transport:     { icon: '🚗', color: '#3b82f6' },
  Entertainment: { icon: '🎬', color: '#a855f7' },
  Health:        { icon: '💊', color: '#10b981' },
  Shopping:      { icon: '🛒', color: '#ec4899' },
  Utilities:     { icon: '💡', color: '#f59e0b' },
  Salary:        { icon: '💼', color: '#06b6d4' },
  Freelance:     { icon: '💻', color: '#8b5cf6' },
  Investment:    { icon: '📈', color: '#14b8a6' },
  Gift:          { icon: '🎁', color: '#f43f5e' },
  Other:         { icon: '📌', color: '#6b7280' },
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function ExpenseItem({ expense, onEdit, onDelete, index = 0 }) {
  const meta = CATEGORY_META[expense.category] || CATEGORY_META.Other;
  const amount = parseFloat(expense.amount).toFixed(2);
  const isIncome = expense.type === 'income';

  return (
    <div
      className="flex items-center px-5 py-4 transition-all duration-200 group"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-lg mr-4 shrink-0"
        style={{
          background: `${meta.color}18`,
          border: `1px solid ${meta.color}25`,
        }}
      >
        {meta.icon}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className="badge text-xs"
            style={{ background: `${meta.color}18`, color: meta.color }}
          >
            {expense.category}
          </span>
          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
            isIncome ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
          }`}>
            {isIncome ? '↑ Income' : '↓ Expense'}
          </span>
        </div>
        <p className="text-sm text-primary font-medium truncate leading-snug">
          {expense.description || (
            <span className="text-muted font-normal italic">No description</span>
          )}
        </p>
        <p className="text-xs text-muted mt-0.5">{formatDate(expense.date)}</p>
      </div>

      {/* Amount + Actions */}
      <div className="ml-4 flex items-center gap-3 shrink-0">
        <p className={`text-base font-bold tabular-nums ${
          isIncome ? 'text-emerald-400' : 'text-primary'
        }`}>
          {isIncome ? '+' : '-'}${amount}
        </p>

        {/* Actions — visible on hover */}
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button onClick={() => onEdit(expense)} className="btn-ghost" title="Edit">✏️</button>
          <button onClick={() => onDelete(expense._id)} className="btn-danger" title="Delete">🗑️</button>
        </div>
      </div>
    </div>
  );
}
