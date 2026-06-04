'use client';

import { motion } from 'framer-motion';

type ExercisePhase = 'idle' | 'contract' | 'relax' | 'rest' | 'completed';

interface Props {
  phase: ExercisePhase;
  progress: number; // 0-1
}

const phaseConfig: Record<ExercisePhase, { scale: number; color: string; label: string; textColor: string }> = {
  contract: { scale: 0.55, color: '#4CAF50', label: '收缩', textColor: '#fff' },
  relax: { scale: 1.25, color: '#FF9800', label: '放松', textColor: '#fff' },
  rest: { scale: 1, color: '#81C784', label: '休息', textColor: '#fff' },
  idle: { scale: 1, color: '#E8F5E9', label: '准备', textColor: '#4CAF50' },
  completed: { scale: 1, color: '#4CAF50', label: '完成!', textColor: '#fff' },
};

export default function BreathingCircle({ phase, progress }: Props) {
  const config = phaseConfig[phase] || phaseConfig.idle;

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        className="rounded-full w-52 h-52 flex items-center justify-center shadow-lg"
        animate={{
          scale: config.scale,
          backgroundColor: config.color,
        }}
        transition={{
          duration: 0.6,
          ease: 'easeInOut',
        }}
      >
        <motion.span
          className="text-lg font-bold select-none"
          style={{ color: config.textColor }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {config.label}
        </motion.span>
      </motion.div>
      {/* Progress ring */}
      <svg className="absolute w-60 h-60 -rotate-90" viewBox="0 0 240 240">
        <circle cx="120" cy="120" r="110" fill="none" stroke="#e0e0e0" strokeWidth="4" />
        <motion.circle
          cx="120" cy="120" r="110" fill="none"
          stroke={config.color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 110}
          initial={{ strokeDashoffset: 2 * Math.PI * 110 }}
          animate={{ strokeDashoffset: 2 * Math.PI * 110 * (1 - progress) }}
          transition={{ duration: 0.3 }}
        />
      </svg>
    </div>
  );
}
