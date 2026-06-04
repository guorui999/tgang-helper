'use client';

import { useTrainingRecords } from '@/hooks/useTrainingRecords';
import StatsCalendar from '@/components/StatsCalendar';
import SummaryChart from '@/components/SummaryChart';

export default function StatsPage() {
  const { getStats, activeDates } = useTrainingRecords();
  const stats = getStats();

  return (
    <div className="space-y-5 pt-2 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-orange-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-[var(--color-accent)]/20">
          📊
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text)]">训练统计</h1>
          <p className="text-sm text-gray-400">坚持就是胜利 💪</p>
        </div>
      </div>

      <StatsCalendar activeDates={activeDates} />

      <SummaryChart
        weeklyMinutes={stats.weeklyMinutes}
        totalSessions={stats.totalSessions}
        totalMinutes={stats.totalMinutes}
        streak={stats.streak}
      />

      {stats.totalSessions === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4 opacity-60">🏋️</div>
          <p className="text-gray-400 font-medium">还没有训练记录</p>
          <p className="text-sm text-gray-300 mt-1">完成一次训练后，记录会显示在这里</p>
        </div>
      )}
    </div>
  );
}
