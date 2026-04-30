import React, { useState } from 'react';
import { createExpense } from '../services/api';

const generateIdempotencyKey = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};

const today = () => new Date().toISOString().split('T')[0];

export default function ExpenseForm({ expenseCategories, incomeCategories, onSuccess }) {
  const [type, setType] = useState('expense');
  const [form, setForm] = useState({
    amount: '',
    category: expenseCategories[0],
    description: '',
    date: today(),
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const categories = type === 'income' ? incomeCategories : expenseCategories;

  const validate = () => {
    const errs = {};
    const amt = Number(form.amount);
    if (!form.amount || form.amount.toString().trim() === '') errs.amount = 'Amount is required';
    else if (isNaN(amt) || amt <= 0) errs.amount = 'Enter a valid positive amount';
    else if (amt > 1_000_000) errs.amount = 'Max $1,000,000';
    if (!form.category) errs.category = 'Category is required';
    if (!form.date) errs.date = 'Date is required';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setSuccessMsg('');
    setApiError('');
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    const cats = newType === 'income' ? incomeCategories : expenseCategories;
    setForm((prev) => ({ ...prev, category: cats[0] }));
    setErrors({});
    setApiError('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    setApiError('');
    setSuccessMsg('');

    try {
      await createExpense({
        type,
        amount: parseFloat(parseFloat(form.amount).toFixed(2)),
        category: form.category,
        description: form.description.trim(),
        date: form.date,
        idempotencyKey: generateIdempotencyKey(),
      });

      setSuccessMsg(`${type === 'income' ? 'Income' : 'Expense'} added!`);
      setForm({ amount: '', category: categories[0], description: '', date: today() });
      setErrors({});
      onSuccess();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = (field) => `input-glass ${errors[field] ? 'input-error' : ''}`;

  return (
    <div className="glass p-6 sticky top-20">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-2 h-2 rounded-full ${type === 'income' ? 'bg-emerald-400' : 'bg-indigo-400'} animate-pulse`} />
          <h2 className="text-lg font-bold text-primary">Add Transaction</h2>
        </div>
        <p className="text-sm text-muted ml-4">Record income or expense</p>
      </div>

      {/* Type Toggle */}
      <div className="type-toggle mb-5">
        <button
          type="button"
          onClick={() => handleTypeChange('expense')}
          className={`type-toggle-btn ${type === 'expense' ? 'active-expense' : ''}`}
        >
          ↓ Expense
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('income')}
          className={`type-toggle-btn ${type === 'income' ? 'active-income' : ''}`}
        >
          ↑ Income
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-1.5">
            Amount <span className={type === 'income' ? 'text-emerald-400' : 'text-indigo-400'}>*</span>
          </label>
          <div className="relative">
            <span className={`absolute inset-y-0 left-4 flex items-center font-semibold text-sm pointer-events-none ${type === 'income' ? 'text-emerald-400' : 'text-indigo-400'}`}>
              $
            </span>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              className={`${inputCls('amount')} pl-8`}
            />
          </div>
          {errors.amount && <p className="text-rose-400 text-xs mt-1.5">⚠ {errors.amount}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-1.5">
            Category <span className={type === 'income' ? 'text-emerald-400' : 'text-indigo-400'}>*</span>
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={`select-glass ${errors.category ? 'input-error' : ''}`}
          >
            {categories.map((c) => (
              <option key={c} value={c} className="bg-gray-900 text-white">{c}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-1.5">
            Description <span className="text-muted font-normal">(optional)</span>
          </label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder={type === 'income' ? 'e.g. Monthly salary' : 'e.g. Lunch at café'}
            maxLength={300}
            className={inputCls('description')}
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-1.5">
            Date <span className={type === 'income' ? 'text-emerald-400' : 'text-indigo-400'}>*</span>
          </label>
          <input type="date" name="date" value={form.date} onChange={handleChange} className={inputCls('date')} />
          {errors.date && <p className="text-rose-400 text-xs mt-1.5">⚠ {errors.date}</p>}
        </div>

        {/* Feedback */}
        {apiError && (
          <div className="bg-rose-500/[0.08] border border-rose-500/20 text-rose-400 text-sm px-4 py-3 rounded-xl animate-slide-down flex items-start gap-2">
            <span>❌</span><span>{apiError}</span>
          </div>
        )}
        {successMsg && (
          <div className={`text-sm px-4 py-3 rounded-xl animate-slide-down flex items-center gap-2 ${
            type === 'income'
              ? 'bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-400'
              : 'bg-indigo-500/[0.08] border border-indigo-500/20 text-indigo-400'
          }`}>
            <span className="text-lg">✓</span><span>{successMsg}</span>
          </div>
        )}

        {/* Submit */}
        <button type="submit" disabled={submitting} className={`btn-primary mt-2 ${type === 'income' ? 'btn-income' : ''}`}>
          {submitting ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
              </svg>
              Saving...
            </>
          ) : (
            <>
              <span className="text-lg leading-none">{type === 'income' ? '↑' : '↓'}</span>
              Add {type === 'income' ? 'Income' : 'Expense'}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
