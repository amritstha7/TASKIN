import { useRouter } from 'expo-router';
import { Bell, CheckCheck, TriangleAlert, X } from 'lucide-react-native';
import { FlatList, Pressable, Text, View } from 'react-native';

import { EmptyState } from '@/components/ui/EmptyState';
import { useNotifications } from '@/hooks/use-notifications';
import { colors } from '@/theme/colors';
import type { TaskUI } from '@/types/app';

function formatDueDate(dueDate: string): string {
  const [y, m, d] = dueDate.split('-');
  return `${d}/${m}/${y}`;
}

export default function NotificationsModal() {
  const router = useRouter();
  const { notifications, unreadCount, readSet, markAllRead } = useNotifications();

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      <View className="flex-row items-center justify-between border-b border-[#e5e5ea] bg-white p-4 dark:border-[#35383c] dark:bg-surface-dark">
        <View className="flex-1 flex-row items-center gap-2.5">
          <View className="h-9 w-9 items-center justify-center rounded-xl bg-[#FFF0EB] dark:bg-[#35383c]">
            <Bell size={18} color={colors.brand} />
          </View>
          <View>
            <Text className="text-sm font-black text-ink dark:text-ink-dark">Notifications</Text>
            <Text className="text-[11px] text-[#8E8E93] dark:text-[#8e9095]">
              {unreadCount > 0 ? `${unreadCount} unread urgent task${unreadCount === 1 ? '' : 's'}` : 'All caught up'}
            </Text>
          </View>
        </View>
        <Pressable onPress={() => router.back()} hitSlop={8} className="rounded-lg p-1.5">
          <X size={20} color={colors.neutralTextLight} />
        </Pressable>
      </View>

      {notifications.length > 0 ? (
        <Pressable
          onPress={() => void markAllRead()}
          disabled={unreadCount === 0}
          className={`m-4 mb-0 flex-row items-center justify-center gap-1.5 rounded-xl border border-[#e5e5ea] bg-white px-3 py-2.5 dark:border-[#35383c] dark:bg-surface-dark ${
            unreadCount === 0 ? 'opacity-50' : ''
          }`}
        >
          <CheckCheck size={16} color={colors.brand} />
          <Text className="text-xs font-bold text-brand">Mark all as read</Text>
        </Pressable>
      ) : null}

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-2.5 p-4"
        ListEmptyComponent={<EmptyState icon={Bell} title="No urgent tasks" description="You'll see a notification here when a task needs urgent attention." />}
        renderItem={({ item }) => <NotificationRow task={item} isRead={readSet.has(item.id)} onPress={() => router.push('/tasks/urgent')} />}
      />
    </View>
  );
}

function NotificationRow({ task, isRead, onPress }: { task: TaskUI; isRead: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-start gap-3 rounded-2xl border p-3.5 ${
        isRead ? 'border-[#e5e5ea] bg-white dark:border-[#35383c] dark:bg-surface-dark' : 'border-[#FFD8CC] bg-[#FFF0EB] dark:border-[#5d3f3c] dark:bg-[#2e3134]'
      }`}
    >
      <View className="mt-0.5 h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: colors.urgentFrom }}>
        <TriangleAlert size={16} color="#fff" />
      </View>
      <View className="flex-1 gap-0.5">
        <View className="flex-row items-center gap-1.5">
          {!isRead ? <View className="h-1.5 w-1.5 rounded-full bg-brand" /> : null}
          <Text className="flex-1 text-sm font-bold text-ink dark:text-ink-dark" numberOfLines={1}>
            {task.title}
          </Text>
        </View>
        <Text className="text-xs text-[#8E8E93] dark:text-[#8e9095]" numberOfLines={2}>
          {task.category} · Due {formatDueDate(task.due_date)}
        </Text>
      </View>
    </Pressable>
  );
}
