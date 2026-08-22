import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useRealtimeInvalidate } from './useRealtimeInvalidate';
import { supabase } from '../lib/supabase';
import { useAuth } from '../providers/AuthProvider';
import type { ProfileRow } from '../types/database';
import type { UserProfile } from '../types';

interface RawProfileRow extends ProfileRow {
  branches: { name: string } | null;
}

function mapProfileRow(row: RawProfileRow): UserProfile {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    branch: row.branches?.name ?? '',
    joinedDate: row.joined_date,
    avatarUrl: row.avatar_url ?? '',
    theme: row.theme,
    language: row.language,
    calendarMode: row.calendar_mode,
    pushNotifications: row.push_notifications,
    dailySummary: row.daily_summary,
    soundVibration: row.sound_vibration,
  };
}

async function fetchProfile(userId: string): Promise<RawProfileRow> {
  const { data, error } = await supabase.from('profiles').select('*, branches(name)').eq('id', userId).single();
  if (error) throw error;
  return data as unknown as RawProfileRow;
}

export function useProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['profile', user?.id] as const;

  const query = useQuery({
    queryKey,
    queryFn: () => fetchProfile(user!.id),
    enabled: !!user,
  });

  useRealtimeInvalidate(`profile-${user?.id}`, 'profiles', user ? `id=eq.${user.id}` : undefined, queryClient, queryKey);

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      if (!user) throw new Error('Not authenticated');
      // `branch` (blocked server-side by a trigger) and `email` (a separate
      // auth.updateUser flow, not implemented here) are display-only fields —
      // silently dropped rather than sent to the DB.
      const { name, role, avatarUrl, theme, language, calendarMode, pushNotifications, dailySummary, soundVibration } = updates;
      const { error } = await supabase
        .from('profiles')
        .update({
          ...(name !== undefined && { name }),
          ...(role !== undefined && { role }),
          ...(avatarUrl !== undefined && { avatar_url: avatarUrl }),
          ...(theme !== undefined && { theme }),
          ...(language !== undefined && { language }),
          ...(calendarMode !== undefined && { calendar_mode: calendarMode }),
          ...(pushNotifications !== undefined && { push_notifications: pushNotifications }),
          ...(dailySummary !== undefined && { daily_summary: dailySummary }),
          ...(soundVibration !== undefined && { sound_vibration: soundVibration }),
        })
        .eq('id', user.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    profile: query.data ? mapProfileRow(query.data) : undefined,
    branchId: query.data?.branch_id,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    updateProfile: updateProfileMutation.mutateAsync,
  };
}
