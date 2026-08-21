import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Camera, Download, ImageIcon, Search, StickyNote, Trash2, UploadCloud, User, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Alert, FlatList, Image, Modal, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { useCommunications } from '@/hooks/use-communications';
import { useMediaNotes } from '@/hooks/use-media-notes';
import { useTasks } from '@/hooks/use-tasks';
import { colors } from '@/theme/colors';
import { useToast } from '@/providers/toast-provider';

const MEDIA_NOTE_CATEGORIES = ['General', 'Compliance & Safety', 'Inventory', 'Merchandising', 'Maintenance', 'Training'];

type MediaFilter = 'all' | 'urgent' | 'task' | 'note';

interface MediaItem {
  id: string;
  url: string | null;
  storagePath: string;
  caption: string | null;
  name: string | null;
  uploadedByName: string;
  uploadedAt: string;
  sourceType: 'task' | 'communication' | 'note';
  sourceTitle: string;
  sourceId: string;
  category: string | null;
  isUrgent: boolean;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MediaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { tasks, isRefetching: tasksRefetching, refetch: refetchTasks, attachPhoto, removePhoto: removeTaskPhoto } = useTasks();
  const {
    communications,
    isRefetching: commsRefetching,
    refetch: refetchComms,
    removePhoto: removeCommPhoto,
  } = useCommunications();
  const { mediaNotes, isRefetching: notesRefetching, refetch: refetchNotes, createMediaNote, deleteMediaNote } = useMediaNotes();

  const [filter, setFilter] = useState<MediaFilter>('all');
  const [search, setSearch] = useState('');
  const [uploadVisible, setUploadVisible] = useState(false);

  const items = useMemo<MediaItem[]>(() => {
    const fromTasks: MediaItem[] = tasks.flatMap((task) =>
      task.photos.map((photo) => ({
        id: photo.id,
        url: photo.url,
        storagePath: photo.storagePath,
        caption: photo.caption,
        name: photo.name,
        uploadedByName: photo.uploadedByName,
        uploadedAt: photo.uploadedAt,
        sourceType: 'task' as const,
        sourceTitle: task.title,
        sourceId: task.id,
        category: null,
        isUrgent: task.is_urgent,
      }))
    );
    const fromComms: MediaItem[] = communications.flatMap((comm) =>
      comm.photos.map((photo) => ({
        id: photo.id,
        url: photo.url,
        storagePath: photo.storagePath,
        caption: photo.caption,
        name: photo.name,
        uploadedByName: photo.uploadedByName,
        uploadedAt: photo.uploadedAt,
        sourceType: 'communication' as const,
        sourceTitle: comm.title,
        sourceId: comm.id,
        category: null,
        isUrgent: false,
      }))
    );
    const fromNotes: MediaItem[] = mediaNotes.map((note) => ({
      id: note.id,
      url: note.url,
      storagePath: note.storage_path,
      caption: note.caption,
      name: note.name,
      uploadedByName: note.uploadedByName,
      uploadedAt: note.uploaded_at,
      sourceType: 'note' as const,
      sourceTitle: note.name,
      sourceId: note.id,
      category: note.category,
      isUrgent: false,
    }));
    return [...fromTasks, ...fromComms, ...fromNotes].sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  }, [tasks, communications, mediaNotes]);

  const filtered = useMemo(() => {
    let list = items;
    if (filter === 'urgent') list = list.filter((i) => i.isUrgent);
    else if (filter === 'task') list = list.filter((i) => i.sourceType === 'task');
    else if (filter === 'note') list = list.filter((i) => i.sourceType === 'note');

    const query = search.trim().toLowerCase();
    if (query) {
      list = list.filter((i) =>
        [i.caption, i.sourceTitle, i.uploadedByName, i.name, i.category].some((field) => field?.toLowerCase().includes(query))
      );
    }
    return list;
  }, [items, filter, search]);

