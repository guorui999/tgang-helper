'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { TrainingRecord } from '@/types';

interface Props {
  show: boolean;
  courseId: string;
  courseTitle: string;
  duration: number;
  onSaveRecord: (record: TrainingRecord) => void;
  onRestart: () => void;
  onHome: () => void;
}

export default function CompletionModal({ show, courseId, courseTitle, duration, onSaveRecord, onRestart, onHome }: Props) {
  const savedRef = useRef(false);

  useEffect(() => {
    if (show && !savedRef.current) {
      savedRef.current = true;
      onSaveRecord({
        date: new Date().toISOString().slice(0, 10),
        courseId,
        courseTitle,
        duration,
        completed: true,
        postureIssues: 0,
      });
    }
    // Reset ref when modal hides
    if (!show) savedRef.current = false;
  }, [show, courseId, courseTitle, duration, onSaveRecord]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 mx-4 max-w-sm text-center shadow-xl"
      >
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">训练完成!</h3>
        <p className="text-gray-500 mb-2">干得漂亮！每天坚持效果更好 💪</p>
        <p className="text-sm text-[var(--color-primary)] mb-6">打卡记录已保存 ✓</p>
        <button className="btn-primary w-full mb-3" onClick={onHome}>
          返回首页
        </button>
        <button className="text-sm text-gray-400 hover:text-gray-600" onClick={onRestart}>
          再练一次
        </button>
      </motion.div>
    </div>
  );
}
