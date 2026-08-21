import { useRouter } from 'expo-router';
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';

export default function LegendModal() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center bg-black/60 p-4">
      <View className="overflow-hidden rounded-2xl border border-[#FFD8CC] bg-white dark:border-[#5d3f3c] dark:bg-surface-dark">
        <View className="flex-row items-center justify-between border-b border-[#e5e5ea] bg-[#F7F7F8] p-4 dark:border-[#35383c] dark:bg-[#26282b]">
          <View className="flex-row items-center gap-2">
            <Info size={20} color={colors.brand} />
            <Text className="text-base font-black text-ink dark:text-ink-dark">Calendar Status Legend</Text>
          </View>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <X size={20} color={colors.neutralTextLight} />
          </Pressable>
        </View>

        <View className="gap-3.5 p-5">
          <View className="flex-row items-center gap-3 rounded-xl border border-[#FFD8CC] bg-[#FFF0EB] p-3">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-brand">
              <TriangleAlert size={18} color="#fff" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold text-brand">Urgent Action Required</Text>
              <Text className="text-xs text-[#8E8E93] dark:text-[#d8dade]">Critical compliance, safety, or priority tasks due today.</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3 rounded-xl border border-[#FFD8CC] bg-[#FFF9F6] p-3">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-brand">
              <View className="h-3.5 w-3.5 rounded-full bg-white" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold text-ink dark:text-ink-dark">Pending Store Task</Text>
              <Text className="text-xs text-[#8E8E93] dark:text-[#d8dade]">Standard shift tasks, replenishment waves, and audits.</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3 rounded-xl border border-[#008259]/20 bg-[#e1ffec] p-3">
            <View className="h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: colors.success }}>
              <CheckCircle2 size={18} color="#fff" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold" style={{ color: colors.success }}>
                Completed Actions
              </Text>
              <Text className="text-xs text-ink dark:text-[#d8dade]">All scheduled operations verified and signed off.</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3 rounded-xl border border-[#e5e5ea] bg-[#F7F7F8] p-3 dark:border-[#4d2d2a] dark:bg-[#35383c]">
            <View className="h-8 w-8 items-center justify-center rounded-xl" style={{ backgroundColor: '#2C2C2E' }}>
              <Text className="text-xs font-bold text-white">16</Text>
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold text-ink dark:text-ink-dark">Today</Text>
              <Text className="text-xs text-[#8E8E93] dark:text-[#d8dade]">Today&apos;s date, highlighted for quick reference.</Text>
            </View>
          </View>
        </View>

        <View className="flex-row justify-end border-t border-[#e5e5ea] bg-[#F7F7F8] p-4 dark:border-[#35383c] dark:bg-[#26282b]">
          <Button onPress={() => router.back()} className="px-5 py-2">
            Got it
          </Button>
        </View>
      </View>
    </View>
  );
}
