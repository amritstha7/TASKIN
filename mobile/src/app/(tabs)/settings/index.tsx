import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  ExternalLink,
  Languages,
  type LucideIcon,
  LogOut,
  Palette,
  Pencil,
  SlidersHorizontal,
  Store,
} from 'lucide-react-native';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useBranch } from '@/hooks/use-branch';
import { useAuth } from '@/providers/auth-provider';
import { useSettings } from '@/providers/settings-provider';
import { colors } from '@/theme/colors';

const THEME_LABEL: Record<string, string> = { auto: 'Auto', light: 'Light', dark: 'Dark' };
const CALENDAR_LABEL: Record<string, string> = { ad: 'AD', bs: 'BS', dual: 'Dual' };

interface MenuItem {
  href: '/(tabs)/settings/theme' | '/(tabs)/settings/calendar-view' | '/(tabs)/settings/language' | '/(tabs)/settings/notifications' | '/(tabs)/settings/diagnostics';
  icon: LucideIcon;
  title: string;
  description: string;
  badge: string;
  badgeType: 'primary' | 'success';
}

export default function SettingsIndexScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile, theme, calendarMode, language } = useSettings();
  const { branchName } = useBranch();
  const { signOut } = useAuth();

  const items: MenuItem[] = [
    { href: '/(tabs)/settings/theme', icon: Palette, title: 'Appearance', description: 'Light, Dark, or Auto system appearance', badge: THEME_LABEL[theme], badgeType: 'primary' },
    { href: '/(tabs)/settings/calendar-view', icon: CalendarDays, title: 'Calendar View Mode', description: 'English (AD), Nepali Bikram Sambat (BS), or Dual View', badge: CALENDAR_LABEL[calendarMode], badgeType: 'primary' },
    { href: '/(tabs)/settings/language', icon: Languages, title: 'Language Preference', description: 'Multi-lingual UI translation and localization', badge: language, badgeType: 'primary' },
    { href: '/(tabs)/settings/notifications', icon: Bell, title: 'Notifications & Sound', description: 'Push alerts, daily summaries, audio feedback, and haptics', badge: '', badgeType: 'primary' },
    { href: '/(tabs)/settings/diagnostics', icon: SlidersHorizontal, title: 'System & Diagnostics', description: 'Shift backups, cache clearing, and data sync status', badge: 'Online', badgeType: 'success' },
  ];

  return (
    <ScrollView className="flex-1 bg-surface dark:bg-surface-dark" contentContainerClassName="gap-5 p-4 pb-10" style={{ paddingTop: insets.top + 8 }}>
      <View
        className="overflow-hidden rounded-2xl border border-[#FFD8CC]/80 dark:border-[#5d3f3c]"
        style={{ shadowColor: '#000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 4 }, shadowRadius: 12, elevation: 3 }}
      >
        <LinearGradient colors={[colors.settingsHeroFrom, colors.settingsHeroVia, colors.settingsHeroTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="p-5">
          <View className="items-center gap-3">
            <View>
              {profile?.avatar_url ? (
                <Image source={{ uri: profile.avatar_url }} className="h-20 w-20 rounded-2xl" style={{ borderWidth: 4, borderColor: 'rgba(255,255,255,0.3)' }} />
              ) : (
                <View className="h-20 w-20 items-center justify-center rounded-2xl bg-white/20" style={{ borderWidth: 4, borderColor: 'rgba(255,255,255,0.3)' }}>
                  <Text className="text-2xl font-black text-white">{(profile?.name ?? '?').slice(0, 1).toUpperCase()}</Text>
                </View>
              )}
              <View className="absolute -bottom-1 -right-1 h-5 w-5 items-center justify-center rounded-full bg-[#008259]" style={{ borderWidth: 2, borderColor: '#fff' }}>
                <Check size={12} color="#fff" />
              </View>
            </View>
            <View className="items-center gap-0.5">
              <View className="flex-row items-center gap-2">
                <Text className="text-xl font-black tracking-tight text-white">{profile?.name}</Text>
              </View>
              <Text className="text-xs font-medium text-white/90">{profile?.role}</Text>
              <View className="mt-1 flex-row items-center gap-2">
                <View className="flex-row items-center gap-1">
                  <Store size={13} color="rgba(255,255,255,0.8)" />
                  <Text className="text-xs text-white/80">{branchName}</Text>
                </View>
                {profile?.joined_date ? <Text className="text-xs text-white/80">· Joined {new Date(profile.joined_date).toLocaleDateString()}</Text> : null}
              </View>
            </View>
            <Pressable onPress={() => router.push('/modals/edit-profile')} className="mt-1 min-h-[40px] flex-row items-center gap-1.5 rounded-xl bg-white px-4 py-2 shadow-md">
              <Pencil size={16} color={colors.brand} />
              <Text className="text-xs font-bold text-brand">Edit Profile</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </View>

      <View className="overflow-hidden rounded-2xl border border-[#e5e5ea] bg-white dark:border-[#35383c] dark:bg-surface-dark">
        {items.map((item, index) => (
          <Pressable
            key={item.href}
            onPress={() => router.push(item.href)}
            className={`flex-row items-center justify-between gap-3 p-4 ${index === items.length - 1 ? '' : 'border-b border-[#e5e5ea] dark:border-[#35383c]'}`}
          >
            <View className="min-w-0 flex-1 flex-row items-center gap-3.5">
              <View className="h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0EB] dark:bg-[#35383c]">
                <item.icon size={20} color={colors.brand} />
              </View>
              <View className="min-w-0 flex-1">
                <Text className="text-sm font-black text-ink dark:text-ink-dark" numberOfLines={1}>
                  {item.title}
                </Text>
                <Text className="text-[11px] text-[#8E8E93] dark:text-[#8e9095]" numberOfLines={1}>
                  {item.description}
                </Text>
              </View>
            </View>
            <View className="shrink-0 flex-row items-center gap-2.5">
              {item.badge ? (
                item.badgeType === 'success' ? (
                  <View className="flex-row items-center gap-1 rounded-full border border-[#a3f3bf] bg-[#e1ffec] px-2.5 py-1">
                    <View className="h-1.5 w-1.5 rounded-full bg-[#008259]" />
                    <Text className="text-xs font-bold text-[#008259]">{item.badge}</Text>
                  </View>
                ) : (
                  <View className="rounded-full border border-[#FFD8CC] bg-[#FFF0EB] px-2.5 py-1 dark:border-[#5d3f3c] dark:bg-[#2c2f33]">
                    <Text className="text-xs font-bold text-brand">{item.badge}</Text>
                  </View>
                )
              ) : null}
              <ChevronRight size={20} color={colors.neutralTextLight} />
            </View>
          </Pressable>
        ))}
      </View>

      <View className="gap-2 rounded-2xl border border-[#e5e5ea] bg-white p-4 dark:border-[#35383c] dark:bg-surface-dark">
        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-[#8E8E93] dark:text-[#8e9095]">App Version</Text>
          <View className="rounded-md border border-[#e5e5ea] bg-[#F7F7F8] px-2 py-0.5 dark:border-[#4d2d2a] dark:bg-[#35383c]">
            <Text className="text-[11px] font-mono text-[#8E8E93] dark:text-[#8e9095]">v1.0.0-mobile</Text>
          </View>
        </View>
        <View className="mt-1 flex-row items-center justify-between border-t border-[#e5e5ea] pt-3 dark:border-[#35383c]">
          <View className="flex-row items-center gap-1">
            <Text className="text-xs font-bold text-brand">Terms of Service</Text>
            <ExternalLink size={12} color={colors.brand} />
          </View>
          <View className="flex-row items-center gap-1">
            <Text className="text-xs font-bold text-brand">Privacy Policy</Text>
            <ExternalLink size={12} color={colors.brand} />
          </View>
        </View>
      </View>

      <Pressable
        onPress={() => void signOut()}
        className="flex-row items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10"
      >
        <LogOut size={16} color="#dc2626" />
        <Text className="text-sm font-semibold text-red-600">Logout Shift</Text>
      </Pressable>
    </ScrollView>
  );
}