  const handleRemove = (item: MediaItem) => {
    Alert.alert('Remove Photo', 'Are you sure you want to remove this photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          if (item.sourceType === 'task') {
            await removeTaskPhoto({ id: item.id, storagePath: item.storagePath });
          } else if (item.sourceType === 'communication') {
            await removeCommPhoto({ id: item.id, storagePath: item.storagePath });
          } else {
            await deleteMediaNote({ id: item.id, storage_path: item.storagePath });
          }
          showToast('Photo removed', 'info');
        },
      },
    ]);
  };

  const isRefetching = tasksRefetching || commsRefetching || notesRefetching;
  const onRefresh = () => {
    void refetchTasks();
    void refetchComms();
    void refetchNotes();
  };

  const urgentCount = items.filter((i) => i.isUrgent).length;
  const taskCount = items.filter((i) => i.sourceType === 'task').length;
  const noteCount = items.filter((i) => i.sourceType === 'note').length;

  return (
    <Screen>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-4 p-4"
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} tintColor="#FF5500" />}
        ListEmptyComponent={
          <EmptyState icon={ImageIcon} title="No photos uploaded yet" description="Upload a photo as a note, or attach photo proof to a task." />
        }
        ListHeaderComponent={
          <View style={{ paddingTop: insets.top + 8 }} className="gap-4 pb-1">
            <View
              className="gap-3 rounded-2xl border border-[#e5e5ea] bg-white p-4 dark:border-[#35383c] dark:bg-surface-dark"
              style={{ shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 2 }}
            >
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1 gap-1">
                  <View className="flex-row items-center gap-2">
                    <View className="h-8 w-8 items-center justify-center rounded-xl bg-[#FFF0EB] dark:bg-[#35383c]">
                      <ImageIcon size={18} color={colors.brand} />
                    </View>
                    <Text className="text-xl font-black tracking-tight text-ink dark:text-ink-dark">Media Gallery</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <View className="self-start rounded-full border border-[#FFD8CC] bg-[#FFF0EB] px-2.5 py-0.5 dark:border-[#5d3f3c] dark:bg-[#35383c]">
                      <Text className="text-xs font-black text-brand">{items.length}</Text>
                    </View>
                    <Text className="text-xs text-[#8E8E93] dark:text-[#8e9095]">Store audit photos & compliance evidence</Text>
                  </View>
                </View>
              </View>
              <Pressable
                onPress={() => setUploadVisible(true)}
                className="min-h-[42px] flex-row items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5"
                style={{ shadowColor: colors.brand, shadowOpacity: 0.25, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 3 }}
              >
                <Camera size={18} color="#fff" />
                <Text className="text-xs font-bold text-white">Upload Photo</Text>
              </Pressable>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-1.5">
              {(
                [
                  ['all', `All Media (${items.length})`],
                  ['note', `Notes (${noteCount})`],
                  ['urgent', `Urgent Actions (${urgentCount})`],
                  ['task', `Tasks (${taskCount})`],
                ] as [MediaFilter, string][]
              ).map(([key, label]) => {
                const active = filter === key;
                return (
                  <Pressable
                    key={key}
                    onPress={() => setFilter(key)}
                    className={`flex-row items-center gap-1 rounded-xl px-3 py-1.5 ${
                      active ? 'bg-brand' : 'border border-[#e5e5ea] bg-white dark:border-[#35383c] dark:bg-surface-dark'
                    }`}
                  >
                    {key === 'urgent' ? <View className="h-2 w-2 rounded-full bg-[#d81b1b]" /> : null}
                    <Text className={`text-xs font-bold ${active ? 'text-white' : 'text-[#8E8E93] dark:text-[#8e9095]'}`}>{label}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View className="flex-row items-center gap-2 rounded-xl border border-[#e5e5ea] bg-white px-3 dark:border-[#35383c] dark:bg-surface-dark">
              <Search size={16} color={colors.neutralTextLight} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search by caption or task..."
                placeholderTextColor="#9a9a9e"
                className="flex-1 py-2 text-xs text-ink dark:text-ink-dark"
              />
            </View>
          </View>
        }
        renderItem={({ item }) => <MediaCard item={item} onRemove={() => handleRemove(item)} />}
        ItemSeparatorComponent={() => <View className="h-4" />}
      />

      <UploadPhotoModal
        visible={uploadVisible}
        onClose={() => setUploadVisible(false)}
        tasks={tasks}
        onUploadToTask={attachPhoto}
        onCreateNote={createMediaNote}
      />
    </Screen>
  );

  function MediaCard({ item, onRemove }: { item: MediaItem; onRemove: () => void }) {
    return (
      <View
        className="overflow-hidden rounded-2xl border border-[#e5e5ea] bg-white dark:border-[#35383c] dark:bg-surface-dark"
        style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 2 }}
      >
        <Pressable
          onPress={() =>
            router.push({
              pathname: '/modals/photo-preview',
              params: { url: item.url ?? '', title: item.sourceTitle, caption: item.caption ?? '', user: item.uploadedByName, time: item.uploadedAt },
            })
          }
          className="aspect-[4/3] bg-[#F7F7F8] dark:bg-[#25282c]"
        >
          {item.url ? <Image source={{ uri: item.url }} className="h-full w-full" /> : null}
          <View className="absolute left-2.5 top-2.5 flex-row items-center gap-1.5">
            <View className={`rounded-full border border-white/30 px-2 py-0.5 ${item.isUrgent ? 'bg-[#d81b1b]/90' : 'bg-brand/90'}`}>
              <Text className="text-[10px] font-black uppercase tracking-wide text-white">
                {item.sourceType === 'note' ? (item.category ?? 'Note') : item.isUrgent ? 'Urgent' : 'Task Proof'}
              </Text>
            </View>
          </View>
        </Pressable>

        <View className="gap-2 p-3.5">
          <View>
            <Text className="text-xs font-black text-ink dark:text-ink-dark" numberOfLines={1}>
              {item.sourceTitle}
            </Text>
            {item.caption ? (
              <Text className="mt-1 text-[11px] leading-relaxed text-[#8E8E93] dark:text-[#8e9095]" numberOfLines={2}>
                &ldquo;{item.caption}&rdquo;
              </Text>
            ) : null}
          </View>

          <View className="flex-row items-center justify-between border-t border-[#e5e5ea] pt-2.5 dark:border-[#2e3134]">
            <View className="flex-row items-center gap-1.5">
              <User size={14} color={colors.neutralTextLight} />
              <Text className="text-[10px] font-semibold text-ink dark:text-ink-dark">{item.uploadedByName || 'Associate'}</Text>
              <Text className="text-[10px] text-[#8E8E93] dark:text-[#8e9095]">· {formatTime(item.uploadedAt)}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/modals/photo-preview',
                    params: { url: item.url ?? '', title: item.sourceTitle, caption: item.caption ?? '', user: item.uploadedByName, time: item.uploadedAt },
                  })
                }
                className="h-8 w-8 items-center justify-center rounded-lg"
              >
                <Download size={15} color={colors.neutralTextLight} />
              </Pressable>
              <Pressable onPress={onRemove} className="h-8 w-8 items-center justify-center rounded-lg">
                <Trash2 size={15} color={colors.danger} />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

