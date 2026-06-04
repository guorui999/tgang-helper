'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { PostureIssue } from '@/types';
import { analyzePosture, formatPostureForAI } from '@/lib/posture-analysis';
import { getPostureCorrection } from '@/lib/deepseek-client';

type PoseStatus = 'loading' | 'ready' | 'error' | 'unavailable';

interface CorrectionResult {
  suggestion: string;
  shortSuggestion: string;
}

interface UsePoseDetectionReturn {
  status: PoseStatus;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  currentIssues: PostureIssue[];
  correction: CorrectionResult | null;
  isProcessing: boolean;
}

export function usePoseDetection(): UsePoseDetectionReturn {
  const [status, setStatus] = useState<PoseStatus>('unavailable');
  const [currentIssues, setCurrentIssues] = useState<PostureIssue[]>([]);
  const [correction, setCorrection] = useState<CorrectionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const poseLandmarkerRef = useRef<any>(null);
  const poseLandmarkerClassRef = useRef<any>(null);
  const drawingUtilsRef = useRef<any>(null);
  const animFrameRef = useRef<number>(0);
  const lastAICallRef = useRef<number>(0);

  // Load PoseLandmarker
  useEffect(() => {
    let cancelled = false;
    setStatus('loading');

    (async () => {
      try {
        const vision = await import('@mediapipe/tasks-vision');
        const { PoseLandmarker, FilesetResolver, DrawingUtils } = vision;

        poseLandmarkerClassRef.current = PoseLandmarker;

        const wasmBase = '/wasm';
        const modelAsset = '/models/pose_landmarker_lite.task';

        const filesetResolver = await FilesetResolver.forVisionTasks(wasmBase);
        const landmarker = await PoseLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: modelAsset,
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numPoses: 1,
          minPoseDetectionConfidence: 0.5,
          minPosePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        if (!cancelled) {
          poseLandmarkerRef.current = landmarker;
          drawingUtilsRef.current = DrawingUtils;
          setStatus('ready');
        }
      } catch (err) {
        console.error('Failed to load PoseLandmarker:', err);
        if (!cancelled) setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera error:', err);
      setStatus('error');
    }
  }, []);

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCurrentIssues([]);
    setCorrection(null);
  }, []);

  // Detection loop
  useEffect(() => {
    if (status !== 'ready') return;

    const landmarker = poseLandmarkerRef.current;
    const PoseLandmarkerClass = poseLandmarkerClassRef.current;
    const DrawingUtils = drawingUtilsRef.current;

    if (!landmarker || !PoseLandmarkerClass || !DrawingUtils) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    const detect = () => {
      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        const timestamp = performance.now();
        const result = landmarker.detectForVideo(video, timestamp);

        const ctx = canvas.getContext('2d');
        if (ctx && result.landmarks && result.landmarks[0]) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const landmarks = result.landmarks[0];

          // Draw skeleton
          const drawUtils = new DrawingUtils(ctx);
          drawUtils.drawConnectors(landmarks, PoseLandmarkerClass.POSE_CONNECTIONS);
          drawUtils.drawLandmarks(landmarks, {
            radius: (data: any) => DrawingUtils.lerp(data.z ?? 0, -0.15, 0.1, 5, 1),
          });

          // Analyze posture
          const normalized = landmarks.map((l: any) => [l.x, l.y, l.z || 0]);
          const analysis = analyzePosture(normalized);

          if (analysis.issues.length > 0) {
            setCurrentIssues(analysis.issues);

            // Call DeepSeek directly from browser if issues persist > 5s
            if (Date.now() - lastAICallRef.current > 5000) {
              lastAICallRef.current = Date.now();
              setIsProcessing(true);
              const postureText = formatPostureForAI(normalized, analysis.issues);
              const apiKey = localStorage.getItem('tgang-api-key') || '';

              getPostureCorrection(postureText, apiKey)
                .then(data => { if (data) setCorrection(data); })
                .catch(console.error)
                .finally(() => setIsProcessing(false));
            }
          } else {
            setCurrentIssues([]);
          }
        }
      }
      animFrameRef.current = requestAnimationFrame(detect);
    };

    animFrameRef.current = requestAnimationFrame(detect);

    return () => cancelAnimationFrame(animFrameRef.current);
  }, [status]);

  return {
    status,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    currentIssues,
    correction,
    isProcessing,
  };
}
