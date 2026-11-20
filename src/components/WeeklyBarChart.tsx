import React, { useState } from 'react';
import { IncomeEntry } from '../types';

interface WeeklyBarChartProps {
  entries: IncomeEntry[];
  compact?: boolean;
}

const DAY_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const WeeklyBarChart: React.FC<WeeklyBarChartProps> = ({ entries, compact = false }) => {
  const [activeDay, setActiveDay] = useState<string | null>(null);

  const dayTotals = DAY_ORDER.map((day) => {
    const total = entries
      .filter((e) => e.type === 'income' && e.dayLabel === day)
      .reduce((acc, e) => acc + e.amount, 0);
    return { day, total };
  });

  const displayDays = compact ? dayTotals.slice(0, 5) : dayTotals;
  const maxVal = Math.max(...displayDays.map((d) => d.total), 500);

  if (compact) {
    return (
      <div className="flex items-end gap-1.5 h-12 shrink-0" aria-label="Weekly income trend">
        {displayDays.map((item, idx) => {
          const heightPct = Math.max(24, Math.round((item.total / maxVal) * 100));
          const opacities = ['bg-[#88ABA5]', 'bg-[#6A948D]', 'bg-[#4B7E76]', 'bg-[#29675E]', 'bg-[#064E46]'];
          return (
            <div
              key={item.day}
              title={`${item.day}: Rs ${item.total}`}
              className={`w-2 rounded-full transition-all duration-300 ${opacities[idx % opacities.length]}`}
              style={{ height: `${heightPct}%` }}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-2 items-end h-32 pt-4">
        {displayDays.map((item) => {
          const heightPct = item.total > 0 ? Math.max(18, Math.round((item.total / maxVal) * 100)) : 8;
          const isSelected = activeDay === item.day;
          return (
            <button
              key={item.day}
              type="button"
              onClick={() => setActiveDay(isSelected ? null : item.day)}
              className="flex flex-col items-center justify-end h-full gap-1.5 group focus-visible:outline-2 focus-visible:outline-[#064E46] rounded-lg"
            >
              <span className="text-[11px] font-medium text-[#064E46] tabular-nums opacity-90">
                {item.total > 0 ? `₹${item.total}` : '—'}
              </span>
              <div className="w-full flex justify-center items-end flex-1">
                <div
                  className={`w-full max-w-[24px] rounded-t-lg transition-all duration-200 ${
                    item.total === 0
                      ? 'bg-[#DDE7E4]'
                      : isSelected
                      ? 'bg-[#043B35]'
                      : 'bg-[#064E46] group-hover:bg-[#0B5D51]'
                  }`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
              <span className="text-[11px] text-[#526763] font-medium">{item.day}</span>
            </button>
          );
        })}
      </div>
      {activeDay && (
        <div className="mt-3 pt-2.5 border-t border-[#E5E0D5] flex items-center justify-between text-xs text-[#526763]">
          <span>
            {activeDay} total:{' '}
            <strong className="text-[#0F2421] tabular-nums">
              Rs {displayDays.find((d) => d.day === activeDay)?.total.toLocaleString('en-IN') ?? 0}
            </strong>
          </span>
          <button
            type="button"
            onClick={() => setActiveDay(null)}
            className="text-[#064E46] font-medium underline"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};
