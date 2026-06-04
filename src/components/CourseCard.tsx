'use client';

import { Course } from '@/types';
import Link from 'next/link';

const difficultyLabels: Record<string, { label: string; color: string }> = {
  beginner: { label: '初级', color: 'bg-green-100 text-green-700' },
  intermediate: { label: '中级', color: 'bg-orange-100 text-orange-700' },
  advanced: { label: '高级', color: 'bg-red-100 text-red-700' },
};

const difficultyBorders: Record<string, string> = {
  beginner: 'border-l-green-400',
  intermediate: 'border-l-orange-400',
  advanced: 'border-l-red-400',
};

const genderLabels: Record<string, string> = {
  male: '♂ 男性',
  female: '♀ 女性',
  all: '通用',
};

export default function CourseCard({ course }: { course: Course }) {
  const diff = difficultyLabels[course.difficulty];
  const borderColor = difficultyBorders[course.difficulty] || 'border-l-primary';

  const exerciseTypes = [...new Set(course.exercises.map(e => {
    const map: Record<string, string> = {
      quick: '快速',
      sustained: '持续',
      staircase: '阶梯',
      relaxation: '放松',
    };
    return map[e.type] || e.type;
  }))];

  return (
    <Link href={`/exercise/${course.id}`}>
      <div className={`card border-l-4 ${borderColor} hover:border-l-[6px] transition-all cursor-pointer`}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-[var(--color-text)]">{course.titleZh}</h3>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${diff.color}`}>
            {diff.label}
          </span>
        </div>
        <p className="text-gray-500 text-sm mb-3 leading-relaxed">{course.description}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs bg-gray-50 text-gray-500 px-2.5 py-0.5 rounded-full border border-gray-100">
            {genderLabels[course.gender]}
          </span>
          <span className="text-xs bg-gray-50 text-gray-500 px-2.5 py-0.5 rounded-full border border-gray-100">
            {course.duration} 分钟
          </span>
          {exerciseTypes.map((t, i) => (
            <span key={t} className="text-xs bg-[var(--color-primary-50)] text-[var(--color-primary)] px-2.5 py-0.5 rounded-full font-medium">
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
