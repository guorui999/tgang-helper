'use client';

import type { PoseType } from '@/types';

interface Props {
  poseType: PoseType;
  highlight?: string;
}

export default function PoseGuideSVG({ poseType, highlight }: Props) {
  // Sitting / lying posture
  if (poseType === 'sitting' || poseType === 'lying') {
    return (
      <svg viewBox="0 0 200 250" className="w-full max-w-[160px] h-auto">
        {/* Head */}
        <circle cx="100" cy="25" r="16" fill="#FFCCBC" stroke="#333" strokeWidth="1.5" />
        {/* Body */}
        <line x1="100" y1="41" x2="100" y2="120" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
        {/* Shoulders */}
        <line x1="75" y1="55" x2="125" y2="55" stroke="#333" strokeWidth="3" strokeLinecap="round" />
        {/* Arms */}
        <path d="M75 55 L55 90 L50 100" stroke="#333" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M125 55 L145 90 L150 100" stroke="#333" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Chair */}
        <rect x="45" y="120" width="110" height="12" rx="3" fill="#8D6E63" />
        <rect x="60" y="132" width="10" height="70" fill="#8D6E63" />
        <rect x="130" y="132" width="10" height="70" fill="#8D6E63" />
        {/* Legs */}
        <line x1="85" y1="120" x2="80" y2="170" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="115" y1="120" x2="120" y2="170" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
        {/* Feet */}
        <ellipse cx="78" cy="172" rx="10" ry="3" fill="#FFCCBC" />
        <ellipse cx="122" cy="172" rx="10" ry="3" fill="#FFCCBC" />
        {/* Highlighted pelvic floor */}
        {highlight && (
          <ellipse cx="100" cy="112" rx="18" ry="7" fill="none" stroke="#4CAF50" strokeWidth="2" strokeDasharray="3,3" opacity={0.8}>
            <animate attributeName="opacity" values="0.4;0.9;0.4" dur="1.5s" repeatCount="indefinite" />
          </ellipse>
        )}
        {highlight && (
          <text x="100" y="195" textAnchor="middle" fill="#4CAF50" fontSize="10" fontWeight="500">
            ⚡ 发力部位
          </text>
        )}
      </svg>
    );
  }

  // Standing posture
  return (
    <svg viewBox="0 0 200 250" className="w-full max-w-[160px] h-auto">
      {/* Head */}
      <circle cx="100" cy="22" r="16" fill="#FFCCBC" stroke="#333" strokeWidth="1.5" />
      {/* Body */}
      <line x1="100" y1="38" x2="100" y2="115" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
      {/* Shoulders */}
      <line x1="74" y1="52" x2="126" y2="52" stroke="#333" strokeWidth="3" strokeLinecap="round" />
      {/* Arms */}
      <path d="M74 52 L52 85 L48 100" stroke="#333" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M126 52 L148 85 L152 100" stroke="#333" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Legs */}
      <line x1="100" y1="115" x2="82" y2="185" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="100" y1="115" x2="118" y2="185" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
      {/* Feet */}
      <ellipse cx="80" cy="188" rx="11" ry="4" fill="#FFCCBC" />
      <ellipse cx="120" cy="188" rx="11" ry="4" fill="#FFCCBC" />
      {/* Highlight */}
      {highlight && (
        <ellipse cx="100" cy="107" rx="18" ry="7" fill="none" stroke="#4CAF50" strokeWidth="2" strokeDasharray="3,3" opacity={0.8}>
          <animate attributeName="opacity" values="0.4;0.9;0.4" dur="1.5s" repeatCount="indefinite" />
        </ellipse>
      )}
      {highlight && (
        <text x="100" y="215" textAnchor="middle" fill="#4CAF50" fontSize="10" fontWeight="500">⚡ 发力部位</text>
      )}
    </svg>
  );
}
