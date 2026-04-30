import React from 'react';

const CATEGORY_META = {
  Food:          { icon: '🍔', bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-400' },
  Transport:     { icon: '🚗', bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-400' },
  Entertainment: { icon: '🎬', bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-400' },
  Health:        { icon: '💊', bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-400' },
  Shopping:      { icon: '🛒', bg: 'bg-pink-100',   text: 'text-pink-700',   dot: 'bg-pink-400' },
  Utilities:     { icon: '💡', bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-400' },
  Other:         { icon: '📌', bg: 'bg-gray-100',   text: 'text-gray-600',   dot: 'bg-gray-400' },
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function ExpenseItem({ expense }) {
  const meta = CATEGORY_META[expense.category] || CATEGORY_META.Other;
  const amount = parseFloat(expense.amount).toFixed(2);

  return (
    <div className="flex items-center px-5 py-3.5 hover:bg-gray-50/80 transition-colors duration-100 group">
      {/* Icon */}
      <div
        className={`${meta.bg} w-10 h-10 rounded-xl flex items-center justify-center text-lg mr-4 shrink-0 shadow-sm`}
      >
        {meta.icon}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${meta.bg} ${meta.text}`}
          >
            {expense.category}
          </span>
        </div>
        <p className="text-sm text-gray-700 font-medium truncate leading-snug">
          {expense.description || (
            <span className="text-gray-400 font-normal italic">No description</span>
          )}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{formatDate(expense.date)}</p>
      </div>

      {/* Amount */}
      <div className="ml-4 text-right shrink-0">
        <p className="text-base font-bold text-gray-900">${amount}</p>
      </div>
    </div>
  );
}
