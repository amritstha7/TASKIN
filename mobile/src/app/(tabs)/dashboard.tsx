import { useRouter } from 'expo-router';
import { Bell, Search } from 'lucide-react-native';
import { ActivityIndicator, Image, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/BrandMark';
import { CalendarView } from '@/components/CalendarView';
import { DashboardNavCards } from '@/components/DashboardNavCards';
import { useCommunications } from '@/hooks/use-communications';
import { useNotifications } from '@/hooks/use-notifications';
import { usePersonalNotes } from '@/hooks/use-personal-notes';
import { useTasks } from '@/hooks/use-tasks';
import { useSettings } from '@/providers/settings-provider';
import { colors } from '@/theme/colors';

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useSettings();
  const { tasks, isLoading: tasksLoading, isRefetching: tasksRefetching, refetch: refetchTasks } = useTasks();
  const { communications, isRefetching: commsRefetching, refetch: refetchComms } = useCommunications();
  const { notes, isRefetching: notesRefetching, refetch: refetchNotes } = usePersonalNotes();
  const { unreadCount } = useNotifications();

  const urgentCount = tasks.filter((tItem) => tItem.is_urgent && !tItem.completed).length;
  const generalCount = tasks.filter((tItem) => !tItem.is_urgent && !tItem.completed).length;
  const commsCount = communications.filter((c) => !c.is_completed).length;
  const notesCount = notes.filter((n) => !n.completed).length;

  const isRefetching = tasksRefetching || commsRefetching || notesRefetching;
  const onRefresh = () => {
    void refetchTasks();
    void refetchComms();
    void refetchNotes();
  };

  if (tasksLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface dark:bg-surface-dark">
        <ActivityIndicator color="#FF5500" size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      <View
        style={{ paddingTop: insets.top + 8 }}
        className="gap-3 border-b border-[#e5e5ea] bg-white px-3.5 pb-2.5 dark:border-[#35383c] dark:bg-surface-dark"
      >
        <View className="flex-row items-center justify-between gap-2">
          <Pressable className="flex-row items-center gap-2.5">
            <BrandMark size={36} />
            <Text className="text-base font-black tracking-tight text-ink dark:text-ink-dark">TASKN</Text>
          </Pressable>

          <View className="flex-row items-center gap-2">
            <Pressable
              onPress={() => router.push('/modals/notifications')}
              className="relative h-9 w-9 items-center justify-center rounded-xl border border-[#e5e5ea] bg-[#F7F7F8] dark:border-[#35383c] dark:bg-[#25282c]"
            >
              <Bell size={18} color={colors.ink} />
              {unreadCount > 0 ? (
                <View className="absolute -right-1 -top-1 h-4 min-w-[16px] items-center justify-center rounded-full bg-brand px-1" style={{ borderWidth: 2, borderColor: '#fff' }}>
                  <Text className="text-[9px] font-black text-white">{unreadCount}</Text>
                </View>
              ) : null}
            </Pressable>
            <Pressable onPress={() => router.push('/modals/edit-profile')} className="relative">
              <View className="h-9 w-9 items-center justify-center rounded-full bg-[#F7F7F8] p-0.5 dark:bg-[#25282c]" style={{ borderWidth: 2, borderColor: 'rgba(255,85,0,0.25)' }}>
                {profile?.avatar_url ? (
                  <Image source={{ uri: profile.avatar_url }} className="h-full w-full rounded-full" />
                ) : (
                  <Text className="text-xs font-bold text-brand">{(profile?.name ?? '?').slice(0, 1).toUpperCase()}</Text>
                )}
              </View>
              <View className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#008259]" style={{ borderWidth: 2, borderColor: '#fff' }} />
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={() => router.push('/tasks/store')}
          className="flex-row items-center gap-2 rounded-xl border border-[#e5e5ea] bg-[#F7F7F8] px-3 py-2.5 dark:border-[#35383c] dark:bg-[#25282c]"
        >
          <Search size={16} color={colors.neutralTextLight} />
          <Text className="text-xs text-[#8E8E93]" numberOfLines={1}>
            Search RTD, protein bar, movie, excel, AI...
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerClassName="gap-4 p-4 pb-28"
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} tintColor="#FF5500" />}
      >
        <CalendarView tasks={tasks} />
        <DashboardNavCards urgentCount={urgentCount} tasksCount={generalCount} commsCount={commsCount} notesCount={notesCount} />
      </ScrollView>
    </View>
  );
}
