import React, { createContext, useContext, useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Task,
  Communication,
  UserProfile,
  ScreenType,
} from '../types';
import { translations, Translations, LanguageKey } from '../i18n/translations';
import { useAuth } from '../providers/AuthProvider';
import { useProfile } from '../hooks/useProfile';
import { useTasks } from '../hooks/useTasks';
import { useCommunications } from '../hooks/useCommunications';
import { usePersonalNotes } from '../hooks/usePersonalNotes';
import { useActivities } from '../hooks/useActivities';
import { useTopPerformers } from '../hooks/useTopPerformers';

interface AppContextType {
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  selectedDate: string; // 'YYYY-MM-DD'
  setSelectedDate: (date: string) => void;
  calendarMonth: number; // 0-11
  calendarYear: number;
  setCalendarMonth: (month: number) => void;
  setCalendarYear: (year: number) => void;
  goToNextMonth: () => void;
  goToPrevMonth: () => void;
  goToToday: () => void;

  // Data
  isLoading: boolean;
  loadError: string | null;
  retryLoad: () => void;
  tasks: Task[];
  communications: Communication[];
  notes: import('../types').MyNote[];
  activities: import('../types').ActivityItem[];
  userProfile: UserProfile;
  topPerformers: import('../types').TopPerformer[];

  // i18n
  t: Translations;
  language: LanguageKey;
  setLanguage: (lang: LanguageKey) => void;

  // Theme
  isDarkMode: boolean;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  toggleTheme: () => void;

  // Calendar View Mode (AD, BS, Dual)
  calendarMode: 'ad' | 'bs' | 'dual';
  setCalendarMode: (mode: 'ad' | 'bs' | 'dual') => void;

  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  toggleTaskComplete: (taskId: string) => void;
  /** For recurring tasks, toggles completion for one specific occurrence date only; for one-off tasks, behaves like toggleTaskComplete. */
  toggleTaskCompleteOnDate: (taskId: string, dateStr: string) => void;
  completeTaskWithPhoto: (taskId: string, blob: Blob, caption?: string) => void;
  attachPhotoToTask: (taskId: string, blob: Blob, caption?: string) => void;
  removePhotoFromTask: (taskId: string, photoId: string) => void;
  deleteTask: (taskId: string) => void;
  toggleCommunicationComplete: (commId: string) => void;
  createCommunication: (input: { title: string; description: string; dueDate: string }) => void;
  deleteCommunication: (commId: string) => void;
  addNoteToTask: (taskId: string, noteText: string) => void;
  addNoteToComm: (commId: string, noteText: string) => void;
  addPersonalNote: (text: string) => void;
  togglePersonalNote: (noteId: string) => void;
  deletePersonalNote: (noteId: string) => void;
  snoozeTask: (taskId: string, hours?: number) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  clearCache: () => void;
  syncData: () => void;
  playChime: () => void;
  signOut: () => void;

  // Modals & UI States
  isAddTaskModalOpen: boolean;
  setIsAddTaskModalOpen: (open: boolean) => void;
  isLegendModalOpen: boolean;
  setIsLegendModalOpen: (open: boolean) => void;
  selectedAttachment: Communication | null;
  setSelectedAttachment: (comm: Communication | null) => void;
  photoProofModalTask: Task | null;
  setPhotoProofModalTask: (task: Task | null) => void;
  previewPhoto: { url: string; title: string; caption?: string; user?: string; time?: string } | null;
  setPreviewPhoto: (photo: { url: string; title: string; caption?: string; user?: string; time?: string } | null) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isEditProfileModalOpen: boolean;
  setIsEditProfileModalOpen: (open: boolean) => void;
  isExportReportModalOpen: boolean;
  setIsExportReportModalOpen: (open: boolean) => void;
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;

  // Filtered metrics
  urgentTasksCount: number;
  generalTasksCount: number;
  communicationsCount: number;
  myNotesCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_PROFILE: UserProfile = {
  id: '',
  name: '',
  email: '',
  role: '',
  branch: '',
  joinedDate: '',
  avatarUrl: '',
  theme: 'auto',
  language: 'English',
  calendarMode: 'dual',
  pushNotifications: true,
  dailySummary: true,
  soundVibration: true,
};

const NOTIFICATION_READ_STORAGE_KEY = 'taskn:read-notification-ids';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const { signOut: authSignOut } = useAuth();