type UploadMode = 'note' | 'task';

function UploadPhotoModal({
  visible,
  onClose,
  tasks,
  onUploadToTask,
  onCreateNote,
}: {
  visible: boolean;
  onClose: () => void;
  tasks: ReturnType<typeof useTasks>['tasks'];
  onUploadToTask: ReturnType<typeof useTasks>['attachPhoto'];
  onCreateNote: ReturnType<typeof useMediaNotes>['createMediaNote'];
}) {
  const { showToast } = useToast();
  const [mode, setMode] = useState<UploadMode>('note');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [noteName, setNoteName] = useState('');
  const [category, setCategory] = useState(MEDIA_NOTE_CATEGORIES[0]);
  const [taskId, setTaskId] = useState<string | null>(tasks[0]?.id ?? null);
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setImageUri(null);
    setCaption('');
    setNoteName('');
    setCategory(MEDIA_NOTE_CATEGORIES[0]);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.9 });
    if (!result.canceled && result.assets[0]) setImageUri(result.assets[0].uri);
  };

  const handleSave = async () => {
    if (!imageUri) return;
    setSaving(true);
    try {
      if (mode === 'note') {
        if (!noteName.trim()) return;
        await onCreateNote({ localUri: imageUri, name: noteName, category, caption });
      } else {
        const targetTaskId = taskId ?? tasks[0]?.id;
        if (!targetTaskId) return;
        await onUploadToTask({ task: tasks.find((task) => task.id === targetTaskId)!, localUri: imageUri, caption });
      }
      reset();
      showToast('Photo uploaded!');
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const canSave = mode === 'note' ? !!imageUri && !!noteName.trim() : !!imageUri && (taskId ?? tasks[0]?.id) != null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <ScrollView contentContainerClassName="gap-4 rounded-t-3xl bg-surface p-5 dark:bg-surface-dark">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-ink dark:text-ink-dark">Upload Photo</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <X size={20} color="#9a9a9e" />
            </Pressable>
          </View>

          <View className="flex-row gap-2 rounded-xl bg-black/5 p-1 dark:bg-white/10">
            <Pressable
              onPress={() => setMode('note')}
              className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-lg py-2 ${mode === 'note' ? 'bg-brand' : ''}`}
            >
              <StickyNote size={14} color={mode === 'note' ? '#fff' : '#8E8E93'} />
              <Text className={`text-xs font-bold ${mode === 'note' ? 'text-white' : 'text-ink/60 dark:text-ink-dark/60'}`}>Media Note</Text>
            </Pressable>
            <Pressable
              onPress={() => setMode('task')}
              className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-lg py-2 ${mode === 'task' ? 'bg-brand' : ''}`}
            >
              <Camera size={14} color={mode === 'task' ? '#fff' : '#8E8E93'} />
              <Text className={`text-xs font-bold ${mode === 'task' ? 'text-white' : 'text-ink/60 dark:text-ink-dark/60'}`}>Task Photo</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={pickImage}
            className="h-40 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-black/20 bg-black/5 dark:border-white/20 dark:bg-white/10"
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} className="h-full w-full" />
            ) : (
              <View className="items-center gap-1">
                <UploadCloud size={22} color="#9a9a9e" />
                <Text className="text-sm text-ink/60 dark:text-ink-dark/60">Tap to choose a photo</Text>
              </View>
            )}
          </Pressable>

          {mode === 'note' ? (
            <>
              <TextInput
                value={noteName}
                onChangeText={setNoteName}
                placeholder="Name this note *"
                placeholderTextColor="#9a9a9e"
                className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-ink dark:border-white/10 dark:bg-white/5 dark:text-ink-dark"
              />
              <View className="gap-1.5">
                <Text className="text-xs font-semibold text-ink/60 dark:text-ink-dark/60">Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
                  {MEDIA_NOTE_CATEGORIES.map((cat) => (
                    <Pressable
                      key={cat}
                      onPress={() => setCategory(cat)}
                      className={`rounded-full px-3 py-1.5 ${category === cat ? 'bg-brand' : 'bg-black/5 dark:bg-white/10'}`}
                    >
                      <Text className={`text-xs font-medium ${category === cat ? 'text-white' : 'text-ink/70 dark:text-ink-dark/70'}`}>{cat}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </>
          ) : null}

          <TextInput
            value={caption}
            onChangeText={setCaption}
            placeholder="Caption (optional)"
            placeholderTextColor="#9a9a9e"
            className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-ink dark:border-white/10 dark:bg-white/5 dark:text-ink-dark"
          />

          {mode === 'task' && tasks.length > 0 ? (
            <View className="gap-1.5">
              <Text className="text-xs font-semibold text-ink/60 dark:text-ink-dark/60">Associate with Task</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
                {tasks.map((task) => (
                  <Pressable
                    key={task.id}
                    onPress={() => setTaskId(task.id)}
                    className={`rounded-full px-3 py-1.5 ${taskId === task.id ? 'bg-brand' : 'bg-black/5 dark:bg-white/10'}`}
                  >
                    <Text className={`text-xs font-medium ${taskId === task.id ? 'text-white' : 'text-ink/70 dark:text-ink-dark/70'}`} numberOfLines={1}>
                      {task.title}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          ) : null}

          {mode === 'task' && tasks.length === 0 ? (
            <Text className="text-xs text-[#8E8E93] dark:text-[#8e9095]">No tasks available to attach a photo to — switch to Media Note instead.</Text>
          ) : null}

          <Button onPress={handleSave} disabled={!canSave || saving} loading={saving}>
            {saving ? '' : 'Save'}
          </Button>
        </ScrollView>
      </View>
    </Modal>
  );
}
