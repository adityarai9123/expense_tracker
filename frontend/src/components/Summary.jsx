import React from 'react';

const CATEGORY_COLORS = {
  Food: 'bg-orange-500',
  Transport: 'bg-blue-500',
  Entertainment: 'bg-purple-500',
  Health: 'bg-green-500',
  Shopping: 'bg-pink-500',
  Utilities: 'bg-yellow-500',
  Other: 'bg-gray-400',
};

export default function Summary({ expenses, total, categoryBreakdown, activeFilter }) {
  const count = expenses.length;

  // Calculate percentage of total for bar widths
  const maxVal = Math.max(...Object.values(categoryBreakdown), 1);

  return (
    <div className="card p-6">
      {/* Top row: totals */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {activeFilter === 'All' ? 'Total Spent' : `${activeFilter} Total`}
          </p>
          <p className="text-4xl font-bold text-gray-900 mt-1">
            ${total.toFixed(2)}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {count} {count === 1 ? 'expense' : 'expenses'}
            {activeFilter !== 'All' && ` in ${activeFilter}`}
          </p>
        </div>

        {/* Quick stats */}
        <div className="text-right">
          <p className="text-sm text-gray-500">Avg / expense</p>
          <p className="text-xl font-semibold text-indigo-600 mt-1">
            {count > 0 ? `$${(total / count).toFixed(2)}` : '—'}
          </p>
        </div>
      </div>

      {/* Category breakdown */}
      {Object.keys(categoryBreakdown).length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            By Category
          </p>
          <div className="space-y-2.5">
            {Object.entries(categoryBreakdown)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, amt]) => {
                const pct = ((amt / maxVal) * 100).toFixed(0);
                const barColor = CATEGORY_COLORS[cat] || 'bg-gray-400';
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{cat}</span>
                      <span className="text-gray-500">${amt.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className={`${barColor} h-1.5 rounded-full transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
