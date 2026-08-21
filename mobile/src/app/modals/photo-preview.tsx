import { File, Paths } from 'expo-file-system';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { Camera, Download, X } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native';

export default function PhotoPreviewModal() {
  const router = useRouter();
  const { url, title, caption, user, time } = useLocalSearchParams<{
    url: string;
    title: string;
    caption?: string;
    user?: string;
    time?: string;
  }>();
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    if (!url) return;
    setSharing(true);
    try {
      const destination = new File(Paths.cache, `taskn-photo-${Date.now()}.jpg`);
      const file = await File.downloadFileAsync(url, destination);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri);
      }
    } finally {
      setSharing(false);
    }
  };

  return (
    <Pressable className="flex-1 items-center justify-center bg-black/85 p-3" onPress={() => router.back()}>
      <Pressable onPress={(e) => e.stopPropagation()} className="w-full overflow-hidden rounded-2xl border border-white/10 bg-[#191c1f]">
        <View className="flex-row items-center justify-between border-b border-white/10 bg-[#25282c] p-3.5">
          <View className="flex-1 flex-row items-center gap-2">
            <Camera size={18} color="#ffb4ac" />
            <View className="flex-1">
              <Text className="text-sm font-bold text-white" numberOfLines={1}>
                {title || 'Task Photo Proof'}
              </Text>
              {user || time ? (
                <Text className="text-[10px] text-white/60">
                  {user ? `By ${user} ` : ''}
                  {time ? `at ${time}` : ''}
                </Text>
              ) : null}
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <Pressable onPress={handleShare} disabled={sharing} className="flex-row items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1.5">
              {sharing ? <ActivityIndicator color="#fff" size="small" /> : <Download size={16} color="#fff" />}
              <Text className="text-[11px] font-medium text-white">Save</Text>
            </Pressable>
            <Pressable onPress={() => router.back()} hitSlop={8} className="rounded-lg bg-white/10 p-1.5">
              <X size={18} color="#fff" />
            </Pressable>
          </View>
        </View>

        <View className="min-h-[300px] items-center justify-center bg-black/60 p-2">
          {url ? <Image source={{ uri: url }} className="h-96 w-full" resizeMode="contain" /> : null}
        </View>

        {caption ? (
          <View className="border-t border-white/10 bg-[#25282c] p-3">
            <Text className="text-xs text-white/90">
              <Text className="font-bold text-[#ffb4ac]">Proof Caption: </Text>
              {caption}
            </Text>
          </View>
        ) : null}
      </Pressable>
    </Pressable>
  );
}
