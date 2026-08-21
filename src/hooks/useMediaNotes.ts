import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useProfile } from './useProfile';
import { useRealtimeInvalidate } from './useRealtimeInvalidate';
import { formatShortTime } from '../lib/format';
import { generateId } from '../lib/id';
import { BUCKETS, deleteFromBucket, getSignedUrlsBatch, uploadImage } from '../lib/storage';
import { supabase } from '../lib/supabase';
import { useAuth } from '../providers/AuthProvider';
import type { MediaNoteRow } from '../types/database';

export interface MediaNoteUI {
  id: string;
  url: string;
  storagePath: string;
  name: string;
  category: string;
  caption?: string;
  uploadedByName: string;
  uploadedAt: string;
}

interface RawMediaNoteRow extends MediaNoteRow {
  uploader: { name: string } | null;
}

const MEDIA_NOTE_SELECT = `*, uploader:profiles!media_notes_uploaded_by_fkey(name)`;

async function fetchMediaNotes(branchId: string): Promise<MediaNoteUI[]> {
  const { data, error } = await supabase
    .from('media_notes')
    .select(MEDIA_NOTE_SELECT)
    .eq('branch_id', branchId)
    .order('uploaded_at', { ascending: false });
  if (error) throw error;

  const rows = (data ?? []) as unknown as RawMediaNoteRow[];
  const signedUrlMap = await getSignedUrlsBatch(
    BUCKETS.taskPhotos,
    rows.map((r) => r.storage_path)
  );

  return rows.map(({ uploader, ...row }) => ({
    id: row.id,
    url: signedUrlMap[row.storage_path] ?? '',
    storagePath: row.storage_path,
    name: row.name,
    category: row.category,
    caption: row.caption ?? undefined,
    uploadedByName: uploader?.name ?? 'Unknown',
    uploadedAt: formatShortTime(row.uploaded_at),
  }));
}

/**
 * Standalone photo notes: upload any photo, name it, and tag it with a
 * category — no existing task/communication association required. Stored
 * in the shared task-photos bucket under a media-notes/ sub-path.
 */
export function useMediaNotes() {
  const { branchId } = useProfile();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['media-notes', branchId] as const;

  const query = useQuery({
    queryKey,
    queryFn: () => fetchMediaNotes(branchId as string),
    enabled: !!branchId,
  });

  const filter = branchId ? `branch_id=eq.${branchId}` : undefined;
  useRealtimeInvalidate(`media-notes-${branchId}`, 'media_notes', filter, queryClient, queryKey);

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const createMediaNote = useMutation({
    mutationFn: async ({ blob, name, category, caption }: { blob: Blob; name: string; category: string; caption?: string }) => {
      if (!branchId || !user) throw new Error('Not ready');
      const path = `${branchId}/media-notes/${generateId('media')}.jpg`;
      await uploadImage(BUCKETS.taskPhotos, path, blob);
      const { error } = await supabase.from('media_notes').insert({
        branch_id: branchId,
        storage_path: path,
        name: name.trim(),
        category: category.trim() || 'General',
        caption: caption?.trim() || null,
        uploaded_by: user.id,
      });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteMediaNote = useMutation({
    mutationFn: async (note: Pick<MediaNoteUI, 'id' | 'storagePath'>) => {
      await deleteFromBucket(BUCKETS.taskPhotos, [note.storagePath]);
      const { error } = await supabase.from('media_notes').delete().eq('id', note.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return {
    mediaNotes: query.data ?? [],
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    refetch: query.refetch,
    createMediaNote: createMediaNote.mutateAsync,
    deleteMediaNote: deleteMediaNote.mutateAsync,
  };
}
