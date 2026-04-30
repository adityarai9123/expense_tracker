import React from 'react';

export default function BarChart({ data, height = 200 }) {
  const entries = Object.entries(data).sort((a, b) => a[0].localeCompare(b[0]));
  if (entries.length === 0) {
    return <div className="flex items-center justify-center text-muted text-sm" style={{ height }}>No data</div>;
  }

  // data format: { "2025-01": { income: 500, expense: 300 } }
  const maxVal = Math.max(...entries.map(([, v]) => Math.max(v.income || 0, v.expense || 0)), 1);

  const formatMonth = (key) => {
    const [year, month] = key.split('-');
    const names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${names[parseInt(month) - 1]} '${year.slice(2)}`;
  };

  return (
    <div className="flex items-end gap-2 sm:gap-3 justify-center" style={{ height }}>
      {entries.map(([key, val], i) => {
        const incPct = ((val.income || 0) / maxVal) * 100;
        const expPct = ((val.expense || 0) / maxVal) * 100;
        return (
          <div key={key} className="flex flex-col items-center gap-1.5 flex-1 max-w-[60px]">
            <span className="text-xs text-muted tabular-nums">${((val.income || 0) + (val.expense || 0)).toFixed(0)}</span>
            <div className="w-full flex gap-0.5 items-end" style={{ height: height - 50 }}>
              {/* Income bar */}
              <div className="flex-1 relative h-full">
                <div className="absolute bottom-0 w-full rounded-t-md bar-grow"
                  style={{ height: `${Math.max(incPct, 2)}%`, background: 'linear-gradient(180deg, #34d399, #10b981)',
                    boxShadow: '0 -2px 8px rgba(16,185,129,0.2)', animationDelay: `${i * 0.1}s` }} />
              </div>
              {/* Expense bar */}
              <div className="flex-1 relative h-full">
                <div className="absolute bottom-0 w-full rounded-t-md bar-grow"
                  style={{ height: `${Math.max(expPct, 2)}%`, background: 'linear-gradient(180deg, #818cf8, #6366f1)',
                    boxShadow: '0 -2px 8px rgba(99,102,241,0.2)', animationDelay: `${i * 0.1 + 0.05}s` }} />
              </div>
            </div>
            <span className="text-xs text-muted whitespace-nowrap">{formatMonth(key)}</span>
          </div>
        );
      })}
    </div>
  );
}
