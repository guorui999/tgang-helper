import type { Course, Gender, Difficulty } from '@/types';

const courses: Course[] = [
  // 1. 男性入门
  {
    id: 'male-beginner',
    title: 'Beginner Male',
    titleZh: '男性入门',
    description:
      '适合男性的入门级盆底肌训练，帮助初学者掌握正确的收缩与放松节奏。',
    gender: 'male',
    difficulty: 'beginner',
    duration: 5,
    exercises: [
      {
        id: 'male-beginner-quick-1',
        type: 'quick',
        name: 'Quick Kegel',
        nameZh: '快速收缩',
        description: '快速收缩盆底肌并立即放松，感受肌肉的快速响应。',
        instruction: '吸气放松，呼气时快速收紧盆底肌并上提，保持1秒后立即放松。',
        duration: 1,
        sets: 10,
        restDuration: 3,
        poseType: 'sitting',
      },
      {
        id: 'male-beginner-sustained-1',
        type: 'sustained',
        name: 'Sustained Hold 5s',
        nameZh: '持续收缩5秒',
        description: '持续收缩盆底肌，增强肌肉耐力。',
        instruction: '呼气时收紧盆底肌并上提，保持5秒，保持正常呼吸，之后缓慢放松。',
        duration: 5,
        sets: 5,
        restDuration: 5,
        poseType: 'sitting',
      },
      {
        id: 'male-beginner-relax-1',
        type: 'relaxation',
        name: 'Deep Breathing Relax',
        nameZh: '深呼吸放松',
        description: '深呼吸放松盆底肌，帮助肌肉恢复。',
        instruction: '闭眼深呼吸，感受盆底肌完全放松，吸气时腹部微微隆起，呼气时缓慢沉下。',
        duration: 10,
        sets: 3,
        restDuration: 3,
        poseType: 'lying',
      },
    ],
  },

  // 2. 女性入门
  {
    id: 'female-beginner',
    title: 'Beginner Female',
    titleZh: '女性入门',
    description:
      '适合女性的入门级盆底肌训练，帮助初学者掌握正确的收缩与放松节奏。',
    gender: 'female',
    difficulty: 'beginner',
    duration: 5,
    exercises: [
      {
        id: 'female-beginner-quick-1',
        type: 'quick',
        name: 'Quick Kegel',
        nameZh: '快速收缩',
        description: '快速收缩盆底肌并立即放松，感受肌肉的快速响应。',
        instruction: '吸气放松，呼气时快速收紧盆底肌并上提，保持1秒后立即放松。',
        duration: 1,
        sets: 10,
        restDuration: 3,
        poseType: 'sitting',
      },
      {
        id: 'female-beginner-sustained-1',
        type: 'sustained',
        name: 'Sustained Hold 5s',
        nameZh: '持续收缩5秒',
        description: '持续收缩盆底肌，增强肌肉耐力。',
        instruction: '呼气时收紧盆底肌并上提，保持5秒，保持正常呼吸，之后缓慢放松。',
        duration: 5,
        sets: 5,
        restDuration: 5,
        poseType: 'sitting',
      },
      {
        id: 'female-beginner-relax-1',
        type: 'relaxation',
        name: 'Deep Breathing Relax',
        nameZh: '深呼吸放松',
        description: '深呼吸放松盆底肌，帮助肌肉恢复。',
        instruction: '闭眼深呼吸，感受盆底肌完全放松，吸气时腹部微微隆起，呼气时缓慢沉下。',
        duration: 10,
        sets: 3,
        restDuration: 3,
        poseType: 'lying',
      },
    ],
  },

  // 3. 阶梯训练（男）
  {
    id: 'male-intermediate',
    title: 'Staircase Training Male',
    titleZh: '阶梯训练（男）',
    description:
      '进阶男性的阶梯式训练，逐步提升收缩强度与持续时间。',
    gender: 'male',
    difficulty: 'intermediate',
    duration: 8,
    exercises: [
      {
        id: 'male-intermediate-quick-1',
        type: 'quick',
        name: 'Quick Kegel',
        nameZh: '快速收缩',
        description: '快速收缩盆底肌并立即放松，提升反应速度。',
        instruction: '呼气时快速收紧并上提盆底肌，保持1秒后快速放松，注意感受收缩与放松的交替节奏。',
        duration: 1,
        sets: 8,
        restDuration: 2,
        poseType: 'standing',
      },
      {
        id: 'male-intermediate-staircase-1',
        type: 'staircase',
        name: 'Staircase Contraction',
        nameZh: '阶梯收缩',
        description: '阶梯式逐步加强收缩强度，每级保持2秒。',
        instruction: '先轻度收缩保持2秒，再中等强度收缩保持2秒，最后全力收缩保持2秒，然后逐步放松。',
        duration: 2,
        sets: 4,
        restDuration: 5,
        poseType: 'standing',
      },
      {
        id: 'male-intermediate-sustained-1',
        type: 'sustained',
        name: 'Long Hold 10s',
        nameZh: '长时收缩10秒',
        description: '长时间持续收缩，极限挑战肌肉耐力。',
        instruction: '呼气时逐渐收紧盆底肌至最大程度，保持10秒，保持均匀呼吸，之后缓慢完全放松。',
        duration: 10,
        sets: 4,
        restDuration: 6,
        poseType: 'standing',
      },
    ],
  },

  // 4. 阶梯训练（女）
  {
    id: 'female-intermediate',
    title: 'Staircase Training Female',
    titleZh: '阶梯训练（女）',
    description:
      '进阶女性的阶梯式训练，逐步提升收缩强度与持续时间。',
    gender: 'female',
    difficulty: 'intermediate',
    duration: 8,
    exercises: [
      {
        id: 'female-intermediate-quick-1',
        type: 'quick',
        name: 'Quick Kegel',
        nameZh: '快速收缩',
        description: '快速收缩盆底肌并立即放松，提升反应速度。',
        instruction: '呼气时快速收紧并上提盆底肌，保持1秒后快速放松，注意感受收缩与放松的交替节奏。',
        duration: 1,
        sets: 8,
        restDuration: 2,
        poseType: 'standing',
      },
      {
        id: 'female-intermediate-staircase-1',
        type: 'staircase',
        name: 'Staircase Contraction',
        nameZh: '阶梯收缩',
        description: '阶梯式逐步加强收缩强度，每级保持2秒。',
        instruction: '先轻度收缩保持2秒，再中等强度收缩保持2秒，最后全力收缩保持2秒，然后逐步放松。',
        duration: 2,
        sets: 4,
        restDuration: 5,
        poseType: 'standing',
      },
      {
        id: 'female-intermediate-sustained-1',
        type: 'sustained',
        name: 'Long Hold 10s',
        nameZh: '长时收缩10秒',
        description: '长时间持续收缩，极限挑战肌肉耐力。',
        instruction: '呼气时逐渐收紧盆底肌至最大程度，保持10秒，保持均匀呼吸，之后缓慢完全放松。',
        duration: 10,
        sets: 4,
        restDuration: 6,
        poseType: 'standing',
      },
    ],
  },

  // 5. 高级挑战
  {
    id: 'advanced-all',
    title: 'Advanced Challenge',
    titleZh: '高级挑战',
    description:
      '高强度的综合训练，包含多种收缩模式和极限挑战，适合已掌握基础的用户。',
    gender: 'all',
    difficulty: 'advanced',
    duration: 12,
    exercises: [
      {
        id: 'advanced-all-quick-1',
        type: 'quick',
        name: 'Quick Fire',
        nameZh: '快速连射',
        description: '连续快速收缩放松，挑战肌肉爆发力。',
        instruction: '以最快速度连续收缩放松盆底肌，每次收缩1秒后立即放松，保持爆发力节奏。',
        duration: 1,
        sets: 12,
        restDuration: 2,
        poseType: 'standing',
      },
      {
        id: 'advanced-all-sustained-1',
        type: 'sustained',
        name: 'Power Hold 15s',
        nameZh: '强力保持15秒',
        description: '极限时长强收缩，考验最大耐力。',
        instruction: '深吸气后呼气，全力收紧盆底肌并上提，保持15秒，期间保持平稳呼吸，结束时缓慢放松。',
        duration: 15,
        sets: 4,
        restDuration: 8,
        poseType: 'standing',
      },
      {
        id: 'advanced-all-staircase-1',
        type: 'staircase',
        name: 'Peak Staircase',
        nameZh: '峰顶阶梯',
        description: '从轻到重阶梯式加强收缩，到达峰顶后逐步下降。',
        instruction: '轻度收缩2秒 → 中等收缩2秒 → 强力收缩2秒 → 全力收缩2秒 → 逐步放松。',
        duration: 2,
        sets: 4,
        restDuration: 5,
        poseType: 'standing',
      },
      {
        id: 'advanced-all-relax-1',
        type: 'relaxation',
        name: 'Full Relaxation',
        nameZh: '完全放松',
        description: '彻底放松盆底肌和全身，让肌肉得到充分恢复。',
        instruction: '平躺闭眼，深呼吸10次，感受盆底肌随着呼气逐渐下沉放松，全身肌肉依次放松。',
        duration: 20,
        sets: 2,
        restDuration: 5,
        poseType: 'lying',
      },
    ],
  },
];

// Helper functions

export function getCourseById(id: string): Course | undefined {
  return courses.find((course) => course.id === id);
}

export function getCoursesByGender(gender: Gender): Course[] {
  return courses.filter(
    (course) => course.gender === gender || course.gender === 'all'
  );
}

export function getCoursesByDifficulty(difficulty: Difficulty): Course[] {
  return courses.filter((course) => course.difficulty === difficulty);
}

export { courses };
