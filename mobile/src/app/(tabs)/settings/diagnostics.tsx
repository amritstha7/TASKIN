import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { CloudCog, Download, History, RefreshCcw, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { SubPageHeader } from '@/components/ui/SubPageHeader';
import { useProfile } from '@/hooks/use-profile';
import { colors } from '@/theme/colors';
import { useToast } from '@/providers/toast-provider';

export default function DiagnosticsSettingsScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { error, isLoading } = useProfile();
  const [syncing, setSyncing] = useState(false);

  const isOnline = !error && !isLoading;

  const handleSyncNow = async () => {
    setSyncing(true);
    await queryClient.invalidateQueries();
    setSyncing(false);
    showToast('Store telemetry synced with central server!');
  };

  const handleClearCache = () => {
    Alert.alert('Clear Local Cache', 'This clears cached data on this device only — nothing is deleted from the server.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset Cache',
        style: 'destructive',
        onPress: () => {
          queryClient.clear();
          showToast('Local scanner cache reset to defaults!', 'info');
        },
      },
    ]);
  };

  return (
    <Screen>
      <View className="gap-4 p-4">
        <SubPageHeader title="System & Diagnostics" path="/settings/diagnostics" description="Shift backups, cache clearing, and data sync status" />

        <View className="overflow-hidden rounded-2xl border border-[#e5e5ea] bg-white dark:border-[#35383c] dark:bg-surface-dark">
          <View className="flex-row items-center justify-between gap-3 border-b border-[#e5e5ea] p-4 dark:border-[#35383c]">
            <View className="flex-1 flex-row items-center gap-3.5">
              <View className="mt-0.5 h-9 w-9 items-center justify-center rounded-xl bg-[#e1ffec]">
                <CloudCog size={18} color={colors.success} />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-ink dark:text-ink-dark">Data Sync Status</Text>
                <View className="mt-1 flex-row items-center gap-1.5 self-start rounded-full border border-[#a3f3bf] bg-[#e1ffec] px-3 py-1">
                  <View className="h-1.5 w-1.5 rounded-full bg-[#008259]" />
                  <Text className="text-xs font-bold text-[#008259]">{isOnline ? 'Online' : 'Reconnecting'}</Text>
                </View>
              </View>
            </View>
            <Pressable onPress={handleSyncNow} className="items-center justify-center rounded-xl border border-[#FFD8CC] p-2 dark:border-[#5d3f3c]">
              <RefreshCcw size={18} color={colors.brand} style={syncing ? { opacity: 0.5 } : undefined} />
            </Pressable>
          </View>

          <View className="flex-row items-center justify-between gap-3 border-b border-[#e5e5ea] p-4 dark:border-[#35383c]">
            <View className="flex-1 flex-row items-center gap-3.5">
              <View className="mt-0.5 h-9 w-9 items-center justify-center rounded-xl bg-[#FFF0EB] dark:bg-[#35383c]">
                <Download size={18} color={colors.brand} />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-ink dark:text-ink-dark">Export Shift Backup</Text>
                <Text className="mt-0.5 text-xs text-[#8E8E93] dark:text-[#8e9095]">JSON snapshot of your branch&apos;s tasks & communications</Text>
              </View>
            </View>
            <Pressable
              onPress={() => router.push('/modals/export-report')}
              className="rounded-xl border border-[#FFD8CC] bg-[#FFF0EB] px-4 py-2 dark:border-[#5d3f3c] dark:bg-[#25282c]"
            >
              <Text className="text-xs font-bold text-brand">Export</Text>
            </Pressable>
          </View>

          <Pressable onPress={() => router.push('/(tabs)/activity')} className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center gap-3.5">
              <View className="mt-0.5 h-9 w-9 items-center justify-center rounded-xl bg-[#F7F7F8] dark:bg-[#35383c]">
                <History size={18} color={colors.ink} />
              </View>
              <Text className="text-sm font-bold text-ink dark:text-ink-dark">Activity Logs</Text>
            </View>
          </Pressable>
        </View>

        <Pressable
          onPress={handleClearCache}
          className="flex-row items-center justify-between gap-3 rounded-2xl border border-[#e5e5ea] bg-white p-4 dark:border-[#35383c] dark:bg-surface-dark"
        >
          <View className="flex-1 flex-row items-center gap-3.5">
            <View className="mt-0.5 h-9 w-9 items-center justify-center rounded-xl bg-[#ffebee] dark:bg-[#4a2424]">
              <Trash2 size={18} color={colors.urgentFrom} />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold" style={{ color: colors.urgentFrom }}>
                Clear Local Cache
              </Text>
              <Text className="mt-0.5 text-xs text-[#8E8E93] dark:text-[#8e9095]">Free up local storage & reset defaults (server data is untouched)</Text>
            </View>
          </View>
        </Pressable>
      </View>
    </Screen>
  );
}
