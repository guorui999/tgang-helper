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
  duration: number; // seconds per set
  sets: number;
  restDuration: number; // seconds between sets
  poseType: PoseType;
}

export interface Course {
  id: string;
  title: string;
  titleZh: string;
  description: string;
  gender: Gender;
  difficulty: Difficulty;
  duration: number; // minutes
  exercises: Exercise[];
}

export interface TrainingRecord {
  date: string; // YYYY-MM-DD
  courseId: string;
  courseTitle: string;
  duration: number; // seconds
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
