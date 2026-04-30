import React from 'react';

export default function Summary({ totalIncome, totalExpense, netBalance, expenses, categoryBreakdown, activeFilter, typeFilter }) {
  const count = expenses.length;

  // Flatten category breakdown for bar rendering
  const catEntries = Object.entries(categoryBreakdown)
    .map(([cat, data]) => ({ cat, total: data.total, income: data.income, expense: data.expense }))
    .sort((a, b) => b.total - a.total);

  const maxCatVal = Math.max(...catEntries.map((e) => e.total), 1);

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Income */}
        <div className="stat-card">
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1">Income</p>
          <p className="text-2xl font-extrabold text-emerald-400">${totalIncome.toFixed(2)}</p>
        </div>

        {/* Expense */}
        <div className="stat-card stagger-1">
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1">Expenses</p>
          <p className="text-2xl font-extrabold text-rose-400">${totalExpense.toFixed(2)}</p>
        </div>

        {/* Net Balance */}
        <div className="stat-card stagger-2">
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1">Net Balance</p>
          <p className={`text-2xl font-extrabold ${netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {netBalance >= 0 ? '+' : ''}{netBalance.toFixed(2)}
          </p>
        </div>

        {/* Count */}
        <div className="stat-card stagger-3">
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1">Transactions</p>
          <p className="text-2xl font-extrabold text-primary">{count}</p>
        </div>
      </div>

      {/* Category breakdown */}
      {catEntries.length > 0 && (
        <div className="glass p-5">
          <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-4">
            By Category
          </p>
          <div className="space-y-3">
            {catEntries.slice(0, 6).map(({ cat, total, income, expense }, i) => {
              const pct = ((total / maxCatVal) * 100).toFixed(0);
              return (
                <div key={cat} className={`stagger-${i + 1}`}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium text-primary">{cat}</span>
                    <div className="flex items-center gap-3 text-xs tabular-nums">
                      {income > 0 && <span className="text-emerald-400">+${income.toFixed(2)}</span>}
                      {expense > 0 && <span className="text-rose-400">-${expense.toFixed(2)}</span>}
                    </div>
                  </div>
                  <div className="w-full rounded-full h-1.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div
                      className="h-1.5 rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${pct}%`,
                        background: income > expense
                          ? 'linear-gradient(90deg, #10b981, #059669)'
                          : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                        boxShadow: income > expense
                          ? '0 0 8px rgba(16,185,129,0.3)'
                          : '0 0 8px rgba(99,102,241,0.3)',
                      }}
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
