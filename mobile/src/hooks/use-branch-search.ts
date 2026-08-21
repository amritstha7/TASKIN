import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

export interface BranchOption {
  id: string;
  name: string;
}

/** Signup typeahead — queried as `anon`, before an account/session exists. */
export function useBranchSearch(query: string) {
  const trimmed = query.trim();
  return useQuery({
    queryKey: ['branch-search', trimmed],
    queryFn: async (): Promise<BranchOption[]> => {
      const { data, error } = await supabase
        .from('branches')
        .select('id, name')
        .ilike('name', `%${trimmed}%`)
        .order('name')
        .limit(8);
      if (error) throw error;
      return data ?? [];
    },
    enabled: trimmed.length > 1,
  });
}
