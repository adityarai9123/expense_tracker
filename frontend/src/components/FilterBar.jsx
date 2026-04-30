import React from 'react';

export default function FilterBar({ categories, category, sort, onCategoryChange, onSortChange }) {
  return (
    <div className="card px-4 py-3 flex flex-wrap items-center gap-4">
      {/* Filter icon */}
      <span className="text-gray-400 text-sm font-medium hidden sm:block">🔍 Filters</span>

      {/* Category filter */}
      <div className="flex items-center gap-2 flex-1 min-w-[160px]">
        <label className="text-sm font-medium text-gray-500 whitespace-nowrap">Category</label>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-1.5 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 
                     bg-gray-50 text-gray-700 cursor-pointer"
        >
          <option value="All">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2 flex-1 min-w-[160px]">
        <label className="text-sm font-medium text-gray-500 whitespace-nowrap">Sort</label>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-1.5 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 
                     bg-gray-50 text-gray-700 cursor-pointer"
        >
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
        </select>
      </div>

      {/* Active filter badge */}
      {category !== 'All' && (
        <button
          onClick={() => onCategoryChange('All')}
          className="text-xs font-medium bg-indigo-50 text-indigo-600 
                     border border-indigo-200 rounded-full px-3 py-1 
                     hover:bg-indigo-100 transition flex items-center gap-1"
        >
          {category} <span>✕</span>
        </button>
      )}
    </div>
  );
}
