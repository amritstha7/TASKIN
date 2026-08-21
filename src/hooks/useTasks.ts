import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useProfile } from './useProfile';
import { useRealtimeInvalidate } from './useRealtimeInvalidate';
import { formatShortTime } from '../lib/format';
import { generateId } from '../lib/id';
import { BUCKETS, deleteFromBucket, getSignedUrlsBatch, uploadImage } from '../lib/storage';
import { supabase } from '../lib/supabase';
import { useAuth } from '../providers/AuthProvider';
import type { Task, TaskPhotoProof } from '../types';
import type { NotificationTiming, Priority, RepeatCadence, TaskNoteRow, TaskPhotoRow, TaskRow, TablesUpdate } from '../types/database';

interface RawProfileRef {
  name: string;
}

interface RawTaskRow extends TaskRow {
  task_notes: (TaskNoteRow & { author: RawProfileRef | null })[];
  task_photos: (TaskPhotoRow & { uploader: RawProfileRef | null })[];
  completed_by_profile: RawProfileRef | null;
  created_by_profile: RawProfileRef | null;
}

const TASK_SELECT = `
  *,
  completed_by_profile:profiles!tasks_completed_by_fkey(name),
  created_by_profile:profiles!tasks_created_by_fkey(name),
  task_notes(*, author:profiles!task_notes_author_id_fkey(name)),
  task_photos(*, uploader:profiles!task_photos_uploaded_by_fkey(name))
`;

function mapTaskRow(row: RawTaskRow, signedUrlMap: Record<string, string>): Task {
  const photos: TaskPhotoProof[] = row.task_photos
    .slice()
    .sort((a, b) => a.uploaded_at.localeCompare(b.uploaded_at))
    .map((p) => ({
      id: p.id,
      url: signedUrlMap[p.storage_path] ?? '',
      storagePath: p.storage_path,
      name: p.name ?? undefined,
      caption: p.caption ?? undefined,
      uploadedAt: formatShortTime(p.uploaded_at),
      uploadedBy: p.uploader?.name,
    }));

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    dueDate: row.due_date,
    priority: row.priority,
    repeat: row.repeat,
    isUrgent: row.is_urgent,
    notifications: { enabled: row.notifications_enabled, timing: row.notifications_timing },
    completed: row.completed,
    completedBy: row.completed_by_profile?.name,
    completedAt: row.completed_at ? formatShortTime(row.completed_at) : undefined,
    notes: row.task_notes
      .slice()
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
      .map((n) => n.body),
    photos,
    attachmentName: row.attachment_name ?? undefined,
    attachmentUrl: row.attachment_url ?? undefined,
    createdAt: row.created_at,
  };
}

async function fetchTasks(branchId: string): Promise<Task[]> {
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
  dueDate: string;
  priority: Priority;
  repeat: RepeatCadence;
  isUrgent: boolean;
  notifications: { enabled: boolean; timing: NotificationTiming };
  attachmentName?: string;
  attachmentUrl?: string;
}

export function useTasks() {
  const { branchId } = useProfile();
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
      const { error } = await supabase.from('tasks').insert({
        branch_id: branchId,
        title: input.title,
        description: input.description,
        category: input.category,
        due_date: input.dueDate,
        priority: input.priority,
        repeat: input.repeat,
        is_urgent: input.isUrgent,
        notifications_enabled: input.notifications.enabled,
        notifications_timing: input.notifications.timing,
        attachment_name: input.attachmentName ?? null,
        attachment_url: input.attachmentUrl ?? null,
      });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const toggleComplete = useMutation({
    mutationFn: async (task: Task) => {
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
    onSuccess: invalidate,
  });

  const completeWithPhoto = useMutation({
    mutationFn: async ({ taskId, blob, caption }: { taskId: string; blob: Blob; caption?: string }) => {
      if (!branchId || !user) throw new Error('Not ready');
      const path = `${branchId}/${taskId}/${generateId('photo')}.jpg`;
      await uploadImage(BUCKETS.taskPhotos, path, blob);

      const { error: photoError } = await supabase
        .from('task_photos')
        .insert({ task_id: taskId, storage_path: path, uploaded_by: user.id });
      if (photoError) throw photoError;

      if (caption?.trim()) {
        await supabase.from('task_notes').insert({ task_id: taskId, body: caption.trim(), author_id: user.id });
      }

      const { error } = await supabase
        .from('tasks')
        .update({ completed: true, completed_by: user.id, completed_at: new Date().toISOString() })
        .eq('id', taskId);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const attachPhoto = useMutation({
    mutationFn: async ({ taskId, blob, caption }: { taskId: string; blob: Blob; caption?: string }) => {
      if (!branchId || !user) throw new Error('Not ready');
      const path = `${branchId}/${taskId}/${generateId('photo')}.jpg`;
      await uploadImage(BUCKETS.taskPhotos, path, blob);
      const { error } = await supabase
        .from('task_photos')
        .insert({ task_id: taskId, storage_path: path, caption: caption?.trim() || null, uploaded_by: user.id });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const removePhoto = useMutation({
    mutationFn: async (photo: Pick<TaskPhotoProof, 'id' | 'storagePath'>) => {
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
    },
    onSuccess: invalidate,
  });

  const addNote = useMutation({
    mutationFn: async ({ taskId, body }: { taskId: string; body: string }) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase.from('task_notes').insert({ task_id: taskId, body: body.trim(), author_id: user.id });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const snoozeTask = useMutation({
    mutationFn: async ({ taskId, hours = 2 }: { taskId: string; hours?: number }) => {
      const until = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
      const { error } = await supabase.from('tasks').update({ snoozed_until: until } satisfies TablesUpdate<'tasks'>).eq('id', taskId);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return {
    tasks: query.data ?? [],
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    refetch: query.refetch,
    error: query.error,
    createTask: createTask.mutateAsync,
    toggleComplete: toggleComplete.mutateAsync,
    completeWithPhoto: completeWithPhoto.mutateAsync,
    attachPhoto: attachPhoto.mutateAsync,
    removePhoto: removePhoto.mutateAsync,
    deleteTask: deleteTask.mutateAsync,
    addNote: addNote.mutateAsync,
    snoozeTask: snoozeTask.mutateAsync,
  };
}
