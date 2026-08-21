import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { NotificationTiming, TaskRow } from '@/types/database';

const STORAGE_KEY = 'taskn:task-notification-ids';

type TaskForReminder = Pick<
  TaskRow,
  'id' | 'title' | 'description' | 'due_date' | 'notifications_enabled' | 'notifications_timing' | 'completed' | 'is_urgent' | 'snoozed_until'
>;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function configureNotifications(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Task reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const result = await Notifications.requestPermissionsAsync();
  return result.granted;
}

async function readIdMap(): Promise<Record<string, string>> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as Record<string, string>) : {};
}

async function writeIdMap(map: Record<string, string>): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

const TIMING_OFFSET_MS: Record<NotificationTiming, number> = {
  '15m': 15 * 60 * 1000,
  '30m': 30 * 60 * 1000,
  '1h': 60 * 60 * 1000,
  '1d': 24 * 60 * 60 * 1000,
};

export async function cancelTaskReminder(taskId: string): Promise<void> {
  const map = await readIdMap();
  const id = map[taskId];
  if (!id) return;
  await Notifications.cancelScheduledNotificationAsync(id).catch(() => undefined);
  delete map[taskId];
  await writeIdMap(map);
}

/**
 * Schedules a local reminder for a task, replacing any existing one. There is
 * no due-time-of-day field in the schema (`due_date` is date-only, matching
 * the original web app), so reminders anchor to 9:00 AM local time on the
 * due date, offset backward by the task's chosen notification timing.
 */
export async function scheduleTaskReminder(task: TaskForReminder): Promise<void> {
  await cancelTaskReminder(task.id);

  if (task.completed || !task.notifications_enabled) return;

  const dueAt = new Date(`${task.due_date}T09:00:00`);
  const offset = TIMING_OFFSET_MS[task.notifications_timing] ?? TIMING_OFFSET_MS['15m'];
  let triggerAt = new Date(dueAt.getTime() - offset);

  if (task.snoozed_until) {
    const snoozedUntil = new Date(task.snoozed_until);
    if (snoozedUntil > triggerAt) triggerAt = snoozedUntil;
  }

  if (triggerAt.getTime() <= Date.now()) return;

  const granted = await requestNotificationPermissions();
  if (!granted) return;

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: task.is_urgent ? `Urgent: ${task.title}` : task.title,
      body: task.description || 'Task reminder',
      sound: true,
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerAt },
  });

  const map = await readIdMap();
  map[task.id] = identifier;
  await writeIdMap(map);
}
