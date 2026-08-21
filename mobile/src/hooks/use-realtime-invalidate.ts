import type { QueryClient, QueryKey } from '@tanstack/react-query';
import { useEffect, useId } from 'react';

import { supabase } from '@/lib/supabase';

/**
 * Subscribes to Postgres changes for a table (scoped by `filter`, e.g.
 * `branch_id=eq.<id>`) and invalidates the given query whenever a row
 * changes — this is what makes a teammate's edit on another device show up
 * live, since this app is a shared branch workspace, not single-user.
 *
 * The channel name is suffixed with a per-instance id: Supabase's client
 * reuses/returns the same channel object for a given topic name, so if two
 * mounted components (e.g. a screen and the tab bar's badge counter) both
 * call a hook like useTasks() at once with the same base channel name, the
 * second one to run tries to attach a `postgres_changes` listener to a
 * channel the first one already called `.subscribe()` on — which throws.
 * Giving every hook instance its own channel avoids that collision.
 */
export function useRealtimeInvalidate(
  channelName: string,
  table: string,
  filter: string | undefined,
  queryClient: QueryClient,
  queryKey: QueryKey
) {
  const instanceId = useId();

  useEffect(() => {
    if (!filter) return undefined;

    const channel = supabase
      .channel(`${channelName}-${instanceId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table, filter }, () => {
        queryClient.invalidateQueries({ queryKey });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelName, instanceId, table, filter]);
}
