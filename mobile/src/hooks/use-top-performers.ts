import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { useSettings } from '@/providers/settings-provider';
import type { TopPerformerRow } from '@/types/database';

export function useTopPerformers() {
  const { branchId } = useSettings();

  const query = useQuery({
    queryKey: ['top-performers', branchId],
    queryFn: async (): Promise<TopPerformerRow[]> => {
      const { data, error } = await supabase
        .from('top_performers')
        .select('*')
        .eq('branch_id', branchId as string)
        .order('rank', { ascending: true })
        .limit(10);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!branchId,
  });

  return { topPerformers: query.data ?? [], isLoading: query.isLoading };
}
