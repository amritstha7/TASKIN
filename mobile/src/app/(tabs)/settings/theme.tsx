import { CheckCircle2, Moon, Smartphone, Sun } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { SubPageHeader } from '@/components/ui/SubPageHeader';
import { Screen } from '@/components/ui/Screen';
import { useSettings } from '@/providers/settings-provider';
import { colors } from '@/theme/colors';
import type { ThemePreference } from '@/types/database';

const OPTIONS: { key: ThemePreference; icon: LucideIcon; label: string; description: string; accent: string }[] = [
  { key: 'light', icon: Sun, label: 'Light', description: 'Clean, crisp off-white canvas with high-contrast vivid orange highlights.', accent: '#FF5500 Retail Accent' },
  { key: 'dark', icon: Moon, label: 'Dark', description: 'Deep charcoal canvas that reduces eye strain during night shifts.', accent: '#fe6b00 Retail Accent' },
  { key: 'auto', icon: Smartphone, label: 'Auto', description: 'Follows your device system appearance automatically.', accent: 'System Adaptive' },
];

export default function ThemeSettingsScreen() {
  const { theme, setTheme } = useSettings();

  return (
    <Screen>
      <View className="gap-4 p-4">
        <SubPageHeader title="Appearance" path="/settings/theme" description="Select your preferred visual interface and contrast mode" />

        {OPTIONS.map((option) => {
          const active = theme === option.key;
          return (
            <Pressable
              key={option.key}
              onPress={() => setTheme(option.key)}
              className={`rounded-2xl border p-4 ${
                active ? 'border-brand bg-[#FFF0EB] dark:bg-[#25282c]' : 'border-[#e5e5ea] bg-white dark:border-[#35383c] dark:bg-[#1f2225]'
              }`}
              style={
                active
                  ? { shadowColor: colors.brand, shadowOpacity: 0.2, shadowOffset: { width: 0, height: 4 }, shadowRadius: 12, elevation: 3 }
                  : undefined
              }
            >
              <View className="mb-3 flex-row items-center justify-between">
                <View className="h-9 w-9 items-center justify-center rounded-xl bg-brand">
                  <option.icon size={18} color="#fff" />
                </View>
                {active ? (
                  <View className="flex-row items-center gap-1">
                    <CheckCircle2 size={18} color={colors.brand} />
                    <Text className="text-xs font-black text-brand">Active</Text>
                  </View>
                ) : (
                  <View className="h-5 w-5 rounded-full border-2 border-[#e5e5ea] dark:border-[#484b50]" />
                )}
              </View>
              <Text className="text-sm font-black text-ink dark:text-ink-dark">{option.label}</Text>
              <Text className="mt-1 text-xs leading-relaxed text-[#8E8E93] dark:text-[#8e9095]">{option.description}</Text>
              <View className="mt-4 flex-row items-center gap-1.5 border-t border-[#FFD8CC] pt-3 dark:border-[#35383c]">
                <View className="h-2 w-2 rounded-full bg-brand" />
                <Text className="text-[10px] font-bold text-brand">{option.accent}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}
