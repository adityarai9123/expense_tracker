import React, { useState, useEffect, useCallback } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import FilterBar from '../components/FilterBar';
import Summary from '../components/Summary';
import { getExpenses } from '../services/api';

export const CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Health',
  'Shopping',
  'Utilities',
  'Other',
];

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [categoryBreakdown, setCategoryBreakdown] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('date_desc');

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { sort };
      if (category !== 'All') params.category = category;

      const data = await getExpenses(params);
      setExpenses(data.data || []);
      setTotal(data.total || 0);
      setCategoryBreakdown(data.categoryBreakdown || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category, sort]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* ── Header ── */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl shadow-md">
            💰
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Expense Tracker</h1>
        </div>
        <p className="text-gray-500 ml-13 pl-0.5">Track, manage, and analyze your personal finances</p>
      </header>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: form */}
        <div className="lg:col-span-1">
          <ExpenseForm categories={CATEGORIES} onSuccess={fetchExpenses} />
        </div>

        {/* Right column: summary + list */}
        <div className="lg:col-span-2 space-y-5">
          <Summary
            expenses={expenses}
            total={total}
            categoryBreakdown={categoryBreakdown}
            activeFilter={category}
          />

          <FilterBar
            categories={CATEGORIES}
            category={category}
            sort={sort}
            onCategoryChange={setCategory}
            onSortChange={setSort}
          />

          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              <span className="text-lg leading-none">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <ExpenseList expenses={expenses} loading={loading} />
        </div>
      </div>
    </div>
  );
}
