import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useTasks } from './useTasks';

const STORAGE_KEY = 'taskn:read-notification-ids';
const READ_IDS_QUERY_KEY = ['notification-read-ids'] as const;

function loadReadIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/**
 * Notifications are derived directly from real task data (urgent + not yet
 * completed) — never static/hardcoded content. Read-state is tracked
 * per-browser in localStorage, but exposed through a shared React Query key
 * so every consumer reading it (the top bar bell badge, the notification
 * panel) stays in sync the instant "Mark all as read" runs anywhere.
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
  const notifications = tasks.filter((t) => t.isUrgent && !t.completed).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const unreadCount = notifications.filter((t) => !readSet.has(t.id)).length;

  const markAllRead = () => {
    const merged = Array.from(new Set([...readIds, ...notifications.map((t) => t.id)]));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    queryClient.setQueryData(READ_IDS_QUERY_KEY, merged);
  };

  return { notifications, unreadCount, readSet, markAllRead };
}
