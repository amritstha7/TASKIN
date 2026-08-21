import { useRouter } from 'expo-router';
import { BadgeCheck, CheckCircle2, Circle, Paperclip, StickyNote, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';

import { TaskPhotoGrid } from '@/components/TaskPhotoGrid';
import { colors } from '@/theme/colors';
import type { CommunicationUI } from '@/types/app';

const INDENT = 50;

function formatDueDate(dueDate: string): string {
  const [y, m, d] = dueDate.split('-');
  return `${d}/${m}/${y}`;
}

interface CommunicationCardProps {
  communication: CommunicationUI;
  onToggleComplete: (comm: CommunicationUI) => void;
  onAddNote: (comm: CommunicationUI, body: string) => void;
  onDelete: (comm: CommunicationUI) => void;
}

export function CommunicationCard({ communication, onToggleComplete, onAddNote, onDelete }: CommunicationCardProps) {
  const router = useRouter();
  const [noteFormOpen, setNoteFormOpen] = useState(false);
  const [noteText, setNoteText] = useState('');

  const confirmDelete = () => {
    Alert.alert('Delete Communication', `Remove "${communication.title}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(communication) },
    ]);
  };

  return (
    <View
      className={`gap-2.5 rounded-2xl border p-4 ${
        communication.is_completed
          ? 'border-[#e5e5ea] bg-[#F7F7F8] opacity-80 dark:border-[#35383c] dark:bg-[#25282c]'
          : 'border-[#e5e5ea] bg-white dark:border-[#35383c] dark:bg-[#1f2225]'
      }`}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 flex-row items-start gap-3">
          <Pressable
            onPress={() => onToggleComplete(communication)}
            hitSlop={4}
            className={`min-h-[38px] min-w-[38px] items-center justify-center rounded-xl ${communication.is_completed ? 'bg-[#e1ffec]' : ''}`}
          >
            {communication.is_completed ? (
              <CheckCircle2 size={24} color={colors.success} fill={colors.success} strokeWidth={0} />
            ) : (
              <Circle size={24} color={colors.neutralTextLight} />
            )}
          </Pressable>

          <View className="flex-1 gap-1">
            <View className="flex-row flex-wrap items-center gap-2">
              <Text
                className={`text-sm font-bold tracking-tight ${
                  communication.is_completed ? 'text-[#8E8E93] line-through dark:text-[#8e9095]' : 'text-ink dark:text-ink-dark'
                }`}
              >
                {communication.title}
              </Text>
              <View className="rounded-md border border-[#e5e5ea] bg-[#F7F7F8] px-2 py-0.5 dark:border-[#4d2d2a] dark:bg-[#35383c]">
                <Text className="text-[10px] text-[#8E8E93] dark:text-[#d8dade]">Due: {formatDueDate(communication.due_date)}</Text>
              </View>
            </View>
            <Text className="text-xs leading-relaxed text-ink dark:text-ink-dark">{communication.description}</Text>

            {communication.is_completed && communication.completedByName ? (
              <View className="mt-1 flex-row items-center gap-1.5 self-start rounded-lg bg-[#e1ffec]/70 px-2.5 py-1 dark:bg-[#008259]/20">
                <BadgeCheck size={15} color={colors.success} />
                <Text className="text-[11px] font-bold text-[#008259]">Acknowledged by {communication.completedByName}</Text>
              </View>
            ) : null}

            {communication.notes.length > 0 ? (
              <View className="mt-1 gap-1 rounded-r-lg border-l-2 border-brand bg-[#FFF9F6] p-2 dark:bg-[#25282c]">
                {communication.notes.map((note) => (
                  <Text key={note.id} className="text-[11px] italic text-[#8E8E93] dark:text-[#d8dade]">
                    &ldquo;{note.body}&rdquo;
                  </Text>
                ))}
              </View>
            ) : null}
          </View>
        </View>

        <View className="flex-row items-center gap-1">
          {communication.attachment_url ? (
            <Pressable
              onPress={() => router.push(`/modals/attachment/${communication.id}`)}
              className="h-9 w-9 items-center justify-center rounded-xl"
            >
              <Paperclip size={20} color={colors.neutralTextLight} />
            </Pressable>
          ) : null}
          <Pressable onPress={() => setNoteFormOpen((v) => !v)} className="h-9 w-9 items-center justify-center rounded-xl">
            <StickyNote size={20} color={noteFormOpen ? colors.brand : colors.neutralTextLight} />
          </Pressable>
          <Pressable onPress={confirmDelete} className="h-9 w-9 items-center justify-center rounded-xl">
            <Trash2 size={20} color={colors.danger} />
          </Pressable>
        </View>
      </View>

      {communication.photos.length > 0 ? (
        <View style={{ paddingLeft: INDENT }} className="border-t border-[#e5e5ea] pt-2.5 dark:border-[#35383c]">
          <TaskPhotoGrid photos={communication.photos} />
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
              onAddNote(communication, noteText.trim());
              setNoteText('');
              setNoteFormOpen(false);
            }}
            className="rounded-xl bg-brand px-4 py-2"
          >
            <Text className="text-xs font-bold text-white">Save</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
