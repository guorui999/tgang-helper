'use client';

import { useEffect, useRef } from 'react';

interface Props {
  duration: number;    // total seconds
  running: boolean;
  onTick: (remaining: number) => void;
  onComplete: () => void;
  resetKey: string;   // change to reset timer
}

export default function ExerciseTimer({ duration, running, onTick, onComplete, resetKey }: Props) {
  const remainingRef = useRef(duration);
  const startTimeRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    remainingRef.current = duration;
    onTick(duration);
  }, [resetKey, duration, onTick]);

  useEffect(() => {
    if (!running) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    startTimeRef.current = performance.now();
    const initialRemaining = remainingRef.current;

    const tick = (now: number) => {
      const elapsed = (now - startTimeRef.current) / 1000;
      const remaining = Math.max(0, initialRemaining - elapsed);
      remainingRef.current = remaining;
      onTick(Math.ceil(remaining));

      if (remaining <= 0) {
        onComplete();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [running, onTick, onComplete]);

  const seconds = Math.ceil(remainingRef.current);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="text-center">
      <span className="text-5xl font-bold text-[var(--color-text)] tabular-nums">
        {minutes}:{secs.toString().padStart(2, '0')}
      </span>
    </div>
  );
}
