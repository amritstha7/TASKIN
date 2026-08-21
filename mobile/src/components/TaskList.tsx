import type { LucideIcon } from 'lucide-react-native';
import type { ReactElement } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';

import { TaskCard } from '@/components/TaskCard';
import { EmptyState } from '@/components/ui/EmptyState';
import type { PhotoUI, TaskUI } from '@/types/app';

interface TaskListProps {
  tasks: TaskUI[];
  variant?: 'urgent' | 'default';
  isRefetching: boolean;
  onRefresh: () => void;
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDescription?: string;
  onToggleComplete: (task: TaskUI) => void;
  onDelete: (task: TaskUI) => void;
  onSnooze: (task: TaskUI) => void;
  onAddNote: (task: TaskUI, body: string) => void;
  onRemovePhoto: (task: TaskUI, photo: PhotoUI) => void;
  ListHeaderComponent?: ReactElement;
}

export function TaskList({
  tasks,
  variant,
  isRefetching,
  onRefresh,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  ListHeaderComponent,
  ...handlers
}: TaskListProps) {
  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TaskCard task={item} variant={variant} {...handlers} />}
      ItemSeparatorComponent={() => <View className="h-3" />}
      contentContainerClassName="p-4"
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={<EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} tintColor="#FF5500" />}
    />
  );
}
