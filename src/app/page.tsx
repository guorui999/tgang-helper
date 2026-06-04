'use client';

import { useState, useMemo } from 'react';
import { courses } from '@/data/courses';
import FilterBar from '@/components/FilterBar';
import CourseCard from '@/components/CourseCard';

type Gender = 'male' | 'female' | 'all';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export default function HomePage() {
  const [gender, setGender] = useState<Gender>('all');
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');

  const filtered = useMemo(() => {
    return courses.filter(c => {
      if (gender !== 'all' && c.gender !== gender && c.gender !== 'all') return false;
      if (difficulty !== 'all' && c.difficulty !== difficulty) return false;
      return true;
    });
  }, [gender, difficulty]);

  return (
    <div>
      {/* App Header */}
      <div className="flex items-center gap-4 mb-8 pt-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-[var(--color-primary)]/20">
          K
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-[var(--color-text)] tracking-tight">
            tgang-helper
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            提肛助手 · 今日也要加油 <span className="inline-block animate-bounce" style={{ animationDuration: '2s' }}>💪</span>
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-[var(--color-primary-50)] flex items-center justify-center text-sm">
          🌿
        </div>
      </div>

      <FilterBar gender={gender} difficulty={difficulty} onGenderChange={setGender} onDifficultyChange={setDifficulty} />

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4 opacity-50">🧘</p>
          <p className="font-medium">没有匹配的课程</p>
          <p className="text-sm mt-1">试试其他筛选条件</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((course, i) => (
            <div
              key={course.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
