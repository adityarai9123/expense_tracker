import React, { useState, useEffect, useCallback } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import FilterBar from '../components/FilterBar';
import Summary from '../components/Summary';
import Analytics from '../components/Analytics';
import EditModal from '../components/EditModal';
import { getExpenses } from '../services/api';

export const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Health', 'Shopping', 'Utilities', 'Other'];
export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];
export const ALL_CATEGORIES = [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])];

export default function Dashboard({ darkMode }) {
  const [expenses, setExpenses] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [netBalance, setNetBalance] = useState(0);
  const [categoryBreakdown, setCategoryBreakdown] = useState({});
  const [monthlyBreakdown, setMonthlyBreakdown] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('date_desc');
  const [typeFilter, setTypeFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('expenses');
  const [editingExpense, setEditingExpense] = useState(null);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { sort };
      if (category !== 'All') params.category = category;
      if (typeFilter !== 'all') params.type = typeFilter;

      const data = await getExpenses(params);
      setExpenses(data.data || []);
      setTotalIncome(data.totalIncome || 0);
      setTotalExpense(data.totalExpense || 0);
      setNetBalance(data.netBalance || 0);
      setCategoryBreakdown(data.categoryBreakdown || {});
      setMonthlyBreakdown(data.monthlyBreakdown || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category, sort, typeFilter]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* ── Sub-header ── */}
      <div className="mb-6 animate-fade-in">
        <p className="text-secondary text-sm">Track, manage, and analyze your personal finances</p>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="flex items-center gap-2 mb-6 animate-slide-up">
        <button
          onClick={() => setActiveTab('expenses')}
          className={activeTab === 'expenses' ? 'tab-btn-active' : 'tab-btn-inactive'}
        >
          <span className="mr-1.5">📊</span> Dashboard
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={activeTab === 'analytics' ? 'tab-btn-active' : 'tab-btn-inactive'}
        >
          <span className="mr-1.5">📈</span> Analytics
        </button>
      </div>

      {/* ── Tab Content ── */}
      {activeTab === 'expenses' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: form */}
          <div className="lg:col-span-1 animate-slide-up">
            <ExpenseForm
              expenseCategories={EXPENSE_CATEGORIES}
              incomeCategories={INCOME_CATEGORIES}
              onSuccess={fetchExpenses}
            />
          </div>

          {/* Right column: summary + list */}
          <div className="lg:col-span-2 space-y-5">
            <Summary
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              netBalance={netBalance}
              expenses={expenses}
              categoryBreakdown={categoryBreakdown}
              activeFilter={category}
              typeFilter={typeFilter}
            />

            <FilterBar
              categories={ALL_CATEGORIES}
              category={category}
              sort={sort}
              typeFilter={typeFilter}
              onCategoryChange={setCategory}
              onSortChange={setSort}
              onTypeFilterChange={setTypeFilter}
            />

            {error && (
              <div className="flex items-start gap-3 glass text-sm px-4 py-3 rounded-xl animate-slide-down"
                   style={{ borderColor: 'rgba(244,63,94,0.2)', color: '#f87171' }}>
                <span className="text-lg leading-none">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <ExpenseList
              expenses={expenses}
              loading={loading}
              onEdit={setEditingExpense}
              onDelete={fetchExpenses}
            />
          </div>
        </div>
      ) : (
        <Analytics
          expenses={expenses}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          netBalance={netBalance}
          categoryBreakdown={categoryBreakdown}
          monthlyBreakdown={monthlyBreakdown}
          loading={loading}
          darkMode={darkMode}
        />
      )}

      {/* ── Edit Modal ── */}
      {editingExpense && (
        <EditModal
          expense={editingExpense}
          expenseCategories={EXPENSE_CATEGORIES}
          incomeCategories={INCOME_CATEGORIES}
          onClose={() => setEditingExpense(null)}
          onSaved={() => {
            setEditingExpense(null);
            fetchExpenses();
          }}
        />
      )}
    </div>
  );
}
