export type TimelineRepeatType = 'today_only' | 'daily' | 'specific_days' | 'date_range';

export type TimelineCategory =
  | 'focus'
  | 'work'
  | 'health'
  | 'personal'
  | 'study'
  | 'routine'
  | 'break';

export interface TimelineItem {
  id: string;
  title: string;
  startTime: string; // e.g., "09:00" (24h HH:mm)
  endTime: string;   // e.g., "10:30" (24h HH:mm)
  category: TimelineCategory;
  color: string;
  emoji: string;
  notes?: string;
  repeatType: TimelineRepeatType;
  specificDays?: number[]; // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  startDate?: string;      // "YYYY-MM-DD"
  endDate?: string;        // "YYYY-MM-DD"
  completedDates?: string[]; // Array of "YYYY-MM-DD" strings when completed
  createdAt: string;
}

export interface TimelineCategoryMeta {
  key: TimelineCategory;
  label: string;
  color: string;
  emoji: string;
}

export const TIMELINE_CATEGORIES: TimelineCategoryMeta[] = [
  { key: 'focus', label: 'Deep Focus', color: '#6366F1', emoji: '🎯' },
  { key: 'work', label: 'Work & Tasks', color: '#3B82F6', emoji: '💼' },
  { key: 'health', label: 'Health & Workout', color: '#10B981', emoji: '🏃' },
  { key: 'study', label: 'Study & Reading', color: '#8B5CF6', emoji: '📚' },
  { key: 'personal', label: 'Personal & Life', color: '#EC4899', emoji: '✨' },
  { key: 'routine', label: 'Daily Routine', color: '#F59E0B', emoji: '☀️' },
  { key: 'break', label: 'Break & Rest', color: '#14B8A6', emoji: '☕' },
];

export const TIMELINE_TEMPLATES: {
  title: string;
  description: string;
  emoji: string;
  items: Omit<TimelineItem, 'id' | 'createdAt' | 'completedDates'>[];
}[] = [
  {
    title: 'Productive Workday',
    description: 'Balanced day of deep focus, meetings & breaks',
    emoji: '🚀',
    items: [
      {
        title: 'Morning Routine & Planning',
        startTime: '08:30',
        endTime: '09:00',
        category: 'routine',
        color: '#F59E0B',
        emoji: '☀️',
        repeatType: 'daily',
      },
      {
        title: 'Deep Focus Work Session',
        startTime: '09:30',
        endTime: '12:00',
        category: 'focus',
        color: '#6366F1',
        emoji: '🎯',
        repeatType: 'daily',
      },
      {
        title: 'Lunch & Relax',
        startTime: '12:30',
        endTime: '13:30',
        category: 'break',
        color: '#14B8A6',
        emoji: '🥗',
        repeatType: 'daily',
      },
      {
        title: 'Afternoon Tasks & Review',
        startTime: '14:30',
        endTime: '17:00',
        category: 'work',
        color: '#3B82F6',
        emoji: '💼',
        repeatType: 'daily',
      },
      {
        title: 'Evening Workout / Walk',
        startTime: '18:00',
        endTime: '19:00',
        category: 'health',
        color: '#10B981',
        emoji: '🏃',
        repeatType: 'daily',
      },
    ],
  },
  {
    title: 'Mindful & Healthy',
    description: 'Focus on wellness, reading and daily fitness',
    emoji: '🌿',
    items: [
      {
        title: 'Morning Hydration & Yoga',
        startTime: '07:00',
        endTime: '08:00',
        category: 'health',
        color: '#10B981',
        emoji: '🧘',
        repeatType: 'daily',
      },
      {
        title: 'Reading & Learning',
        startTime: '09:00',
        endTime: '10:30',
        category: 'study',
        color: '#8B5CF6',
        emoji: '📖',
        repeatType: 'daily',
      },
      {
        title: 'Outdoor Walk & Sunshine',
        startTime: '16:00',
        endTime: '17:00',
        category: 'personal',
        color: '#EC4899',
        emoji: '🌳',
        repeatType: 'daily',
      },
    ],
  },
];
