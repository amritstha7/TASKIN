import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { useSettings } from '@/providers/settings-provider';

export function useBranch() {
  const { branchId } = useSettings();

  const query = useQuery({
    queryKey: ['branch', branchId],
    queryFn: async () => {
      const { data, error } = await supabase.from('branches').select('name').eq('id', branchId as string).single();
      if (error) throw error;
      return data;
    },
    enabled: !!branchId,
  });

  return { branchName: query.data?.name };
}
