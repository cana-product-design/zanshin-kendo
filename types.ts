
export enum TrainingEnvironment {
  GYM = 'GYM',
  HOME = 'HOME',
  DOJO = 'DOJO'
}

export enum KendoLevel {
  BEGINNER = 'Beginner (Mudansha)',
  INTERMEDIATE = 'Intermediate (1-3 Dan)',
  ADVANCED = 'Advanced (4+ Dan)'
}

export interface UserProfile {
  name: string;
  age: number;
  height: number; // cm
  weight: number; // kg
  level: KendoLevel;
  injuries: string;
  goals: string;
}

export interface Exercise {
  name: string;
  reps: string;
  sets: number;
  description: string;
  muscleFocus: string; // e.g., "Left Calf (Fumikomi)", "Forearms"
  category: 'WARMUP' | 'STRENGTH' | 'CARDIO' | 'HIIT' | 'SKILL' | 'COOLDOWN';
}

export interface TrainingSession {
  id: string;
  dayLabel: string; // e.g. "Day 1", "Day 2", "Wednesday"
  title: string;
  environment: TrainingEnvironment;
  durationMinutes: number;
  focus: string; // e.g., "Explosive Power", "Endurance"
  exercises: Exercise[];
}

export interface TrainingPlan {
  environment: TrainingEnvironment;
  programTitle: string; // e.g. "Dojo Master Hypertrophy"
  description: string;
  durationWeeks: number; // e.g. 4
  frequencyPerWeek: number; // e.g. 4
  sessions: TrainingSession[]; // The weekly schedule
}

export interface ProgressHistoryPoint {
  week: string;
  xp: number;
  completedSessions: number;
}

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  completedWorkouts: number;
  history?: ProgressHistoryPoint[];
}
