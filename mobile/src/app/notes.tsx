import { CheckCircle2, Circle, NotebookPen, Plus, StickyNote, Trash2 } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GradientBanner } from '@/components/GradientBanner';
import { BreadcrumbHeader } from '@/components/ui/BreadcrumbHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { usePersonalNotes } from '@/hooks/use-personal-notes';
import { useToast } from '@/providers/toast-provider';
import { colors } from '@/theme/colors';
import type { PersonalNoteRow } from '@/types/database';

type Filter = 'all' | 'active' | 'completed';

export default function NotesScreen() {
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { notes, isRefetching, refetch, addNote, toggleNote, deleteNote } = usePersonalNotes();
  const [filter, setFilter] = useState<Filter>('all');
  const [text, setText] = useState('');

  const filtered = useMemo(() => {
    if (filter === 'active') return notes.filter((n) => !n.completed);
    if (filter === 'completed') return notes.filter((n) => n.completed);
    return notes;
  }, [notes, filter]);

  const handleAdd = async () => {
    if (!text.trim()) return;
    await addNote(text.trim());
    setText('');
    showToast('Note added to My Tasks & Notes');
  };

  return (
    <Screen>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NoteRow note={item} onToggle={toggleNote} onDelete={deleteNote} />}
        ItemSeparatorComponent={() => <View className="h-2.5" />}
        contentContainerClassName="p-4"
        ListHeaderComponent={
          <View style={{ paddingTop: insets.top + 8 }} className="gap-4 pb-4">
            <BreadcrumbHeader
              right={<Text className="text-xs font-medium text-[#8E8E93] dark:text-[#8e9095]">{notes.filter((n) => !n.completed).length} Active Notes</Text>}
            />
            <GradientBanner
              icon={NotebookPen}
              title="My Tasks & Notes"
              count={notes.filter((n) => !n.completed).length}
              description="Personal scratchpad, shift reminders, and operational checklist"
              gradientColors={[colors.notesCardBg, colors.notesCardBg]}
              countTextColor={colors.brand}
              shadowColor="#000"
            />

            <View className="flex-row items-end gap-2 rounded-2xl border border-[#FFD8CC] bg-white p-3 shadow-sm dark:border-[#5d3f3c] dark:bg-surface-dark">
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Add a new quick note, checklist item, or reminder..."
                placeholderTextColor="#9a9a9e"
                multiline
                blurOnSubmit={false}
                className="max-h-28 flex-1 px-1 py-1 text-xs text-ink dark:text-ink-dark"
              />
              <Pressable
                onPress={handleAdd}
                disabled={!text.trim()}
                className={`flex-row items-center gap-1 rounded-xl bg-brand px-4 py-2.5 ${!text.trim() ? 'opacity-50' : ''}`}
              >
                <Plus size={16} color="#fff" />
                <Text className="text-xs font-bold text-white">Add Note</Text>
              </Pressable>
            </View>

            <SegmentedTabs
              options={[
                { key: 'all', label: `All (${notes.length})` },
                { key: 'active', label: `Active (${notes.filter((n) => !n.completed).length})` },
                { key: 'completed', label: `Completed (${notes.filter((n) => n.completed).length})` },
              ]}
              value={filter}
              onChange={setFilter}
              activeClassName="bg-[#242830]"
            />
          </View>
        }
        ListEmptyComponent={
          <EmptyState icon={StickyNote} title="No notes found" description="Use the input box above to jot down quick reminders for your shift." />
        }
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#FF5500" />}
      />
    </Screen>
  );
}

function NoteRow({
  note,
  onToggle,
  onDelete,
}: {
  note: PersonalNoteRow;
  onToggle: (note: PersonalNoteRow) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <View
      className={`flex-row items-center gap-3 rounded-2xl border p-3.5 ${
        note.completed
          ? 'border-[#e5e5ea] bg-[#F7F7F8] opacity-75 dark:border-[#35383c] dark:bg-[#25282c]'
          : 'border-[#e5e5ea] bg-white dark:border-[#35383c] dark:bg-[#1f2225]'
      }`}
    >
      <Pressable
        onPress={() => onToggle(note)}
        hitSlop={4}
        className={`min-h-[32px] min-w-[32px] items-center justify-center rounded-xl ${note.completed ? 'bg-[#e1ffec]' : ''}`}
      >
        {note.completed ? (
          <CheckCircle2 size={22} color={colors.success} fill={colors.success} strokeWidth={0} />
        ) : (
          <Circle size={22} color={colors.neutralTextLight} />
        )}
      </Pressable>
      <View className="flex-1">
        <Text className={`text-xs font-medium ${note.completed ? 'text-[#8E8E93] line-through dark:text-[#8e9095]' : 'text-ink dark:text-ink-dark'}`}>
          {note.text}
        </Text>
        <Text className="text-[10px] text-[#8E8E93] dark:text-[#8e9095]">
          {new Date(note.created_at).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' })}
        </Text>
      </View>
      <Pressable onPress={() => onDelete(note.id)} hitSlop={4} className="rounded-xl p-1.5">
        <Trash2 size={18} color={colors.neutralTextLight} />
      </Pressable>
    </View>
  );
}
