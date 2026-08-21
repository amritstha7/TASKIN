import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

export function SubPageHeader({ title, path, description }: { title: string; path: string; description: string }) {
  const router = useRouter();
  return (
    <View
      className="flex-row items-center gap-3 rounded-2xl border border-[#e5e5ea] bg-white p-4 dark:border-[#35383c] dark:bg-surface-dark"
      style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 2 }}
    >
      <Pressable onPress={() => router.back()} className="h-9 w-9 items-center justify-center rounded-xl border border-[#e5e5ea] bg-[#F7F7F8] dark:border-[#3a3d42] dark:bg-[#2c2f33]">
        <ArrowLeft size={18} color={colors.ink} />
      </Pressable>
      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-black tracking-tight text-ink dark:text-ink-dark">{title}</Text>
          <View className="rounded-md border border-[#e5e5ea] bg-[#F7F7F8] px-2 py-0.5 dark:border-[#35383c] dark:bg-[#2c2f33]">
            <Text className="text-[11px] font-mono text-[#8E8E93] dark:text-[#8e9095]">{path}</Text>
          </View>
        </View>
        <Text className="mt-0.5 text-xs text-[#8E8E93] dark:text-[#8e9095]">{description}</Text>
      </View>
    </View>
  );
}
