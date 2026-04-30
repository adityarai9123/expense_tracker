import React, { useState, useEffect } from 'react';
import { updateExpense } from '../services/api';

export default function EditModal({ expense, expenseCategories, incomeCategories, onClose, onSaved }) {
  const [type, setType] = useState(expense?.type || 'expense');
  const [form, setForm] = useState({ amount: '', category: '', description: '', date: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');

  const categories = type === 'income' ? incomeCategories : expenseCategories;

  useEffect(() => {
    if (expense) {
      setType(expense.type || 'expense');
      setForm({
        amount: expense.amount?.toString() || '',
        category: expense.category || '',
        description: expense.description || '',
        date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : '',
      });
    }
  }, [expense]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const validate = () => {
    const errs = {};
    const amt = Number(form.amount);
    if (!form.amount) errs.amount = 'Required';
    else if (isNaN(amt) || amt <= 0) errs.amount = 'Invalid amount';
    if (!form.category) errs.category = 'Required';
    if (!form.date) errs.date = 'Required';
    return errs;
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: '' }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    try {
      await updateExpense(expense._id, {
        type, amount: parseFloat(parseFloat(form.amount).toFixed(2)),
        category: form.category, description: form.description.trim(), date: form.date,
      });
      onSaved();
    } catch (err) { setApiError(err.message); }
    finally { setSaving(false); }
  };

  const inputCls = (f) => `input-glass ${errors[f] ? 'input-error' : ''}`;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-primary">Edit Transaction</h3>
          <button onClick={onClose} className="btn-ghost !px-2 !py-1">✕</button>
        </div>

        {/* Type Toggle */}
        <div className="type-toggle mb-5">
          <button type="button" onClick={() => { setType('expense'); setForm(p => ({...p, category: expenseCategories[0]})); }}
            className={`type-toggle-btn ${type === 'expense' ? 'active-expense' : ''}`}>↓ Expense</button>
          <button type="button" onClick={() => { setType('income'); setForm(p => ({...p, category: incomeCategories[0]})); }}
            className={`type-toggle-btn ${type === 'income' ? 'active-income' : ''}`}>↑ Income</button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Amount</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-indigo-400 font-semibold text-sm pointer-events-none">$</span>
              <input type="number" name="amount" value={form.amount} onChange={handleChange} step="0.01" className={`${inputCls('amount')} pl-8`} />
            </div>
            {errors.amount && <p className="text-rose-400 text-xs mt-1">⚠ {errors.amount}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="select-glass">
              {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Description</label>
            <input type="text" name="description" value={form.description} onChange={handleChange} maxLength={300} className={inputCls('description')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Date</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} className={inputCls('date')} />
          </div>

          {apiError && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm px-4 py-3 rounded-xl">❌ {apiError}</div>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 !py-2.5">Cancel</button>
            <button type="submit" disabled={saving} className={`btn-primary flex-1 ${type === 'income' ? 'btn-income' : ''}`}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
