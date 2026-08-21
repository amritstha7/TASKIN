import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useTasks } from '@/hooks/use-tasks';

const STORAGE_KEY = 'taskn:read-notification-ids';
const READ_IDS_QUERY_KEY = ['notification-read-ids'] as const;

async function loadReadIds(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as string[]) : [];
}

/**
 * Notifications are derived directly from real task data (urgent + not yet
 * completed) — never static/hardcoded content. Read-state is tracked
 * per-device in AsyncStorage, but exposed through a shared React Query key
 * so every screen reading it (the dashboard bell badge, the notifications
 * panel) stays in sync the instant "Mark all read" runs anywhere.
 */
export function useNotifications() {
  const { tasks } = useTasks();
  const queryClient = useQueryClient();

  const { data: readIds = [] } = useQuery({
    queryKey: READ_IDS_QUERY_KEY,
    queryFn: loadReadIds,
    staleTime: Infinity,
  });

  const readSet = new Set(readIds);
  const notifications = tasks.filter((t) => t.is_urgent && !t.completed).sort((a, b) => a.due_date.localeCompare(b.due_date));
  const unreadCount = notifications.filter((t) => !readSet.has(t.id)).length;

  const markAllRead = async () => {
    const merged = Array.from(new Set([...readIds, ...notifications.map((t) => t.id)]));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    queryClient.setQueryData(READ_IDS_QUERY_KEY, merged);
  };

  return { notifications, unreadCount, readSet, markAllRead };
}
