'use client';

import { useMemo } from 'react';

interface Props {
  activeDates: string[];
}

export default function StatsCalendar({ activeDates }: Props) {
  const days = useMemo(() => {
    const result: { date: string; day: number; active: boolean; isToday: boolean }[] = [];
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      result.push({
        date: dateStr,
        day: d.getDate(),
        active: activeDates.includes(dateStr),
        isToday: dateStr === todayStr,
      });
    }
    return result;
  }, [activeDates]);

  const weekDays = ['一', '二', '三', '四', '五', '六', '日'];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[var(--color-text)]">打卡日历</h3>
        <span className="text-xs text-gray-400">
          最近30天 · {activeDates.length} 天打卡
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(d => (
          <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>
        ))}
        {days.map(d => (
          <div
            key={d.date}
            className={`aspect-square rounded-xl flex items-center justify-center text-xs font-medium transition-all relative
              ${d.isToday ? 'ring-2 ring-[var(--color-primary)] ring-offset-1' : ''}
              ${d.active
                ? 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white shadow-sm'
                : 'bg-gray-50/80 text-gray-400'
              }`}
            title={d.date}
          >
            {d.day}
            {d.isToday && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--color-accent)] rounded-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
