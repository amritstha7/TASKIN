import type { LucideIcon } from 'lucide-react-native';
import { Text, View } from 'react-native';

export function EmptyState({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description?: string }) {
  return (
    <View className="items-center justify-center gap-2 px-8 py-16">
      <View className="mb-2 rounded-full bg-black/5 p-4 dark:bg-white/10">
        <Icon size={28} color="#9a9a9e" />
      </View>
      <Text className="text-center text-base font-semibold text-ink dark:text-ink-dark">{title}</Text>
      {description ? <Text className="text-center text-sm text-ink/60 dark:text-ink-dark/60">{description}</Text> : null}
    </View>
  );
}
