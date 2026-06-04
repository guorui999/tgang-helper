'use client';

interface Props {
  weeklyMinutes: number[];
  totalSessions: number;
  totalMinutes: number;
  streak: number;
}

export default function SummaryChart({ weeklyMinutes, totalSessions, totalMinutes, streak }: Props) {
  const maxMin = Math.max(...weeklyMinutes, 1);
  const labels = ['6周前', '5周前', '4周前', '3周前', '2周前', '上周', '本周'];

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card-accent text-center">
          <div className="text-2xl font-bold text-[var(--color-primary)]">{totalSessions}</div>
          <div className="text-xs text-gray-400 mt-0.5">本月训练</div>
        </div>
        <div className="card-accent text-center">
          <div className="text-2xl font-bold text-[var(--color-accent)]">{totalMinutes}</div>
          <div className="text-xs text-gray-400 mt-0.5">总分钟</div>
        </div>
        <div className="card-accent text-center">
          <div className="text-2xl font-bold text-orange-500">{streak}</div>
          <div className="text-xs text-gray-400 mt-0.5">连击天数</div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="card">
        <h3 className="font-semibold text-[var(--color-text)] mb-4">每周训练</h3>
        <div className="flex items-end gap-2 h-32">
          {weeklyMinutes.map((min, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-xs font-medium tabular-nums" style={{ color: min > 0 ? 'var(--color-primary)' : '#ccc' }}>
                {min}
              </span>
              <div
                className="w-full rounded-lg transition-all duration-500 ease-out"
                style={{
                  height: `${Math.max((min / maxMin) * 100, min > 0 ? 6 : 0)}%`,
                  background: min > 0
                    ? 'linear-gradient(180deg, var(--color-primary-light) 0%, var(--color-primary) 100%)'
                    : 'transparent',
                  border: min > 0 ? 'none' : '1px dashed #e5e5e5',
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-1">
          {labels.map(l => (
            <span key={l} className="flex-1 text-center text-[10px] text-gray-400 truncate">{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
