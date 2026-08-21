import { useQuery } from '@tanstack/react-query';
import { File, Paths } from 'expo-file-system';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { Download, FileText, X } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { useCommunications } from '@/hooks/use-communications';
import { BUCKETS, getSignedUrl } from '@/lib/storage';
import { colors } from '@/theme/colors';

function formatBytes(bytes: number | null): string {
  if (!bytes) return '1.8 MB';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AttachmentModal() {
  const router = useRouter();
  const { commId } = useLocalSearchParams<{ commId: string }>();
  const { communications } = useCommunications();
  const [downloading, setDownloading] = useState(false);

  const communication = communications.find((c) => c.id === commId);

  const { data: signedUrl, isLoading } = useQuery({
    queryKey: ['attachment-url', communication?.attachment_url],
    queryFn: () => getSignedUrl(BUCKETS.communicationAttachments, communication!.attachment_url as string),
    enabled: !!communication?.attachment_url,
  });

  if (!communication) {
    return (
      <View className="flex-1 items-center justify-center bg-surface p-6 dark:bg-surface-dark">
        <Text className="text-sm text-ink/60 dark:text-ink-dark/60">Communication not found.</Text>
      </View>
    );
  }

  const handleDownload = async () => {
    if (!signedUrl) return;
    setDownloading(true);
    try {
      const destination = new File(Paths.cache, communication.attachment_name ?? `attachment-${Date.now()}`);
      const file = await File.downloadFileAsync(signedUrl, destination, { idempotent: true });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri);
      }
    } finally {
      setDownloading(false);
    }
  };

  return (
    <View className="flex-1 justify-center bg-black/60 p-4">
      <View className="overflow-hidden rounded-2xl border border-[#FFD8CC] bg-white dark:border-[#5d3f3c] dark:bg-surface-dark">
        <View className="flex-row items-center justify-between border-b border-[#e5e5ea] bg-[#F7F7F8] p-4 dark:border-[#35383c] dark:bg-[#26282b]">
          <View className="flex-1 flex-row items-center gap-2.5">
            <View className="h-9 w-9 items-center justify-center rounded-xl bg-[#FFF0EB] dark:bg-[#35383c]">
              <FileText size={20} color={colors.brand} />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-black text-ink dark:text-ink-dark" numberOfLines={1}>
                {communication.attachment_name ?? 'Operational Document'}
              </Text>
              <Text className="text-[11px] text-[#8E8E93] dark:text-[#d8dade]">
                Size: {formatBytes(communication.attachment_size_bytes)} · Due: {communication.due_date}
              </Text>
            </View>
          </View>
          <Pressable onPress={() => router.back()} hitSlop={8} className="rounded-xl p-1.5">
            <X size={20} color={colors.neutralTextLight} />
          </Pressable>
        </View>

        <View className="gap-4 p-5">
          <View className="rounded-xl border border-[#FFD8CC] bg-[#FFF9F6] p-3.5 dark:border-[#5d3f3c] dark:bg-[#25282c]">
            <Text className="mb-1 text-[10px] font-black uppercase tracking-wider text-brand">Store Operations Directive</Text>
            <Text className="text-sm font-black text-ink dark:text-ink-dark">{communication.title}</Text>
            <Text className="mt-1 text-xs leading-relaxed text-[#8E8E93] dark:text-[#d8dade]">{communication.description}</Text>
          </View>

          {isLoading ? (
            <ActivityIndicator color={colors.brand} />
          ) : !communication.attachment_name ? (
            <Text className="text-xs text-[#8E8E93] dark:text-[#8e9095]">No attachment on this communication.</Text>
          ) : null}
        </View>

        <View className="flex-row items-center justify-between border-t border-[#e5e5ea] bg-[#F7F7F8] p-4 dark:border-[#35383c] dark:bg-[#26282b]">
          {communication.attachment_name ? (
            <Pressable onPress={handleDownload} disabled={!signedUrl || downloading} className="flex-row items-center gap-1.5">
              {downloading ? <ActivityIndicator color={colors.brand} size="small" /> : <Download size={16} color={colors.brand} />}
              <Text className="text-xs font-bold text-brand">Download File</Text>
            </Pressable>
          ) : (
            <View />
          )}
          <Pressable onPress={() => router.back()} className="rounded-xl bg-brand px-5 py-2">
            <Text className="text-xs font-bold text-white">Done</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
