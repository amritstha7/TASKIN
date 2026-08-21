import { Bell, CalendarClock, Volume2 } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Platform, Pressable, Switch, Text, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { SubPageHeader } from '@/components/ui/SubPageHeader';
import { useFeedback } from '@/hooks/use-feedback';
import { useSettings } from '@/providers/settings-provider';
import { colors } from '@/theme/colors';

function ToggleRow({
  icon: Icon,
  label,
  description,
  value,
  onChange,
  isLast,
}: {
  icon: LucideIcon;
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
  isLast?: boolean;
}) {
  return (
    <View className={`min-h-[56px] flex-row items-center gap-3.5 p-4 ${isLast ? '' : 'border-b border-[#e5e5ea] dark:border-[#35383c]'}`}>
      <View className="mt-0.5 h-9 w-9 items-center justify-center rounded-xl bg-[#FFF0EB] dark:bg-[#35383c]">
        <Icon size={18} color={colors.brand} />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-bold text-ink dark:text-ink-dark">{label}</Text>
        <Text className="mt-0.5 text-xs text-[#8E8E93] dark:text-[#8e9095]">{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#e5e5ea', true: colors.brand }}
        thumbColor={Platform.OS === 'android' ? '#fff' : undefined}
      />
    </View>
  );
}

export default function NotificationSettingsScreen() {
  const { profile, updateProfile } = useSettings();
  const { celebrate } = useFeedback();

  return (
    <Screen>
      <View className="gap-4 p-4">
        <SubPageHeader title="Notifications" path="/settings/notifications" description="Push alerts, daily summaries, audio feedback, and haptics" />

        <View className="overflow-hidden rounded-2xl border border-[#e5e5ea] bg-white dark:border-[#35383c] dark:bg-surface-dark">
          <ToggleRow
            icon={Bell}
            label="Push Notifications"
            description="Alerts for high-priority tasks & urgent compliance"
            value={profile?.push_notifications ?? true}
            onChange={(v) => void updateProfile({ push_notifications: v })}
          />
          <ToggleRow
            icon={CalendarClock}
            label="Daily Summary"
            description="End of shift handover report"
            value={profile?.daily_summary ?? true}
            onChange={(v) => void updateProfile({ daily_summary: v })}
          />
          <ToggleRow
            icon={Volume2}
            label="Sound & Haptic Feedback"
            description="Audio chime and tactile feedback on task completion"
            value={profile?.sound_vibration ?? true}
            onChange={(v) => void updateProfile({ sound_vibration: v })}
            isLast
          />
        </View>

        <Pressable
          onPress={celebrate}
          className="min-h-[40px] flex-row items-center justify-center gap-1.5 self-start rounded-xl border border-[#FFD8CC] bg-[#FFF0EB] px-3.5 py-2 dark:border-[#5d3f3c] dark:bg-[#35383c]"
        >
          <Volume2 size={18} color={colors.brand} />
          <Text className="text-xs font-bold text-brand">Test Sound</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
