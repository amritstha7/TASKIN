import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { useProfile } from '@/hooks/use-profile';
import { type LanguageKey, translations, type Translations } from '@/i18n/translations';
import type { CalendarMode, ProfileRow, ThemePreference } from '@/types/database';

interface SettingsContextValue {
  profile: ProfileRow | undefined;
  isLoading: boolean;
  t: Translations;
  language: LanguageKey;
  isDarkMode: boolean;
  theme: ThemePreference;
  calendarMode: CalendarMode;
  branchId: string | undefined;
  setLanguage: (lang: LanguageKey) => void;
  setTheme: (theme: ThemePreference) => void;
  setCalendarMode: (mode: CalendarMode) => void;
  updateProfile: ReturnType<typeof useProfile>['updateProfile'];
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: PropsWithChildren) {
  const { profile, isLoading, updateProfile } = useProfile();
  const systemScheme = useColorScheme();
  const { setColorScheme } = useNativeWindColorScheme();

  const language = (profile?.language ?? 'English') as LanguageKey;
  const theme = profile?.theme ?? 'auto';
  const calendarMode = profile?.calendar_mode ?? 'dual';
  const t = translations[language] ?? translations.English;
  const isDarkMode = theme === 'dark' || (theme === 'auto' && systemScheme === 'dark');

  // Keep NativeWind's `dark:` variants in sync with the profile's theme
  // preference (which can override the OS setting), not just the OS itself.
  useEffect(() => {
    setColorScheme(theme === 'auto' ? 'system' : theme);
  }, [theme, setColorScheme]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      profile,
      isLoading,
      t,
      language,
      isDarkMode,
      theme,
      calendarMode,
      branchId: profile?.branch_id,
      setLanguage: (lang) => {
        void updateProfile({ language: lang });
      },
      setTheme: (nextTheme) => {
        void updateProfile({ theme: nextTheme });
      },
      setCalendarMode: (mode) => {
        void updateProfile({ calendar_mode: mode });
      },
      updateProfile,
    }),
    [profile, isLoading, t, language, isDarkMode, theme, calendarMode, updateProfile]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider');
  return ctx;
}
