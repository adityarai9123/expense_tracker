import React from 'react';
import DonutChart from './DonutChart';
import BarChart from './BarChart';

const ICONS = { Food:'🍔', Transport:'🚗', Entertainment:'🎬', Health:'💊', Shopping:'🛒', Utilities:'💡', Salary:'💼', Freelance:'💻', Investment:'📈', Gift:'🎁', Other:'📌' };

export default function Analytics({ expenses, totalIncome, totalExpense, netBalance, categoryBreakdown, monthlyBreakdown, loading }) {
  const count = expenses.length;
  const catEntries = Object.entries(categoryBreakdown).sort((a, b) => b[1].total - a[1].total);

  // Expense-only breakdown for donut
  const expenseDonut = {};
  catEntries.forEach(([cat, d]) => { if (d.expense > 0) expenseDonut[cat] = d.expense; });

  // Recent 7 days
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  const recent = expenses.filter((e) => new Date(e.date) >= weekAgo);
  const recentTotal = recent.reduce((s, e) => s + parseFloat(e.amount), 0);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1,2,3,4].map((i) => (
          <div key={i} className="glass p-8 animate-pulse">
            <div className="h-5 w-32 bg-white/[0.06] rounded mb-6" />
            <div className="h-40 bg-white/[0.03] rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="stat-card">
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1">Income</p>
          <p className="text-2xl font-extrabold text-emerald-400">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="stat-card stagger-1">
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1">Expenses</p>
          <p className="text-2xl font-extrabold text-rose-400">${totalExpense.toFixed(2)}</p>
        </div>
        <div className="stat-card stagger-2">
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1">Net Balance</p>
          <p className={`text-2xl font-extrabold ${netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {netBalance >= 0 ? '+' : ''}{netBalance.toFixed(2)}
          </p>
        </div>
        <div className="stat-card stagger-3">
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1">Last 7 Days</p>
          <p className="text-2xl font-extrabold text-primary">${recentTotal.toFixed(2)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6">
          <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-6">Expenses by Category</h3>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <DonutChart data={expenseDonut} size={180} />
            <div className="flex-1 space-y-2 w-full">
              {Object.entries(expenseDonut).slice(0, 6).map(([cat, amt]) => (
                <div key={cat} className="flex items-center gap-2">
                  <span className="text-base">{ICONS[cat] || '📌'}</span>
                  <span className="text-sm text-secondary flex-1">{cat}</span>
                  <span className="text-sm text-primary font-medium tabular-nums">${amt.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass p-6">
          <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-6">Monthly Trend</h3>
          <BarChart data={monthlyBreakdown} height={220} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass p-6">
        <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-4">Recent Activity</h3>
        {recent.length === 0 ? (
          <p className="text-muted text-sm py-4 text-center">No transactions in the last 7 days</p>
        ) : (
          <div className="space-y-2">
            {recent.slice(0, 5).map((exp) => (
              <div key={exp._id} className="flex items-center gap-3 py-2">
                <span className="text-lg">{ICONS[exp.category] || '📌'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-primary font-medium truncate">{exp.description || exp.category}</p>
                  <p className="text-xs text-muted">{new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </div>
                <p className={`text-sm font-bold tabular-nums ${exp.type === 'income' ? 'text-emerald-400' : 'text-primary'}`}>
                  {exp.type === 'income' ? '+' : '-'}${parseFloat(exp.amount).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
