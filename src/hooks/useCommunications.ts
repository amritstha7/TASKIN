import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useProfile } from './useProfile';
import { useRealtimeInvalidate } from './useRealtimeInvalidate';
import { formatShortTime, formatBytes } from '../lib/format';
import { generateId } from '../lib/id';
import { BUCKETS, deleteFromBucket, getSignedUrlsBatch, uploadFile, uploadImage } from '../lib/storage';
import { supabase } from '../lib/supabase';
import { useAuth } from '../providers/AuthProvider';
import type { Communication, TaskPhotoProof } from '../types';
import type { CommunicationNoteRow, CommunicationPhotoRow, CommunicationRow } from '../types/database';

interface RawProfileRef {
  name: string;
}

interface RawCommunicationRow extends CommunicationRow {
  communication_notes: (CommunicationNoteRow & { author: RawProfileRef | null })[];
  communication_photos: (CommunicationPhotoRow & { uploader: RawProfileRef | null })[];
  completed_by_profile: RawProfileRef | null;
  created_by_profile: RawProfileRef | null;
}

const COMM_SELECT = `
  *,
  completed_by_profile:profiles!communications_completed_by_fkey(name),
  created_by_profile:profiles!communications_created_by_fkey(name),
  communication_notes(*, author:profiles!communication_notes_author_id_fkey(name)),
  communication_photos(*, uploader:profiles!communication_photos_uploaded_by_fkey(name))
`;

function mapCommRow(row: RawCommunicationRow, signedUrlMap: Record<string, string>): Communication {
  const photos: TaskPhotoProof[] = row.communication_photos
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
    dueDate: row.due_date,
    attachmentName: row.attachment_name ?? undefined,
    attachmentUrl: row.attachment_url ?? undefined,
    attachmentSize: row.attachment_size_bytes != null ? formatBytes(row.attachment_size_bytes) : undefined,
    completedBy: row.completed_by_profile?.name,
    completedAt: row.completed_at ? formatShortTime(row.completed_at) : undefined,
    isCompleted: row.is_completed,
    notes: row.communication_notes
      .slice()
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
      .map((n) => n.body),
    photos,
  };
}

async function fetchCommunications(branchId: string): Promise<Communication[]> {
  const { data, error } = await supabase
    .from('communications')
    .select(COMM_SELECT)
    .eq('branch_id', branchId)
    .order('due_date', { ascending: true });
  if (error) throw error;

  const rows = (data ?? []) as unknown as RawCommunicationRow[];
  const allPaths = rows.flatMap((r) => r.communication_photos.map((p) => p.storage_path));
  const signedUrlMap = await getSignedUrlsBatch(BUCKETS.communicationAttachments, allPaths);

  return rows.map((row) => mapCommRow(row, signedUrlMap));
}

export function useCommunications() {
  const { branchId } = useProfile();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['communications', branchId] as const;

  const query = useQuery({
    queryKey,
    queryFn: () => fetchCommunications(branchId as string),
    enabled: !!branchId,
  });

  const filter = branchId ? `branch_id=eq.${branchId}` : undefined;
  useRealtimeInvalidate(`comms-${branchId}`, 'communications', filter, queryClient, queryKey);
  useRealtimeInvalidate(`comm-notes-${branchId}`, 'communication_notes', filter, queryClient, queryKey);
  useRealtimeInvalidate(`comm-photos-${branchId}`, 'communication_photos', filter, queryClient, queryKey);

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const createCommunication = useMutation({
    mutationFn: async (input: { title: string; description: string; dueDate: string }) => {
      if (!branchId) throw new Error('No branch');
      const { error } = await supabase
        .from('communications')
        .insert({ branch_id: branchId, title: input.title, description: input.description, due_date: input.dueDate });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteCommunication = useMutation({
    mutationFn: async (communicationId: string) => {
      const { error } = await supabase.from('communications').delete().eq('id', communicationId);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const toggleComplete = useMutation({
    mutationFn: async (comm: Communication) => {
      const willComplete = !comm.isCompleted;
      const { error } = await supabase
        .from('communications')
        .update({
          is_completed: willComplete,
          completed_by: willComplete ? (user?.id ?? null) : null,
          completed_at: willComplete ? new Date().toISOString() : null,
        })
        .eq('id', comm.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const addNote = useMutation({
    mutationFn: async ({ communicationId, body }: { communicationId: string; body: string }) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('communication_notes')
        .insert({ communication_id: communicationId, body: body.trim(), author_id: user.id });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const uploadAttachment = useMutation({
    mutationFn: async ({
      communicationId,
      file,
      fileName,
      contentType,
      sizeBytes,
    }: {
      communicationId: string;
      file: Blob;
      fileName: string;
      contentType: string;
      sizeBytes: number;
    }) => {
      if (!branchId) throw new Error('No branch');
      const path = `${branchId}/${communicationId}/${fileName}`;
      await uploadFile(BUCKETS.communicationAttachments, path, file, contentType);
      const { error } = await supabase
        .from('communications')
        .update({ attachment_name: fileName, attachment_url: path, attachment_size_bytes: sizeBytes })
        .eq('id', communicationId);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const uploadPhoto = useMutation({
    mutationFn: async ({ communicationId, blob, caption }: { communicationId: string; blob: Blob; caption?: string }) => {
      if (!branchId || !user) throw new Error('Not ready');
      const path = `${branchId}/${communicationId}/${generateId('photo')}.jpg`;
      await uploadImage(BUCKETS.communicationAttachments, path, blob);
      const { error } = await supabase.from('communication_photos').insert({
        communication_id: communicationId,
        storage_path: path,
        caption: caption?.trim() || null,
        uploaded_by: user.id,
      });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const removePhoto = useMutation({
    mutationFn: async (photo: Pick<TaskPhotoProof, 'id' | 'storagePath'>) => {
      await deleteFromBucket(BUCKETS.communicationAttachments, [photo.storagePath]);
      const { error } = await supabase.from('communication_photos').delete().eq('id', photo.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return {
    communications: query.data ?? [],
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    refetch: query.refetch,
    error: query.error,
    createCommunication: createCommunication.mutateAsync,
    deleteCommunication: deleteCommunication.mutateAsync,
    toggleComplete: toggleComplete.mutateAsync,
    addNote: addNote.mutateAsync,
    uploadAttachment: uploadAttachment.mutateAsync,
    uploadPhoto: uploadPhoto.mutateAsync,
    removePhoto: removePhoto.mutateAsync,
  };
}
