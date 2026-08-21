import { useRouter } from 'expo-router';
import { AlarmClock, BadgeCheck, Camera, CheckCircle2, Circle, StickyNote, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';

import { TaskPhotoGrid } from '@/components/TaskPhotoGrid';
import { colors } from '@/theme/colors';
import type { PhotoUI, TaskUI } from '@/types/app';

const INDENT = 50;

function formatDueDate(dueDate: string): string {
  const [y, m, d] = dueDate.split('-');
  return `${d}/${m}/${y}`;
}

interface TaskCardProps {
  task: TaskUI;
  variant?: 'urgent' | 'default';
  onToggleComplete: (task: TaskUI) => void;
  onDelete: (task: TaskUI) => void;
  onSnooze: (task: TaskUI) => void;
  onAddNote: (task: TaskUI, body: string) => void;
  onRemovePhoto: (task: TaskUI, photo: PhotoUI) => void;
}

export function TaskCard({ task, variant = 'default', onToggleComplete, onDelete, onSnooze, onAddNote, onRemovePhoto }: TaskCardProps) {
  const router = useRouter();
  const [noteFormOpen, setNoteFormOpen] = useState(false);
  const [noteText, setNoteText] = useState('');

  const confirmDelete = () => {
    Alert.alert('Delete Task', `Remove "${task.title}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(task) },
    ]);
  };

  return (
    <View
      className={`gap-2.5 rounded-2xl border p-4 ${
        task.completed
          ? 'border-[#e5e5ea] bg-[#F7F7F8] opacity-80 dark:border-[#35383c] dark:bg-[#25282c]'
          : 'border-[#FFD8CC] bg-white dark:border-[#93000d]/50 dark:bg-[#1f2225]'
      }`}
      style={
        !task.completed
          ? { shadowColor: colors.brand, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 1 }
          : undefined
      }
    >
      <View className="flex-row items-start justify-between gap-2.5">
        <View className="flex-1 flex-row items-start gap-3">
          <Pressable
            onPress={() => onToggleComplete(task)}
            hitSlop={4}
            className={`min-h-[38px] min-w-[38px] items-center justify-center rounded-xl ${task.completed ? 'bg-[#e1ffec]' : ''}`}
          >
            {task.completed ? (
              <CheckCircle2 size={24} color={colors.success} fill={colors.success} strokeWidth={0} />
            ) : (
              <Circle size={24} color={colors.neutralTextLight} />
            )}
          </Pressable>

          <View className="flex-1 gap-1">
            <Text
              className={`text-sm font-bold leading-snug tracking-tight ${
                task.completed ? 'text-[#8E8E93] line-through dark:text-[#8e9095]' : 'text-ink dark:text-ink-dark'
              }`}
            >
              {task.title}
            </Text>
            <View className="flex-row flex-wrap items-center gap-1.5">
              {variant === 'urgent' ? (
                <View className="rounded-md border border-[#FFD8CC] bg-[#FFF0EB] px-2 py-0.5 dark:border-transparent dark:bg-[#ba1a1a]/30">
                  <Text className="text-[10px] font-black uppercase text-[#FF5500] dark:text-[#ffb4ac]">High Priority</Text>
                </View>
              ) : null}
              <View className="rounded-md border border-[#e5e5ea] bg-[#F7F7F8] px-2 py-0.5 dark:border-[#4d2d2a] dark:bg-[#35383c]">
                <Text className="text-[10px] font-semibold text-ink dark:text-ink-dark">{task.category}</Text>
              </View>
              <Text className="text-[10px] text-[#8E8E93] dark:text-[#d8dade]">Due: {formatDueDate(task.due_date)}</Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center gap-0.5">
          <Pressable
            onPress={() => router.push(`/modals/photo-proof/${task.id}`)}
            className="min-h-[34px] min-w-[34px] items-center justify-center rounded-xl"
          >
            <View>
              <Camera size={19} color={colors.neutralTextLight} />
              {task.photos.length > 0 ? (
                <View className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-brand" />
              ) : null}
            </View>
          </Pressable>
          <Pressable onPress={() => onSnooze(task)} className="min-h-[34px] min-w-[34px] items-center justify-center rounded-xl">
            <AlarmClock size={19} color={colors.neutralTextLight} />
          </Pressable>
          <Pressable
            onPress={() => setNoteFormOpen((v) => !v)}
            className="min-h-[34px] min-w-[34px] items-center justify-center rounded-xl"
          >
            <StickyNote size={19} color={noteFormOpen ? colors.brand : colors.neutralTextLight} />
          </Pressable>
          <Pressable onPress={confirmDelete} className="min-h-[34px] min-w-[34px] items-center justify-center rounded-xl">
            <Trash2 size={19} color={colors.danger} />
          </Pressable>
        </View>
      </View>

      {task.description ? (
        <View style={{ paddingLeft: INDENT }}>
          <Text className="text-xs leading-relaxed text-[#48484a] dark:text-[#c7cad1]">{task.description}</Text>
        </View>
      ) : null}

      {task.completed && task.completedByName ? (
        <View style={{ marginLeft: INDENT }}>
          <View className="flex-row items-center gap-2 self-start rounded-xl border border-[#a3e6be] bg-[#e1ffec]/80 px-3 py-1.5 dark:border-[#008259]/40 dark:bg-[#008259]/20">
            <BadgeCheck size={16} color={colors.success} />
            <Text className="text-xs font-bold text-[#008259] dark:text-[#2dd4bf]">
              Completed by {task.completedByName}
              {task.completed_at ? ` at ${new Date(task.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
            </Text>
          </View>
        </View>
      ) : null}

      {task.photos.length > 0 ? (
        <View style={{ paddingLeft: INDENT, marginTop: 2, paddingTop: 10 }} className="border-t border-[#e5e5ea] dark:border-[#35383c]">
          <View className="mb-1.5 flex-row items-center justify-between">
            <View className="flex-row items-center gap-1">
              <Camera size={13} color={colors.brand} />
              <Text className="text-[10px] font-bold text-[#8E8E93] dark:text-[#8e9095]">Photo Evidence ({task.photos.length})</Text>
            </View>
            <Pressable onPress={() => router.push(`/modals/photo-proof/${task.id}`)}>
              <Text className="text-[10px] font-bold text-brand">+ Add More</Text>
            </Pressable>
          </View>
          <TaskPhotoGrid photos={task.photos} onRemove={(photo) => onRemovePhoto(task, photo)} />
        </View>
      ) : null}

      {task.notes.length > 0 ? (
        <View style={{ paddingLeft: INDENT }}>
          <View className="gap-1 rounded-r-lg border-l-2 border-brand bg-[#FFF9F6] p-2 dark:bg-[#25282c]">
            {task.notes.map((note) => (
              <Text key={note.id} className="text-[11px] italic text-ink dark:text-[#d8dade]">
                &ldquo;{note.body}&rdquo;
              </Text>
            ))}
          </View>
        </View>
      ) : null}

      {noteFormOpen ? (
        <View className="mt-1 flex-row items-end gap-2 border-t border-[#e5e5ea] pt-3 dark:border-[#35383c]">
          <TextInput
            value={noteText}
            onChangeText={setNoteText}
            placeholder="Type a note..."
            placeholderTextColor="#9a9a9e"
            multiline
            blurOnSubmit={false}
            className="max-h-28 flex-1 rounded-xl border border-[#e5e5ea] bg-white px-3 py-2 text-xs text-ink dark:border-[#5d3f3c] dark:bg-surface-dark dark:text-ink-dark"
          />
          <Pressable
            onPress={() => {
              if (!noteText.trim()) return;
              onAddNote(task, noteText.trim());
              setNoteText('');
              setNoteFormOpen(false);
            }}
            className="rounded-xl bg-brand px-3 py-2"
          >
            <Text className="text-xs font-semibold text-white">Save</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
