import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { GlobalSearchBar } from './GlobalSearchBar';

export const TopAppBar: React.FC = () => {
  const {
    userProfile,
    isDarkMode,
    toggleTheme,
    t,
    setIsNotificationsOpen,
    setIsEditProfileModalOpen,
    urgentTasksCount,
    setCurrentScreen,
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#191c1f] border-b border-[#e5e5ea] dark:border-[#35383c] px-3.5 md:px-6 py-2.5 transition-colors card-depth">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2.5 md:gap-3 shrink-0">
          <button
            onClick={() => setCurrentScreen('dashboard')}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            aria-label="TASKN Dashboard"
          >
            {/* 3D animated Logo badge */}
            <motion.div
              whileHover={{ scale: 1.08, rotate: [0, -4, 4, 0] }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-[#FF5500] to-[#FF3300] dark:from-[#b60013] dark:to-[#85000c] text-white flex items-center justify-center shadow-[0_4px_14px_rgba(255,85,0,0.35)] dark:shadow-[0_4px_14px_rgba(182,0,19,0.4)]"
            >
              <span className="material-symbols-outlined text-[22px] md:text-[24px]">
                storefront
              </span>
            </motion.div>

            <div className="text-left hidden xs:block">
              <div className="flex items-center gap-1.5">
                <span className="text-base md:text-lg font-black tracking-tight text-[#2C2C2E] dark:text-[#eff1f5] group-hover:text-[#FF5500] dark:group-hover:text-[#ffb4ac] transition-colors">
                  TASKN
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-[#FFF0EB] dark:bg-[#35383c] text-[#FF5500] dark:text-[#ffb4ac] border border-[#FFD8CC] dark:border-[#4d2d2a]">
                  OPS
                </span>
              </div>
              <p className="text-[10px] text-[#8E8E93] dark:text-[#8e9095] leading-none hidden sm:block">
                {userProfile.branch}
              </p>
            </div>
          </button>
        </div>

        {/* Center: Relocated Global Search Bar */}
        <GlobalSearchBar />

        {/* Right Action Toolbar */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Notifications Trigger */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsNotificationsOpen(true)}
            className="relative w-9 h-9 rounded-xl border border-[#e5e5ea] dark:border-[#35383c] bg-[#F7F7F8] dark:bg-[#25282c] text-[#2C2C2E] dark:text-[#eff1f5] flex items-center justify-center hover:text-[#FF5500] dark:hover:text-[#ffb4ac] hover:border-[#FF5500] dark:hover:border-[#ffb4ac] transition-all cursor-pointer shadow-xs"
            aria-label="Notifications"
            id="header-notifications-button"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {urgentTasksCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF5500] dark:bg-[#ba1a1a] text-white text-[9px] font-black flex items-center justify-center animate-pulse ring-2 ring-white dark:ring-[#191c1f]">
                {urgentTasksCount}
              </span>
            )}
          </motion.button>

          {/* Simplified User Profile Avatar Trigger (Direct circular click target without down-arrow) */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full relative p-0.5 border-2 border-transparent hover:border-[#FF5500] dark:hover:border-[#ffb4ac] focus:border-[#FF5500] transition-all cursor-pointer bg-[#F7F7F8] dark:bg-[#25282c] shadow-xs focus:outline-none ring-2 ring-[#FF5500]/25 dark:ring-[#ba1a1a]/30"
              aria-label="User profile menu"
              id="header-user-profile-avatar-button"
              title={userProfile.name}
            >
              <img
                src={userProfile.avatarUrl}
                alt={userProfile.name}
                className="w-full h-full rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#008259] ring-2 ring-white dark:ring-[#191c1f]" />
            </motion.button>

            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#25282c] rounded-2xl border border-[#e5e5ea] dark:border-[#35383c] shadow-2xl p-2 z-50"
                >
                  <div className="p-2.5 border-b border-[#e5e5ea] dark:border-[#35383c] mb-1">
                    <p className="text-xs font-bold text-[#2C2C2E] dark:text-[#eff1f5]">
                      {userProfile.name}
                    </p>
                    <p className="text-[10px] text-[#8E8E93] dark:text-[#8e9095]">
                      {userProfile.role}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setCurrentScreen('admin');
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium text-[#2C2C2E] dark:text-[#eff1f5] hover:bg-[#FFF0EB] dark:hover:bg-[#35383c] hover:text-[#FF5500] dark:hover:text-[#ffb4ac] transition-colors text-left cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">settings</span>
                    {t.navSettings}
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsEditProfileModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium text-[#2C2C2E] dark:text-[#eff1f5] hover:bg-[#FFF0EB] dark:hover:bg-[#35383c] hover:text-[#FF5500] dark:hover:text-[#ffb4ac] transition-colors text-left cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">badge</span>
                    {t.editProfile}
                  </button>

                  <div className="border-t border-[#e5e5ea] dark:border-[#35383c] my-1" />

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      toggleTheme();
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium text-[#2C2C2E] dark:text-[#eff1f5] hover:bg-[#F7F7F8] dark:hover:bg-[#35383c] transition-colors text-left cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">
                        {isDarkMode ? 'light_mode' : 'dark_mode'}
                      </span>
                      {isDarkMode ? t.themeLight : t.themeDark}
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
