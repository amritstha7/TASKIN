import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useRealtimeInvalidate } from '@/hooks/use-realtime-invalidate';
import { supabase } from '@/lib/supabase';
import { useSettings } from '@/providers/settings-provider';
import type { ActivityUI } from '@/types/app';

export function useActivities() {
  const { branchId } = useSettings();
  const queryClient = useQueryClient();
  const queryKey = ['activities', branchId] as const;

  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<ActivityUI[]> => {
      const { data, error } = await supabase
        .from('activities')
        .select('*, actor:profiles!activities_actor_id_fkey(name)')
        .eq('branch_id', branchId as string)
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data ?? []).map((row) => {
        const { actor, ...rest } = row as typeof row & { actor: { name: string } | null };
        return { ...rest, actorName: actor?.name ?? null };
      });
    },
    enabled: !!branchId,
  });

  useRealtimeInvalidate(
    `activities-${branchId}`,
    'activities',
    branchId ? `branch_id=eq.${branchId}` : undefined,
    queryClient,
    queryKey
  );

  return {
    activities: query.data ?? [],
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    refetch: query.refetch,
  };
}
