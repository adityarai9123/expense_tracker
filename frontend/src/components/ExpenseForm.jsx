import React, { useState } from 'react';
import { createExpense } from '../services/api';

// Generate a unique idempotency key per submission attempt
const generateIdempotencyKey = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};

const today = () => new Date().toISOString().split('T')[0];

const INITIAL_FORM = (categories) => ({
  amount: '',
  category: categories[0] || 'Food',
  description: '',
  date: today(),
});

export default function ExpenseForm({ categories, onSuccess }) {
  const [form, setForm] = useState(INITIAL_FORM(categories));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // ── Validation ──────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    const amt = Number(form.amount);

    if (!form.amount || form.amount.toString().trim() === '') {
      errs.amount = 'Amount is required';
    } else if (isNaN(amt) || amt <= 0) {
      errs.amount = 'Enter a valid positive amount';
    } else if (amt > 1_000_000) {
      errs.amount = 'Amount too large (max $1,000,000)';
    }

    if (!form.category) errs.category = 'Category is required';
    if (!form.date) errs.date = 'Date is required';

    return errs;
  };

  // ── Handlers ─────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field-level error on change
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setSuccessMsg('');
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return; // Guard against double-click

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    setApiError('');
    setSuccessMsg('');

    try {
      await createExpense({
        amount: parseFloat(parseFloat(form.amount).toFixed(2)),
        category: form.category,
        description: form.description.trim(),
        date: form.date,
        idempotencyKey: generateIdempotencyKey(),
      });

      setSuccessMsg('✓ Expense added successfully!');
      setForm(INITIAL_FORM(categories));
      setErrors({});
      onSuccess(); // Refresh parent list
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = (field) =>
    `input-base ${errors[field] ? 'input-error' : ''}`;

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="card p-6 sticky top-6">
      {/* Card Header */}
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900">Add Expense</h2>
        <p className="text-sm text-gray-500 mt-0.5">Record a new transaction</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Amount <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 font-medium text-sm pointer-events-none">
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
              max="1000000"
              className={`${inputCls('amount')} pl-7`}
            />
          </div>
          {errors.amount && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <span>⚠</span> {errors.amount}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={inputCls('category')}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">⚠ {errors.category}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Description{' '}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="e.g. Lunch at café"
            maxLength={300}
            className={inputCls('description')}
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className={inputCls('date')}
          />
          {errors.date && (
            <p className="text-red-500 text-xs mt-1">⚠ {errors.date}</p>
          )}
        </div>

        {/* API Error */}
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl flex items-start gap-2">
            <span className="shrink-0">❌</span>
            <span>{apiError}</span>
          </div>
        )}

        {/* Success */}
        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
            {successMsg}
          </div>
        )}

        {/* Submit */}
        <button type="submit" disabled={submitting} className="btn-primary mt-2">
          {submitting ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              Saving...
            </>
          ) : (
            <>
              <span className="text-lg leading-none">+</span> Add Expense
            </>
          )}
        </button>
      </form>
    </div>
  );
}
