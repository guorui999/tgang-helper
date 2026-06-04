'use client';

import { usePoseDetection } from '@/hooks/usePoseDetection';
import { motion, AnimatePresence } from 'framer-motion';

const issueLabels: Record<string, string> = {
  slouching: '驼背',
  shrugging: '耸肩',
  tilting: '身体歪斜',
};

export default function CameraView() {
  const { status, videoRef, canvasRef, startCamera, stopCamera, currentIssues, correction } = usePoseDetection();
  const isActive = status === 'ready' || status === 'loading';

  const toggleCamera = () => {
    if (isActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  return (
    <div className="relative inline-block">
      {/* Toggle button */}
      <button
        onClick={toggleCamera}
        className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full transition-all ${
          isActive
            ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
        }`}
      >
        <span>📷</span>
        <span>{status === 'loading' ? '加载中...' : isActive ? '姿势检测开' : '姿势检测'}</span>
      </button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="fixed top-4 right-4 w-52 rounded-2xl overflow-hidden shadow-xl border-2 border-white z-40 bg-black"
          >
            <div className="relative">
              <video ref={videoRef} className="w-full h-40 object-cover" playsInline muted />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-40"
                width={640}
                height={480}
              />
            </div>

            {/* Status badge */}
            {status === 'loading' && (
              <div className="absolute top-2 left-2">
                <span className="text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full">加载中</span>
              </div>
            )}

            {/* Posture issues */}
            {currentIssues.length > 0 && (
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-red-500/90 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
                  {currentIssues.map(i => issueLabels[i]).join('、')}
                </div>
              </div>
            )}

            {/* AI correction */}
            {correction && (
              <div className="p-2 bg-blue-500/90 text-white text-xs backdrop-blur-sm">
                {correction.shortSuggestion || correction.suggestion}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
