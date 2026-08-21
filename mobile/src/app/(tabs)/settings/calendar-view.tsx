import { CheckCircle2 } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { SubPageHeader } from '@/components/ui/SubPageHeader';
import { useSettings } from '@/providers/settings-provider';
import { colors } from '@/theme/colors';
import type { CalendarMode } from '@/types/database';

export default function CalendarModeSettingsScreen() {
  const { calendarMode, setCalendarMode } = useSettings();

  const options: { key: CalendarMode; badge: string; label: string; description: string; example: string }[] = [
    { key: 'ad', badge: 'AD', label: 'English (AD)', description: 'Standard Gregorian calendar dates throughout the app.', example: 'Example: Aug 19, 2026' },
    { key: 'bs', badge: 'BS', label: 'Nepali (BS)', description: 'Bikram Sambat calendar dates throughout the app.', example: 'Example: २०८३ भाद्र ३ गते' },
    { key: 'dual', badge: 'AD+BS', label: 'Dual View', description: 'Show both AD and BS dates together everywhere.', example: 'Example: Aug 19 · भाद्र ३' },
  ];

  return (
    <Screen>
      <View className="gap-4 p-4">
        <SubPageHeader title="Calendar View" path="/settings/calendar-view" description="English (AD), Nepali Bikram Sambat (BS), or Dual View" />

        {options.map((option) => {
          const active = calendarMode === option.key;
          return (
            <Pressable
              key={option.key}
              onPress={() => setCalendarMode(option.key)}
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
                  <Text className="text-[10px] font-mono font-bold text-white">{option.badge}</Text>
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
              <View className="mt-4 border-t border-[#FFD8CC] pt-3 dark:border-[#35383c]">
                <Text className="text-[10px] font-bold text-brand">{option.example}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}
