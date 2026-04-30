import React from 'react';

export default function FilterBar({ categories, category, sort, typeFilter, onCategoryChange, onSortChange, onTypeFilterChange }) {
  return (
    <div className="glass px-4 py-3 flex flex-wrap items-center gap-3 animate-slide-up">
      <span className="text-muted text-sm font-medium hidden sm:block">🔍 Filters</span>

      <div className="flex items-center gap-2 min-w-[120px]">
        <label className="text-sm font-medium text-muted">Type</label>
        <select value={typeFilter} onChange={(e) => onTypeFilterChange(e.target.value)} className="select-glass flex-1 !py-1.5 text-sm">
          <option value="all">All</option>
          <option value="expense">Expenses</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div className="flex items-center gap-2 flex-1 min-w-[130px]">
        <label className="text-sm font-medium text-muted">Category</label>
        <select value={category} onChange={(e) => onCategoryChange(e.target.value)} className="select-glass flex-1 !py-1.5 text-sm">
          <option value="All">All</option>
          {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
        </select>
      </div>

      <div className="flex items-center gap-2 flex-1 min-w-[130px]">
        <label className="text-sm font-medium text-muted">Sort</label>
        <select value={sort} onChange={(e) => onSortChange(e.target.value)} className="select-glass flex-1 !py-1.5 text-sm">
          <option value="date_desc">Newest</option>
          <option value="date_asc">Oldest</option>
        </select>
      </div>

      {(typeFilter !== 'all' || category !== 'All') && (
        <div className="flex gap-1.5">
          {typeFilter !== 'all' && (
            <button onClick={() => onTypeFilterChange('all')} className={`text-xs font-medium rounded-full px-2.5 py-1 flex items-center gap-1 ${typeFilter === 'income' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
              {typeFilter} ✕
            </button>
          )}
          {category !== 'All' && (
            <button onClick={() => onCategoryChange('All')} className="text-xs font-medium rounded-full px-2.5 py-1 flex items-center gap-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {category} ✕
            </button>
          )}
        </div>
      )}
    </div>
  );
}
