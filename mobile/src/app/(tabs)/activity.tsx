import { CheckCircle2, Clock, History, PenLine, PlusCircle, StickyNote } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { useActivities } from '@/hooks/use-activities';
import { colors } from '@/theme/colors';
import type { ActivityUI } from '@/types/app';
import type { ActivityType } from '@/types/database';

type Filter = 'all' | ActivityType;

const TYPE_ICON: Record<ActivityType, LucideIcon> = {
  created: PlusCircle,
  updated: PenLine,
  completed: CheckCircle2,
  snoozed: Clock,
  note_added: StickyNote,
};

const TYPE_STYLE: Record<ActivityType, { bg: string; badgeBg: string; badgeText: string }> = {
  completed: { bg: colors.success, badgeBg: colors.successBg, badgeText: colors.success },
  updated: { bg: colors.brand, badgeBg: colors.tintBg, badgeText: colors.brand },
  created: { bg: colors.brand, badgeBg: colors.tintBg, badgeText: colors.brand },
  snoozed: { bg: colors.neutralTextLight, badgeBg: colors.surface, badgeText: colors.ink },
  note_added: { bg: colors.brand, badgeBg: colors.tintBg, badgeText: colors.brand },
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const { activities, isRefetching, refetch } = useActivities();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => (filter === 'all' ? activities : activities.filter((a) => a.type === filter)), [activities, filter]);

  const filters: [Filter, string][] = [
    ['all', 'All Activities'],
    ['completed', 'Completed'],
    ['updated', 'Updated'],
    ['snoozed', 'Snoozed'],
    ['note_added', 'Notes'],
  ];

  return (
    <Screen>
      <View style={{ paddingTop: insets.top + 8 }} className="gap-1 px-4 pb-3">
        <Text className="text-xl font-black text-ink dark:text-ink-dark">Activity History</Text>
        <Text className="text-xs text-[#8E8E93] dark:text-[#d8dade]">Audit trail of shift compliance, task actions, and associate logs</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 px-4 pb-3">
        {filters.map(([key, label]) => {
          const active = filter === key;
          return (
            <Pressable
              key={key}
              onPress={() => setFilter(key)}
              className={`rounded-xl px-3.5 py-1.5 ${
                active ? 'bg-brand' : 'border border-[#e5e5ea] bg-white dark:border-[#35383c] dark:bg-[#25282c]'
              }`}
            >
              <Text className={`text-xs font-bold ${active ? 'text-white' : 'text-[#8E8E93] dark:text-[#d8dade]'}`}>{label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ActivityRow activity={item} isLast={index === filtered.length - 1} />
        )}
        contentContainerClassName="mx-4 mb-4 overflow-hidden rounded-2xl border border-[#e5e5ea] bg-white dark:border-[#5d3f3c] dark:bg-surface-dark"
        ListEmptyComponent={<EmptyState icon={History} title="No activity records found for this filter." />}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#FF5500" />}
      />
    </Screen>
  );
}

function ActivityRow({ activity, isLast }: { activity: ActivityUI; isLast: boolean }) {
  const Icon = TYPE_ICON[activity.type];
  const style = TYPE_STYLE[activity.type];

  return (
    <View className={`flex-row items-start gap-3.5 p-4 ${isLast ? '' : 'border-b border-[#e5e5ea] dark:border-[#35383c]'}`}>
      <View className="mt-0.5 h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: style.bg }}>
        <Icon size={20} color="#fff" />
      </View>
      <View className="min-w-0 flex-1">
        <View className="mb-0.5 flex-row items-start justify-between">
          <Text className="flex-1 pr-2 text-sm font-bold text-ink dark:text-ink-dark" numberOfLines={1}>
            {activity.title}
          </Text>
          <Text className="shrink-0 text-xs text-[#8E8E93] dark:text-[#d8dade]">{formatTime(activity.created_at)}</Text>
        </View>
        <Text className="mb-2 text-xs leading-relaxed text-[#8E8E93] dark:text-[#d8dade]">{activity.description}</Text>
        <View className="flex-row flex-wrap items-center gap-2">
          <View className="rounded-md border border-[#e5e5ea] bg-[#F7F7F8] px-2 py-0.5 dark:border-[#4d2d2a] dark:bg-[#35383c]">
            <Text className="text-[10px] font-semibold text-ink dark:text-ink-dark">{formatDate(activity.created_at)}</Text>
          </View>
          {activity.status_badge ? (
            <View className="rounded-md px-2 py-0.5" style={{ backgroundColor: style.badgeBg }}>
              <Text className="text-[10px] font-bold" style={{ color: style.badgeText }}>
                {activity.status_badge}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}
