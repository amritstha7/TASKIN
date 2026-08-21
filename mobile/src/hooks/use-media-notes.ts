import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useRealtimeInvalidate } from '@/hooks/use-realtime-invalidate';
import { generateId } from '@/lib/id';
import { BUCKETS, deleteFromBucket, getSignedUrlsBatch, uploadImage } from '@/lib/storage';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/auth-provider';
import { useSettings } from '@/providers/settings-provider';
import type { MediaNoteUI, RawMediaNoteRow } from '@/types/app';

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
    ...row,
    url: signedUrlMap[row.storage_path] ?? null,
    uploadedByName: uploader?.name ?? 'Unknown',
  }));
}

/**
 * Standalone photo notes: upload any photo, name it, and tag it with a
 * category — no existing task/communication association required (Bug 10).
 * Stored in the shared task-photos bucket under a media-notes/ sub-path.
 */
export function useMediaNotes() {
  const { branchId } = useSettings();
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
    mutationFn: async ({ localUri, name, category, caption }: { localUri: string; name: string; category: string; caption?: string }) => {
      if (!branchId || !user) throw new Error('Not ready');
      const path = `${branchId}/media-notes/${generateId('media')}.jpg`;
      await uploadImage(BUCKETS.taskPhotos, path, localUri);
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
    mutationFn: async (note: Pick<MediaNoteUI, 'id' | 'storage_path'>) => {
      await deleteFromBucket(BUCKETS.taskPhotos, [note.storage_path]);
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