  const { profile, isLoading: profileLoading, error: profileError, refetch: refetchProfile, updateProfile } = useProfile();
  const userProfile = profile ?? DEFAULT_PROFILE;

  const tasksHook = useTasks();
  const commsHook = useCommunications();
  const personalNotesHook = usePersonalNotes();
  const activitiesHook = useActivities();
  const { topPerformers } = useTopPerformers();

  const tasks = tasksHook.tasks;
  const communications = commsHook.communications;
  const notes = personalNotesHook.notes;
  const activities = activitiesHook.activities;

  // A hard timeout so a stuck request (network hang, a stale realtime
  // subscription, etc.) always resolves into a visible error + retry
  // instead of spinning forever — the actual root cause of "infinite
  // loading" reports is rarely worth guessing at blind; what matters is
  // that the user is never left staring at a spinner with no way out.
  const [timedOut, setTimedOut] = useState(false);
  const stillLoading = profileLoading || tasksHook.isLoading;
  React.useEffect(() => {
    if (!stillLoading) {
      setTimedOut(false);
      return undefined;
    }
    const timer = setTimeout(() => setTimedOut(true), 15000);
    return () => clearTimeout(timer);
  }, [stillLoading]);

  const isLoading = stillLoading && !timedOut;
  const loadError = timedOut
    ? 'This is taking longer than expected. Your connection may be slow, or something went wrong loading your account.'
    : profileError
    ? profileError instanceof Error
      ? profileError.message
      : 'Failed to load your profile.'
    : tasksHook.error
    ? 'Failed to load your tasks.'
    : null;

