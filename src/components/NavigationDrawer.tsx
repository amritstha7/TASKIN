import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { ScreenType } from '../types';

export const NavigationDrawer: React.FC = () => {
  const { currentScreen, setCurrentScreen, urgentTasksCount, activities } = useApp();

  const navItems: {
    id: ScreenType;
    label: string;
    icon: string;
    isAddTask?: boolean;
    badge?: number | string;
  }[] = [
    {
      id: 'dashboard',
      label: 'DASHBOARD',
      icon: 'view_quilt',
    },
    {
      id: 'add-task',
      label: 'ADD TASK',
      icon: 'add',
      isAddTask: true,
    },
    {
      id: 'media',
      label: 'MEDIA',
      icon: 'photo_library',
    },
    {
      id: 'activity',
      label: 'ACTIVITY',
      icon: 'history',
      badge: 3,
    },
    {
      id: 'admin',
      label: 'ADMIN',
      icon: 'manage_accounts',
    },
  ];

  return (
    <aside
      id="left-vertical-navigation-rail"
      className="hidden md:flex flex-col items-center w-[92px] min-h-screen bg-[#111315] border-r border-[#1f2228] py-6 px-1 shrink-0 select-none z-30 transition-colors"
    >
      {/* Navigation Stack */}
      <nav className="flex flex-col items-center gap-3.5 w-full">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.94 }}
              onClick={() => setCurrentScreen(item.id)}
              className={`relative w-[84px] py-3.5 px-1 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer group ${
                isActive
                  ? 'bg-[#242830] text-white shadow-md'
                  : 'bg-transparent hover:bg-[#1a1d23] text-[#8E9299] hover:text-white'
              }`}
              title={item.label}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Left Active Orange Accent Bar */}
              {isActive && (
                <motion.span
                  layoutId="activeLeftRailBar"
                  className="absolute left-0 top-2.5 bottom-2.5 w-1.5 bg-[#FF5500] rounded-r-md"
                />
              )}

              {/* Icon rendering */}
              <div className="relative flex items-center justify-center min-h-[28px]">
                {item.isAddTask ? (
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 ${
                      isActive
                        ? 'bg-[#FF5500] text-white shadow-[0_2px_8px_rgba(255,85,0,0.5)]'
                        : 'bg-[#FF5500] text-white shadow-xs'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] font-black">
                      add
                    </span>
                  </div>
                ) : (
                  <span
                    className={`material-symbols-outlined text-[24px] transition-colors ${
                      isActive
                        ? 'text-white'
                        : 'text-[#8E9299] group-hover:text-white'
                    }`}
                  >
                    {item.icon}
                  </span>
                )}

                {/* Badge (e.g. Activity Badge "3") */}
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 rounded-full bg-[#FF5500] text-white text-[9px] font-black flex items-center justify-center ring-2 ring-[#111315] shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] tracking-wider uppercase mt-1.5 text-center leading-tight transition-colors ${
                  isActive
                    ? 'text-white font-black'
                    : 'text-[#8E9299] group-hover:text-white font-bold'
                }`}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom Divider */}
      <div className="w-14 border-t border-[#23272f] mt-auto mb-2" />
    </aside>
  );
};
