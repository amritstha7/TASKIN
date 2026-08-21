import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Task, MyNote, Communication, ActivityItem } from '../types';

type SearchCategory = 'all' | 'tasks' | 'notes' | 'comms' | 'activity' | 'settings';

interface SettingModuleItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  path: string;
  keywords: string[];
  action: () => void;
}

export const GlobalSearchBar: React.FC = () => {
  const {
    tasks,
    notes,
    communications,
    activities,
    setCurrentScreen,
    setSelectedDate,
    setCalendarMonth,
    setCalendarYear,
    setSelectedAttachment,
    setPreviewPhoto,
    setIsAddTaskModalOpen,
  } = useApp();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut listener (Cmd/Ctrl + K or / to focus search, Esc to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Static App Modules & Settings list
  const settingModules: SettingModuleItem[] = useMemo(
    () => [
      {
        id: 'mod-dashboard',
        title: 'Operations Dashboard',
        description: 'Shift schedule, calendar, task lists, and communications',
        icon: 'dashboard',
        category: 'Module',
        path: '/dashboard',
        keywords: ['dashboard', 'home', 'main', 'schedule', 'tasks', 'store', 'shift', 'app'],
        action: () => {
          setCurrentScreen('dashboard');
          setIsOpen(false);
        },
      },
      {
        id: 'mod-add-task',
        title: 'Add New Task',
        description: 'Create urgent, high, or standard operational shift task',
        icon: 'add_task',
        category: 'Action',
        path: '/add-task',
        keywords: ['add task', 'create', 'new task', 'urgent', 'assign', 'app'],
        action: () => {
          setIsAddTaskModalOpen(true);
          setIsOpen(false);
        },
      },
      {
        id: 'mod-activity',
        title: 'Activity & Audit Log',
        description: 'Live shift timeline and operational update records',
        icon: 'history',
        category: 'Module',
        path: '/activity',
        keywords: ['activity', 'audit', 'logs', 'history', 'timeline', 'updates', 'events', 'app'],
        action: () => {
          setCurrentScreen('activity');
          setIsOpen(false);
        },
      },
      {
        id: 'mod-media',
        title: 'Photo Proofs Gallery',
        description: 'Shelf compliance pictures, barcodes, and audit photos',
        icon: 'photo_library',
        category: 'Module',
        path: '/media',
        keywords: ['media', 'photos', 'proof', 'gallery', 'compliance', 'images', 'camera', 'app'],
        action: () => {
          setCurrentScreen('media');
          setIsOpen(false);
        },
      },
      {
        id: 'mod-theme',
        title: 'Visual Interface & Theme',
        description: 'Light mode, Dark mode, and automatic OS appearance',
        icon: 'palette',
        category: 'Settings',
        path: '/settings/theme',
        keywords: ['theme', 'dark mode', 'light mode', 'appearance', 'contrast', 'color', 'ui', 'app'],
        action: () => {
          setCurrentScreen('admin');
          setIsOpen(false);
        },
      },
      {
        id: 'mod-calendar-view',
        title: 'Calendar View Preference',
        description: 'Gregorian (AD), Nepali Bikram Sambat (BS), or Dual View',
        icon: 'calendar_month',
        category: 'Settings',
        path: '/settings/calendar-view',
        keywords: ['calendar', 'ad', 'bs', 'bikram sambat', 'nepali', 'gregorian', 'dual', 'patro', 'date', 'app'],
        action: () => {
          setCurrentScreen('admin');
          setIsOpen(false);
        },
      },
      {
        id: 'mod-language',
        title: 'Language & Localization',
        description: 'Multi-lingual interface translations (English, Nepali, Spanish, French)',
        icon: 'translate',
        category: 'Settings',
        path: '/settings/language',
        keywords: ['language', 'locale', 'localization', 'translation', 'nepali', 'english', 'spanish', 'bhasa', 'app'],
        action: () => {
          setCurrentScreen('admin');
          setIsOpen(false);
        },
      },
      {
        id: 'mod-notifications',
        title: 'Notifications & Audio Feedback',
        description: 'Shift push alerts, daily summaries, haptic triggers, and scanner sounds',
        icon: 'notifications_active',
        category: 'Settings',
        path: '/settings/notifications',
        keywords: ['notifications', 'audio', 'sound', 'chime', 'vibration', 'haptics', 'alerts', 'scanner', 'app'],
        action: () => {
          setCurrentScreen('admin');
          setIsOpen(false);
        },
      },
      {
        id: 'mod-diagnostics',
        title: 'System & Diagnostics',
        description: 'Shift JSON backups, central sync status, and storage reset',
        icon: 'tune',
        category: 'Settings',
        path: '/settings/diagnostics',
        keywords: ['system', 'diagnostics', 'backup', 'json', 'export', 'cache', 'sync', 'reset', 'database', 'app'],
        action: () => {
          setCurrentScreen('admin');
          setIsOpen(false);
        },
      },
    ],
    [setCurrentScreen, setIsAddTaskModalOpen]
  );

  // Quick suggestion chips
  const quickSuggestions = ['RTD', 'Protein Bar', 'Movie', 'Excel', 'AI', 'App', 'Compliance', 'Theme'];

  // Search Filtering Engine
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        tasks: [],
        notes: [],
        comms: [],
        activities: [],
        settings: [],
        total: 0,
      };
    }

    // 1. Filter Tasks
    const matchedTasks = tasks.filter((task) => {
      if (!task) return false;
      const matchTitle = (task.title ?? '').toLowerCase().includes(q);
      const matchDesc = (task.description ?? '').toLowerCase().includes(q);
      const matchCat = (task.category ?? '').toLowerCase().includes(q);
      const matchAssignee = (task.completedBy ?? '').toLowerCase().includes(q);
      const matchNotes = (task.notes || []).some((n) => (n ?? '').toLowerCase().includes(q));
      const matchPhotos = (task.photos || []).some(
        (p) =>
          (p?.name ?? '').toLowerCase().includes(q) ||
          (p?.caption ?? '').toLowerCase().includes(q) ||
          (p?.uploadedBy ?? '').toLowerCase().includes(q)
      );
      return matchTitle || matchDesc || matchCat || matchAssignee || matchNotes || matchPhotos;
    });

    // 2. Filter Notes
    const matchedNotes = notes.filter((note) => {
      if (!note) return false;
      return (
        (note.text ?? '').toLowerCase().includes(q) ||
        (note.createdAt ?? '').toLowerCase().includes(q)
      );
    });

    // 3. Filter Communications
    const matchedComms = communications.filter((comm) => {
      if (!comm) return false;
      const matchTitle = (comm.title ?? '').toLowerCase().includes(q);
      const matchDesc = (comm.description ?? '').toLowerCase().includes(q);
      const matchAttach = (comm.attachmentName ?? '').toLowerCase().includes(q);
      const matchNotes = (comm.notes || []).some((n) => (n ?? '').toLowerCase().includes(q));
      return matchTitle || matchDesc || matchAttach || matchNotes;
    });

    // 4. Filter Activities
    const matchedActivities = activities.filter((act) => {
      if (!act) return false;
      const matchTitle = (act.title ?? '').toLowerCase().includes(q);
      const matchDesc = (act.description ?? '').toLowerCase().includes(q);
      const matchUser = (act.user ?? '').toLowerCase().includes(q);
      const matchBadge = (act.statusBadge ?? '').toLowerCase().includes(q);
      return matchTitle || matchDesc || matchUser || matchBadge;
    });

    // 5. Filter Settings & Modules
    const matchedSettings = settingModules.filter((mod) => {
      if (!mod) return false;
      const matchTitle = (mod.title ?? '').toLowerCase().includes(q);
      const matchDesc = (mod.description ?? '').toLowerCase().includes(q);
      const matchKeywords = (mod.keywords || []).some((k) => (k ?? '').toLowerCase().includes(q));
      const matchPath = (mod.path ?? '').toLowerCase().includes(q);
      return matchTitle || matchDesc || matchKeywords || matchPath;
    });

    const total =
      matchedTasks.length +
      matchedNotes.length +
      matchedComms.length +
      matchedActivities.length +
      matchedSettings.length;

    return {
      tasks: matchedTasks,
      notes: matchedNotes,
      comms: matchedComms,
      activities: matchedActivities,
      settings: matchedSettings,
      total,
    };
  }, [query, tasks, notes, communications, activities, settingModules]);

  // Click Handlers for results with Direct Date & Task Navigation
  const handleSelectTask = (task: Task) => {
    if (task.dueDate) {
      const parts = task.dueDate.split('-');
      if (parts.length === 3) {
        const y = Number(parts[0]);
        const m = Number(parts[1]) - 1;
        if (!isNaN(y) && !isNaN(m)) {
          setCalendarYear(y);
          setCalendarMonth(m);
        }
      }
      setSelectedDate(task.dueDate);
    }
    setCurrentScreen('dashboard');

    if (task.photos && task.photos.length > 0) {
      setPreviewPhoto({
        url: task.photos[0].url,
        title: task.title,
        caption: task.photos[0].caption,
        user: task.photos[0].uploadedBy,
        time: task.photos[0].uploadedAt,
      });
    }

    setIsOpen(false);
  };

  const handleSelectNote = (note: MyNote) => {
    if (note.createdAt && note.createdAt.includes('-')) {
      const datePart = note.createdAt.slice(0, 10);
      const parts = datePart.split('-');
      if (parts.length === 3) {
        const y = Number(parts[0]);
        const m = Number(parts[1]) - 1;
        if (!isNaN(y) && !isNaN(m)) {
          setCalendarYear(y);
          setCalendarMonth(m);
        }
        setSelectedDate(datePart);
      }
    }
    setCurrentScreen('dashboard');
    setIsOpen(false);
  };

  const handleSelectComm = (comm: Communication) => {
    if (comm.dueDate) {
      const parts = comm.dueDate.split('-');
      if (parts.length === 3) {
        const y = Number(parts[0]);
        const m = Number(parts[1]) - 1;
        if (!isNaN(y) && !isNaN(m)) {
          setCalendarYear(y);
          setCalendarMonth(m);
        }
      }
      setSelectedDate(comm.dueDate);
    }
    setCurrentScreen('dashboard');
    setSelectedAttachment(comm);
    setIsOpen(false);
  };

  const handleSelectActivity = () => {
    setCurrentScreen('activity');
    setIsOpen(false);
  };

  // Text highlighter helper
  const highlightMatch = (text: string | undefined | null, search: string) => {
    const safeText = text ?? '';
    if (!search?.trim()) return safeText;
    const parts = safeText.split(new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          (part ?? '').toLowerCase() === (search ?? '').toLowerCase() ? (
            <mark
              key={i}
              className="bg-[#FFE5D9] dark:bg-[#5d2a23] text-[#FF5500] dark:text-[#ffb4ac] font-bold rounded px-0.5"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div ref={searchContainerRef} className="relative flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-1 sm:mx-2">
      {/* Header Search Input */}
      <div className="relative flex items-center">
        <span className="absolute left-3 text-[#8E8E93] dark:text-[#8e9095] flex items-center justify-center pointer-events-none transition-colors">
          <span className="material-symbols-outlined text-[18px]">search</span>
        </span>

        <input
          ref={inputRef}
          id="global-header-search-input"
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          placeholder="Search RTD, protein bar, movie, excel, AI..."
          className="w-full pl-9 pr-14 py-1.5 sm:py-2 bg-[#F7F7F8] dark:bg-[#25282c] hover:bg-white dark:hover:bg-[#1e2124] text-[#2C2C2E] dark:text-[#eff1f5] text-xs sm:text-sm font-medium rounded-xl border border-[#e5e5ea] dark:border-[#35383c] focus:border-[#FF5500] dark:focus:border-[#ffb4ac] focus:bg-white dark:focus:bg-[#191c1f] focus:outline-none focus:ring-2 focus:ring-[#FF5500]/25 transition-all shadow-xs placeholder:text-[#8E8E93] dark:placeholder:text-[#8e9095]"
        />

        <div className="absolute right-2 flex items-center gap-1">
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="w-5 h-5 rounded-full bg-[#e5e5ea] dark:bg-[#35383c] hover:bg-[#FFD8CC] dark:hover:bg-[#4d2d2a] text-[#8E8E93] dark:text-[#eff1f5] flex items-center justify-center transition-colors cursor-pointer"
              title="Clear search"
            >
              <span className="material-symbols-outlined text-[12px]">close</span>
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-[#8E8E93] dark:text-[#8e9095] bg-white dark:bg-[#191c1f] border border-[#e5e5ea] dark:border-[#35383c] select-none">
              /
            </kbd>
          )}
        </div>
      </div>

      {/* Floating Search Results Dropdown Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.99 }}
            transition={{ duration: 0.14 }}
            className="absolute left-0 right-0 sm:-left-12 sm:-right-12 md:-left-20 md:-right-20 mt-1.5 bg-white dark:bg-[#1e2124] rounded-xl sm:rounded-2xl border border-[#e5e5ea] dark:border-[#35383c] shadow-2xl overflow-hidden z-50 max-h-[75vh] flex flex-col"
          >
            {/* Desktop-only Header / Filter Tabs (Hidden on small mobile screens to keep overlay streamlined) */}
            <div className="hidden sm:block p-3 border-b border-[#e5e5ea] dark:border-[#35383c] bg-[#FAFAFA] dark:bg-[#25282c]">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF5500] dark:bg-[#ffb4ac]" />
                  <span className="text-xs font-bold text-[#2C2C2E] dark:text-[#eff1f5]">
                    Global Search
                  </span>
                  {query && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-[#FFF0EB] dark:bg-[#35383c] text-[#FF5500] dark:text-[#ffb4ac] border border-[#FFD8CC] dark:border-[#5d3f3c]">
                      {searchResults.total} {searchResults.total === 1 ? 'match' : 'matches'}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-[#8E8E93] dark:text-[#8e9095] flex items-center gap-1">
                  <span>ESC to close</span>
                </div>
              </div>

              {/* Desktop Category Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
                {(
                  [
                    { id: 'all', label: 'All', count: searchResults.total },
                    { id: 'tasks', label: 'Tasks', count: searchResults.tasks.length },
                    { id: 'notes', label: 'Notes', count: searchResults.notes.length },
                    { id: 'comms', label: 'Comms', count: searchResults.comms.length },
                    { id: 'activity', label: 'Activity', count: searchResults.activities.length },
                    { id: 'settings', label: 'Modules', count: searchResults.settings.length },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveCategory(tab.id)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                      activeCategory === tab.id
                        ? 'bg-[#FF5500] text-white shadow-xs'
                        : 'bg-white dark:bg-[#191c1f] text-[#2C2C2E] dark:text-[#eff1f5] border border-[#e5e5ea] dark:border-[#35383c] hover:border-[#FF5500]/50'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {query && tab.count > 0 && (
                      <span
                        className={`text-[9px] px-1 rounded ${
                          activeCategory === tab.id
                            ? 'bg-black/20 text-white'
                            : 'bg-[#F7F7F8] dark:bg-[#35383c] text-[#8E8E93] dark:text-[#8e9095]'
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Body - Clean plain list view without heavy nested containers */}
            <div className="overflow-y-auto p-2 sm:p-3 divide-y divide-[#f0f0f2] dark:divide-[#2e3134]">
              {/* If no query, show helpful keyword suggestions */}
              {!query ? (
                <div className="py-2.5 px-1 space-y-3">
                  <div>
                    <p className="text-[11px] font-bold text-[#8E8E93] dark:text-[#8e9095] mb-2 uppercase tracking-wide">
                      Quick Keywords
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {quickSuggestions.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setQuery(item);
                            inputRef.current?.focus();
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#F7F7F8] dark:bg-[#25282c] hover:bg-[#FFF0EB] dark:hover:bg-[#35383c] text-[#2C2C2E] dark:text-[#eff1f5] hover:text-[#FF5500] dark:hover:text-[#ffb4ac] border border-[#e5e5ea] dark:border-[#35383c] hover:border-[#FF5500] transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-[13px] text-[#FF5500] dark:text-[#ffb4ac]">
                            trending_up
                          </span>
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#f0f0f2] dark:border-[#2e3134]">
                    <p className="text-[11px] font-bold text-[#8E8E93] dark:text-[#8e9095] mb-2 uppercase tracking-wide">
                      Direct App Actions
                    </p>
                    <div className="space-y-1">
                      {settingModules.slice(0, 3).map((mod) => (
                        <button
                          key={mod.id}
                          type="button"
                          onClick={mod.action}
                          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#FFF0EB] dark:hover:bg-[#25282c] text-left transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-7 h-7 rounded-lg bg-[#F7F7F8] dark:bg-[#25282c] text-[#FF5500] dark:text-[#ffb4ac] flex items-center justify-center shrink-0 border border-[#e5e5ea] dark:border-[#35383c]">
                              <span className="material-symbols-outlined text-[16px]">
                                {mod.icon}
                              </span>
                            </span>
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-[#2C2C2E] dark:text-[#eff1f5] block truncate">
                                {mod.title}
                              </span>
                              <span className="text-[10px] text-[#8E8E93] dark:text-[#8e9095] block truncate">
                                {mod.description}
                              </span>
                            </div>
                          </div>
                          <span className="material-symbols-outlined text-[#8E8E93] group-hover:text-[#FF5500] text-[16px]">
                            chevron_right
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : searchResults.total === 0 ? (
                /* No Results Found */
                <div className="py-6 text-center space-y-1.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF0EB] dark:bg-[#35383c] text-[#FF5500] dark:text-[#ffb4ac] mx-auto flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">search_off</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#2C2C2E] dark:text-[#eff1f5]">
                    No matches found for &ldquo;{query}&rdquo;
                  </h4>
                  <p className="text-[11px] text-[#8E8E93] dark:text-[#8e9095]">
                    Try keywords like <strong className="text-[#FF5500]">RTD</strong>, <strong className="text-[#FF5500]">protein bar</strong>, or <strong className="text-[#FF5500]">movie</strong>.
                  </p>
                </div>
              ) : (
                /* Filtered Content: Clean, Plain List Items with Direct Navigation */
                <div className="space-y-1 pt-1">
                  {/* 1. TASKS MATCHES */}
                  {(activeCategory === 'all' || activeCategory === 'tasks') &&
                    searchResults.tasks.map((task) => (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => handleSelectTask(task)}
                        className="w-full flex items-start justify-between p-2.5 rounded-lg hover:bg-[#FFF0EB] dark:hover:bg-[#282b30] text-left transition-colors cursor-pointer group"
                      >
                        <div className="flex items-start gap-2.5 min-w-0 flex-1 pr-2">
                          <span
                            className={`material-symbols-outlined text-[18px] mt-0.5 shrink-0 ${
                              task.completed
                                ? 'text-[#008259]'
                                : task.isUrgent
                                ? 'text-[#D32F2F]'
                                : 'text-[#FF5500]'
                            }`}
                          >
                            {task.completed
                              ? 'check_circle'
                              : task.isUrgent
                              ? 'error'
                              : 'radio_button_unchecked'}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-bold text-[#2C2C2E] dark:text-[#eff1f5] group-hover:text-[#FF5500] dark:group-hover:text-[#ffb4ac] transition-colors">
                                {highlightMatch(task.title, query)}
                              </span>
                              <span className="text-[10px] text-[#8E8E93] dark:text-[#8e9095]">
                                • {task.category}
                              </span>
                              {task.isUrgent && (
                                <span className="px-1 py-0.2 rounded text-[9px] font-black bg-[#FFE5E5] dark:bg-[#4d1f1f] text-[#D32F2F] dark:text-[#ffb4ab]">
                                  Urgent
                                </span>
                              )}
                              {task.completed && (
                                <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-[#E6F7EF] dark:bg-[#1a3829] text-[#008259] dark:text-[#7ce0ad]">
                                  Done
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#8E8E93] dark:text-[#8e9095] mt-0.5 line-clamp-1">
                              {highlightMatch(task.description, query)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0 mt-0.5">
                          <span className="text-[10px] font-mono font-bold text-[#FF5500] dark:text-[#ffb4ac] block">
                            {task.dueDate}
                          </span>
                          <span className="text-[9px] text-[#8E8E93] dark:text-[#8e9095]">
                            Go to date →
                          </span>
                        </div>
                      </button>
                    ))}

                  {/* 2. NOTES MATCHES */}
                  {(activeCategory === 'all' || activeCategory === 'notes') &&
                    searchResults.notes.map((note) => (
                      <button
                        key={note.id}
                        type="button"
                        onClick={() => handleSelectNote(note)}
                        className="w-full flex items-start justify-between p-2.5 rounded-lg hover:bg-[#FFF0EB] dark:hover:bg-[#282b30] text-left transition-colors cursor-pointer group"
                      >
                        <div className="flex items-start gap-2.5 min-w-0 flex-1 pr-2">
                          <span className="material-symbols-outlined text-[18px] text-[#FF5500] mt-0.5 shrink-0">
                            edit_note
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-[#2C2C2E] dark:text-[#eff1f5] line-clamp-2">
                              {highlightMatch(note.text, query)}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-[#8E8E93] dark:text-[#8e9095] shrink-0 mt-0.5">
                          {note.createdAt}
                        </span>
                      </button>
                    ))}

                  {/* 3. COMMUNICATIONS MATCHES */}
                  {(activeCategory === 'all' || activeCategory === 'comms') &&
                    searchResults.comms.map((comm) => (
                      <button
                        key={comm.id}
                        type="button"
                        onClick={() => handleSelectComm(comm)}
                        className="w-full flex items-start justify-between p-2.5 rounded-lg hover:bg-[#FFF0EB] dark:hover:bg-[#282b30] text-left transition-colors cursor-pointer group"
                      >
                        <div className="flex items-start gap-2.5 min-w-0 flex-1 pr-2">
                          <span className="material-symbols-outlined text-[18px] text-[#FF5500] mt-0.5 shrink-0">
                            mark_chat_unread
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-[#2C2C2E] dark:text-[#eff1f5] group-hover:text-[#FF5500] dark:group-hover:text-[#ffb4ac] transition-colors">
                                {highlightMatch(comm.title, query)}
                              </span>
                              {comm.attachmentName && (
                                <span className="text-[10px] text-[#8E8E93] flex items-center gap-0.5">
                                  <span className="material-symbols-outlined text-[11px]">attach_file</span>
                                  {comm.attachmentName}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#8E8E93] dark:text-[#8e9095] mt-0.5 line-clamp-1">
                              {highlightMatch(comm.description, query)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0 mt-0.5">
                          <span className="text-[10px] font-mono font-bold text-[#FF5500] dark:text-[#ffb4ac] block">
                            {comm.dueDate}
                          </span>
                        </div>
                      </button>
                    ))}

                  {/* 4. ACTIVITY MATCHES */}
                  {(activeCategory === 'all' || activeCategory === 'activity') &&
                    searchResults.activities.map((act) => (
                      <button
                        key={act.id}
                        type="button"
                        onClick={handleSelectActivity}
                        className="w-full flex items-start justify-between p-2.5 rounded-lg hover:bg-[#FFF0EB] dark:hover:bg-[#282b30] text-left transition-colors cursor-pointer group"
                      >
                        <div className="flex items-start gap-2.5 min-w-0 flex-1 pr-2">
                          <span className="material-symbols-outlined text-[18px] text-[#8E8E93] mt-0.5 shrink-0">
                            history
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-[#2C2C2E] dark:text-[#eff1f5]">
                                {highlightMatch(act.title, query)}
                              </span>
                              <span className="text-[10px] text-[#8E8E93] dark:text-[#8e9095]">
                                by {act.user}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#8E8E93] dark:text-[#8e9095] mt-0.5 line-clamp-1">
                              {highlightMatch(act.description, query)}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-[#8E8E93] dark:text-[#8e9095] shrink-0 mt-0.5">
                          {act.time}
                        </span>
                      </button>
                    ))}

                  {/* 5. APP MODULES & SETTINGS MATCHES */}
                  {(activeCategory === 'all' || activeCategory === 'settings') &&
                    searchResults.settings.map((mod) => (
                      <button
                        key={mod.id}
                        type="button"
                        onClick={() => {
                          mod.action();
                          setIsOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#FFF0EB] dark:hover:bg-[#282b30] text-left transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-7 h-7 rounded-lg bg-[#F7F7F8] dark:bg-[#25282c] text-[#FF5500] dark:text-[#ffb4ac] flex items-center justify-center shrink-0 border border-[#e5e5ea] dark:border-[#35383c]">
                            <span className="material-symbols-outlined text-[16px]">
                              {mod.icon}
                            </span>
                          </span>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-[#2C2C2E] dark:text-[#eff1f5] block truncate group-hover:text-[#FF5500] dark:group-hover:text-[#ffb4ac] transition-colors">
                              {highlightMatch(mod.title, query)}
                            </span>
                            <span className="text-[10px] text-[#8E8E93] dark:text-[#8e9095] block truncate">
                              {highlightMatch(mod.description, query)}
                            </span>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-[#8E8E93] group-hover:text-[#FF5500] text-[16px]">
                          chevron_right
                        </span>
                      </button>
                    ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
