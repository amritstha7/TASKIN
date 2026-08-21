import { useRouter } from 'expo-router';
import { AlertTriangle, Plus } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
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

export default function UrgentTasksScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { tasks, isRefetching, refetch } = useTasks();
  const actions = useTaskCardActions();
  const [filter, setFilter] = useState<Filter>('all');

  const urgentTasks = useMemo(() => tasks.filter((task) => task.is_urgent), [tasks]);
  const filtered = useMemo(() => {
    if (filter === 'pending') return urgentTasks.filter((task) => !task.completed);
    if (filter === 'completed') return urgentTasks.filter((task) => task.completed);
    return urgentTasks;
  }, [urgentTasks, filter]);

  return (
    <Screen>
      <TaskList
        tasks={filtered}
        variant="urgent"
        isRefetching={isRefetching}
        onRefresh={refetch}
        emptyIcon={AlertTriangle}
        emptyTitle="No urgent tasks"
        emptyDescription="All urgent actions are cleared."
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
              icon={AlertTriangle}
              title="Urgent Actions"
              count={urgentTasks.length}
              description="Critical store compliance and immediate operational requirements"
              gradientColors={[colors.urgentFrom, colors.urgentVia, colors.urgentTo]}
              countTextColor={colors.urgentFrom}
              shadowColor={colors.urgentVia}
            />
            <SegmentedTabs
              options={[
                { key: 'all', label: `All (${urgentTasks.length})` },
                { key: 'pending', label: `Pending (${urgentTasks.filter((t) => !t.completed).length})` },
                { key: 'completed', label: `Completed (${urgentTasks.filter((t) => t.completed).length})` },
              ]}
              value={filter}
              onChange={setFilter}
            />
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
