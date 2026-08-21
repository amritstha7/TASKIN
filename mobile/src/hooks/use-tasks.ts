import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useRealtimeInvalidate } from '@/hooks/use-realtime-invalidate';
import { generateId } from '@/lib/id';
import { cancelTaskReminder, scheduleTaskReminder } from '@/lib/notifications';
import { BUCKETS, deleteFromBucket, getSignedUrlsBatch, uploadImage } from '@/lib/storage';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/auth-provider';
import { useSettings } from '@/providers/settings-provider';
import type { PhotoUI, RawTaskRow, TaskUI } from '@/types/app';
import type { NotificationTiming, Priority, RepeatCadence, TablesUpdate } from '@/types/database';

const TASK_SELECT = `
  *,
  completed_by_profile:profiles!tasks_completed_by_fkey(name),
  created_by_profile:profiles!tasks_created_by_fkey(name),
  task_notes(*, author:profiles!task_notes_author_id_fkey(name)),
  task_photos(*, uploader:profiles!task_photos_uploaded_by_fkey(name))
`;

function mapTaskRow(row: RawTaskRow, signedUrlMap: Record<string, string>): TaskUI {
  const { task_notes, task_photos, completed_by_profile, created_by_profile, ...rest } = row;
  return {
    ...rest,
    completedByName: completed_by_profile?.name ?? null,
    createdByName: created_by_profile?.name ?? null,
    notes: task_notes
      .slice()
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
      .map((n) => ({ id: n.id, body: n.body, authorName: n.author?.name ?? 'Unknown', createdAt: n.created_at })),
    photos: task_photos
      .slice()
      .sort((a, b) => a.uploaded_at.localeCompare(b.uploaded_at))
      .map((p) => ({
        id: p.id,
        storagePath: p.storage_path,
        url: signedUrlMap[p.storage_path] ?? null,
        name: p.name,
        caption: p.caption,
        uploadedByName: p.uploader?.name ?? 'Unknown',
        uploadedAt: p.uploaded_at,
      })),
  };
}

async function fetchTasks(branchId: string): Promise<TaskUI[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select(TASK_SELECT)
    .eq('branch_id', branchId)
    .order('due_date', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) throw error;

  const rows = (data ?? []) as unknown as RawTaskRow[];
  const allPaths = rows.flatMap((r) => r.task_photos.map((p) => p.storage_path));
  const signedUrlMap = await getSignedUrlsBatch(BUCKETS.taskPhotos, allPaths);

  return rows.map((row) => mapTaskRow(row, signedUrlMap));
}

export interface NewTaskInput {
  title: string;
  description: string;
  category: string;
  due_date: string;
  priority: Priority;
  repeat: RepeatCadence;
  is_urgent: boolean;
  notifications_enabled: boolean;
  notifications_timing: NotificationTiming;
}

export function useTasks() {
  const { branchId } = useSettings();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['tasks', branchId] as const;

  const query = useQuery({
    queryKey,
    queryFn: () => fetchTasks(branchId as string),
    enabled: !!branchId,
  });

  const filter = branchId ? `branch_id=eq.${branchId}` : undefined;
  useRealtimeInvalidate(`tasks-${branchId}`, 'tasks', filter, queryClient, queryKey);
  useRealtimeInvalidate(`task-notes-${branchId}`, 'task_notes', filter, queryClient, queryKey);
  useRealtimeInvalidate(`task-photos-${branchId}`, 'task_photos', filter, queryClient, queryKey);

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const createTask = useMutation({
    mutationFn: async (input: NewTaskInput) => {
      if (!branchId) throw new Error('No branch');
      const { data, error } = await supabase
        .from('tasks')
        .insert({ branch_id: branchId, ...input })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (task) => {
      invalidate();
      void scheduleTaskReminder(task);
    },
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TablesUpdate<'tasks'> }) => {
      const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (task) => {
      invalidate();
      void scheduleTaskReminder(task);
    },
  });

  const toggleComplete = useMutation({
    mutationFn: async (task: TaskUI) => {
      const willComplete = !task.completed;
      const { error } = await supabase
        .from('tasks')
        .update({
          completed: willComplete,
          completed_by: willComplete ? (user?.id ?? null) : null,
          completed_at: willComplete ? new Date().toISOString() : null,
        })
        .eq('id', task.id);
      if (error) throw error;
    },
    onSuccess: (_, task) => {
      invalidate();
      void cancelTaskReminder(task.id);
    },
  });

  const completeWithPhoto = useMutation({
    mutationFn: async ({ task, localUri, caption }: { task: TaskUI; localUri: string; caption?: string }) => {
      if (!branchId || !user) throw new Error('Not ready');
      const path = `${branchId}/${task.id}/${generateId('photo')}.jpg`;
      await uploadImage(BUCKETS.taskPhotos, path, localUri);

      const { error: photoError } = await supabase
        .from('task_photos')
        .insert({ task_id: task.id, storage_path: path, uploaded_by: user.id });
      if (photoError) throw photoError;

      if (caption?.trim()) {
        await supabase.from('task_notes').insert({ task_id: task.id, body: caption.trim(), author_id: user.id });
      }

      const { error } = await supabase
        .from('tasks')
        .update({ completed: true, completed_by: user.id, completed_at: new Date().toISOString() })
        .eq('id', task.id);
      if (error) throw error;
    },
    onSuccess: (_, { task }) => {
      invalidate();
      void cancelTaskReminder(task.id);
    },
  });

  const attachPhoto = useMutation({
    mutationFn: async ({ task, localUri, caption }: { task: TaskUI; localUri: string; caption?: string }) => {
      if (!branchId || !user) throw new Error('Not ready');
      const path = `${branchId}/${task.id}/${generateId('photo')}.jpg`;
      await uploadImage(BUCKETS.taskPhotos, path, localUri);
      const { error } = await supabase
        .from('task_photos')
        .insert({ task_id: task.id, storage_path: path, caption: caption?.trim() || null, uploaded_by: user.id });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const removePhoto = useMutation({
    mutationFn: async (photo: Pick<PhotoUI, 'id' | 'storagePath'>) => {
      await deleteFromBucket(BUCKETS.taskPhotos, [photo.storagePath]);
      const { error } = await supabase.from('task_photos').delete().eq('id', photo.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteTask = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);
      if (error) throw error;
      return taskId;
    },
    onSuccess: (taskId) => {
      invalidate();
      void cancelTaskReminder(taskId);
    },
  });

  const addNote = useMutation({
    mutationFn: async ({ taskId, body }: { taskId: string; body: string }) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('task_notes')
        .insert({ task_id: taskId, body: body.trim(), author_id: user.id });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const snoozeTask = useMutation({
    mutationFn: async ({ taskId, hours = 2 }: { taskId: string; hours?: number }) => {
      const until = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from('tasks')
        .update({ snoozed_until: until })
        .eq('id', taskId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (task) => {
      invalidate();
      void scheduleTaskReminder(task);
    },
  });

  return {
    tasks: query.data ?? [],
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    refetch: query.refetch,
    error: query.error,
    createTask: createTask.mutateAsync,
    updateTask: updateTask.mutateAsync,
    toggleComplete: toggleComplete.mutateAsync,
    completeWithPhoto: completeWithPhoto.mutateAsync,
    attachPhoto: attachPhoto.mutateAsync,
    removePhoto: removePhoto.mutateAsync,
    deleteTask: deleteTask.mutateAsync,
    addNote: addNote.mutateAsync,
    snoozeTask: snoozeTask.mutateAsync,
  };
}
