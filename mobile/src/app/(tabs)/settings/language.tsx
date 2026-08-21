import { CheckCircle2 } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { SubPageHeader } from '@/components/ui/SubPageHeader';
import type { LanguageKey } from '@/i18n/translations';
import { useSettings } from '@/providers/settings-provider';
import { colors } from '@/theme/colors';

const LANGUAGES: { key: LanguageKey; label: string; native: string; flag: string }[] = [
  { key: 'English', label: 'English', native: 'English (US)', flag: '🇺🇸' },
  { key: 'Nepali', label: 'Nepali', native: 'नेपाली', flag: '🇳🇵' },
  { key: 'Spanish', label: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { key: 'French', label: 'French', native: 'Français', flag: '🇫🇷' },
];

export default function LanguageSettingsScreen() {
  const { language, setLanguage } = useSettings();

  return (
    <Screen>
      <View className="gap-4 p-4">
        <SubPageHeader title="Language" path="/settings/language" description="Multi-lingual UI translation and localization" />

        {LANGUAGES.map((lang) => {
          const active = language === lang.key;
          return (
            <Pressable
              key={lang.key}
              onPress={() => setLanguage(lang.key)}
              className={`flex-row items-center justify-between rounded-2xl border p-4 ${
                active ? 'border-brand bg-[#FFF0EB] dark:bg-[#25282c]' : 'border-[#e5e5ea] bg-white dark:border-[#35383c] dark:bg-[#1f2225]'
              }`}
              style={
                active
                  ? { shadowColor: colors.brand, shadowOpacity: 0.18, shadowOffset: { width: 0, height: 4 }, shadowRadius: 12, elevation: 3 }
                  : undefined
              }
            >
              <View className="flex-row items-center gap-3.5">
                <Text className="text-3xl">{lang.flag}</Text>
                <View>
                  <Text className="text-sm font-black text-ink dark:text-ink-dark">{lang.label}</Text>
                  <Text className="mt-0.5 text-xs font-medium text-[#8E8E93] dark:text-[#8e9095]">{lang.native}</Text>
                </View>
              </View>
              {active ? (
                <CheckCircle2 size={20} color={colors.brand} />
              ) : (
                <View className="h-5 w-5 rounded-full border-2 border-[#e5e5ea] dark:border-[#484b50]" />
              )}
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}
