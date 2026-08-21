import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { LanguageKey } from '../i18n/translations';

type SettingsSubPage = 'theme' | 'calendar-view' | 'language' | 'notifications' | 'diagnostics' | null;

export const SettingsScreen: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
    clearCache,
    syncData,
    setCurrentScreen,
    setIsEditProfileModalOpen,
    showToast,
    playChime,
    t,
    language,
    setLanguage,
    setTheme,
    calendarMode,
    setCalendarMode,
    tasks,
  } = useApp();

  const [activeSubPage, setActiveSubPage] = useState<SettingsSubPage>(null);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const languages: { key: LanguageKey; label: string; native: string; flag: string }[] = [
    { key: 'English', label: 'English (US)', native: 'English', flag: '🇺🇸' },
    { key: 'Nepali', label: 'Nepali', native: 'नेपाली', flag: '🇳🇵' },
    { key: 'Spanish', label: 'Spanish', native: 'Español', flag: '🇪🇸' },
    { key: 'French', label: 'French', native: 'Français', flag: '🇫🇷' },
  ];

  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify({ userProfile, tasks, exportDate: new Date().toISOString() }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `taskn_backup_${userProfile.branch.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('JSON shift backup exported successfully!', 'success');
  };

  const handleTriggerSync = () => {
    setIsSyncing(true);
    syncData();
    setTimeout(() => {
      setIsSyncing(false);
    }, 600);
  };

  // Helper for current values on main menu badges
  const getThemeBadge = () => {
    if (userProfile.theme === 'light') return 'Light';
    if (userProfile.theme === 'dark') return 'Dark';
    return 'Auto';
  };

  const getCalendarBadge = () => {
    if (calendarMode === 'ad') return 'English (AD)';
    if (calendarMode === 'bs') return 'Nepali (BS)';
    return 'Dual (AD+BS)';
  };

  const getLanguageBadge = () => {
    const current = languages.find((l) => l.key === language);
    return current ? `${current.flag} ${current.label}` : 'English';
  };

  const getNotifsBadge = () => {
    const activeCount = [
      userProfile.pushNotifications,
      userProfile.dailySummary,
      userProfile.soundVibration,
    ].filter(Boolean).length;
    return `${activeCount}/3 Active`;
  };

  const settingsMenuItems = [
    {
      id: 'theme' as SettingsSubPage,
      title: t.themeTitle,
      description: 'Light, Dark, or Auto system appearance',
      icon: 'palette',
      badge: getThemeBadge(),
      badgeType: 'primary',
      path: '/settings/theme',
    },
    {
      id: 'calendar-view' as SettingsSubPage,
      title: t.calendarViewPreference,
      description: 'English (AD), Nepali Bikram Sambat (BS), or Dual View',
      icon: 'calendar_month',
      badge: getCalendarBadge(),
      badgeType: 'primary',
      path: '/settings/calendar-view',
    },
    {
      id: 'language' as SettingsSubPage,
      title: t.languageTitle,
      description: 'Multi-lingual UI translation and localization',
      icon: 'translate',
      badge: getLanguageBadge(),
      badgeType: 'primary',
      path: '/settings/language',
    },
    {
      id: 'notifications' as SettingsSubPage,
      title: `${t.notificationsTitle} & Sound`,
      description: 'Push alerts, daily summaries, audio feedback, and haptics',
      icon: 'notifications_active',
      badge: getNotifsBadge(),
      badgeType: 'primary',
      path: '/settings/notifications',
    },
    {
      id: 'diagnostics' as SettingsSubPage,
      title: `${t.systemTitle} & Diagnostics`,
      description: 'Shift JSON backups, cache clearing, and data sync status',
      icon: 'tune',
      badge: 'Online',
      badgeType: 'success',
      path: '/settings/diagnostics',
    },
  ];

  // ==========================================
  // SUB-PAGE 1: VISUAL INTERFACE & THEME
  // ==========================================
  const renderThemeSubPage = () => (
    <motion.div
      key="subpage-theme"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-5"
    >
      {/* Subpage Header with Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#191c1f] p-4 sm:p-5 rounded-2xl border border-[#e5e5ea] dark:border-[#35383c] card-depth">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setActiveSubPage(null)}
            className="w-9 h-9 rounded-xl bg-[#F7F7F8] dark:bg-[#2c2f33] border border-[#e5e5ea] dark:border-[#3a3d42] flex items-center justify-center text-[#2C2C2E] dark:text-[#eff1f5] hover:bg-[#FFF0EB] hover:text-[#FF5500] dark:hover:bg-[#35383c] transition-colors cursor-pointer"
            aria-label="Back to Settings"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </motion.button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-[#2C2C2E] dark:text-[#eff1f5] tracking-tight">
                {t.themeTitle}
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#F7F7F8] dark:bg-[#2c2f33] text-[#8E8E93] dark:text-[#8e9095] border border-[#e5e5ea] dark:border-[#35383c]">
                /settings/theme
              </span>
            </div>
            <p className="text-xs text-[#8E8E93] dark:text-[#8e9095] mt-0.5">
              Select your preferred visual interface and contrast mode
            </p>
          </div>
        </div>
      </div>

      {/* Theme Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Light Theme */}
        <motion.button
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setTheme('light');
            showToast('Switched to Light Theme', 'info');
          }}
          className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer card-depth ${
            userProfile.theme === 'light'
              ? 'border-[#FF5500] bg-[#FFF0EB] dark:bg-[#25282c] shadow-[0_4px_16px_rgba(255,85,0,0.2)] ring-2 ring-[#FF5500]/30'
              : 'border-[#e5e5ea] dark:border-[#35383c] bg-white dark:bg-[#1f2225] hover:border-[#FF5500]/50'
          }`}
        >
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="w-9 h-9 rounded-xl bg-[#FF5500] text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[18px]">light_mode</span>
              </span>
              {userProfile.theme === 'light' ? (
                <span className="flex items-center gap-1 text-xs font-black text-[#FF5500]">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Active
                </span>
              ) : (
                <span className="w-5 h-5 rounded-full border-2 border-[#e5e5ea] dark:border-[#484b50]" />
              )}
            </div>
            <div className="text-sm font-black text-[#2C2C2E] dark:text-[#eff1f5]">
              {t.themeLight}
            </div>
            <p className="text-xs text-[#8E8E93] dark:text-[#8e9095] mt-1 leading-relaxed">
              Clean, crisp off-white canvas with high-contrast vivid orange highlights.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#FFD8CC] dark:border-[#35383c] flex items-center gap-1.5 text-[10px] font-bold text-[#FF5500]">
            <span className="w-2 h-2 rounded-full bg-[#FF5500]" />
            #FF5500 Retail Accent
          </div>
        </motion.button>

        {/* Dark Theme */}
        <motion.button
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setTheme('dark');
            showToast('Switched to Dark Theme', 'info');
          }}
          className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer card-depth ${
            userProfile.theme === 'dark'
              ? 'border-[#FF5500] dark:border-[#ffb4ac] bg-[#2C2C2E] text-white shadow-[0_4px_16px_rgba(0,0,0,0.35)] ring-2 ring-[#FF5500]/30'
              : 'border-[#e5e5ea] dark:border-[#35383c] bg-white dark:bg-[#1f2225] hover:border-[#FF5500]/50'
          }`}
        >
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="w-9 h-9 rounded-xl bg-[#191c1f] text-white flex items-center justify-center border border-white/20 shadow-xs">
                <span className="material-symbols-outlined text-[18px]">dark_mode</span>
              </span>
              {userProfile.theme === 'dark' ? (
                <span className="flex items-center gap-1 text-xs font-black text-[#FF5500] dark:text-[#ffb4ac]">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Active
                </span>
              ) : (
                <span className="w-5 h-5 rounded-full border-2 border-[#e5e5ea] dark:border-[#484b50]" />
              )}
            </div>
            <div className="text-sm font-black text-[#2C2C2E] dark:text-[#eff1f5]">
              {t.themeDark}
            </div>
            <p className="text-xs text-[#8E8E93] dark:text-[#8e9095] mt-1 leading-relaxed">
              Charcoal black canvas reducing eye fatigue in low-light store environments.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#35383c] flex items-center gap-1.5 text-[10px] font-bold text-[#8E8E93] dark:text-[#8e9095]">
            <span className="w-2 h-2 rounded-full bg-[#35383c]" />
            #191C1F Deep Charcoal
          </div>
        </motion.button>

        {/* Auto System Theme */}
        <motion.button
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setTheme('auto');
            showToast('Theme synced with OS setting', 'info');
          }}
          className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer card-depth ${
            userProfile.theme === 'auto'
              ? 'border-[#FF5500] bg-[#FFF0EB] dark:bg-[#25282c] shadow-[0_4px_16px_rgba(255,85,0,0.2)] ring-2 ring-[#FF5500]/30'
              : 'border-[#e5e5ea] dark:border-[#35383c] bg-white dark:bg-[#1f2225] hover:border-[#FF5500]/50'
          }`}
        >
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="w-9 h-9 rounded-xl bg-[#8E8E93] text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[18px]">settings_brightness</span>
              </span>
              {userProfile.theme === 'auto' ? (
                <span className="flex items-center gap-1 text-xs font-black text-[#FF5500]">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Active
                </span>
              ) : (
                <span className="w-5 h-5 rounded-full border-2 border-[#e5e5ea] dark:border-[#484b50]" />
              )}
            </div>
            <div className="text-sm font-black text-[#2C2C2E] dark:text-[#eff1f5]">
              {t.themeAuto}
            </div>
            <p className="text-xs text-[#8E8E93] dark:text-[#8e9095] mt-1 leading-relaxed">
              Dynamically matches your phone, tablet, or browser system setting.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#FFD8CC] dark:border-[#35383c] flex items-center gap-1.5 text-[10px] font-bold text-[#8E8E93] dark:text-[#8e9095]">
            <span className="w-2 h-2 rounded-full bg-[#8E8E93]" />
            OS Dynamic Detection
          </div>
        </motion.button>
      </div>

      {/* Live Preview Box */}
      <div className="bg-white dark:bg-[#191c1f] p-5 rounded-2xl border border-[#e5e5ea] dark:border-[#35383c] card-depth space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-[#8E8E93] dark:text-[#8e9095]">
          Live Interface Preview
        </h4>
        <div className="p-4 rounded-xl bg-[#F7F7F8] dark:bg-[#25282c] border border-[#e5e5ea] dark:border-[#35383c] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[#FF5500] text-white flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[20px]">storefront</span>
            </span>
            <div>
              <div className="text-xs font-black text-[#2C2C2E] dark:text-[#eff1f5]">
                Store #402 • Active Shift
              </div>
              <div className="text-[11px] text-[#8E8E93] dark:text-[#8e9095]">
                High-contrast operational layout with {userProfile.theme.toUpperCase()} mode active
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveSubPage(null)}
            className="px-4 py-2 bg-[#FF5500] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#E04800] transition-colors cursor-pointer"
          >
            Done &amp; Return
          </button>
        </div>
      </div>
    </motion.div>
  );

  // ==========================================
  // SUB-PAGE 2: CALENDAR VIEW MODE
  // ==========================================
  const renderCalendarSubPage = () => (
    <motion.div
      key="subpage-calendar"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#191c1f] p-4 sm:p-5 rounded-2xl border border-[#e5e5ea] dark:border-[#35383c] card-depth">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setActiveSubPage(null)}
            className="w-9 h-9 rounded-xl bg-[#F7F7F8] dark:bg-[#2c2f33] border border-[#e5e5ea] dark:border-[#3a3d42] flex items-center justify-center text-[#2C2C2E] dark:text-[#eff1f5] hover:bg-[#FFF0EB] hover:text-[#FF5500] dark:hover:bg-[#35383c] transition-colors cursor-pointer"
            aria-label="Back to Settings"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </motion.button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-[#2C2C2E] dark:text-[#eff1f5] tracking-tight">
                {t.calendarViewPreference}
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#F7F7F8] dark:bg-[#2c2f33] text-[#8E8E93] dark:text-[#8e9095] border border-[#e5e5ea] dark:border-[#35383c]">
                /settings/calendar-view
              </span>
            </div>
            <p className="text-xs text-[#8E8E93] dark:text-[#8e9095] mt-0.5">
              Choose English (AD), Nepali Bikram Sambat (BS), or Dual View
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* AD Gregorian */}
        <motion.button
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setCalendarMode('ad');
            showToast('Calendar set to English (AD)', 'info');
          }}
          className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer card-depth ${
            calendarMode === 'ad'
              ? 'border-[#FF5500] bg-[#FFF0EB] dark:bg-[#25282c] shadow-[0_4px_16px_rgba(255,85,0,0.2)] ring-2 ring-[#FF5500]/30'
              : 'border-[#e5e5ea] dark:border-[#35383c] bg-white dark:bg-[#1f2225] hover:border-[#FF5500]/50'
          }`}
        >
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="w-9 h-9 rounded-xl bg-[#FF5500] text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                AD
              </span>
              {calendarMode === 'ad' ? (
                <span className="flex items-center gap-1 text-xs font-black text-[#FF5500]">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Active
                </span>
              ) : (
                <span className="w-5 h-5 rounded-full border-2 border-[#e5e5ea] dark:border-[#484b50]" />
              )}
            </div>
            <div className="text-sm font-black text-[#2C2C2E] dark:text-[#eff1f5]">
              {t.calendarModeAD}
            </div>
            <p className="text-xs text-[#8E8E93] dark:text-[#8e9095] mt-1 leading-relaxed">
              Standard International Gregorian dates, monthly calendar grids, and weekly shift schedules.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#FFD8CC] dark:border-[#35383c] text-[10px] font-bold text-[#FF5500]">
            Example: Aug 19, 2026
          </div>
        </motion.button>

        {/* BS Nepali Bikram Sambat */}
        <motion.button
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setCalendarMode('bs');
            showToast('Calendar set to Nepali Bikram Sambat (BS)', 'info');
          }}
          className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer card-depth ${
            calendarMode === 'bs'
              ? 'border-[#FF5500] bg-[#FFF0EB] dark:bg-[#25282c] shadow-[0_4px_16px_rgba(255,85,0,0.2)] ring-2 ring-[#FF5500]/30'
              : 'border-[#e5e5ea] dark:border-[#35383c] bg-white dark:bg-[#1f2225] hover:border-[#FF5500]/50'
          }`}
        >
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="w-9 h-9 rounded-xl bg-[#FF5500] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                BS
              </span>
              {calendarMode === 'bs' ? (
                <span className="flex items-center gap-1 text-xs font-black text-[#FF5500]">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Active
                </span>
              ) : (
                <span className="w-5 h-5 rounded-full border-2 border-[#e5e5ea] dark:border-[#484b50]" />
              )}
            </div>
            <div className="text-sm font-black text-[#2C2C2E] dark:text-[#eff1f5]">
              {t.calendarModeBS}
            </div>
            <p className="text-xs text-[#8E8E93] dark:text-[#8e9095] mt-1 leading-relaxed">
              Bikram Sambat solar calendar with Nepali month names (बैशाख, जेठ, असार, साउन, भदौ...).
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#FFD8CC] dark:border-[#35383c] text-[10px] font-bold text-[#FF5500]">
            Example: २०८३ भाद्र ३ गते
          </div>
        </motion.button>

        {/* Dual View */}
        <motion.button
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setCalendarMode('dual');
            showToast('Calendar set to Dual View (AD + BS)', 'info');
          }}
          className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer card-depth ${
            calendarMode === 'dual'
              ? 'border-[#FF5500] bg-[#FFF0EB] dark:bg-[#25282c] shadow-[0_4px_16px_rgba(255,85,0,0.2)] ring-2 ring-[#FF5500]/30'
              : 'border-[#e5e5ea] dark:border-[#35383c] bg-white dark:bg-[#1f2225] hover:border-[#FF5500]/50'
          }`}
        >
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="w-9 h-9 rounded-xl bg-[#FF5500] text-white flex items-center justify-center font-mono font-bold text-[10px] shadow-xs">
                AD+BS
              </span>
              {calendarMode === 'dual' ? (
                <span className="flex items-center gap-1 text-xs font-black text-[#FF5500]">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Active
                </span>
              ) : (
                <span className="w-5 h-5 rounded-full border-2 border-[#e5e5ea] dark:border-[#484b50]" />
              )}
            </div>
            <div className="text-sm font-black text-[#2C2C2E] dark:text-[#eff1f5]">
              {t.calendarModeDual}
            </div>
            <p className="text-xs text-[#8E8E93] dark:text-[#8e9095] mt-1 leading-relaxed">
              Side-by-side presentation showing both Gregorian and Nepali calendar dates on each cell.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#FFD8CC] dark:border-[#35383c] text-[10px] font-bold text-[#FF5500]">
            Example: Aug 19 • भाद्र ३
          </div>
        </motion.button>
      </div>

      {/* Date Demonstration Preview */}
      <div className="bg-white dark:bg-[#191c1f] p-5 rounded-2xl border border-[#e5e5ea] dark:border-[#35383c] card-depth space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-[#8E8E93] dark:text-[#8e9095]">
          Calendar Banner Preview
        </h4>
        <div className="p-4 rounded-xl bg-[#F7F7F8] dark:bg-[#25282c] border border-[#e5e5ea] dark:border-[#35383c] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#FF5500] text-[24px]">calendar_today</span>
            <div>
              <div className="text-xs font-black text-[#2C2C2E] dark:text-[#eff1f5]">
                {calendarMode === 'ad' && 'Wednesday, August 19, 2026'}
                {calendarMode === 'bs' && 'बुधबार, ३ भाद्र २०८३ (Bhadra 3, 2083)'}
                {calendarMode === 'dual' && 'Wed, Aug 19, 2026 • २०८३ भाद्र ३ गते'}
              </div>
              <div className="text-[11px] text-[#8E8E93] dark:text-[#8e9095]">
                Active shift view for store operations
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveSubPage(null)}
            className="px-4 py-2 bg-[#FF5500] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#E04800] transition-colors cursor-pointer"
          >
            Save &amp; Return
          </button>
        </div>
      </div>
    </motion.div>
  );

  // ==========================================
  // SUB-PAGE 3: LANGUAGE PREFERENCE
  // ==========================================
  const renderLanguageSubPage = () => (
    <motion.div
      key="subpage-language"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#191c1f] p-4 sm:p-5 rounded-2xl border border-[#e5e5ea] dark:border-[#35383c] card-depth">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setActiveSubPage(null)}
            className="w-9 h-9 rounded-xl bg-[#F7F7F8] dark:bg-[#2c2f33] border border-[#e5e5ea] dark:border-[#3a3d42] flex items-center justify-center text-[#2C2C2E] dark:text-[#eff1f5] hover:bg-[#FFF0EB] hover:text-[#FF5500] dark:hover:bg-[#35383c] transition-colors cursor-pointer"
            aria-label="Back to Settings"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </motion.button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-[#2C2C2E] dark:text-[#eff1f5] tracking-tight">
                {t.languageTitle}
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#F7F7F8] dark:bg-[#2c2f33] text-[#8E8E93] dark:text-[#8e9095] border border-[#e5e5ea] dark:border-[#35383c]">
                /settings/language
              </span>
            </div>
            <p className="text-xs text-[#8E8E93] dark:text-[#8e9095] mt-0.5">
              Select your primary working language for real-time app translation
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {languages.map((lang) => {
          const isSelected = language === lang.key;
          return (
            <motion.button
              key={lang.key}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setLanguage(lang.key);
                showToast(`Language set to ${lang.label}`, 'success');
              }}
              className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer card-depth ${
                isSelected
                  ? 'border-[#FF5500] bg-[#FFF0EB] dark:bg-[#25282c] shadow-[0_4px_16px_rgba(255,85,0,0.18)] ring-2 ring-[#FF5500]/30'
                  : 'border-[#e5e5ea] dark:border-[#35383c] bg-white dark:bg-[#1f2225] hover:border-[#FF5500]/50'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span className="text-3xl select-none">{lang.flag}</span>
                <div>
                  <div className="text-sm font-black text-[#2C2C2E] dark:text-[#eff1f5]">
                    {lang.label}
                  </div>
                  <div className="text-xs font-medium text-[#8E8E93] dark:text-[#8e9095] mt-0.5">
                    {lang.native}
                  </div>
                </div>
              </div>

              {isSelected ? (
                <span className="flex items-center gap-1 text-xs font-black text-[#FF5500]">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                </span>
              ) : (
                <span className="w-5 h-5 rounded-full border-2 border-[#e5e5ea] dark:border-[#484b50]" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Done button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => setActiveSubPage(null)}
          className="px-5 py-2.5 bg-[#FF5500] text-white font-bold text-xs rounded-xl shadow-md hover:bg-[#E04800] transition-colors cursor-pointer"
        >
          Save &amp; Return to Settings
        </button>
      </div>
    </motion.div>
  );

  // ==========================================
  // SUB-PAGE 4: NOTIFICATIONS & SOUND
  // ==========================================
  const renderNotificationsSubPage = () => (
    <motion.div
      key="subpage-notifications"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#191c1f] p-4 sm:p-5 rounded-2xl border border-[#e5e5ea] dark:border-[#35383c] card-depth">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setActiveSubPage(null)}
            className="w-9 h-9 rounded-xl bg-[#F7F7F8] dark:bg-[#2c2f33] border border-[#e5e5ea] dark:border-[#3a3d42] flex items-center justify-center text-[#2C2C2E] dark:text-[#eff1f5] hover:bg-[#FFF0EB] hover:text-[#FF5500] dark:hover:bg-[#35383c] transition-colors cursor-pointer"
            aria-label="Back to Settings"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </motion.button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-[#2C2C2E] dark:text-[#eff1f5] tracking-tight">
                {t.notificationsTitle} &amp; Sound
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#F7F7F8] dark:bg-[#2c2f33] text-[#8E8E93] dark:text-[#8e9095] border border-[#e5e5ea] dark:border-[#35383c]">
                /settings/notifications
              </span>
            </div>
            <p className="text-xs text-[#8E8E93] dark:text-[#8e9095] mt-0.5">
              Configure push alerts, digest summaries, audio feedback, and haptics
            </p>
          </div>
        </div>

        {/* Audio Test Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            playChime();
            showToast('Playing synthetic scanner chime...', 'info');
          }}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#FFF0EB] dark:bg-[#35383c] border border-[#FFD8CC] dark:border-[#5d3f3c] text-[#FF5500] dark:text-[#ffb4ac] shadow-2xs cursor-pointer min-h-[40px]"
        >
          <span className="material-symbols-outlined text-[18px]">volume_up</span>
          <span>{t.testSound || 'Test Sound'}</span>
        </motion.button>
      </div>

      {/* Notifications Controls List */}
      <div className="bg-white dark:bg-[#191c1f] rounded-2xl border border-[#e5e5ea] dark:border-[#35383c] divide-y divide-[#e5e5ea] dark:divide-[#35383c] card-depth overflow-hidden">
        {/* Push Notifications */}
        <div className="flex justify-between items-center p-4 sm:p-5 min-h-[56px] hover:bg-[#F7F7F8]/60 dark:hover:bg-[#222528] transition-colors">
          <div className="flex items-start gap-3.5">
            <span className="w-9 h-9 rounded-xl bg-[#FFF0EB] dark:bg-[#35383c] text-[#FF5500] dark:text-[#ffb4ac] flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </span>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#2C2C2E] dark:text-[#eff1f5]">
                {t.pushNotifications}
              </div>
              <div className="text-xs text-[#8E8E93] dark:text-[#8e9095] mt-0.5">
                {t.pushDesc}
              </div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
            <input
              type="checkbox"
              checked={userProfile.pushNotifications}
              onChange={(e) => {
                updateUserProfile({ pushNotifications: e.target.checked });
                showToast(e.target.checked ? 'Push notifications enabled' : 'Push notifications disabled', 'info');
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#e5e5ea] dark:bg-[#414448] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5500] dark:peer-checked:bg-[#b60013]" />
          </label>
        </div>

        {/* Daily Summary */}
        <div className="flex justify-between items-center p-4 sm:p-5 min-h-[56px] hover:bg-[#F7F7F8]/60 dark:hover:bg-[#222528] transition-colors">
          <div className="flex items-start gap-3.5">
            <span className="w-9 h-9 rounded-xl bg-[#FFF0EB] dark:bg-[#35383c] text-[#FF5500] dark:text-[#ffb4ac] flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[20px]">summarize</span>
            </span>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#2C2C2E] dark:text-[#eff1f5]">
                {t.dailySummary}
              </div>
              <div className="text-xs text-[#8E8E93] dark:text-[#8e9095] mt-0.5">
                {t.dailyDesc}
              </div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
            <input
              type="checkbox"
              checked={userProfile.dailySummary}
              onChange={(e) => {
                updateUserProfile({ dailySummary: e.target.checked });
                showToast(e.target.checked ? 'Daily summary enabled' : 'Daily summary disabled', 'info');
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#e5e5ea] dark:bg-[#414448] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5500] dark:peer-checked:bg-[#b60013]" />
          </label>
        </div>

        {/* Sound & Vibration */}
        <div className="flex justify-between items-center p-4 sm:p-5 min-h-[56px] hover:bg-[#F7F7F8]/60 dark:hover:bg-[#222528] transition-colors">
          <div className="flex items-start gap-3.5">
            <span className="w-9 h-9 rounded-xl bg-[#FFF0EB] dark:bg-[#35383c] text-[#FF5500] dark:text-[#ffb4ac] flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[20px]">volume_up</span>
            </span>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#2C2C2E] dark:text-[#eff1f5]">
                {t.soundVibration}
              </div>
              <div className="text-xs text-[#8E8E93] dark:text-[#8e9095] mt-0.5">
                {t.soundDesc}
              </div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
            <input
              type="checkbox"
              checked={userProfile.soundVibration}
              onChange={(e) => {
                updateUserProfile({ soundVibration: e.target.checked });
                showToast(e.target.checked ? 'Sound & haptics enabled' : 'Sound & haptics disabled', 'info');
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#e5e5ea] dark:bg-[#414448] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5500] dark:peer-checked:bg-[#b60013]" />
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={() => setActiveSubPage(null)}
          className="px-5 py-2.5 bg-[#FF5500] text-white font-bold text-xs rounded-xl shadow-md hover:bg-[#E04800] transition-colors cursor-pointer"
        >
          Save &amp; Return to Settings
        </button>
      </div>
    </motion.div>
  );

  // ==========================================
  // SUB-PAGE 5: SYSTEM & DIAGNOSTICS
  // ==========================================
  const renderDiagnosticsSubPage = () => (
    <motion.div
      key="subpage-diagnostics"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#191c1f] p-4 sm:p-5 rounded-2xl border border-[#e5e5ea] dark:border-[#35383c] card-depth">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setActiveSubPage(null)}
            className="w-9 h-9 rounded-xl bg-[#F7F7F8] dark:bg-[#2c2f33] border border-[#e5e5ea] dark:border-[#3a3d42] flex items-center justify-center text-[#2C2C2E] dark:text-[#eff1f5] hover:bg-[#FFF0EB] hover:text-[#FF5500] dark:hover:bg-[#35383c] transition-colors cursor-pointer"
            aria-label="Back to Settings"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </motion.button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-[#2C2C2E] dark:text-[#eff1f5] tracking-tight">
                {t.systemTitle} &amp; Diagnostics
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#F7F7F8] dark:bg-[#2c2f33] text-[#8E8E93] dark:text-[#8e9095] border border-[#e5e5ea] dark:border-[#35383c]">
                /settings/diagnostics
              </span>
            </div>
            <p className="text-xs text-[#8E8E93] dark:text-[#8e9095] mt-0.5">
              Shift backups, cache clearing, and central server sync status
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#191c1f] rounded-2xl border border-[#e5e5ea] dark:border-[#35383c] divide-y divide-[#e5e5ea] dark:divide-[#35383c] card-depth overflow-hidden">
        {/* Data Sync Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-3 hover:bg-[#F7F7F8]/60 dark:hover:bg-[#222528] transition-colors">
          <div className="flex items-start gap-3.5">
            <span className="w-9 h-9 rounded-xl bg-[#e1ffec] text-[#008259] flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[20px]">cloud_sync</span>
            </span>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#2C2C2E] dark:text-[#eff1f5]">
                {t.dataSyncStatus}
              </div>
              <div className="text-xs text-[#8E8E93] dark:text-[#8e9095] mt-0.5">
                Central retail cluster: <span className="text-[#008259] font-bold">ONLINE</span> (Metro-Node-East)
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <span className="bg-[#e1ffec] text-[#008259] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-[#a3f3bf]">
              <span className="w-2 h-2 rounded-full bg-[#008259] animate-pulse" />
              {t.syncedJustNow}
            </span>
            <motion.button
              whileHover={{ rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={handleTriggerSync}
              className={`p-2 hover:bg-[#FFF0EB] dark:hover:bg-[#35383c] rounded-xl text-[#FF5500] dark:text-[#ffb4ac] border border-[#FFD8CC] dark:border-[#5d3f3c] cursor-pointer ${
                isSyncing ? 'animate-spin' : ''
              }`}
              title="Sync now"
            >
              <span className="material-symbols-outlined text-[18px]">sync</span>
            </motion.button>
          </div>
        </div>

        {/* Export Backup (JSON) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-3 hover:bg-[#F7F7F8]/60 dark:hover:bg-[#222528] transition-colors">
          <div className="flex items-start gap-3.5">
            <span className="w-9 h-9 rounded-xl bg-[#FFF0EB] dark:bg-[#35383c] text-[#FF5500] dark:text-[#ffb4ac] flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[20px]">download</span>
            </span>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#2C2C2E] dark:text-[#eff1f5]">
                Export Shift Backup (JSON)
              </div>
              <div className="text-xs text-[#8E8E93] dark:text-[#8e9095] mt-0.5">
                Download structured JSON backup containing tasks, media attachments, and notes.
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportBackup}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFF0EB] dark:bg-[#25282c] border border-[#FFD8CC] dark:border-[#5d3f3c] text-[#FF5500] dark:text-[#ffb4ac] text-xs font-bold cursor-pointer self-end sm:self-center"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            Export JSON
          </motion.button>
        </div>

        {/* Activity Logs Jump */}
        <button
          onClick={() => setCurrentScreen('activity')}
          className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-[#F7F7F8] dark:hover:bg-[#222528] transition-colors text-left cursor-pointer"
        >
          <div className="flex items-start gap-3.5">
            <span className="w-9 h-9 rounded-xl bg-[#F7F7F8] dark:bg-[#35383c] text-[#2C2C2E] dark:text-[#eff1f5] flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[20px]">history</span>
            </span>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#2C2C2E] dark:text-[#eff1f5]">
                {t.activityHistory}
              </div>
              <div className="text-xs text-[#8E8E93] dark:text-[#8e9095] mt-0.5">
                Inspect real-time telemetry, completion audit timestamps, and system logs.
              </div>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#8E8E93] text-[20px]">
            chevron_right
          </span>
        </button>

        {/* Clear Local Cache */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-3 hover:bg-[#ffebee]/40 dark:hover:bg-[#352525] transition-colors">
          <div className="flex items-start gap-3.5">
            <span className="w-9 h-9 rounded-xl bg-[#ffebee] dark:bg-[#4a2424] text-[#d81b1b] flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[20px]">delete_sweep</span>
            </span>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#d81b1b]">
                {t.clearCache}
              </div>
              <div className="text-xs text-[#8E8E93] dark:text-[#8e9095] mt-0.5">
                {t.clearCacheDesc}
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsClearConfirmOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#d81b1b] text-white text-xs font-bold shadow-xs hover:bg-[#b51414] transition-colors cursor-pointer self-end sm:self-center"
          >
            Reset Cache
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={() => setActiveSubPage(null)}
          className="px-5 py-2.5 bg-[#FF5500] text-white font-bold text-xs rounded-xl shadow-md hover:bg-[#E04800] transition-colors cursor-pointer"
        >
          Return to Settings
        </button>
      </div>
    </motion.div>
  );

  // ==========================================
  // MAIN SETTINGS MENU (SINGLE-ROW ITEMS)
  // ==========================================
  const renderMainMenu = () => (
    <motion.div
      key="main-settings-menu"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.2 }}
      className="space-y-5"
    >
      {/* 1. HERO PROFILE CARD */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#191c1f] border border-[#FFD8CC]/80 dark:border-[#5d3f3c] rounded-2xl overflow-hidden card-depth transition-all"
      >
        <div className="bg-gradient-to-r from-[#FF5500] via-[#FF4500] to-[#E04800] dark:from-[#b60013] dark:to-[#e01a22] p-4 sm:p-6 text-white relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 relative z-10">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <motion.div whileHover={{ scale: 1.06, rotate: 2 }} className="relative">
                <img
                  alt={userProfile.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-xl ring-4 ring-white/30"
                  src={userProfile.avatarUrl}
                />
                <span
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#008259] ring-2 ring-white flex items-center justify-center text-white"
                  title="Active on Shift"
                >
                  <span className="material-symbols-outlined text-[12px]">check</span>
                </span>
              </motion.div>

              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight">{userProfile.name}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-white/20 border border-white/30">
                    Lead
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-white/90 font-medium mt-0.5">
                  {userProfile.role}
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-xs text-white/80">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">store</span>
                    {userProfile.branch}
                  </span>
                  <span>•</span>
                  <span>Joined {userProfile.joinedDate}</span>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditProfileModalOpen(true)}
              className="bg-white text-[#FF5500] dark:text-[#b60013] px-4 py-2 rounded-xl font-bold text-xs shadow-md hover:bg-white/90 transition-all flex items-center gap-1.5 cursor-pointer min-h-[40px]"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              {t.editProfile}
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* 2. PRIMARY CONFIGURATION MENU LIST (SINGLE-ROW ITEMS) */}
      <section className="bg-white dark:bg-[#191c1f] border border-[#e5e5ea] dark:border-[#35383c] rounded-2xl overflow-hidden card-depth transition-colors divide-y divide-[#e5e5ea] dark:divide-[#35383c]">
        {settingsMenuItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ x: 3 }}
            onClick={() => setActiveSubPage(item.id)}
            className="w-full flex items-center justify-between p-4 sm:p-4.5 hover:bg-[#F7F7F8] dark:hover:bg-[#222528] transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <span className="w-10 h-10 rounded-xl bg-[#FFF0EB] dark:bg-[#35383c] text-[#FF5500] dark:text-[#ffb4ac] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              </span>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-black text-[#2C2C2E] dark:text-[#eff1f5] truncate">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#8E8E93] dark:text-[#8e9095] truncate">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 ml-3">
              {item.badgeType === 'success' ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#e1ffec] text-[#008259] border border-[#a3f3bf] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#008259]" />
                  {item.badge}
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#FFF0EB] dark:bg-[#2c2f33] text-[#FF5500] dark:text-[#ffb4ac] border border-[#FFD8CC] dark:border-[#5d3f3c]">
                  {item.badge}
                </span>
              )}
              <span className="material-symbols-outlined text-[#8E8E93] group-hover:text-[#FF5500] text-[20px] transition-colors">
                chevron_right
              </span>
            </div>
          </motion.button>
        ))}
      </section>

      {/* 4. ABOUT & LEGAL FOOTER */}
      <section className="bg-white dark:bg-[#191c1f] border border-[#e5e5ea] dark:border-[#35383c] rounded-2xl overflow-hidden card-depth transition-colors p-4 sm:p-5">
        <div className="flex items-center justify-between border-b border-[#e5e5ea] dark:border-[#35383c] pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#FF5500] dark:text-[#ffb4ac]">
              info
            </span>
            <h4 className="text-sm font-bold text-[#2C2C2E] dark:text-[#eff1f5]">
              {t.aboutTaskn}
            </h4>
          </div>
          <span className="text-xs text-[#8E8E93] dark:text-[#d8dade] font-mono bg-[#F7F7F8] dark:bg-[#35383c] px-2 py-0.5 rounded-md">
            v3.2.0-retail
          </span>
        </div>

        <p className="text-xs text-[#8E8E93] dark:text-[#d8dade] leading-relaxed">
          {t.aboutDesc}
        </p>

        <div className="flex gap-4 pt-3 mt-3 border-t border-[#e5e5ea] dark:border-[#35383c]">
          <button
            onClick={() => setIsTermsOpen(true)}
            className="text-xs font-bold text-[#FF5500] dark:text-[#ffb4ac] hover:underline flex items-center gap-1 cursor-pointer"
          >
            Terms of Service
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </button>
          <button
            onClick={() => setIsPrivacyOpen(true)}
            className="text-xs font-bold text-[#FF5500] dark:text-[#ffb4ac] hover:underline flex items-center gap-1 cursor-pointer"
          >
            Privacy Policy
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </button>
        </div>
      </section>
    </motion.div>
  );

  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in duration-200 pb-12">
      <AnimatePresence mode="wait">
        {activeSubPage === 'theme' && renderThemeSubPage()}
        {activeSubPage === 'calendar-view' && renderCalendarSubPage()}
        {activeSubPage === 'language' && renderLanguageSubPage()}
        {activeSubPage === 'notifications' && renderNotificationsSubPage()}
        {activeSubPage === 'diagnostics' && renderDiagnosticsSubPage()}
        {activeSubPage === null && renderMainMenu()}
      </AnimatePresence>

      {/* Clear Cache Confirmation Dialog */}
      <AnimatePresence>
        {isClearConfirmOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-white dark:bg-[#191c1f] rounded-2xl max-w-md w-full p-6 space-y-4 border border-[#FFD8CC] dark:border-[#5d3f3c] shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-[#FFF0EB] text-[#FF5500] flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-[28px]">warning</span>
              </div>
              <div className="text-center">
                <h3 className="text-base font-black text-[#2C2C2E] dark:text-[#eff1f5]">
                  Clear Local Cache?
                </h3>
                <p className="text-xs text-[#8E8E93] dark:text-[#d8dade] mt-1">
                  This will reset all locally stored tasks, notes, and activity logs to default state.
                </p>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={() => setIsClearConfirmOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-[#e5e5ea] dark:border-[#35383c] hover:bg-[#F7F7F8] cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={() => {
                    clearCache();
                    setIsClearConfirmOpen(false);
                    setActiveSubPage(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FF5500] text-white hover:bg-[#E04800] cursor-pointer"
                >
                  Confirm Reset
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Terms Modal */}
      {isTermsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#191c1f] rounded-2xl max-w-lg w-full p-6 space-y-4 border border-[#e5e5ea]">
            <h3 className="text-base font-bold text-[#2C2C2E] dark:text-[#eff1f5]">
              Terms of Service
            </h3>
            <p className="text-xs text-[#8E8E93] dark:text-[#d8dade] leading-relaxed">
              TASKN operations platform is licensed for retail store associates and supervisors. Store
              telemetry and compliance checks are logged in accordance with enterprise safety guidelines.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsTermsOpen(false)}
                className="bg-[#FF5500] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {isPrivacyOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#191c1f] rounded-2xl max-w-lg w-full p-6 space-y-4 border border-[#e5e5ea]">
            <h3 className="text-base font-bold text-[#2C2C2E] dark:text-[#eff1f5]">
              Privacy Policy
            </h3>
            <p className="text-xs text-[#8E8E93] dark:text-[#d8dade] leading-relaxed">
              Shift data and task audits are encrypted and stored locally with periodic synchronization to
              the central store database. No personal telemetry is transmitted outside the authorized VPN.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsPrivacyOpen(false)}
                className="bg-[#FF5500] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

