import { useRouter } from 'expo-router';
import { ClipboardList, Plus } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GradientBanner } from '@/components/GradientBanner';
import { TaskList } from '@/components/TaskList';
import { BreadcrumbHeader } from '@/components/ui/BreadcrumbHeader';
import { Screen } from '@/components/ui/Screen';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { useTaskCardActions } from '@/hooks/use-task-actions';
import { useTasks } from '@/hooks/use-tasks';
import { colors } from '@/theme/colors';

type Filter = 'all' | 'pending' | 'completed';

export default function StoreTasksScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { tasks, isRefetching, refetch } = useTasks();
  const actions = useTaskCardActions();
  const [filter, setFilter] = useState<Filter>('all');
  const [category, setCategory] = useState<string | null>(null);

  const storeTasks = useMemo(() => tasks.filter((task) => !task.is_urgent), [tasks]);
  const categories = useMemo(() => Array.from(new Set(storeTasks.map((task) => task.category))), [storeTasks]);

  const filtered = useMemo(() => {
    let list = storeTasks;
    if (filter === 'pending') list = list.filter((task) => !task.completed);
    if (filter === 'completed') list = list.filter((task) => task.completed);
    if (category) list = list.filter((task) => task.category === category);
    return list;
  }, [storeTasks, filter, category]);

  return (
    <Screen>
      <TaskList
        tasks={filtered}
        variant="default"
        isRefetching={isRefetching}
        onRefresh={refetch}
        emptyIcon={ClipboardList}
        emptyTitle="No tasks"
        emptyDescription="Nothing scheduled here yet."
        ListHeaderComponent={
          <View style={{ paddingTop: insets.top + 8 }} className="gap-4 pb-4">
            <BreadcrumbHeader
              right={
                <Pressable
                  onPress={() => router.push('/modals/add-task')}
                  className="flex-row items-center gap-1 rounded-xl bg-brand px-3 py-1.5 shadow-sm"
                >
                  <Plus size={16} color="#fff" />
                  <Text className="text-xs font-bold text-white">Add Task</Text>
                </Pressable>
              }
            />
            <GradientBanner
              icon={ClipboardList}
              title="Tasks"
              count={storeTasks.length}
              description="Daily store operations, merchandising routines, and inventory checks"
              gradientColors={[colors.brand, colors.brandDark]}
              countTextColor={colors.brand}
              shadowColor={colors.brand}
            />
            <SegmentedTabs
              options={[
                { key: 'all', label: `All (${storeTasks.length})` },
                { key: 'pending', label: `Pending (${storeTasks.filter((t) => !t.completed).length})` },
                { key: 'completed', label: `Completed (${storeTasks.filter((t) => t.completed).length})` },
              ]}
              value={filter}
              onChange={setFilter}
            />
            {categories.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 pr-4">
                <Pressable
                  onPress={() => setCategory(null)}
                  className={`rounded-full px-3 py-1.5 ${!category ? 'bg-ink dark:bg-ink-dark' : 'border border-[#e5e5ea] bg-white dark:border-[#35383c] dark:bg-surface-dark'}`}
                >
                  <Text className={`text-xs font-semibold ${!category ? 'text-white dark:text-surface-dark' : 'text-[#8E8E93] dark:text-[#8e9095]'}`}>
                    All Categories
                  </Text>
                </Pressable>
                {categories.map((cat) => (
                  <Pressable
                    key={cat}
                    onPress={() => setCategory(cat)}
                    className={`rounded-full px-3 py-1.5 ${category === cat ? 'bg-ink dark:bg-ink-dark' : 'border border-[#e5e5ea] bg-white dark:border-[#35383c] dark:bg-surface-dark'}`}
                  >
                    <Text
                      className={`text-xs font-semibold ${category === cat ? 'text-white dark:text-surface-dark' : 'text-[#8E8E93] dark:text-[#8e9095]'}`}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            ) : null}
          </View>
        }
        onToggleComplete={actions.onToggleComplete}
        onDelete={actions.onDelete}
        onSnooze={actions.onSnooze}
        onAddNote={actions.onAddNote}
        onRemovePhoto={actions.onRemovePhoto}
      />
    </Screen>
  );
}
