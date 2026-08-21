import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, Info, TriangleAlert } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { useSettings } from '@/providers/settings-provider';
import type { TaskUI } from '@/types/app';
import { formatAdToBsString, getBsDateFromAd } from '@/utils/nepaliCalendar';

interface DayCell {
  date: Date;
  inCurrentMonth: boolean;
  iso: string;
}

function buildMonthGrid(year: number, month: number): DayCell[] {
  const firstOfMonth = new Date(year, month, 1);
  const leadingBlanks = (firstOfMonth.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - leadingBlanks);

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    return { date, inCurrentMonth: date.getMonth() === month, iso: toIso(date) };
  });
}

function toIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

interface DayMarker {
  urgent: boolean;
  pending: boolean;
  completed: boolean;
}

function markerForDay(tasks: TaskUI[], iso: string): DayMarker {
  const dayTasks = tasks.filter((t) => t.due_date === iso);
  return {
    urgent: dayTasks.some((t) => t.is_urgent && !t.completed),
    pending: dayTasks.some((t) => !t.completed && !t.is_urgent),
    completed: dayTasks.some((t) => t.completed),
  };
}

export function CalendarView({ tasks }: { tasks: TaskUI[] }) {
  const router = useRouter();
  const { t, calendarMode } = useSettings();
  // Seed initial state from "now" once at mount — fine, this is a normal
  // useState initializer. The bug this fixes is further down: `goToday` and
  // `todayIso` used to close over this same Date instance forever (it was
  // wrapped in `useMemo(() => new Date(), [])`), so "Today" and the
  // today-highlight went stale the moment the calendar had been mounted for
  // longer than the current day — e.g. an app left open overnight, or a Fast
  // Refresh that preserved component state across a code edit during testing.
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());
  const [selectedIso, setSelectedIso] = useState(() => toIso(new Date()));

  const grid = useMemo(() => buildMonthGrid(viewYear, viewMonth), [viewYear, viewMonth]);
  const weekdayLabels = [t.mon, t.tue, t.wed, t.thu, t.fri, t.sat, t.sun];

  const monthLabelAd = new Date(viewYear, viewMonth, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const monthLabelBs = useMemo(() => {
    const bs = getBsDateFromAd(viewYear, viewMonth, 1);
    return `${bs.monthNameEn} ${bs.year} BS`;
  }, [viewYear, viewMonth]);

  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };
  const goToday = () => {
    // Always resolve "now" at the moment this is pressed — never reuse a
    // Date captured earlier, or this drifts the instant a day boundary passes
    // while the app is still open.
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setSelectedIso(toIso(now));
  };

  const selectedDayTasks = tasks.filter((tItem) => tItem.due_date === selectedIso);
  // Recomputed every render (cheap) so the today-highlight never goes stale.
  const todayIso = toIso(new Date());

  return (
    <View
      className="gap-3 rounded-2xl border border-[#e5e5ea] bg-white p-3.5 dark:border-[#5d3f3c] dark:bg-surface-dark"
      style={{ shadowColor: '#000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 4 }, shadowRadius: 12, elevation: 3 }}
    >
      <View className="flex-row items-center justify-between border-b border-[#e5e5ea] pb-3 dark:border-[#35383c]">
        <View className="flex-1">
          <Text className="text-base font-black tracking-tight text-ink dark:text-ink-dark">
            {calendarMode === 'bs' ? monthLabelBs : monthLabelAd}
          </Text>
          {calendarMode === 'dual' ? <Text className="text-[11px] font-medium text-[#8E8E93] dark:text-[#8e9095]">{monthLabelBs}</Text> : null}
        </View>
        <View className="flex-row items-center gap-1">
          <Pressable onPress={goPrevMonth} hitSlop={8} className="h-8 w-8 items-center justify-center rounded-full">
            <ChevronLeft size={18} color={colors.ink} />
          </Pressable>
          <Pressable onPress={goNextMonth} hitSlop={8} className="h-8 w-8 items-center justify-center rounded-full">
            <ChevronRight size={18} color={colors.ink} />
          </Pressable>
        </View>
      </View>

      <View className="flex-row items-center gap-2 self-end">
        <Pressable
          onPress={() => router.push('/modals/legend')}
          className="flex-row items-center gap-1.5 rounded-xl border border-[#e5e5ea] bg-[#F7F7F8] px-3 py-1.5 dark:border-[#5d3f3c] dark:bg-[#2e3134]"
        >
          <Info size={14} color={colors.brand} />
          <Text className="text-xs font-bold text-ink dark:text-ink-dark">{t.legend}</Text>
        </Pressable>
        <Pressable onPress={goToday} className="rounded-xl border border-[#FFD8CC] bg-[#FFF0EB] px-3 py-1.5 dark:border-[#5d3f3c] dark:bg-[#2e3134]">
          <Text className="text-xs font-bold text-brand dark:text-ink-dark">{t.today}</Text>
        </Pressable>
      </View>

      <View className="flex-row">
        {weekdayLabels.map((label, i) => (
          <View key={`${label}-${i}`} className="flex-1 items-center">
            <Text className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E93] dark:text-[#d8dade]">{label}</Text>
          </View>
        ))}
      </View>

      <View className="flex-row flex-wrap">
        {grid.map((cell) => {
          const marker = markerForDay(tasks, cell.iso);
          const isSelected = cell.iso === selectedIso;
          const isToday = cell.iso === todayIso;
          const bs = calendarMode !== 'ad' ? getBsDateFromAd(cell.date.getFullYear(), cell.date.getMonth(), cell.date.getDate()) : null;

          let cellBg = 'bg-white dark:bg-[#1e2124] border-[#e5e5ea] dark:border-[#35383c]';
          if (!cell.inCurrentMonth) cellBg = 'bg-[#F7F7F8]/60 dark:bg-[#1f2225]/40 border-[#e5e5ea]/50 dark:border-[#35383c]/50';
          else if (isSelected) cellBg = 'bg-[#FFF0EB] dark:bg-[#ffb4ac]/10 border-[#FF5500]';
          else if (isToday) cellBg = 'bg-[#2C2C2E] dark:bg-[#2e3134] border-[#2C2C2E]';

          return (
            <Pressable
              key={cell.iso}
              onPress={() => setSelectedIso(cell.iso)}
              style={{ width: `${100 / 7}%` }}
              className="p-0.5"
            >
              <View
                className={`min-h-[56px] justify-between rounded-xl border p-1.5 ${cellBg} ${!cell.inCurrentMonth ? 'opacity-35' : ''} ${isSelected ? 'border-2' : ''}`}
                style={isSelected ? { shadowColor: colors.brand, shadowOpacity: 0.2, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 3 } : undefined}
              >
                <View className="items-end">
                  {calendarMode === 'bs' && bs ? (
                    <View className="items-end">
                      <Text className={`text-xs font-bold leading-none ${isToday ? 'text-white' : isSelected ? 'text-brand' : 'text-ink dark:text-ink-dark'}`}>
                        {bs.day}
                      </Text>
                      <Text className={`text-[9px] leading-none ${isToday ? 'text-white/70' : 'text-[#8E8E93] dark:text-[#8e9095]'}`}>{bs.monthNameNp}</Text>
                    </View>
                  ) : calendarMode === 'dual' && bs ? (
                    <View className="items-end">
                      <Text className={`text-xs font-bold leading-none ${isToday ? 'text-white' : isSelected ? 'text-brand' : 'text-ink dark:text-ink-dark'}`}>
                        {cell.date.getDate()}
                      </Text>
                      <Text className={`mt-0.5 text-[9px] font-semibold leading-none ${isToday ? 'text-white/70' : 'text-brand'}`}>
                        {bs.dayNp} {bs.monthNameNp.slice(0, 4)}
                      </Text>
                    </View>
                  ) : (
                    <Text className={`text-xs font-semibold leading-none ${isToday ? 'text-white' : isSelected ? 'text-brand' : 'text-ink dark:text-ink-dark'}`}>
                      {cell.date.getDate()}
                    </Text>
                  )}
                </View>

                <View className="mt-auto flex-row items-center gap-1 pt-1">
                  {marker.urgent ? (
                    <TriangleAlert size={13} color={isToday ? '#ffb4ac' : colors.brand} fill={isToday ? '#ffb4ac' : colors.brand} strokeWidth={0} />
                  ) : marker.pending || marker.completed ? (
                    <>
                      {marker.pending ? <View className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.brand }} /> : null}
                      {marker.completed ? <View className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.success }} /> : null}
                    </>
                  ) : null}
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View className="gap-2 border-t border-[#e5e5ea] pt-3 dark:border-[#2e3134]">
        <Text className="text-[11px] text-[#8E8E93] dark:text-[#d8dade]">
          {t.tasksDueOnDay}{' '}
          <Text className="font-mono font-bold text-ink dark:text-ink-dark">
            {new Date(`${selectedIso}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </Text>
          {calendarMode !== 'ad' ? <Text className="font-medium text-brand"> · {formatAdToBsString(selectedIso, 'short')}</Text> : null}
        </Text>
        {selectedDayTasks.length === 0 ? (
          <Text className="text-sm text-[#8E8E93] dark:text-[#8e9095]">{t.noTasksForDay}</Text>
        ) : (
          selectedDayTasks.map((tItem) => (
            <View key={tItem.id} className="flex-row items-center gap-2">
              <View
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: tItem.completed ? colors.success : tItem.is_urgent ? colors.urgentFrom : colors.brand }}
              />
              <Text className="flex-1 text-sm text-ink dark:text-ink-dark" numberOfLines={1}>
                {tItem.title}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
