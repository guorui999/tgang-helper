# tgang-helper 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建完整的提肛助手 Web 应用，含分级课程、动画引导、语音播报、摄像头姿势校正和训练记录

**Architecture:** Next.js 14+ App Router SPA，3 个路由页面（首页/训练/统计），纯前端姿态检测（MediaPipe），API Route 代理 DeepSeek V4

**Tech Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion + @mediapipe/tasks-vision + OpenAI SDK

---

### Task 1: 项目脚手架 + 配置文件

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.js`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `.env.example`
- Create: `.env.local`

- [ ] **Step 1: 初始化 Next.js 项目**

```bash
cd /c/Users/huang/Desktop/sport && npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias --use-npm 2>&1 | tail -5
```

- [ ] **Step 2: 安装额外依赖**

```bash
npm install framer-motion @mediapipe/tasks-vision openai 2>&1 | tail -5
```

- [ ] **Step 3: 配置 tailwind.config.ts**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4CAF50',
          light: '#81C784',
          dark: '#388E3C',
        },
        accent: {
          DEFAULT: '#FF9800',
          light: '#FFB74D',
        },
        bg: '#F5F7FA',
        text: '#1A1A2E',
      },
      animation: {
        'breathe-in': 'breatheIn 3s ease-in-out',
        'breathe-out': 'breatheOut 3s ease-in-out',
      },
      keyframes: {
        breatheIn: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(0.7)', opacity: '0.7' },
        },
        breatheOut: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.3)', opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 4: 创建 .env 文件**

Write `C:\Users\huang\Desktop\sport\.env.example`:
```
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-v4-pro
```

Write `C:\Users\huang\Desktop\sport\.env.local`:
```
DEEPSEEK_API_KEY=sk-4d0f17efa0bb4067aa05c13c90f0ba01
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-v4-pro
```

- [ ] **Step 5: 配置 next.config.js 允许 MediaPipe WASM**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // MediaPipe loads WASM from CDN, allow cross-origin
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

- [ ] **Step 6: 验证构建**

```bash
cd /c/Users/huang/Desktop/sport && npm run build 2>&1 | tail -20
```

---

### Task 2: 类型定义 + 课程数据

**Files:**
- Create: `src/types/index.ts`
- Create: `src/data/courses.ts`

- [ ] **Step 1: 创建类型定义**

Write `src/types/index.ts`:

```typescript
export type Gender = 'male' | 'female' | 'all';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type ExerciseType = 'quick' | 'sustained' | 'staircase' | 'relaxation';

export type PoseType = 'sitting' | 'standing' | 'lying';

export interface Exercise {
  id: string;
  type: ExerciseType;
  name: string;
  nameZh: string;
  description: string;
  instruction: string;
  duration: number;       // seconds per rep
  sets: number;
  restDuration: number;   // seconds rest between sets
  poseType: PoseType;
}

export interface Course {
  id: string;
  title: string;
  titleZh: string;
  description: string;
  gender: Gender;
  difficulty: Difficulty;
  duration: number;       // total minutes
  exercises: Exercise[];
}

export interface TrainingRecord {
  date: string;          // YYYY-MM-DD
  courseId: string;
  courseTitle: string;
  duration: number;      // seconds completed
  completed: boolean;
  postureIssues: number;
}

export type PostureIssue = 'slouching' | 'shrugging' | 'tilting';

export interface PostureData {
  issues: PostureIssue[];
  landmarks: number[][];
  timestamp: number;
}

export type ExercisePhase = 'idle' | 'contract' | 'relax' | 'rest' | 'completed';
```

- [ ] **Step 2: 创建课程数据**

Write `src/data/courses.ts`:

```typescript
import { Course } from '@/types';

