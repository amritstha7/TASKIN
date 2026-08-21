import { useQuery } from '@tanstack/react-query';

import { useProfile } from './useProfile';
import { supabase } from '../lib/supabase';
import type { TopPerformer } from '../types';

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

export function useTopPerformers() {
  const { branchId } = useProfile();

  const query = useQuery({
    queryKey: ['top-performers', branchId],
    queryFn: async (): Promise<TopPerformer[]> => {
      const { data, error } = await supabase
        .from('top_performers')
        .select('*')
        .eq('branch_id', branchId as string)
        .order('rank', { ascending: true })
        .limit(10);
      if (error) throw error;
      return (data ?? []).map((row) => ({
        id: row.profile_id,
        name: row.name,
        role: row.role,
        taskCount: row.task_count,
        // No DB column backs this — the original mock metric was confirmed
        // dead/unused too. Synthesized as a fixed placeholder until a real
        // QA metric (e.g. % of completions with a photo attached) exists.
        qaPercentage: 100,
        rank: row.rank,
        avatar: row.avatar_url ?? undefined,
        initials: initialsFromName(row.name),
      }));
    },
    enabled: !!branchId,
  });

  return { topPerformers: query.data ?? [], isLoading: query.isLoading };
}
