import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

export function BreadcrumbHeader({ right }: { right?: ReactNode }) {
  const router = useRouter();
  return (
    <View className="flex-row items-center justify-between gap-2">
      <Pressable onPress={() => router.back()} className="flex-row items-center gap-1.5 rounded-lg px-2.5 py-1">
        <ArrowLeft size={18} color={colors.neutralTextLight} />
        <Text className="text-xs font-bold text-[#8E8E93] dark:text-[#8e9095]">Back to Dashboard</Text>
      </Pressable>
      {right}
    </View>
  );
}