export const courses: Course[] = [
  {
    id: 'male-beginner-1',
    title: 'Quick Start for Men',
    titleZh: '男性入门',
    description: '适合男性的基础盆底肌训练，掌握快速收缩',
    gender: 'male',
    difficulty: 'beginner',
    duration: 5,
    exercises: [
      {
        id: 'mb-quick-1',
        type: 'quick',
        name: 'Quick Squeeze',
        nameZh: '快速收缩',
        description: '快速收紧盆底肌，保持1秒后放松',
        instruction: '收紧盆底肌，保持1秒，放松',
        duration: 1,
        sets: 10,
        restDuration: 3,
        poseType: 'sitting',
      },
      {
        id: 'mb-hold-1',
        type: 'sustained',
        name: 'Sustained Hold',
        nameZh: '持续收缩',
        description: '持续收紧盆底肌，保持5秒',
        instruction: '收紧盆底肌，保持5秒，慢慢放松',
        duration: 5,
        sets: 5,
        restDuration: 5,
        poseType: 'sitting',
      },
      {
        id: 'mb-relax-1',
        type: 'relaxation',
        name: 'Deep Breathing',
        nameZh: '深呼吸放松',
        description: '深呼吸，完全放松盆底肌',
        instruction: '深吸一口气，呼气时完全放松盆底肌',
        duration: 10,
        sets: 3,
        restDuration: 3,
        poseType: 'lying',
      },
    ],
  },
  {
    id: 'female-beginner-1',
    title: 'Quick Start for Women',
    titleZh: '女性入门',
    description: '适合女性的基础盆底肌训练，感受正确发力',
    gender: 'female',
    difficulty: 'beginner',
    duration: 5,
    exercises: [
      {
        id: 'fb-quick-1',
        type: 'quick',
        name: 'Quick Squeeze',
        nameZh: '快速收缩',
        description: '快速收紧盆底肌，保持1秒后放松',
        instruction: '收紧盆底肌，想象中断尿流的感觉，保持1秒，放松',
        duration: 1,
        sets: 10,
        restDuration: 3,
        poseType: 'sitting',
      },
      {
        id: 'fb-hold-1',
        type: 'sustained',
        name: 'Sustained Hold',
        nameZh: '持续收缩',
        description: '持续收紧盆底肌，保持5秒',
        instruction: '收紧盆底肌，保持5秒，感受提升的感觉，慢慢放松',
        duration: 5,
        sets: 5,
        restDuration: 5,
        poseType: 'sitting',
      },
      {
        id: 'fb-relax-1',
        type: 'relaxation',
        name: 'Deep Breathing',
        nameZh: '深呼吸放松',
        description: '深呼吸，完全放松盆底肌',
        instruction: '深吸一口气，呼气时完全放松盆底肌',
        duration: 10,
        sets: 3,
        restDuration: 3,
        poseType: 'lying',
      },
    ],
  },
  {
    id: 'male-intermediate-1',
    title: 'Staircase Strength',
    titleZh: '阶梯训练（男）',
    description: '阶梯式收缩训练，逐步提升控制力',
    gender: 'male',
    difficulty: 'intermediate',
    duration: 8,
    exercises: [
      {
        id: 'mi-quick-1',
        type: 'quick',
        name: 'Quick Squeeze',
        nameZh: '快速收缩',
        description: '快速收缩盆底肌',
        instruction: '快速收紧盆底肌，保持1秒，放松',
        duration: 1,
        sets: 8,
        restDuration: 2,
        poseType: 'standing',
      },
      {
        id: 'mi-stair-1',
        type: 'staircase',
        name: 'Staircase Climb',
        nameZh: '阶梯收缩',
        description: '逐级收紧，像爬楼梯一样逐步加强',
        instruction: '轻轻收紧，再收紧一点，再收紧到最大，然后逐步放松',
        duration: 8,
        sets: 4,
        restDuration: 5,
        poseType: 'standing',
      },
      {
        id: 'mi-hold-1',
        type: 'sustained',
        name: 'Long Hold',
        nameZh: '长时收缩',
        description: '持续收紧盆底肌10秒',
        instruction: '收紧盆底肌，保持10秒，保持正常呼吸',
        duration: 10,
        sets: 4,
        restDuration: 5,
        poseType: 'sitting',
      },
    ],
  },
  {
    id: 'female-intermediate-1',
    title: 'Staircase Strength',
    titleZh: '阶梯训练（女）',
    description: '阶梯式收缩训练，逐步提升控制力',
    gender: 'female',
    difficulty: 'intermediate',
    duration: 8,
    exercises: [
      {
        id: 'fi-quick-1',
        type: 'quick',
        name: 'Quick Squeeze',
        nameZh: '快速收缩',
        description: '快速收缩盆底肌',
        instruction: '快速收紧盆底肌，保持1秒，放松',
        duration: 1,
        sets: 8,
        restDuration: 2,
        poseType: 'standing',
      },
      {
        id: 'fi-stair-1',
        type: 'staircase',
        name: 'Staircase Climb',
        nameZh: '阶梯收缩',
        description: '逐级收紧，像爬楼梯一样逐步加强',
        instruction: '轻轻收紧，再收紧一点，再收紧到最大，然后逐步放松',
        duration: 8,
        sets: 4,
        restDuration: 5,
        poseType: 'standing',
      },
      {
        id: 'fi-hold-1',
        type: 'sustained',
        name: 'Long Hold',
        nameZh: '长时收缩',
        description: '持续收紧盆底肌10秒',
        instruction: '收紧盆底肌，保持10秒，保持正常呼吸',
        duration: 10,
        sets: 4,
        restDuration: 5,
        poseType: 'sitting',
      },
    ],
  },
  {
    id: 'advanced-mixed-1',
    title: 'Advanced Challenge',
    titleZh: '高级挑战',
    description: '综合训练，包含所有动作类型',
    gender: 'all',
    difficulty: 'advanced',
    duration: 12,
    exercises: [
      {
        id: 'ad-quick-1',
        type: 'quick',
        name: 'Rapid Fire',
        nameZh: '快速连射',
        description: '连续快速收缩，锻炼反应速度',
        instruction: '快速收紧、放松、收紧、放松，保持节奏',
        duration: 1,
        sets: 12,
        restDuration: 2,
        poseType: 'standing',
      },
      {
        id: 'ad-hold-1',
        type: 'sustained',
        name: 'Power Hold',
        nameZh: '强力保持',
        description: '最大力度收紧，保持15秒',
        instruction: '最大力度收紧盆底肌，保持15秒，不要憋气',
        duration: 15,
        sets: 4,
        restDuration: 8,
        poseType: 'standing',
      },
      {
        id: 'ad-stair-1',
        type: 'staircase',
        name: 'Peak Staircase',
        nameZh: '峰顶阶梯',
        description: '从轻到重再到轻的完整阶梯',
        instruction: '慢慢收紧到最大力度，再慢慢放松到底',
        duration: 10,
        sets: 4,
        restDuration: 6,
        poseType: 'sitting',
      },
      {
        id: 'ad-relax-1',
        type: 'relaxation',
        name: 'Full Relaxation',
        nameZh: '完全放松',
        description: '彻底放松盆底肌',
        instruction: '深呼吸，完全放松全身，感受盆底肌的松弛',
        duration: 15,
        sets: 2,
        restDuration: 0,
        poseType: 'lying',
      },
    ],
  },
];

export function getCourseById(id: string): Course | undefined {
  return courses.find(c => c.id === id);
}

export function getCoursesByGender(gender: 'male' | 'female' | 'all'): Course[] {
  if (gender === 'all') return courses;
  return courses.filter(c => c.gender === gender || c.gender === 'all');
}

export function getCoursesByDifficulty(difficulty: string): Course[] {
  return courses.filter(c => c.difficulty === difficulty);
}
```

- [ ] **Step 3: 验证 TypeScript 编译**

```bash
cd /c/Users/huang/Desktop/sport && npx tsc --noEmit 2>&1
```

---

### Task 3: 全局布局 + 导航组件

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/app/layout.tsx`
- Create: `src/components/NavigationBar.tsx`

- [ ] **Step 1: 写全局样式**

Write `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #4CAF50;
  --primary-light: #81C784;
  --primary-dark: #388E3C;
  --accent: #FF9800;
  --accent-light: #FFB74D;
  --bg: #F5F7FA;
  --text: #1A1A2E;
}

body {
  background-color: var(--bg);
  color: var(--text);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

@layer components {
  .btn-primary {
    @apply bg-primary text-white px-6 py-3 rounded-full font-semibold 
           hover:bg-primary-dark active:scale-95 transition-all duration-200
           shadow-md hover:shadow-lg;
  }
  .btn-accent {
    @apply bg-accent text-white px-6 py-3 rounded-full font-semibold 
           hover:bg-orange-600 active:scale-95 transition-all duration-200
           shadow-md hover:shadow-lg;
  }
  .card {
    @apply bg-white rounded-2xl shadow-sm border border-gray-100 p-5;
  }
}
```

