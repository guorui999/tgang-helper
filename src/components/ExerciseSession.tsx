'use client';

import { use, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getCourseById } from '@/data/courses';
import type { Exercise, ExercisePhase } from '@/types';
import BreathingCircle from '@/components/BreathingCircle';
import PoseGuideSVG from '@/components/PoseGuideSVG';
import VoiceGuide from '@/components/VoiceGuide';
import ExerciseTimer from '@/components/ExerciseTimer';
import CameraView from '@/components/CameraView';
import CompletionModal from '@/components/CompletionModal';
import { useTrainingRecords } from '@/hooks/useTrainingRecords';

interface Props {
  id: string;
}

export default function ExerciseSession({ id }: Props) {
  const router = useRouter();
  const course = useMemo(() => getCourseById(id), [id]);
  const { saveRecord } = useTrainingRecords();

  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(0);
  const [phase, setPhase] = useState<ExercisePhase>('idle');
  const [running, setRunning] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [timerKey, setTimerKey] = useState('init');
  const [remaining, setRemaining] = useState(0);

  if (!course) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">🔍</p>
        <p className="text-gray-500">课程未找到</p>
        <button className="btn-primary mt-4" onClick={() => router.push('/')}>返回首页</button>
      </div>
    );
  }

  const currentEx: Exercise = course.exercises[currentExIndex];
  const totalExercises = course.exercises.length;
  const isLastSet = currentSet >= currentEx.sets - 1;
  const isLastExercise = currentExIndex >= totalExercises - 1;
  const progress = currentEx.duration > 0 ? 1 - (remaining / currentEx.duration) : 0;

  const handleStart = () => {
    setPhase('contract');
    setRunning(true);
    setTimerKey(`${currentExIndex}-${currentSet}-start`);
  };

  const handlePause = () => setRunning(false);
  const handleResume = () => setRunning(true);

  const handleTimerComplete = useCallback(() => {
    if (phase === 'contract') {
      setPhase('relax');
      setTimerKey(`relax-${currentExIndex}-${currentSet}`);
      setRunning(true);
    } else if (phase === 'relax') {
      setRunning(false);
      if (!isLastSet) {
        setPhase('rest');
        setCurrentSet(s => s + 1);
        setTimerKey(`rest-${currentExIndex}-${currentSet + 1}`);
      } else if (!isLastExercise) {
        setPhase('rest');
        setCurrentExIndex(i => i + 1);
        setCurrentSet(0);
        setTimerKey(`rest-${currentExIndex + 1}-0`);
      } else {
        setPhase('completed');
      }
    }
  }, [phase, isLastSet, isLastExercise, currentExIndex, currentSet]);

  const handleSetStart = () => {
    setPhase('contract');
    setRunning(true);
    setTimerKey(`start-${currentExIndex}-${currentSet}`);
  };

  const timerDuration = phase === 'contract'
    ? currentEx.duration
    : phase === 'relax'
    ? Math.max(2, Math.floor(currentEx.duration * 0.5))
    : phase === 'rest'
    ? currentEx.restDuration || 3
    : 0;

  const voiceText = phase === 'contract'
    ? currentEx.instruction
    : phase === 'relax'
    ? '放松盆底肌，深呼吸'
    : phase === 'rest'
    ? '休息一下，准备下一组'
    : phase === 'completed'
    ? '训练完成！干得漂亮！'
    : currentEx.instruction;

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <button onClick={() => router.push('/')} className="text-gray-400 hover:text-gray-600 text-sm">← 返回</button>
        <div className="text-center">
          <h2 className="font-bold text-[var(--color-text)]">{course.titleZh}</h2>
          <p className="text-xs text-gray-400">
            {currentExIndex + 1}/{totalExercises} · 第{currentSet + 1}/{currentEx.sets}组
          </p>
        </div>
        <div className="w-10" />
      </div>

      {/* Voice + Camera toggles */}
      <div className="flex items-center justify-center gap-3 mb-3">
        <button
          onClick={() => setVoiceEnabled(v => !v)}
          className={`text-sm px-3 py-1 rounded-full ${voiceEnabled ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'bg-gray-100 text-gray-400'}`}
        >
          {voiceEnabled ? '🔊 语音' : '🔇 静音'}
        </button>
        <CameraView />
      </div>

      {/* Animation Area */}
      <div className="relative flex flex-col items-center justify-center flex-1 w-full">
        <div className="relative flex items-center justify-center">
          <BreathingCircle phase={phase} progress={progress} />
        </div>
        <div className="mt-6">
          <PoseGuideSVG poseType={currentEx.poseType} highlight={phase === 'contract' ? 'pelvic' : undefined} />
        </div>
        <p className="text-lg font-semibold text-[var(--color-text)] mt-4">{currentEx.nameZh}</p>
        <p className="text-sm text-gray-400 text-center px-6">{currentEx.description}</p>
      </div>

      {/* Timer + Controls */}
      <div className="w-full mt-auto pt-6 pb-4">
        <ExerciseTimer duration={timerDuration} running={running} onTick={setRemaining} onComplete={handleTimerComplete} resetKey={timerKey} />
        <div className="flex justify-center gap-4 mt-4">
          {phase === 'idle' || phase === 'rest' ? (
            <button className="btn-primary text-lg px-10" onClick={handleSetStart}>
              {phase === 'rest' ? '继续下一组' : '开始训练'}
            </button>
          ) : running ? (
            <button className="btn-accent text-lg px-10" onClick={handlePause}>暂停</button>
          ) : (
            <button className="btn-primary text-lg px-10" onClick={handleResume}>继续</button>
          )}
        </div>
      </div>

      <VoiceGuide text={voiceText} enabled={voiceEnabled && phase !== 'idle'} />

      <CompletionModal
        show={phase === 'completed'}
        courseId={id}
        courseTitle={course.titleZh}
        duration={course.duration * 60}
        onSaveRecord={saveRecord}
        onRestart={() => { setCurrentExIndex(0); setCurrentSet(0); setPhase('idle'); setRunning(false); setTimerKey('reset'); }}
        onHome={() => router.push('/')}
      />
    </div>
  );
}
