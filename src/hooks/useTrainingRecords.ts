'use client';

import { useState, useEffect, useCallback } from 'react';
import type { TrainingRecord } from '@/types';

const STORAGE_KEY = 'tgang-training-records';

export function useTrainingRecords() {
  const [records, setRecords] = useState<TrainingRecord[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRecords(JSON.parse(stored));
    } catch { /* ignore parse errors */ }
  }, []);

  const saveRecord = useCallback((record: TrainingRecord) => {
    setRecords(prev => {
      const updated = [...prev, record];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        if (e instanceof DOMException && e.name === 'QuotaExceededError') {
          const cleaned = updated.slice(-100);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
          return cleaned;
        }
      }
      return updated;
    });
  }, []);

  const getStats = useCallback(() => {
    const now = new Date();
    const thisMonth = now.toISOString().slice(0, 7);
    const today = now.toISOString().slice(0, 10);

    const monthRecords = records.filter(r => r.date.startsWith(thisMonth));
    const totalSessions = monthRecords.length;
    const totalMinutes = Math.round(monthRecords.reduce((s, r) => s + r.duration, 0) / 60);
    const completedToday = records.some(r => r.date === today && r.completed);

    // Calculate consecutive streak
    let streak = 0;
    const d = new Date();
    while (true) {
      const ds = d.toISOString().slice(0, 10);
      if (records.some(r => r.date === ds && r.completed)) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else break;
    }

    // Weekly minutes for chart (last 7 weeks)
    const weeklyMinutes: number[] = [];
    for (let w = 0; w < 7; w++) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + w - 6);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const weekRecords = records.filter(r => {
        const rd = new Date(r.date);
        return rd >= weekStart && rd <= weekEnd;
      });
      weeklyMinutes.push(Math.round(weekRecords.reduce((s, r) => s + r.duration, 0) / 60));
    }

    return { totalSessions, totalMinutes, completedToday, streak, weeklyMinutes };
  }, [records]);

  const activeDates = records
    .filter(r => r.completed)
    .map(r => r.date)
    .filter((d, i, a) => a.indexOf(d) === i);

  return { records, saveRecord, getStats, activeDates };
}