- [ ] **Step 2: 写导航组件**

Write `src/components/NavigationBar.tsx`:

```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavigationBar() {
  const pathname = usePathname();
  const isExercise = pathname.startsWith('/exercise');

  if (isExercise) return null; // hide nav during exercise

  const links = [
    { href: '/', label: '首页', icon: '🏠' },
    { href: '/stats', label: '统计', icon: '📊' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <div className="max-w-lg mx-auto flex justify-around py-2">
        {links.map(link => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center px-6 py-1 rounded-xl transition-colors
                ${active ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <span className="text-xl">{link.icon}</span>
              <span className="text-xs mt-0.5 font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

- [ ] **Step 3: 写根布局**

Write `src/app/layout.tsx`:

```typescript
import type { Metadata, Viewport } from 'next';
import './globals.css';
import NavigationBar from '@/components/NavigationBar';

export const metadata: Metadata = {
  title: 'tgang-helper | 提肛助手',
  description: '科学盆底肌训练 — 凯格尔运动助手',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#4CAF50',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="pb-16 min-h-screen">
        <main className="max-w-lg mx-auto px-4 pt-4 pb-4">
          {children}
        </main>
        <NavigationBar />
      </body>
    </html>
  );
}
```

- [ ] **Step 4: 验证编译**

```bash
cd /c/Users/huang/Desktop/sport && npx tsc --noEmit 2>&1
```

---

### Task 4: 首页 — 课程列表

**Files:**
- Create: `src/components/CourseCard.tsx`
- Create: `src/components/FilterBar.tsx`
- Write: `src/app/page.tsx`

- [ ] **Step 1: 写 CourseCard 组件**

Write `src/components/CourseCard.tsx`:

```typescript
'use client';

import { Course } from '@/types';
import Link from 'next/link';

const difficultyLabels: Record<string, { label: string; color: string }> = {
  beginner: { label: '初级', color: 'bg-green-100 text-green-700' },
  intermediate: { label: '中级', color: 'bg-orange-100 text-orange-700' },
  advanced: { label: '高级', color: 'bg-red-100 text-red-700' },
};

const genderLabels: Record<string, string> = {
  male: '♂ 男性',
  female: '♀ 女性',
  all: '通用',
};

