import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useProfile } from './useProfile';
import { useRealtimeInvalidate } from './useRealtimeInvalidate';
import { formatShortDate, formatShortTime } from '../lib/format';
import { supabase } from '../lib/supabase';
import type { ActivityItem } from '../types';

export function useActivities() {
  const { branchId } = useProfile();
  const queryClient = useQueryClient();
  const queryKey = ['activities', branchId] as const;

  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<ActivityItem[]> => {
      const { data, error } = await supabase
        .from('activities')
        .select('*, actor:profiles!activities_actor_id_fkey(name)')
        .eq('branch_id', branchId as string)
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data ?? []).map((row) => {
        const { actor, ...rest } = row as typeof row & { actor: { name: string } | null };
        return {
          id: rest.id,
          title: rest.title,
          description: rest.description,
          type: rest.type,
          user: actor?.name ?? 'Unknown',
          time: formatShortTime(rest.created_at),
          date: formatShortDate(rest.created_at),
          statusBadge: rest.status_badge ?? undefined,
        };
      });
    },
    enabled: !!branchId,
  });

  useRealtimeInvalidate(`activities-${branchId}`, 'activities', branchId ? `branch_id=eq.${branchId}` : undefined, queryClient, queryKey);

  return {
    activities: query.data ?? [],
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    refetch: query.refetch,
  };
}
