import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: ReactNode;
}

export function ScreenHeader({ title, subtitle, onBack, right }: ScreenHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ paddingTop: insets.top + 8 }}
      className="flex-row items-center gap-3 border-b border-black/5 bg-surface px-4 pb-3 dark:border-white/5 dark:bg-surface-dark"
    >
      <Pressable
        onPress={onBack ?? (() => router.back())}
        hitSlop={12}
        className="h-9 w-9 items-center justify-center rounded-full bg-black/5 dark:bg-white/10"
      >
        <ChevronLeft size={20} color="#FF5500" />
      </Pressable>
      <View className="flex-1">
        <Text className="text-lg font-bold text-ink dark:text-ink-dark" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text className="text-xs text-ink/60 dark:text-ink-dark/60" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}