export default function CourseCard({ course }: { course: Course }) {
  const diff = difficultyLabels[course.difficulty];
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
      <div className="card hover:shadow-md transition-shadow cursor-pointer active:scale-[0.98]">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-text">{course.titleZh}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diff.color}`}>
            {diff.label}
          </span>
        </div>
        <p className="text-gray-500 text-sm mb-3">{course.description}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {genderLabels[course.gender]}
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {course.duration} 分钟
          </span>
          {exerciseTypes.map(t => (
            <span key={t} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: 写 FilterBar 组件**

Write `src/components/FilterBar.tsx`:

```typescript
'use client';

import { Gender, Difficulty } from '@/types';

interface Props {
  gender: Gender | 'all';
  difficulty: Difficulty | 'all';
  onGenderChange: (g: Gender | 'all') => void;
  onDifficultyChange: (d: Difficulty | 'all') => void;
}

export default function FilterBar({ gender, difficulty, onGenderChange, onDifficultyChange }: Props) {
  const genders = [
    { value: 'all', label: '全部' },
    { value: 'male', label: '男性' },
    { value: 'female', label: '女性' },
  ] as const;

  const difficulties = [
    { value: 'all', label: '全部' },
    { value: 'beginner', label: '初级' },
    { value: 'intermediate', label: '中级' },
    { value: 'advanced', label: '高级' },
  ] as const;

  const btnClass = (active: boolean) =>
    `px-3 py-1.5 text-sm rounded-full font-medium transition-all ${
      active
        ? 'bg-primary text-white shadow-sm'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`;

  return (
    <div className="space-y-2 mb-4">
      <div className="flex gap-2">
        {genders.map(g => (
          <button key={g.value} className={btnClass(gender === g.value)} onClick={() => onGenderChange(g.value)}>
            {g.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        {difficulties.map(d => (
          <button key={d.value} className={btnClass(difficulty === d.value)} onClick={() => onDifficultyChange(d.value)}>
            {d.label}
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 写首页**

Write `src/app/page.tsx`:

```typescript
'use client';

import { useState, useMemo } from 'react';
import { courses } from '@/data/courses';
import { Gender, Difficulty } from '@/types';
import FilterBar from '@/components/FilterBar';
import CourseCard from '@/components/CourseCard';

export default function HomePage() {
  const [gender, setGender] = useState<Gender | 'all'>('all');
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
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pt-2">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-sm">
          K
        </div>
        <div>
          <h1 className="text-xl font-bold text-text">tgang-helper</h1>
          <p className="text-sm text-gray-400">提肛助手 · 今日也要加油 💪</p>
        </div>
      </div>

      <FilterBar gender={gender} difficulty={difficulty} onGenderChange={setGender} onDifficultyChange={setDifficulty} />

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-3xl mb-2">🧘</p>
          <p>没有匹配的课程</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: 验证编译**

```bash
cd /c/Users/huang/Desktop/sport && npx tsc --noEmit 2>&1
```

---

### Task 5: 训练执行核心 — BreathingCircle + VoiceGuide + ExerciseTimer

**Files:**
- Create: `src/components/BreathingCircle.tsx`
- Create: `src/components/VoiceGuide.tsx`
- Create: `src/components/ExerciseTimer.tsx`

- [ ] **Step 1: 写 BreathingCircle 组件**

Write `src/components/BreathingCircle.tsx`:

```typescript
'use client';

import { motion } from 'framer-motion';
import { ExercisePhase } from '@/types';

interface Props {
  phase: ExercisePhase;
  progress: number; // 0-1, current exercise progress
}

const phaseConfig = {
  contract: { scale: 0.55, color: '#4CAF50', label: '收缩', textColor: '#fff' },
  relax: { scale: 1.25, color: '#FF9800', label: '放松', textColor: '#fff' },
  rest: { scale: 1, color: '#81C784', label: '休息', textColor: '#fff' },
  idle: { scale: 1, color: '#E8F5E9', label: '准备', textColor: '#4CAF50' },
  completed: { scale: 1, color: '#4CAF50', label: '完成!', textColor: '#fff' },
};

export default function BreathingCircle({ phase, progress }: Props) {
  const config = phaseConfig[phase] || phaseConfig.idle;

  return (
    <div className="flex items-center justify-center">
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
          animate={{ strokeDashoffset: 2 * Math.PI * 110 * (1 - progress) }}
          transition={{ duration: 0.3 }}
        />
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: 写 VoiceGuide 组件**

Write `src/components/VoiceGuide.tsx`:

```typescript
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
    if (!window.speechSynthesis) return;
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
      // Small delay so DOM updates first
      const timer = setTimeout(() => speak(), 100);
      return () => clearTimeout(timer);
    }
  }, [enabled, text, speak]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  return null;
}
```

- [ ] **Step 3: 写 ExerciseTimer 组件**

Write `src/components/ExerciseTimer.tsx`:

```typescript
'use client';

import { useEffect, useRef } from 'react';

interface Props {
  duration: number;    // total seconds for this exercise
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
      <span className="text-5xl font-bold text-text tabular-nums">
        {minutes}:{secs.toString().padStart(2, '0')}
      </span>
    </div>
  );
}
```

- [ ] **Step 4: 验证编译**

```bash
cd /c/Users/huang/Desktop/sport && npx tsc --noEmit 2>&1
```

---

### Task 6: PoseGuideSVG + 训练页面

**Files:**
- Create: `src/components/PoseGuideSVG.tsx`
- Create: `src/app/exercise/[id]/page.tsx`

- [ ] **Step 1: 写人体姿势 SVG 组件**

Write `src/components/PoseGuideSVG.tsx`:

```typescript
'use client';

import { PoseType } from '@/types';

interface Props {
  poseType: PoseType;
  highlight?: string; // area to highlight
}

export default function PoseGuideSVG({ poseType, highlight }: Props) {
  // Sitting posture SVG — simplified human figure
  if (poseType === 'sitting') {
    return (
      <svg viewBox="0 0 200 280" className="w-full max-w-[200px] h-auto">
        {/* Head */}
        <circle cx="100" cy="30" r="20" fill="#FFCCBC" stroke="#333" strokeWidth="1.5" />
        {/* Body */}
        <path d="M100 50 L100 140" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
        {/* Shoulders */}
        <path d="M70 65 L130 65" stroke="#333" strokeWidth="3" strokeLinecap="round" />
        {/* Arms */}
        <path d="M70 65 L55 100 L50 110" stroke="#333" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M130 65 L145 100 L150 110" stroke="#333" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Chair */}
        <rect x="40" y="140" width="120" height="15" rx="3" fill="#8D6E63" />
        <rect x="55" y="155" width="10" height="80" fill="#8D6E63" />
        <rect x="135" y="155" width="10" height="80" fill="#8D6E63" />
        {/* Legs */}
        <path d="M85 140 L80 190 L80 210" stroke="#333" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M115 140 L120 190 L120 210" stroke="#333" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Feet */}
        <ellipse cx="80" cy="212" rx="12" ry="4" fill="#FFCCBC" />
        <ellipse cx="120" cy="212" rx="12" ry="4" fill="#FFCCBC" />
        {/* Highlighted pelvic floor area */}
        {highlight && (
          <ellipse cx="100" cy="130" rx="22" ry="10" fill="none" stroke="#4CAF50" strokeWidth="2.5" strokeDasharray="4,3" opacity={0.8}>
            <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
          </ellipse>
        )}
        {/* Label */}
        {highlight && (
          <text x="100" y="250" textAnchor="middle" className="text-xs fill-primary font-medium">
            ⚡ 发力部位
          </text>
        )}
      </svg>
    );
  }

  // Standing posture
  return (
    <svg viewBox="0 0 200 280" className="w-full max-w-[200px] h-auto">
      {/* Head */}
      <circle cx="100" cy="25" r="18" fill="#FFCCBC" stroke="#333" strokeWidth="1.5" />
      {/* Body */}
      <line x1="100" y1="43" x2="100" y2="130" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
      {/* Shoulders */}
      <line x1="72" y1="58" x2="128" y2="58" stroke="#333" strokeWidth="3" strokeLinecap="round" />
      {/* Arms */}
      <path d="M72 58 L50 95 L45 110" stroke="#333" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M128 58 L150 95 L155 110" stroke="#333" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Legs */}
      <line x1="100" y1="130" x2="80" y2="210" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="100" y1="130" x2="120" y2="210" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
      {/* Feet */}
      <ellipse cx="78" cy="212" rx="12" ry="4" fill="#FFCCBC" />
      <ellipse cx="122" cy="212" rx="12" ry="4" fill="#FFCCBC" />
      {/* Highlight */}
      {highlight && (
        <ellipse cx="100" cy="120" rx="20" ry="8" fill="none" stroke="#4CAF50" strokeWidth="2.5" strokeDasharray="4,3" opacity={0.8}>
          <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
        </ellipse>
      )}
      {highlight && (
        <text x="100" y="240" textAnchor="middle" className="text-xs fill-primary font-medium">
          ⚡ 发力部位
        </text>
      )}
    </svg>
  );
}
```

- [ ] **Step 2: 写训练页面**

Write `src/app/exercise/[id]/page.tsx`:

```typescript
'use client';

import { use, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getCourseById } from '@/data/courses';
import { Exercise, ExercisePhase } from '@/types';
import BreathingCircle from '@/components/BreathingCircle';
import PoseGuideSVG from '@/components/PoseGuideSVG';
import VoiceGuide from '@/components/VoiceGuide';
import ExerciseTimer from '@/components/ExerciseTimer';

export default function ExercisePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const course = useMemo(() => getCourseById(id), [id]);

  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(0);
  const [phase, setPhase] = useState<ExercisePhase>('idle');
  const [running, setRunning] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [timerKey, setTimerKey] = useState('init');

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

  const handleStart = () => {
    setPhase('contract');
    setRunning(true);
    setTimerKey(`${currentExIndex}-${currentSet}-${Date.now()}`);
  };

  const handlePause = () => {
    setRunning(false);
  };

  const handleTimerComplete = useCallback(() => {
    if (phase === 'contract') {
      // Switch to relax phase
      setPhase('relax');
      setTimerKey(`relax-${currentExIndex}-${currentSet}-${Date.now()}`);
      setRunning(true);
    } else if (phase === 'relax') {
      // Exercise set complete
      setRunning(false);
      if (!isLastSet) {
        // Next set
        setPhase('rest');
        setCurrentSet(s => s + 1);
        setTimerKey(`rest-${currentExIndex}-${currentSet}-${Date.now()}`);
      } else if (!isLastExercise) {
        // Next exercise
        setPhase('rest');
        setCurrentExIndex(i => i + 1);
        setCurrentSet(0);
        setTimerKey(`rest-${currentExIndex + 1}-0-${Date.now()}`);
      } else {
        // All done
        setPhase('completed');
        setRunning(false);
      }
    }
  }, [phase, isLastSet, isLastExercise, currentExIndex, currentSet]);

  const handleRestComplete = () => {
    setPhase('idle');
    setRunning(false);
  };

  const handleSetStartAgain = () => {
    setPhase('contract');
    setRunning(true);
    setTimerKey(`${currentExIndex}-${currentSet}-${Date.now()}`);
  };

  // Determine timer duration based on phase
  const timerDuration = phase === 'contract'
    ? currentEx.duration
    : phase === 'relax'
    ? Math.max(2, currentEx.duration * 0.5) // relax half the contract time
    : phase === 'rest'
    ? currentEx.restDuration || 3
    : 0;

  const voiceText = phase === 'contract'
    ? currentEx.instruction
    : phase === 'relax'
    ? '放松盆底肌'
    : phase === 'rest'
    ? '休息一下，准备下一组'
    : phase === 'completed'
    ? '训练完成！干得漂亮！'
    : currentEx.instruction;

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="w-full text-center mb-4">
        <button onClick={() => router.push('/')} className="float-left text-gray-400 hover:text-gray-600 text-sm">
          ← 返回
        </button>
        <h2 className="font-bold text-text">{course.titleZh}</h2>
        <p className="text-xs text-gray-400">
          动作 {currentExIndex + 1}/{totalExercises} · 第 {currentSet + 1}/{currentEx.sets} 组
        </p>
      </div>

      {/* Voice toggle */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => setVoiceEnabled(v => !v)}
          className={`text-sm px-3 py-1 rounded-full ${voiceEnabled ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'}`}
        >
          {voiceEnabled ? '🔊 语音已开' : '🔇 语音已关'}
        </button>
      </div>

      {/* Animation Area */}
      <div className="relative flex flex-col items-center justify-center flex-1 w-full">
        <div className="relative flex items-center justify-center">
          <BreathingCircle phase={phase} progress={0} />
        </div>

        <div className="mt-4">
          <PoseGuideSVG poseType={currentEx.poseType} highlight={phase === 'contract' ? 'pelvic' : undefined} />
        </div>

        {/* Exercise name */}
        <p className="text-lg font-semibold text-text mt-3">{currentEx.nameZh}</p>
        <p className="text-sm text-gray-400 text-center px-4">{currentEx.description}</p>
      </div>

      {/* Timer + Controls */}
      <div className="w-full mt-auto pt-6 pb-4">
        <ExerciseTimer
          duration={timerDuration}
          running={running}
          onTick={() => {}}
          onComplete={handleTimerComplete}
          resetKey={timerKey}
        />

        <div className="flex justify-center gap-4 mt-4">
          {phase === 'idle' || phase === 'rest' ? (
            <button className="btn-primary text-lg px-10" onClick={handleSetStartAgain}>
              {phase === 'rest' ? '继续' : '开始训练'}
            </button>
          ) : (
            <button
              className={`px-10 py-3 rounded-full font-semibold transition-all ${
                running
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-primary text-white shadow-md'
              }`}
              onClick={running ? handlePause : handleStart}
            >
              {running ? '暂停' : '继续'}
            </button>
          )}
        </div>
      </div>

      {/* Voice Guide */}
      <VoiceGuide text={voiceText} enabled={voiceEnabled && (phase !== 'idle')} />

      {/* Completion overlay */}
      {phase === 'completed' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 mx-4 max-w-sm text-center shadow-xl">
            <p className="text-5xl mb-4">🎉</p>
            <h3 className="text-2xl font-bold text-text mb-2">训练完成!</h3>
            <p className="text-gray-500 mb-6">干得漂亮！每天坚持效果更好 💪</p>
            <button className="btn-primary w-full mb-3" onClick={() => router.push('/')}>
             返回首页
            </button>
            <button className="text-sm text-gray-400 hover:text-gray-600" onClick={() => {
              setCurrentExIndex(0);
              setCurrentSet(0);
              setPhase('idle');
              setRunning(false);
            }}>
              再练一次
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: 验证编译**

```bash
cd /c/Users/huang/Desktop/sport && npx tsc --noEmit 2>&1
```

---

### Task 7: 训练记录 hook + 统计页面

**Files:**
- Create: `src/hooks/useTrainingRecords.ts`
- Create: `src/components/StatsCalendar.tsx`
- Create: `src/components/SummaryChart.tsx`
- Write: `src/app/stats/page.tsx`

- [ ] **Step 1: 写训练记录 hook**

Write `src/hooks/useTrainingRecords.ts`:

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrainingRecord } from '@/types';

const STORAGE_KEY = 'tgang-training-records';

export function useTrainingRecords() {
  const [records, setRecords] = useState<TrainingRecord[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRecords(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  const saveRecord = useCallback((record: TrainingRecord) => {
    setRecords(prev => {
      const updated = [...prev, record];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        // QuotaExceededError — clean old records
        if (e instanceof DOMException && e.name === 'QuotaExceededError') {
          const cleaned = updated.slice(-100);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
          return cleaned;
        }
      }
      return updated;
    });
  }, []);

  const getStats = useCallback(() => {
    const now = new Date();
    const thisMonth = now.toISOString().slice(0, 7);
    const today = now.toISOString().slice(0, 10);

    const monthRecords = records.filter(r => r.date.startsWith(thisMonth));
    const totalSessions = monthRecords.length;
    const totalMinutes = Math.round(monthRecords.reduce((s, r) => s + r.duration, 0) / 60);
    const completedToday = records.some(r => r.date === today && r.completed);

    // Calculate streak
    let streak = 0;
    const d = new Date();
    while (true) {
      const ds = d.toISOString().slice(0, 10);
      if (records.some(r => r.date === ds && r.completed)) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else break;
    }

    // Weekly minutes for chart
    const weeklyMinutes: number[] = [];
    for (let w = 0; w < 7; w++) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + w - 6);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const weekRecords = records.filter(r => {
        const rd = new Date(r.date);
        return rd >= weekStart && rd <= weekEnd;
      });
      weeklyMinutes.push(Math.round(weekRecords.reduce((s, r) => s + r.duration, 0) / 60));
    }

    return { totalSessions, totalMinutes, completedToday, streak, weeklyMinutes };
  }, [records]);

  // Get dates that have records for calendar
  const activeDates = records
    .filter(r => r.completed)
    .map(r => r.date)
    .filter((d, i, a) => a.indexOf(d) === i);

  return { records, saveRecord, getStats, activeDates };
}
```

- [ ] **Step 2: 写打卡日历组件**

Write `src/components/StatsCalendar.tsx`:

```typescript
'use client';

import { useMemo } from 'react';

interface Props {
  activeDates: string[];
}

export default function StatsCalendar({ activeDates }: Props) {
  const days = useMemo(() => {
    const result: { date: string; day: number; active: boolean }[] = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      result.push({
        date: dateStr,
        day: d.getDate(),
        active: activeDates.includes(dateStr),
      });
    }
    return result;
  }, [activeDates]);

  const weekDays = ['一', '二', '三', '四', '五', '六', '日'];

  return (
    <div>
      <h3 className="font-semibold text-text mb-3">打卡日历</h3>
      <div className="grid grid-cols-7 gap-1.5">
        {weekDays.map(d => (
          <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>
        ))}
        {days.map(d => (
          <div
            key={d.date}
            className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-colors
              ${d.active
                ? 'bg-primary text-white shadow-sm'
                : 'bg-gray-50 text-gray-400'
              }`}
            title={d.date}
          >
            {d.day}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 写统计图表组件**

Write `src/components/SummaryChart.tsx`:

```typescript
'use client';

interface Props {
  weeklyMinutes: number[];
  totalSessions: number;
  totalMinutes: number;
  streak: number;
}

export default function SummaryChart({ weeklyMinutes, totalSessions, totalMinutes, streak }: Props) {
  const maxMin = Math.max(...weeklyMinutes, 1);
  const labels = ['前7天', '前6天', '前5天', '前4天', '前3天', '前2天', '上周'];

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card text-center">
          <p className="text-2xl font-bold text-primary">{totalSessions}</p>
          <p className="text-xs text-gray-400">本月训练</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-accent">{totalMinutes}</p>
          <p className="text-xs text-gray-400">总分钟</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-orange-500">{streak}</p>
          <p className="text-xs text-gray-400">连续天数</p>
        </div>
      </div>

      {/* Bar chart */}
      <div>
        <h3 className="font-semibold text-text mb-3">每周训练（分钟）</h3>
        <div className="flex items-end gap-2 h-28">
          {weeklyMinutes.map((min, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-400">{min}</span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-primary to-primary-light transition-all"
                style={{ height: `${(min / maxMin) * 100}%`, minHeight: min > 0 ? '8px' : '0' }}
              />
              <span className="text-[10px] text-gray-400 -rotate-45 origin-left whitespace-nowrap">
                {labels[i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 写统计页面**

Write `src/app/stats/page.tsx`:

```typescript
'use client';

import { useTrainingRecords } from '@/hooks/useTrainingRecords';
import StatsCalendar from '@/components/StatsCalendar';
import SummaryChart from '@/components/SummaryChart';

export default function StatsPage() {
  const { getStats, activeDates } = useTrainingRecords();
  const stats = getStats();

  return (
    <div className="space-y-6 pt-2">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white text-lg shadow-sm">
          📊
        </div>
        <div>
          <h1 className="text-xl font-bold text-text">训练统计</h1>
          <p className="text-sm text-gray-400">坚持就是胜利 💪</p>
        </div>
      </div>

      <StatsCalendar activeDates={activeDates} />

      <SummaryChart
        weeklyMinutes={stats.weeklyMinutes}
        totalSessions={stats.totalSessions}
        totalMinutes={stats.totalMinutes}
        streak={stats.streak}
      />

      {stats.totalSessions === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p className="text-3xl mb-2">🏋️</p>
          <p>还没有训练记录</p>
          <p className="text-sm">完成一次训练后，记录会显示在这里</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: 验证编译**

```bash
cd /c/Users/huang/Desktop/sport && npx tsc --noEmit 2>&1
```

---

### Task 8: MediaPipe Pose 检测 + DeepSeek API

**Files:**
- Create: `src/hooks/usePoseDetection.ts`
- Create: `src/lib/posture-analysis.ts`
- Create: `src/lib/deepseek.ts`
- Create: `src/app/api/posture-correction/route.ts`

- [ ] **Step 1: 写姿态分析逻辑**

Write `src/lib/posture-analysis.ts`:

```typescript
import { PostureIssue } from '@/types';

// MediaPipe Pose landmark indices
const NOSE = 0;
const LEFT_SHOULDER = 11;
const RIGHT_SHOULDER = 12;
const LEFT_EAR = 7;
const RIGHT_EAR = 8;
const LEFT_HIP = 23;
const RIGHT_HIP = 24;

export interface AnalysisResult {
  issues: PostureIssue[];
  details: string[];
}

/**
 * Analyze posture from normalized landmarks
 */
export function analyzePosture(landmarks: number[][]): AnalysisResult {
  if (!landmarks || landmarks.length < 25) {
    return { issues: [], details: [] };
  }

  const issues: PostureIssue[] = [];
  const details: string[] = [];

  const nose = landmarks[NOSE];
  const lShoulder = landmarks[LEFT_SHOULDER];
  const rShoulder = landmarks[RIGHT_SHOULDER];
  const lEar = landmarks[LEFT_EAR];
  const rEar = landmarks[RIGHT_EAR];
  const lHip = landmarks[LEFT_HIP];
  const rHip = landmarks[RIGHT_HIP];

  // 1. Slouching detection (驼背)
  // Check ear y vs shoulder y — if ears are far forward relative to shoulders
  const earYAvg = (lEar[1] + rEar[1]) / 2;
  const shoulderYAvg = (lShoulder[1] + rShoulder[1]) / 2;
  const shoulderXAvg = (lShoulder[0] + rShoulder[0]) / 2;
  const earXAvg = (lEar[0] + rEar[0]) / 2;

  // In good posture, ear x should be roughly aligned with shoulder x
  // Forward head = slouching indicator
  if (earXAvg < shoulderXAvg - 0.05) {
    issues.push('slouching');
    details.push('检测到驼背：头部前倾，建议挺直背部，收下巴');
  }

  // 2. Shrugging detection (耸肩)
  // Shoulder y vs ear y — if shoulders are too high relative to ears
  // Normal: shoulder y roughly 0.35-0.45 below ear y in normalized coords
  const shoulderEarDiff = shoulderYAvg - earYAvg;
  if (shoulderEarDiff < 0.1) {
    issues.push('shrugging');
    details.push('检测到耸肩：肩膀过高，建议放松双肩，自然下沉');
  }

  // 3. Tilting detection (身体歪斜)
  // Check left vs right shoulder height difference
  const shoulderDiff = Math.abs(lShoulder[1] - rShoulder[1]);
  if (shoulderDiff > 0.04) {
    issues.push('tilting');
    const tiltDir = lShoulder[1] < rShoulder[1] ? '左肩偏高' : '右肩偏高';
    details.push(`检测到身体歪斜：${tiltDir}，建议双肩放平`);
  }

  // Also check hip tilt
  const hipDiff = Math.abs(lHip[1] - rHip[1]);
  if (hipDiff > 0.04) {
    if (!issues.includes('tilting')) {
      issues.push('tilting');
    }
    const hipTiltDir = lHip[1] < rHip[1] ? '左髋偏高' : '右髋偏高';
    details.push(`检测到骨盆倾斜：${hipTiltDir}，建议调整重心`);
  }

  return { issues, details };
}

/**
 * Format posture data for DeepSeek API
 */
export function formatPostureForAI(landmarks: number[][], issues: PostureIssue[]): string {
  const landmarkSummary = landmarks.map((l, i) => {
    // Only include key upper body landmarks
    if ([0, 7, 8, 11, 12, 23, 24].includes(i)) {
      return `landmark[${i}]: (${l[0].toFixed(3)}, ${l[1].toFixed(3)}, ${(l[2] || 0).toFixed(3)})`;
    }
    return null;
  }).filter(Boolean).join('\n');

  return `姿态问题: [${issues.join(', ')}]\n关键点数据:\n${landmarkSummary}`;
}
```

- [ ] **Step 2: 写 DeepSeek client**

Write `src/lib/deepseek.ts`:

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  timeout: 10000,
  maxRetries: 2,
});

export interface CorrectionResult {
  suggestion: string;
  shortSuggestion: string;
}

export async function getPostureCorrection(postureData: string): Promise<CorrectionResult | null> {
  try {
    const completion = await client.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL || 'deepseek-v4-pro',
      messages: [
        {
          role: 'system',
          content: `你是一个专业姿态矫正教练。根据用户姿态检测数据，给出简洁的纠正建议。
要求：
1. 回答使用中文，口语化，适合语音播报
2. 每句不超过 20 个字
3. 给出具体可操作的建议
4. 输出 JSON: { "suggestion": "完整建议", "shortSuggestion": "简短版（15字内）" }`,
        },
        {
          role: 'user',
          content: postureData,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) return null;

    return JSON.parse(content) as CorrectionResult;
  } catch (error) {
    console.error('DeepSeek API error:', error);
    return null;
  }
}
```

- [ ] **Step 3: 写 API Route**

Write `src/app/api/posture-correction/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getPostureCorrection } from '@/lib/deepseek';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { issues, landmarkSummary } = body;

    if (!issues || !landmarkSummary) {
      return NextResponse.json(
        { error: 'Missing required fields: issues, landmarkSummary' },
        { status: 400 }
      );
    }

    const postureText = `姿态问题: [${issues.join(', ')}]\n关键点数据:\n${landmarkSummary}`;
    const result = await getPostureCorrection(postureText);

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to get correction from AI' },
        { status: 502 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Posture correction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 4: 写 usePoseDetection hook**

Write `src/hooks/usePoseDetection.ts`:

```typescript
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { PostureIssue } from '@/types';
import { analyzePosture, formatPostureForAI, AnalysisResult } from '@/lib/posture-analysis';
import { CorrectionResult } from '@/lib/deepseek';

type PoseStatus = 'loading' | 'ready' | 'error' | 'unavailable';

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
  const animFrameRef = useRef<number>(0);
  const issueAccumRef = useRef<AnalysisResult | null>(null);
  const lastAICallRef = useRef<number>(0);

  // Load PoseLandmarker
  useEffect(() => {
    let cancelled = false;
    setStatus('loading');

    (async () => {
      try {
        const { PoseLandmarker, FilesetResolver, DrawingUtils } = await import('@mediapipe/tasks-vision');
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm'
        );
        const landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numPoses: 1,
          minPoseDetectionConfidence: 0.5,
          minPosePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
        if (!cancelled) {
          poseLandmarkerRef.current = { landmarker, DrawingUtils };
          setStatus('ready');
        }
      } catch (err) {
        console.error('Failed to load PoseLandmarker:', err);
        if (!cancelled) setStatus('error');
      }
    })();

    return () => { cancelled = true; };
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
    if (status !== 'ready' || !videoRef.current) return;

    const landmarker = poseLandmarkerRef.current?.landmarker;
    const DrawingUtils = poseLandmarkerRef.current?.DrawingUtils;
    if (!landmarker || !DrawingUtils) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    let lastDetection = 0;

    const detect = (now: number) => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        const timestamp = performance.now();
        const result = landmarker.detectForVideo(video, timestamp);

        // Draw landmarks
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (result.landmarks && result.landmarks[0]) {
              const landmarks = result.landmarks[0];
              const drawingUtils = new DrawingUtils(ctx);
              drawingUtils.drawLandmarks(landmarks, {
                radius: (data: any) => DrawingUtils.lerp(data.from!.z!, -0.15, 0.1, 5, 1),
              });
              drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS);

              // Analyze posture
              const normalized = landmarks.map((l: any) => [l.x, l.y, l.z || 0]);
              const analysis = analyzePosture(normalized);

              if (analysis.issues.length > 0) {
                issueAccumRef.current = analysis;
                setCurrentIssues(analysis.issues);

                // Call DeepSeek if issues persist > 5 seconds
                if (now - lastAICallRef.current > 5000) {
                  lastAICallRef.current = now;
                  setIsProcessing(true);
                  const postureText = formatPostureForAI(normalized, analysis.issues);

                  fetch('/api/posture-correction', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      issues: analysis.issues,
                      landmarkSummary: postureText,
                    }),
                  })
                    .then(res => res.json())
                    .then((data: CorrectionResult) => {
                      setCorrection(data);
                    })
                    .catch(console.error)
                    .finally(() => setIsProcessing(false));
                }
              } else {
                setCurrentIssues([]);
              }
            }
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
```

- [ ] **Step 5: 验证编译**

```bash
cd /c/Users/huang/Desktop/sport && npx tsc --noEmit 2>&1
```

---

### Task 9: 摄像头悬浮层组件 + 训练页面集成

**Files:**
- Create: `src/components/CameraView.tsx`
- Create: `src/components/CompletionModal.tsx`
- Modify: `src/app/exercise/[id]/page.tsx` (integrate camera + save records)

- [ ] **Step 1: 写 CameraView 组件**

Write `src/components/CameraView.tsx`:

```typescript
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
    <div className="relative">
      {/* Toggle button */}
      <button
        onClick={toggleCamera}
        className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full transition-all ${
          isActive
            ? 'bg-primary/10 text-primary'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
        }`}
      >
        <span>{isActive ? '📷' : '📷'}</span>
        <span>{status === 'loading' ? '加载中...' : isActive ? '摄像头开' : '摄像头关'}</span>
      </button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="fixed top-4 right-4 w-48 rounded-2xl overflow-hidden shadow-xl border-2 border-white z-40 bg-black"
          >
            {/* Mirror the video */}
            <div className="relative transform scale-x-[-1]">
              <video ref={videoRef} className="w-full h-36 object-cover" playsInline muted />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-36"
                width={640}
                height={480}
                style={{ transform: 'scaleX(-1)' }}
              />
            </div>

            {/* Status overlays */}
            <div className="absolute top-2 left-2">
              {status === 'loading' && (
                <span className="text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full">加载中</span>
              )}
              {status === 'error' && (
                <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">摄像头不可用</span>
              )}
            </div>

            {/* Posture issues */}
            {currentIssues.length > 0 && (
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-red-500/90 text-white text-xs px-2 py-1 rounded-lg">
                  {currentIssues.map(i => issueLabels[i]).join('、')}
                </div>
              </div>
            )}

            {/* AI correction suggestion */}
            {correction && (
              <div className="p-2 bg-blue-500/90 text-white text-xs">
                {correction.shortSuggestion || correction.suggestion}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: 更新训练页面（集成摄像头 + 训练记录保存）**

Edit `src/app/exercise/[id]/page.tsx` — add CameraView import and record saving logic:

Add imports at top:
```typescript
import CameraView from '@/components/CameraView';
import CompletionModal from '@/components/CompletionModal';
import { useTrainingRecords } from '@/hooks/useTrainingRecords';
```

Add hook usage before the `if (!course)` check:
```typescript
  const { saveRecord } = useTrainingRecords();
```

Add camera toggle next to voice toggle:
```typescript
        <div className="flex items-center justify-center gap-4 mb-3">
          <button
            onClick={() => setVoiceEnabled(v => !v)}
            className={`text-sm px-3 py-1 rounded-full ${voiceEnabled ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'}`}
          >
            {voiceEnabled ? '🔊 语音已开' : '🔇 语音已关'}
          </button>
          <CameraView />
        </div>
```

Replace the completion overlay with:
```typescript
      {/* Completion Modal */}
      <CompletionModal
        show={phase === 'completed'}
        courseId={id}
        courseTitle={course.titleZh}
        duration={course.duration * 60}
        onSaveRecord={saveRecord}
        onRestart={() => {
          setCurrentExIndex(0);
          setCurrentSet(0);
          setPhase('idle');
          setRunning(false);
        }}
        onHome={() => router.push('/')}
      />
```

- [ ] **Step 3: 写 CompletionModal 组件**

Write `src/components/CompletionModal.tsx`:

```typescript
'use client';

import { useEffect } from 'react';
import { TrainingRecord } from '@/types';

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
  useEffect(() => {
    if (show) {
      const record: TrainingRecord = {
        date: new Date().toISOString().slice(0, 10),
        courseId,
        courseTitle,
        duration,
        completed: true,
        postureIssues: 0,
      };
      onSaveRecord(record);
    }
  }, [show, courseId, courseTitle, duration, onSaveRecord]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 mx-4 max-w-sm text-center shadow-xl">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-text mb-2">训练完成!</h3>
        <p className="text-gray-500 mb-2">干得漂亮！每天坚持效果更好 💪</p>
        <p className="text-sm text-primary mb-6">打卡记录已保存 ✓</p>
        <button className="btn-primary w-full mb-3" onClick={onHome}>
          返回首页
        </button>
        <button className="text-sm text-gray-400 hover:text-gray-600" onClick={onRestart}>
          再练一次
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 验证编译**

```bash
cd /c/Users/huang/Desktop/sport && npx tsc --noEmit 2>&1
```

---

### Task 10: UI 打磨 + 测试验证

**Files:**
- All existing files may be lightly modified

- [ ] **Step 1: 使用 frontend-design 技能美化页面**

```bash
# Invoke frontend-design skill to polish UI
```

- [ ] **Step 2: 运行测试验证**

```bash
cd /c/Users/huang/Desktop/sport && npm run build 2>&1
```

- [ ] **Step 3: 修复所有 TypeScript 和构建错误**

- [ ] **Step 4: 最终构建验证**

```bash
cd /c/Users/huang/Desktop/sport && npm run build 2>&1
```
