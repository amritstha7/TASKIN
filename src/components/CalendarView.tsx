import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { getBsDateFromAd, formatAdToBsString, toDevanagariDigits, NEP_DAYS_NP } from '../utils/nepaliCalendar';

export const CalendarView: React.FC = () => {
  const {
    calendarMonth,
    calendarYear,
    goToNextMonth,
    goToPrevMonth,
    goToToday,
    selectedDate,
    setSelectedDate,
    setIsLegendModalOpen,
    tasks,
    t,
    calendarMode,
  } = useApp();

  const [hoveredCell, setHoveredCell] = useState<{
    dateStr: string;
    bsDateStr: string;
    tasksCount: number;
    urgentCount: number;
    completedCount: number;
    firstTitle?: string;
  } | null>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper to format ISO date string YYYY-MM-DD
  const formatDayString = (year: number, month: number, day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  // Days in month calculation
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Day of week for 1st of month (Mon=0, Tue=1, ..., Sun=6)
  const getFirstDayOfWeek = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return (day + 6) % 7;
  };

  const daysInCurrentMonth = getDaysInMonth(calendarYear, calendarMonth);
  const firstDayIndex = getFirstDayOfWeek(calendarYear, calendarMonth);

  // Prev month filler
  const prevMonthIndex = calendarMonth === 0 ? 11 : calendarMonth - 1;
  const prevMonthYear = calendarMonth === 0 ? calendarYear - 1 : calendarYear;
  const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonthIndex);

  const prevMonthDays = [];
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    prevMonthDays.push({
      day: daysInPrevMonth - i,
      month: prevMonthIndex,
      year: prevMonthYear,
      isCurrentMonth: false,
    });
  }

  // Current month days
  const currentMonthDays = [];
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    currentMonthDays.push({
      day: d,
      month: calendarMonth,
      year: calendarYear,
      isCurrentMonth: true,
    });
  }

  // Next month filler
  const totalSlots = Math.ceil((prevMonthDays.length + currentMonthDays.length) / 7) * 7;
  const nextMonthFillerCount = totalSlots - (prevMonthDays.length + currentMonthDays.length);
  const nextMonthIndex = calendarMonth === 11 ? 0 : calendarMonth + 1;
  const nextMonthYear = calendarMonth === 11 ? calendarYear + 1 : calendarYear;

  const nextMonthDays = [];
  for (let d = 1; d <= nextMonthFillerCount; d++) {
    nextMonthDays.push({
      day: d,
      month: nextMonthIndex,
      year: nextMonthYear,
      isCurrentMonth: false,
    });
  }

  const allCalendarDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

  // Specific markers for August 2026 rendering
  const getCustomMarkerForDay = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return null;

    const dateStr = formatDayString(calendarYear, calendarMonth, day);
    const dayTasks = tasks.filter((taskItem) => taskItem.dueDate === dateStr);

    const hasUrgent = dayTasks.some((taskItem) => taskItem.isUrgent && !taskItem.completed);
    const hasCompleted = dayTasks.some((taskItem) => taskItem.completed);
    const hasPending = dayTasks.some((taskItem) => !taskItem.completed && !taskItem.isUrgent);

    // Explicit presets for August 2026
    if (calendarMonth === 7 && calendarYear === 2026) {
      if (day === 3) {
        return (
          <div className="absolute bottom-1.5 left-1.5 flex gap-1 items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5500] dark:bg-[#fe6b00] shadow-[0_0_6px_rgba(255,85,0,0.5)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#008259] dark:bg-[#006645]" />
          </div>
        );
      }
      if (day === 5 || day === 8) {
        return (
          <span
            className="material-symbols-outlined text-[#FF5500] dark:text-[#e01a22] text-[16px] absolute bottom-1.5 left-1.5 fill animate-pulse"
            style={{ fontVariationSettings: "'FILL' 1" }}
            title="Urgent Action Required"
          >
            warning
          </span>
        );
      }
      if (day === 10) {
        return (
          <div className="absolute bottom-1.5 left-1.5 flex gap-1 items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#008259] dark:bg-[#006645]" />
          </div>
        );
      }
      if (day === 11) {
        return (
          <div className="absolute bottom-1.5 left-1.5 flex gap-1 items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5500] dark:bg-[#fe6b00]" />
          </div>
        );
      }
      if (day === 12) {
        return (
          <span
            className="material-symbols-outlined text-[#008259] text-[16px] absolute bottom-1.5 left-1.5 fill"
            style={{ fontVariationSettings: "'FILL' 1" }}
            title="Completed All Actions"
          >
            check_circle
          </span>
        );
      }
    }

    // Dynamic fallback for newly created tasks
    if (hasUrgent) {
      return (
        <span
          className="material-symbols-outlined text-[#FF5500] dark:text-[#e01a22] text-[16px] absolute bottom-1.5 left-1.5 fill animate-bounce"
          style={{ fontVariationSettings: "'FILL' 1" }}
          title="Urgent Task"
        >
          warning
        </span>
      );
    }

    if (hasPending || hasCompleted) {
      return (
        <div className="absolute bottom-1.5 left-1.5 flex gap-1 items-center">
          {hasPending && <span className="w-2.5 h-2.5 rounded-full bg-[#FF5500] dark:bg-[#fe6b00]" />}
          {hasCompleted && <span className="w-2.5 h-2.5 rounded-full bg-[#008259] dark:bg-[#006645]" />}
        </div>
      );
    }

    return null;
  };

  const getDayInfo = (cell: { day: number; month: number; year: number; isCurrentMonth: boolean }) => {
    const dateStr = formatDayString(cell.year, cell.month, cell.day);
    const bsDate = getBsDateFromAd(cell.year, cell.month, cell.day);
    const dayTasks = tasks.filter((tItem) => tItem.dueDate === dateStr);
    const urgentCount = dayTasks.filter((tItem) => tItem.isUrgent && !tItem.completed).length;
    const completedCount = dayTasks.filter((tItem) => tItem.completed).length;
    return {
      dateStr,
      bsDateStr: `${bsDate.dayNp} ${bsDate.monthNameNp} ${bsDate.yearNp} BS (${bsDate.monthNameEn} ${bsDate.day}, ${bsDate.year})`,
      tasksCount: dayTasks.length,
      urgentCount,
      completedCount,
      firstTitle: dayTasks[0]?.title,
    };
  };

  // Bikram Sambat month header for mid-month representation
  const midMonthBs = getBsDateFromAd(calendarYear, calendarMonth, 15);
  const startMonthBs = getBsDateFromAd(calendarYear, calendarMonth, 1);
  const endMonthBs = getBsDateFromAd(calendarYear, calendarMonth, daysInCurrentMonth);

  const getMonthHeaderTitle = () => {
    const adTitle = `${monthNames[calendarMonth]} ${calendarYear}`;
    const bsTitle = `${startMonthBs.monthNameNp} / ${endMonthBs.monthNameNp} ${midMonthBs.yearNp} BS`;
    const bsTitleEn = `${startMonthBs.monthNameEn} / ${endMonthBs.monthNameEn} ${midMonthBs.year} BS`;

    if (calendarMode === 'bs') {
      return {
        primary: bsTitle,
        secondary: bsTitleEn,
      };
    }
    if (calendarMode === 'dual') {
      return {
        primary: adTitle,
        secondary: `${startMonthBs.monthNameNp} - ${endMonthBs.monthNameNp} ${midMonthBs.yearNp} BS (${bsTitleEn})`,
      };
    }
    return {
      primary: adTitle,
      secondary: null,
    };
  };

  const monthHeader = getMonthHeaderTitle();

  // Weekday array with Mon - Sun ordering
  const weekdays = [
    { en: t.mon || 'Mon', np: NEP_DAYS_NP[1] },
    { en: t.tue || 'Tue', np: NEP_DAYS_NP[2] },
    { en: t.wed || 'Wed', np: NEP_DAYS_NP[3] },
    { en: t.thu || 'Thu', np: NEP_DAYS_NP[4] },
    { en: t.fri || 'Fri', np: NEP_DAYS_NP[5] },
    { en: t.sat || 'Sat', np: NEP_DAYS_NP[6] },
    { en: t.sun || 'Sun', np: NEP_DAYS_NP[0] },
  ];

  return (
    <section className="bg-white dark:bg-[#191c1f] rounded-2xl border border-[#e5e5ea] dark:border-[#5d3f3c] shadow-md mb-5 p-3.5 md:p-6 transition-all duration-200 relative overflow-visible">
      {/* Calendar Header: Navigation, Title & Legend / Today Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#e5e5ea] dark:border-[#35383c]">
        {/* Month Navigation & Month Title */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.15, x: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToPrevMonth}
            className="p-1.5 md:p-2 hover:bg-[#F7F7F8] dark:hover:bg-[#2e3134] rounded-full text-[#2C2C2E] dark:text-[#eff1f5] transition-colors focus:outline-none cursor-pointer"
            aria-label="Previous Month"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </motion.button>

          <div>
            <h2 className="text-base md:text-xl font-black text-[#2C2C2E] dark:text-[#eff1f5] tracking-tight flex items-baseline gap-2">
              <span>{monthHeader.primary}</span>
              {calendarMode === 'dual' && (
                <span className="hidden sm:inline text-xs font-bold text-[#FF5500] dark:text-[#ffb4ac] bg-[#FFF0EB] dark:bg-[#35383c] px-2 py-0.5 rounded-full border border-[#FFD8CC] dark:border-[#4d2d2a]">
                  {startMonthBs.monthNameNp} / {endMonthBs.monthNameNp} {midMonthBs.yearNp} BS
                </span>
              )}
            </h2>
            {monthHeader.secondary && calendarMode !== 'dual' && (
              <p className="text-[11px] text-[#8E8E93] dark:text-[#8e9095] font-medium">
                {monthHeader.secondary}
              </p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.15, x: 2 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToNextMonth}
            className="p-1.5 md:p-2 hover:bg-[#F7F7F8] dark:hover:bg-[#2e3134] rounded-full text-[#2C2C2E] dark:text-[#eff1f5] transition-colors focus:outline-none cursor-pointer"
            aria-label="Next Month"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </motion.button>
        </div>

        {/* Legend & Today Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsLegendModalOpen(true)}
            className="bg-[#F7F7F8] dark:bg-[#2e3134] text-[#2C2C2E] dark:text-[#eff1f5] px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-[#eceef2] dark:hover:bg-[#414448] border border-[#e5e5ea] dark:border-[#5d3f3c] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px] text-[#FF5500] dark:text-[#ffb4ac]">
              info
            </span>
            <span>{t.legend}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToToday}
            className="border border-[#FFD8CC] dark:border-[#5d3f3c] bg-[#FFF0EB] dark:bg-[#2e3134] px-3 py-1.5 rounded-xl text-xs font-bold text-[#FF5500] dark:text-[#eff1f5] hover:bg-[#FFE5DC] dark:hover:bg-[#35383c] transition-all shadow-xs cursor-pointer"
          >
            {t.today}
          </motion.button>
        </div>
      </div>

      {/* Weekday Labels (Mon - Sun / सोम - आइत) */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
        {weekdays.map((w) => (
          <div
            key={w.en}
            className="text-[11px] font-bold text-[#8E8E93] dark:text-[#d8dade] py-1 uppercase tracking-wider"
          >
            {calendarMode === 'bs' ? (
              <span>{w.np}</span>
            ) : calendarMode === 'dual' ? (
              <span className="flex flex-col sm:flex-row items-center justify-center sm:gap-1">
                <span>{w.en}</span>
                <span className="text-[9px] text-[#FF5500] dark:text-[#ffb4ac] lowercase font-normal">
                  ({w.np})
                </span>
              </span>
            ) : (
              <span>{w.en}</span>
            )}
          </div>
        ))}
      </div>

      {/* Days Grid with 3D micro-animations & calendar mode representations */}
      <div className="grid grid-cols-7 gap-1 md:gap-1.5 text-center text-xs relative">
        {allCalendarDays.map((cell, idx) => {
          const dateString = formatDayString(cell.year, cell.month, cell.day);
          const isSelected = selectedDate === dateString;
          const isAugust14 = cell.isCurrentMonth && cell.day === 14 && calendarMonth === 7;
          const isAugust16 = cell.isCurrentMonth && cell.day === 16 && calendarMonth === 7;
          const isAugust9 = cell.isCurrentMonth && cell.day === 9 && calendarMonth === 7;

          const bsDate = getBsDateFromAd(cell.year, cell.month, cell.day);

          let cellClass =
            'calendar-cell-3d p-1.5 md:p-2 border rounded-xl min-h-[56px] md:min-h-[68px] text-right relative transition-all duration-200 cursor-pointer select-none flex flex-col justify-between ';

          if (!cell.isCurrentMonth) {
            cellClass +=
              'opacity-35 text-[#8E8E93] dark:text-[#8e9095] border-[#e5e5ea]/50 dark:border-[#35383c]/50 bg-[#F7F7F8]/60 dark:bg-[#1f2225]/40 ';
          } else if (isSelected) {
            cellClass +=
              'ring-2 ring-[#FF5500] dark:ring-[#ffb4ac] border-[#FF5500] bg-[#FFF0EB] dark:bg-[#ffb4ac]/10 font-bold shadow-[0_4px_12px_rgba(255,85,0,0.18)] ';
          } else if (isAugust16) {
            cellClass +=
              'bg-[#2C2C2E] dark:bg-[#2e3134] text-white border-[#2C2C2E] font-bold shadow-xs hover:bg-[#3f4347] ';
          } else if (isAugust9) {
            cellClass +=
              'bg-[#F7F7F8] dark:bg-[#26282b] text-[#2C2C2E] dark:text-[#eff1f5] border-[#e5e5ea] dark:border-[#35383c] hover:border-[#FF5500]/60 ';
          } else {
            cellClass +=
              'bg-white dark:bg-[#1e2124] text-[#2C2C2E] dark:text-[#eff1f5] border-[#e5e5ea] dark:border-[#35383c] hover:border-[#FF5500]/60 hover:bg-[#FFF5F0] dark:hover:bg-[#25282c] ';
          }

          if (isAugust14 && !isAugust16) {
            cellClass += 'text-[#FF5500] dark:text-[#ffb4ac] font-black ';
          }

          return (
            <motion.div
              key={`${cell.year}-${cell.month}-${cell.day}-${idx}`}
              whileHover={{ y: -3, scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              onMouseEnter={() => {
                if (cell.isCurrentMonth) {
                  setHoveredCell(getDayInfo(cell));
                }
              }}
              onMouseLeave={() => setHoveredCell(null)}
              onClick={() => {
                setSelectedDate(dateString);
              }}
              className={cellClass}
            >
              {/* Day Number Header based on Calendar Mode */}
              <div className="flex justify-between items-start w-full">
                {isAugust14 ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] dark:bg-[#ffb4ac]" />
                ) : (
                  <span />
                )}

                {calendarMode === 'ad' && (
                  <span className="text-[11px] md:text-xs font-semibold leading-none">
                    {cell.day}
                  </span>
                )}

                {calendarMode === 'bs' && (
                  <div className="flex flex-col items-end leading-none">
                    <span className="text-[12px] md:text-sm font-bold text-[#2C2C2E] dark:text-[#eff1f5]">
                      {bsDate.dayNp}
                    </span>
                    <span className="text-[9px] text-[#8E8E93] dark:text-[#8e9095]">
                      {bsDate.monthNameNp}
                    </span>
                  </div>
                )}

                {calendarMode === 'dual' && (
                  <div className="flex flex-col items-end leading-none">
                    <span className="text-[11px] md:text-xs font-bold leading-none">
                      {cell.day}
                    </span>
                    <span className="text-[9px] md:text-[10px] text-[#FF5500] dark:text-[#ffb4ac] font-semibold mt-0.5">
                      {bsDate.dayNp} {bsDate.monthNameNp.slice(0, 4)}
                    </span>
                  </div>
                )}
              </div>

              {/* Status / Urgency Marker */}
              <div className="w-full flex items-center justify-between mt-auto pt-1">
                {getCustomMarkerForDay(cell.day, cell.isCurrentMonth)}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Hover Card for Date Peek (3D Interactive Preview with AD & BS dates) */}
      <AnimatePresence>
        {hoveredCell && hoveredCell.tasksCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-2 right-4 z-30 bg-white/95 dark:bg-[#25282c]/95 backdrop-blur-md rounded-xl p-3 border border-[#FFD8CC] dark:border-[#5d3f3c] shadow-xl pointer-events-none max-w-xs"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#2C2C2E] dark:text-[#eff1f5] mb-0.5">
              <span className="material-symbols-outlined text-[#FF5500] text-[16px]">
                event_available
              </span>
              <span>{hoveredCell.dateStr}</span>
            </div>
            <div className="text-[10px] font-semibold text-[#FF5500] dark:text-[#ffb4ac] mb-1">
              {hoveredCell.bsDateStr}
            </div>
            <p className="text-[11px] text-[#8E8E93] dark:text-[#8e9095] truncate">
              {hoveredCell.firstTitle || `${hoveredCell.tasksCount} tasks scheduled`}
            </p>
            <div className="flex gap-2 mt-1.5 text-[10px]">
              {hoveredCell.urgentCount > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-[#FF5500] text-white font-bold">
                  {hoveredCell.urgentCount} Urgent
                </span>
              )}
              {hoveredCell.completedCount > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-[#008259] text-white font-bold">
                  {hoveredCell.completedCount} Done
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendar Footer: Selected date details in active calendar mode */}
      <div className="mt-3 md:mt-4 flex items-center justify-between flex-wrap gap-2 pt-2.5 border-t border-[#e5e5ea] dark:border-[#2e3134]">
        <div className="text-[11px] text-[#8E8E93] dark:text-[#d8dade]">
          Selected Date:{' '}
          <strong className="text-[#2C2C2E] dark:text-[#eff1f5] font-mono">
            {selectedDate.split('-').reverse().join('/')}
          </strong>
          <span className="ml-1.5 text-[#FF5500] dark:text-[#ffb4ac] font-medium">
            ({formatAdToBsString(selectedDate, 'dual')})
          </span>
        </div>
      </div>
    </section>
  );
};
