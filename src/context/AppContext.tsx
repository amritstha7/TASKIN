import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Task,
  TaskPhotoProof,
  Communication,
  MyNote,
  ActivityItem,
  UserProfile,
  TopPerformer,
  ScreenType,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_TASKS,
  INITIAL_COMMUNICATIONS,
  INITIAL_NOTES,
  INITIAL_ACTIVITIES,
  INITIAL_TOP_PERFORMERS,
} from '../data/initialData';
import { translations, Translations, LanguageKey } from '../i18n/translations';

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
  tasks: Task[];
  communications: Communication[];
  notes: MyNote[];
  activities: ActivityItem[];
  userProfile: UserProfile;
  topPerformers: TopPerformer[];
  
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
  completeTaskWithPhoto: (taskId: string, photo: TaskPhotoProof, note?: string) => void;
  attachPhotoToTask: (taskId: string, photo: TaskPhotoProof) => void;
  removePhotoFromTask: (taskId: string, photoId: string) => void;
  deleteTask: (taskId: string) => void;
  toggleCommunicationComplete: (commId: string) => void;
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

const STORAGE_KEYS = {
  TASKS: 'taskn_tasks_v2',
  COMMUNICATIONS: 'taskn_comms_v2',
  NOTES: 'taskn_notes_v2',
  ACTIVITIES: 'taskn_activities_v2',
  USER: 'taskn_user_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard');
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-14');
  const [calendarMonth, setCalendarMonth] = useState<number>(7); // August = 7 (0-indexed)
  const [calendarYear, setCalendarYear] = useState<number>(2026);

  // Load persisted state or fallback to authentic defaults
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [communications, setCommunications] = useState<Communication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMMUNICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_COMMUNICATIONS;
    } catch {
      return INITIAL_COMMUNICATIONS;
    }
  });

  const [notes, setNotes] = useState<MyNote[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
      return saved ? JSON.parse(saved) : INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [topPerformers] = useState<TopPerformer[]>(INITIAL_TOP_PERFORMERS);

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

  // Internationalization
  const language = userProfile.language || 'English';
  const t = useMemo(() => {
    return translations[language] || translations.English;
  }, [language]);

  const setLanguage = (newLang: LanguageKey) => {
    updateUserProfile({ language: newLang });
    const dict = translations[newLang] || translations.English;
    showToast(dict.toastSettingsSaved || 'Language updated!');
  };

  // Theme Handling (Clean & Robust)
  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
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

  useEffect(() => {
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
    updateUserProfile({ theme: newTheme });
  };

  const toggleTheme = () => {
    const nextTheme = isDarkMode ? 'light' : 'dark';
    setTheme(nextTheme);
    showToast(`${nextTheme === 'dark' ? t.themeDark : t.themeLight}`, 'info');
  };

  // Calendar View Mode: 'ad' | 'bs' | 'dual'
  const calendarMode = userProfile.calendarMode || 'dual';
  const setCalendarMode = (mode: 'ad' | 'bs' | 'dual') => {
    updateUserProfile({ calendarMode: mode });
    const modeLabel =
      mode === 'ad' ? t.calendarModeAD : mode === 'bs' ? t.calendarModeBS : t.calendarModeDual;
    showToast(`${t.calendarViewPreference}: ${modeLabel}`, 'info');
  };

  // Save to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMMUNICATIONS, JSON.stringify(communications));
    } catch (e) {
      console.error(e);
    }
  }, [communications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch (e) {
      console.error(e);
    }
  }, [notes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    } catch (e) {
      console.error(e);
    }
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userProfile));
    } catch (e) {
      console.error(e);
    }
  }, [userProfile]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 2800);
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
    setCalendarMonth(7); // Aug 2026
    setCalendarYear(2026);
    setSelectedDate('2026-08-14');
    showToast(`${t.monthAugust} 14, 2026`, 'info');
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);

    // Add activity log
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      title: newTask.title,
      description: `Task created in category "${newTask.category}".`,
      type: 'created',
      user: userProfile.name,
      time: nowTime,
      date: '14/08/2026',
      statusBadge: 'Created',
    };
    setActivities((prev) => [newActivity, ...prev]);

    showToast(t.toastTaskAdded || `Task "${newTask.title}" added successfully!`);
    playChime();
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((tItem) => {
        if (tItem.id === taskId) {
          const willBeCompleted = !tItem.completed;
          const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

          // Record activity log
          const newActivity: ActivityItem = {
            id: `act-${Date.now()}`,
            title: tItem.title,
            description: willBeCompleted ? 'Task marked as completed.' : 'Task reopened for further action.',
            type: willBeCompleted ? 'completed' : 'updated',
            user: userProfile.name,
            time: nowTime,
            date: '14/08/2026',
            statusBadge: willBeCompleted ? 'Completed' : 'Updated',
          };
          setActivities((a) => [newActivity, ...a]);

          if (willBeCompleted) {
            playChime();
            showToast(t.toastTaskCompleted);
          } else {
            showToast(t.toastTaskReopened, 'info');
          }

          return {
            ...tItem,
            completed: willBeCompleted,
            completedBy: willBeCompleted ? userProfile.name : undefined,
            completedAt: willBeCompleted ? nowTime : undefined,
          };
        }
        return tItem;
      })
    );
  };

  const completeTaskWithPhoto = (taskId: string, photo: TaskPhotoProof, note?: string) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    setTasks((prev) =>
      prev.map((tItem) => {
        if (tItem.id === taskId) {
          const updatedPhotos = [...(tItem.photos || []), photo];
          const updatedNotes = note && note.trim() ? [...(tItem.notes || []), note.trim()] : (tItem.notes || []);
          return {
            ...tItem,
            completed: true,
            completedBy: userProfile.name,
            completedAt: nowTime,
            photos: updatedPhotos,
            notes: updatedNotes,
          };
        }
        return tItem;
      })
    );

    const task = tasks.find((tItem) => tItem.id === taskId);
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      title: task ? task.title : 'Task',
      description: `Task completed with photo proof by ${userProfile.name}.`,
      type: 'completed',
      user: userProfile.name,
      time: nowTime,
      date: '14/08/2026',
      statusBadge: 'Completed with Proof',
    };
    setActivities((prev) => [newActivity, ...prev]);

    playChime();
    showToast('Task marked complete with photo proof!');
  };

  const attachPhotoToTask = (taskId: string, photo: TaskPhotoProof) => {
    setTasks((prev) =>
      prev.map((tItem) => {
        if (tItem.id === taskId) {
          return {
            ...tItem,
            photos: [...(tItem.photos || []), photo],
          };
        }
        return tItem;
      })
    );
    showToast('Photo proof attached to task!');
  };

  const removePhotoFromTask = (taskId: string, photoId: string) => {
    setTasks((prev) =>
      prev.map((tItem) => {
        if (tItem.id === taskId) {
          return {
            ...tItem,
            photos: (tItem.photos || []).filter((p) => p.id !== photoId),
          };
        }
        return tItem;
      })
    );
    showToast('Photo removed', 'info');
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((tItem) => tItem.id !== taskId));
    showToast('Task removed', 'info');
  };

  const toggleCommunicationComplete = (commId: string) => {
    setCommunications((prev) =>
      prev.map((c) => {
        if (c.id === commId) {
          const nextState = !c.isCompleted;
          const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
          const newActivity: ActivityItem = {
            id: `act-${Date.now()}`,
            title: c.title,
            description: nextState ? 'Communication confirmed and signed off.' : 'Communication marked pending.',
            type: nextState ? 'completed' : 'updated',
            user: userProfile.name,
            time: nowTime,
            date: '14/08/2026',
            statusBadge: nextState ? 'Completed' : 'Updated',
          };
          setActivities((a) => [newActivity, ...a]);

          if (nextState) {
            playChime();
            showToast(t.toastTaskCompleted);
          }

          return {
            ...c,
            isCompleted: nextState,
            completedBy: nextState ? userProfile.name : undefined,
            completedAt: nextState ? '14/08/2026' : undefined,
          };
        }
        return c;
      })
    );
  };

  const addNoteToTask = (taskId: string, noteText: string) => {
    if (!noteText.trim()) return;
    setTasks((prev) =>
      prev.map((tItem) => {
        if (tItem.id === taskId) {
          return {
            ...tItem,
            notes: [...(tItem.notes || []), noteText.trim()],
          };
        }
        return tItem;
      })
    );

    const task = tasks.find((tItem) => tItem.id === taskId);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      title: task ? task.title : 'Task',
      description: `Note added: "${noteText.trim().slice(0, 40)}${noteText.length > 40 ? '...' : ''}"`,
      type: 'note_added',
      user: userProfile.name,
      time: nowTime,
      date: '14/08/2026',
    };
    setActivities((prev) => [newActivity, ...prev]);
    showToast('Note added to task!');
  };

  const addNoteToComm = (commId: string, noteText: string) => {
    if (!noteText.trim()) return;
    setCommunications((prev) =>
      prev.map((c) => {
        if (c.id === commId) {
          return {
            ...c,
            notes: [...(c.notes || []), noteText.trim()],
          };
        }
        return c;
      })
    );
    showToast('Note added to communication');
  };

  const addPersonalNote = (text: string) => {
    if (!text.trim()) return;
    const newNote: MyNote = {
      id: `note-${Date.now()}`,
      text: text.trim(),
      completed: false,
      createdAt: '14/08/2026, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    };
    setNotes((prev) => [newNote, ...prev]);

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      title: 'My Tasks & Notes',
      description: `New note added: "${text.trim().slice(0, 30)}..."`,
      type: 'note_added',
      user: userProfile.name,
      time: nowTime,
      date: '14/08/2026',
    };
    setActivities((prev) => [newActivity, ...prev]);
    showToast('Note added to My Tasks & Notes');
  };

  const togglePersonalNote = (noteId: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, completed: !n.completed } : n))
    );
  };

  const deletePersonalNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    showToast('Note deleted', 'info');
  };

  const snoozeTask = (taskId: string, hours: number = 2) => {
    const task = tasks.find((tItem) => tItem.id === taskId);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      title: task ? task.title : 'Task',
      description: `Reminder snoozed for ${hours} hours.`,
      type: 'snoozed',
      user: userProfile.name,
      time: nowTime,
      date: '14/08/2026',
    };
    setActivities((prev) => [newActivity, ...prev]);
    showToast(`${t.snoozedFor2Hours}`, 'info');
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
  };

  const clearCache = () => {
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.COMMUNICATIONS);
    localStorage.removeItem(STORAGE_KEYS.NOTES);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    setTasks(INITIAL_TASKS);
    setCommunications(INITIAL_COMMUNICATIONS);
    setNotes(INITIAL_NOTES);
    setActivities(INITIAL_ACTIVITIES);
    showToast(t.toastCacheCleared || 'Local storage cleared!', 'info');
  };

  const syncData = () => {
    playChime();
    showToast(t.toastSynced || 'Data synchronized with central retail server!', 'success');
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
        completeTaskWithPhoto,
        attachPhotoToTask,
        removePhotoFromTask,
        deleteTask,
        toggleCommunicationComplete,
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

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
