# tgang-helper (提肛助手) — 设计文档

## 概述

tgang-helper 是一个帮助用户科学练习盆底肌训练（提肛 / 凯格尔运动）的 Web 应用。提供分级训练课程、动画引导、语音播报、摄像头姿势校正和训练记录功能。

## 技术栈

- **框架**: Next.js 14+ (App Router) + TypeScript
- **样式**: Tailwind CSS + Framer Motion
- **姿态检测**: `@mediapipe/tasks-vision` (Pose Landmarker)
- **AI**: DeepSeek V4 → 通过 Next.js API Route 代理
- **语音**: Web Speech API (SpeechSynthesis)
- **存储**: localStorage
- **模型版本**: `@mediapipe/tasks-vision@0.10.18`

## 路由设计

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 课程列表、今日推荐 |
| `/exercise/[id]` | 训练执行 | 动画引导 + 语音 + 摄像头 |
| `/stats` | 统计 | 打卡日历 + 图表 |

## 页面设计

### 首页 (`/`)

- **顶部**: 应用 Logo + 今日打卡状态
- **课程网格**: 按难度（初级/中级/高级）和性别（男/女）分类的课程卡片
- **每个卡片**: 课程名称、时长、难度标签、动作类型标签、完成进度
- **底部导航**: 首页 / 统计

### 训练执行 (`/exercise/[id]`)

核心交互页面，分三个区域：

- **中央动画区**:
  - 呼吸圈动画（Framer Motion）— 收缩时缩小、放松时扩大，颜色从绿渐变橙
  - 人体姿势 SVG — 显示当前动作的正确体位和发力部位（高亮区域）
- **底部控制区**:
  - 开始/暂停按钮
  - 倒计时显示
  - 当前动作名称 + 剩余组数
- **摄像头悬浮层**（可选开关）:
  - 实时摄像头画面 + MediaPipe 骨架叠加
  - 姿势偏差提示文字
  - 连续姿势异常 → 调用 DeepSeek 获取纠正建议 → 语音播报

### 统计 (`/stats`)

- **打卡日历**: 30 天热力图，标记已训练天数
- **统计摘要**: 本月训练次数、总时长、连续打卡天数
- **简单图表**: 每周训练时长柱状图

## 课程数据结构

```typescript
interface Course {
  id: string;
  title: string;
  gender: 'male' | 'female' | 'all';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // 分钟
  exercises: Exercise[];
}

interface Exercise {
  id: string;
  type: 'quick' | 'sustained' | 'staircase' | 'relaxation';
  name: string;
  description: string;
  instruction: string; // 语音播报文案
  duration: number; // 秒
  sets: number;
  restDuration: number; // 组间休息秒数
  poseType: 'sitting' | 'standing' | 'lying';
}
```

## 组件树

```
Layout (主题 + 导航)
├── HomePage
│   ├── Header (打卡状态)
│   ├── FilterBar (性别/难度筛选)
│   └── CourseGrid
│       └── CourseCard[]
├── ExercisePage
│   ├── ExerciseHeader (课程名 + 进度)
│   ├── AnimationArea
│   │   ├── BreathingCircle (呼吸圈动画)
│   │   └── PoseGuideSVG (人体姿势动画)
│   ├── ControlBar (开始/暂停 + 计时)
│   ├── VoiceGuide (语音播报)
│   └── CameraOverlay (可选)
│       ├── CameraFeed
│       └── PoseOverlay (MediaPipe 骨架)
└── StatsPage
    ├── Calendar (打卡日历)
    ├── SummaryCards (训练统计)
    └── Chart (周时长柱状图)
```

## 数据流

### 训练流程

1. 用户选择课程 → 进入 `/exercise/[id]`
2. 加载课程定义 → 按顺序遍历 exercises
3. 每个 exercise:
   - 语音播报指令 (SpeechSynthesis)
   - 呼吸圈动画同步节奏
   - SVG 姿势示范
   - 倒计时计时器
   - 完成该组 → 记录到 localStorage
   - 组间休息 → 呼吸圈恢复动画
4. 全部完成 → 弹窗庆祝 → 更新打卡日历

### 姿势检测流程

1. 用户开启摄像头
2. `usePoseDetection` hook 初始化 PoseLandmarker
3. 每帧 `detectForVideo(video, timestamp)`
4. 计算姿势偏差（驼背/耸肩/歪斜）
5. 持续偏差超过阈值（如 5 秒）→ 调用 `/api/posture-correction`
6. API Route 将姿势数据发送给 DeepSeek V4
7. 返回纠正建议 → 语音播报

### 训练记录 (localStorage)

```typescript
interface TrainingRecord {
  date: string; // YYYY-MM-DD
  courseId: string;
  duration: number;
  completed: boolean;
  postureIssues: number; // 检测到的姿势问题次数
}
```

## DeepSeek API 集成

- **Endpoint**: `https://api.deepseek.com/v1/chat/completions`
- **Model**: `deepseek-v4-pro`
- **通过 API Route 代理**: `src/app/api/posture-correction/route.ts`
- **只发送姿势数据（非图像）**: 关键点坐标 + 偏差类型

## 配色方案

- 主色: `#4CAF50` (薄荷绿) — 健康、自然
- 强调色: `#FF9800` (暖橙) — 活力、积极
- 背景: `#F5F7FA` (浅灰白)
- 文字: `#1A1A2E` (深色)
- 成功: `#4CAF50`
- 警告: `#FF9800`
- 错误: `#EF5350`

## 边界情况处理

- **摄像头不可用**: 优雅降级，无摄像头也能正常训练，仅跳过姿势校正
- **语音合成失败**: 降级为屏幕文字提示
- **(Web Worker 方案)**: 如果主线程卡顿，将 Pose 检测移至经典 Worker
- **深度求索 API 超时**: 使用 `fetch` timeout + 重试逻辑
- **localStorage 满**: 捕获 `QuotaExceededError`，清理旧数据
- **浏览器不支持 Web Speech**: 检测 `window.speechSynthesis`，显示文字

## 开发顺序

1. 项目初始化 + Tailwind 配置 + 基础布局
2. 课程数据定义 + 首页课程列表
3. 训练执行核心（呼吸圈 + 计时 + 语音）
4. 人体姿势 SVG 动画
5. 打卡日历 + 统计
6. MediaPipe Pose 姿态检测集成
7. DeepSeek 姿势纠正 API Route
8. 摄像头悬浮层 + 实时骨架
9. UI 打磨（frontend-design 技能美化）
10. 测试验证

## 非功能性要求

- 所有页面 Lighthouse Performance ≥ 80
- Pose 检测 ≤ 50ms/帧
- 首次加载 JS 包 ≤ 200KB (gzip)
- 支持 Chrome / Edge / Safari 最新版
