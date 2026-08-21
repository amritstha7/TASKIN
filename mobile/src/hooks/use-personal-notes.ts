import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useRealtimeInvalidate } from '@/hooks/use-realtime-invalidate';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/auth-provider';
import type { PersonalNoteRow } from '@/types/database';

export function usePersonalNotes() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['personal-notes', user?.id] as const;

  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<PersonalNoteRow[]> => {
      const { data, error } = await supabase
        .from('personal_notes')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  useRealtimeInvalidate(
    `personal-notes-${user?.id}`,
    'personal_notes',
    user ? `user_id=eq.${user.id}` : undefined,
    queryClient,
    queryKey
  );

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const addNote = useMutation({
    mutationFn: async (text: string) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase.from('personal_notes').insert({ user_id: user.id, text: text.trim() });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const toggleNote = useMutation({
    mutationFn: async (note: PersonalNoteRow) => {
      const { error } = await supabase
        .from('personal_notes')
        .update({ completed: !note.completed })
        .eq('id', note.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteNote = useMutation({
    mutationFn: async (noteId: string) => {
      const { error } = await supabase.from('personal_notes').delete().eq('id', noteId);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return {
    notes: query.data ?? [],
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    refetch: query.refetch,
    addNote: addNote.mutateAsync,
    toggleNote: toggleNote.mutateAsync,
    deleteNote: deleteNote.mutateAsync,
  };
}
