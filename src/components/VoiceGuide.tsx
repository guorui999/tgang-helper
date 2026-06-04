'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Props {
  text: string;
  enabled: boolean;
  onEnd?: () => void;
}

export default function VoiceGuide({ text, enabled, onEnd }: Props) {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1;
    if (onEnd) utterance.onend = onEnd;
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [text, onEnd]);

  useEffect(() => {
    if (enabled && text) {
      const timer = setTimeout(() => speak(), 100);
      return () => clearTimeout(timer);
    }
  }, [enabled, text, speak]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  return null;
}
