import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useRealtimeInvalidate } from '@/hooks/use-realtime-invalidate';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/auth-provider';
import type { ProfileRow, TablesUpdate } from '@/types/database';

export function useProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['profile', user?.id] as const;

  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<ProfileRow> => {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user!.id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  useRealtimeInvalidate(
    `profile-${user?.id}`,
    'profiles',
    user ? `id=eq.${user.id}` : undefined,
    queryClient,
    queryKey
  );

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: TablesUpdate<'profiles'>) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    error: query.error,
    updateProfile: updateProfileMutation.mutateAsync,
  };
}
