import { LanguageKey } from './i18n/translations';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskCategory = 
  | 'Protein Bar'
  | 'RTD Nepal'
  | 'Gym Reading'
  | 'AI'
  | 'Excel'
  | 'Learning New Activity'
  | 'Inventory'
  | 'Merchandising'
  | 'Compliance'
  | string;

export interface TaskPhotoProof {
  id: string;
  url: string; // base64 or URL
  name?: string;
  caption?: string;
  uploadedAt: string;
  uploadedBy?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  dueDate: string; // YYYY-MM-DD or DD/MM/YYYY
  priority: Priority;
  repeat: 'none' | 'daily' | 'weekly' | 'monthly';
  isUrgent: boolean;
  notifications: {
    enabled: boolean;
    timing: '15m' | '30m' | '1h' | '1d';
  };
  completed: boolean;
  completedBy?: string;
  completedAt?: string;
  notes?: string[];
  photos?: TaskPhotoProof[];
  attachmentName?: string;
  attachmentUrl?: string;
  createdAt: string;
}

export interface Communication {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  attachmentName?: string;
  attachmentUrl?: string;
  attachmentSize?: string;
  completedBy?: string;
  completedAt?: string;
  isCompleted: boolean;
  notes?: string[];
  photos?: TaskPhotoProof[];
}

export interface MyNote {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  type: 'updated' | 'completed' | 'snoozed' | 'note_added' | 'created';
  user: string;
  time: string;
  date: string;
  statusBadge?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  branch: string;
  joinedDate: string;
  avatarUrl: string;
  theme: 'auto' | 'light' | 'dark';
  language: LanguageKey;
  calendarMode?: 'ad' | 'bs' | 'dual';
  pushNotifications: boolean;
  dailySummary: boolean;
  soundVibration: boolean;
}

export interface TopPerformer {
  id: string;
  name: string;
  role: string;
  taskCount: number;
  qaPercentage: number;
  rank: number;
  avatar?: string;
  initials?: string;
}

export interface WeeklyVolumeItem {
  day: string;
  shortDay: string;
  volume: number;
  percentage: number;
  isToday?: boolean;
}

export type ScreenType =
  | 'dashboard'
  | 'add-task'
  | 'media'
  | 'admin'
  | 'activity'
  | 'urgent-tasks'
  | 'store-tasks'
  | 'communications'
  | 'notes';
