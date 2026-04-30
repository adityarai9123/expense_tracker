import React from 'react';

const COLORS = [
  '#6366f1', // indigo
  '#f97316', // orange
  '#3b82f6', // blue
  '#a855f7', // purple
  '#10b981', // emerald
  '#ec4899', // pink
  '#f59e0b', // amber
  '#6b7280', // gray
];

export default function DonutChart({ data, size = 200 }) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [, val]) => sum + val, 0);

  if (total === 0 || entries.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <p className="text-gray-600 text-sm">No data</p>
      </div>
    );
  }

  const cx = size / 2;
  const cy = size / 2;
  const radius = (size / 2) - 20;
  const strokeWidth = 28;
  const circumference = 2 * Math.PI * radius;

  let accumulatedOffset = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background ring */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth={strokeWidth}
        />

        {/* Segments */}
        {entries.map(([cat, val], i) => {
          const pct = val / total;
          const segmentLength = pct * circumference;
          const gap = entries.length > 1 ? 4 : 0;
          const dashArray = `${Math.max(segmentLength - gap, 1)} ${circumference - segmentLength + gap}`;
          const offset = -accumulatedOffset + circumference * 0.25; // Start from top

          accumulatedOffset += segmentLength;

          return (
            <circle
              key={cat}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={strokeWidth}
              strokeDasharray={dashArray}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="donut-segment"
              style={{
                '--circumference': circumference,
                '--offset': offset,
                animationDelay: `${i * 0.15}s`,
                filter: `drop-shadow(0 0 6px ${COLORS[i % COLORS.length]}40)`,
              }}
            />
          );
        })}
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-2xl font-extrabold text-white">${total.toFixed(0)}</p>
        <p className="text-xs text-gray-500 mt-0.5">Total</p>
      </div>
    </div>
  );
}
