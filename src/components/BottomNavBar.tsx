import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { ScreenType } from '../types';

export const BottomNavBar: React.FC = () => {
  const { currentScreen, setCurrentScreen, urgentTasksCount, t } = useApp();

  const navItems: {
    id: ScreenType;
    label: string;
    icon: string;
    badge?: number;
    isPrimary?: boolean;
  }[] = [
    {
      id: 'dashboard',
      label: t.navDashboard,
      icon: 'dashboard',
    },
    {
      id: 'activity',
      label: t.activityTitle.split(' ')[0],
      icon: 'history',
    },
    {
      id: 'add-task',
      label: t.navAddTask,
      icon: 'add',
      isPrimary: true,
    },
    {
      id: 'media',
      label: t.navMedia,
      icon: 'photo_library',
    },
    {
      id: 'admin',
      label: t.navSettings.split(' ')[0],
      icon: 'settings',
      badge: urgentTasksCount > 0 ? urgentTasksCount : undefined,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#191c1f]/95 backdrop-blur-md border-t border-[#e5e5ea] dark:border-[#35383c] px-2 py-1.5 transition-colors card-depth safe-area-pb">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive =
            currentScreen === item.id ||
            (item.id === 'dashboard' &&
              ['urgent-tasks', 'store-tasks', 'communications', 'notes'].includes(currentScreen));

          if (item.isPrimary) {
            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.1, y: -4 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentScreen(item.id)}
                className="relative -top-3 w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF5500] to-[#FF3300] dark:from-[#b60013] dark:to-[#e01a22] text-white flex items-center justify-center shadow-[0_6px_20px_rgba(255,85,0,0.4)] dark:shadow-[0_6px_20px_rgba(182,0,19,0.5)] cursor-pointer"
                aria-label="Add Task"
              >
                <span className="material-symbols-outlined text-[26px]">add</span>
              </motion.button>
            );
          }

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.88 }}
              onClick={() => setCurrentScreen(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                isActive
                  ? 'text-[#FF5500] dark:text-[#ffb4ac]'
                  : 'text-[#8E8E93] dark:text-[#8e9095] hover:text-[#2C2C2E] dark:hover:text-[#eff1f5]'
              }`}
            >
              <div className="relative">
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>

                {item.badge && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#FF5500] dark:bg-[#ba1a1a] text-white text-[9px] font-black flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] tracking-tight mt-0.5 ${
                  isActive ? 'font-bold' : 'font-medium'
                }`}
              >
                {item.label}
              </span>

              {isActive && (
                <motion.div
                  layoutId="bottomNavDot"
                  className="w-1 h-1 rounded-full bg-[#FF5500] dark:bg-[#ffb4ac] mt-0.5"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