  const retryLoad = () => {
    setTimedOut(false);
    void refetchProfile();
    void tasksHook.refetch();
  };

  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard');
  const [selectedDate, setSelectedDate] = useState<string>(() => toIsoDate(new Date()));
  const [calendarMonth, setCalendarMonth] = useState<number>(() => new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState<number>(() => new Date().getFullYear());

  // Modals state
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isLegendModalOpen, setIsLegendModalOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<Communication | null>(null);
  const [photoProofModalTask, setPhotoProofModalTask] = useState<Task | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<{
    url: string;
    title: string;
    caption?: string;
    user?: string;
    time?: string;
  } | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isExportReportModalOpen, setIsExportReportModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 2800);
  };

  const onError = (err: unknown) => {
    showToast(err instanceof Error ? err.message : 'Something went wrong', 'error');
  };

  // Internationalization
  const language = userProfile.language || 'English';
  const t = useMemo(() => translations[language] || translations.English, [language]);

  const setLanguage = (newLang: LanguageKey) => {
    void updateProfile({ language: newLang }).catch(onError);
    const dict = translations[newLang] || translations.English;
    showToast(dict.toastSettingsSaved || 'Language updated!');
  };

  // Theme Handling
  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const isDarkMode = useMemo(() => {
    if (userProfile.theme === 'dark') return true;
    if (userProfile.theme === 'light') return false;
    return systemIsDark;
  }, [userProfile.theme, systemIsDark]);

  React.useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [isDarkMode]);

  const setTheme = (newTheme: 'light' | 'dark' | 'auto') => {
    void updateProfile({ theme: newTheme }).catch(onError);
  };

  const toggleTheme = () => {
    const nextTheme = isDarkMode ? 'light' : 'dark';
    setTheme(nextTheme);
    showToast(`${nextTheme === 'dark' ? t.themeDark : t.themeLight}`, 'info');
  };

  const calendarMode = userProfile.calendarMode || 'dual';
  const setCalendarMode = (mode: 'ad' | 'bs' | 'dual') => {
    void updateProfile({ calendarMode: mode }).catch(onError);
    const modeLabel = mode === 'ad' ? t.calendarModeAD : mode === 'bs' ? t.calendarModeBS : t.calendarModeDual;
    showToast(`${t.calendarViewPreference}: ${modeLabel}`, 'info');
  };

  const playChime = () => {
    if (!userProfile.soundVibration) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  const goToNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((y) => y + 1);
    } else {
      setCalendarMonth((m) => m + 1);
    }
  };

  const goToPrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((y) => y - 1);
    } else {
      setCalendarMonth((m) => m - 1);
    }
  };

  const goToToday = () => {
    const now = new Date();
    setCalendarMonth(now.getMonth());
    setCalendarYear(now.getFullYear());
    setSelectedDate(toIsoDate(now));
    showToast(now.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }), 'info');
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    tasksHook
      .createTask({
        title: taskData.title,
        description: taskData.description,
        category: taskData.category,
        dueDate: taskData.dueDate,
        priority: taskData.priority,
        repeat: taskData.repeat,
        isUrgent: taskData.isUrgent,
        notifications: taskData.notifications,
        attachmentName: taskData.attachmentName,
        attachmentUrl: taskData.attachmentUrl,
      })
      .then(() => {
        showToast(t.toastTaskAdded || `Task "${taskData.title}" added successfully!`);
        playChime();
      })
      .catch(onError);
  };

  const toggleTaskComplete = (taskId: string) => {
    const task = tasks.find((tItem) => tItem.id === taskId);
    if (!task) return;
    const willComplete = !task.completed;
    tasksHook
      .toggleComplete(task)
      .then(() => {
        if (willComplete) {
          playChime();
          showToast(t.toastTaskCompleted);
        } else {
          showToast(t.toastTaskReopened, 'info');
        }
      })
      .catch(onError);
  };

  const toggleTaskCompleteOnDate = (taskId: string, dateStr: string) => {
    const task = tasks.find((tItem) => tItem.id === taskId);
    if (!task) return;
    if (!task.repeat || task.repeat === 'none') {
      toggleTaskComplete(taskId);
      return;
    }
    const willComplete = !(task.completedDates ?? []).includes(dateStr);
    tasksHook
      .toggleOccurrenceComplete({ task, dateStr })
      .then(() => {
        if (willComplete) {
          playChime();
          showToast(t.toastTaskCompleted);
        } else {
          showToast(t.toastTaskReopened, 'info');
        }
      })
      .catch(onError);
  };

  const completeTaskWithPhoto = (taskId: string, blob: Blob, caption?: string) => {
    const task = tasks.find((tItem) => tItem.id === taskId);
    // A recurring task has no single global "completed" state — completing
    // it via this modal (no date context beyond "now") marks today's
    // occurrence only, same as the calendar's per-date checkbox would.
    const promise =
      task && task.repeat && task.repeat !== 'none'
        ? tasksHook.attachPhoto({ taskId, blob, caption }).then(() =>
            tasksHook.toggleOccurrenceComplete({ task, dateStr: toIsoDate(new Date()) })
          )
        : tasksHook.completeWithPhoto({ taskId, blob, caption });

    promise
      .then(() => {
        playChime();
        showToast('Task marked complete with photo proof!');
      })
      .catch(onError);
  };

  const attachPhotoToTask = (taskId: string, blob: Blob, caption?: string) => {
    tasksHook
      .attachPhoto({ taskId, blob, caption })
      .then(() => showToast('Photo proof attached to task!'))
      .catch(onError);
  };

  const removePhotoFromTask = (taskId: string, photoId: string) => {
    const task = tasks.find((tItem) => tItem.id === taskId);
    const photo = task?.photos?.find((p) => p.id === photoId);
    if (!photo) return;
    tasksHook
      .removePhoto({ id: photo.id, storagePath: photo.storagePath })
      .then(() => showToast('Photo removed', 'info'))
      .catch(onError);
  };

  const deleteTask = (taskId: string) => {
    tasksHook
      .deleteTask(taskId)
      .then(() => showToast('Task removed', 'info'))
      .catch(onError);
  };

  const toggleCommunicationComplete = (commId: string) => {
    const comm = communications.find((c) => c.id === commId);
    if (!comm) return;
    const nextState = !comm.isCompleted;
    commsHook
      .toggleComplete(comm)
      .then(() => {
        if (nextState) {
          playChime();
          showToast(t.toastTaskCompleted);
        }
      })
      .catch(onError);
  };

  const createCommunication = (input: { title: string; description: string; dueDate: string }) => {
    commsHook
      .createCommunication(input)
      .then(() => showToast(`Communication "${input.title}" added successfully!`))
      .catch(onError);
  };

  const deleteCommunication = (commId: string) => {
    commsHook
      .deleteCommunication(commId)
      .then(() => showToast('Communication removed', 'info'))
      .catch(onError);
  };

  const addNoteToTask = (taskId: string, noteText: string) => {
    if (!noteText.trim()) return;
    tasksHook
      .addNote({ taskId, body: noteText })
      .then(() => showToast('Note added to task!'))
      .catch(onError);
  };

  const addNoteToComm = (commId: string, noteText: string) => {
    if (!noteText.trim()) return;
    commsHook
      .addNote({ communicationId: commId, body: noteText })
      .then(() => showToast('Note added to communication'))
      .catch(onError);
  };

  const addPersonalNote = (text: string) => {
    if (!text.trim()) return;
    personalNotesHook
      .addNote(text)
      .then(() => showToast('Note added to My Tasks & Notes'))
      .catch(onError);
  };

  const togglePersonalNote = (noteId: string) => {
    personalNotesHook.toggleNote(noteId).catch(onError);
  };

  const deletePersonalNote = (noteId: string) => {
    personalNotesHook
      .deleteNote(noteId)
      .then(() => showToast('Note deleted', 'info'))
      .catch(onError);
  };

  const snoozeTask = (taskId: string, hours: number = 2) => {
    tasksHook
      .snoozeTask({ taskId, hours })
      .then(() => showToast(`${t.snoozedFor2Hours}`, 'info'))
      .catch(onError);
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    updateProfile(updates)
      .then(() => showToast(t.toastProfileUpdated || 'Profile updated successfully!'))
      .catch(onError);
  };

  const clearCache = () => {
    queryClient.clear();
    try {
      localStorage.removeItem(NOTIFICATION_READ_STORAGE_KEY);
    } catch {
      // ignore
    }
    showToast(t.toastCacheCleared || 'Local cache cleared — refetching from server.', 'info');
  };

  const syncData = () => {
    void queryClient.invalidateQueries();
    playChime();
    showToast(t.toastSynced || 'Data synchronized with central retail server!', 'success');
  };

  const signOut = () => {
    void authSignOut();
  };

  // Counts
  const urgentTasksCount = tasks.filter((tItem) => tItem.isUrgent && !tItem.completed).length;
  const generalTasksCount = tasks.filter((tItem) => !tItem.isUrgent && !tItem.completed).length;
  const communicationsCount = communications.filter((c) => !c.isCompleted).length;
  const myNotesCount = notes.filter((n) => !n.completed).length;

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        selectedDate,
        setSelectedDate,
        calendarMonth,
        calendarYear,
        setCalendarMonth,
        setCalendarYear,
        goToNextMonth,
        goToPrevMonth,
        goToToday,
        isLoading,
        loadError,
        retryLoad,
        tasks,
        communications,
        notes,
        activities,
        userProfile,
        topPerformers,
        t,
        language,
        setLanguage,
        isDarkMode,
        setTheme,
        toggleTheme,
        calendarMode,
        setCalendarMode,
        addTask,
        toggleTaskComplete,
        toggleTaskCompleteOnDate,
        completeTaskWithPhoto,
        attachPhotoToTask,
        removePhotoFromTask,
        deleteTask,
        toggleCommunicationComplete,
        createCommunication,
        deleteCommunication,
        addNoteToTask,
        addNoteToComm,
        addPersonalNote,
        togglePersonalNote,
        deletePersonalNote,
        snoozeTask,
        updateUserProfile,
        clearCache,
        syncData,
        playChime,
        signOut,
        isAddTaskModalOpen,
        setIsAddTaskModalOpen,
        isLegendModalOpen,
        setIsLegendModalOpen,
        selectedAttachment,
        setSelectedAttachment,
        photoProofModalTask,
        setPhotoProofModalTask,
        previewPhoto,
        setPreviewPhoto,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isEditProfileModalOpen,
        setIsEditProfileModalOpen,
        isExportReportModalOpen,
        setIsExportReportModalOpen,
        toast,
        showToast,
        urgentTasksCount,
        generalTasksCount,
        communicationsCount,
        myNotesCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

function toIsoDate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
