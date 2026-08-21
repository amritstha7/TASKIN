import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowRight, ChevronRight, Plus } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

interface GradientRowProps {
  href: '/tasks/urgent' | '/tasks/store' | '/communications';
  title: string;
  count: number;
  gradientColors: [string, string, ...string[]];
  shadowColor: string;
  countTextColor: string;
}

function GradientRow({ href, title, count, gradientColors, shadowColor, countTextColor }: GradientRowProps) {
  const router = useRouter();
  return (
    <Pressable onPress={() => router.push(href)}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          minHeight: 58,
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 14,
          shadowColor,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.28,
          shadowRadius: 12,
          elevation: 5,
        }}
        className="flex-row items-center justify-between"
      >
        <View className="flex-row items-center gap-2">
          <ArrowRight size={22} color="rgba(255,255,255,0.9)" />
          {count > 0 ? (
            <View className="rounded-full border border-white/40 bg-white/25 px-3.5 py-0.5">
              <Text className="text-xs font-black text-white">{count}</Text>
            </View>
          ) : null}
          <Text className="text-base font-black tracking-tight text-white">{title}</Text>
        </View>
        <ChevronRight size={20} color="rgba(255,255,255,0.6)" />
      </LinearGradient>
    </Pressable>
  );
}

export function DashboardNavCards({
  urgentCount,
  tasksCount,
  commsCount,
  notesCount,
}: {
  urgentCount: number;
  tasksCount: number;
  commsCount: number;
  notesCount: number;
}) {
  const router = useRouter();

  return (
    <View className="gap-2.5">
      <GradientRow
        href="/tasks/urgent"
        title="Urgent Actions"
        count={urgentCount}
        gradientColors={[colors.urgentFrom, colors.urgentVia, colors.urgentTo]}
        shadowColor={colors.urgentVia}
        countTextColor={colors.urgentFrom}
      />
      <GradientRow
        href="/tasks/store"
        title="Tasks"
        count={tasksCount}
        gradientColors={[colors.brand, colors.brandAlt, colors.brandDark]}
        shadowColor={colors.brand}
        countTextColor={colors.brand}
      />
      <GradientRow
        href="/communications"
        title="Communications"
        count={commsCount}
        gradientColors={[colors.brand, colors.brandAlt, colors.brandDark]}
        shadowColor={colors.brand}
        countTextColor={colors.brand}
      />

      <Pressable onPress={() => router.push('/notes')}>
        <View
          className="min-h-[58px] flex-row items-center justify-between rounded-2xl px-4 py-3.5 shadow-md"
          style={{ backgroundColor: colors.notesCardBg, borderWidth: 1, borderColor: colors.notesCardBorder }}
        >
          <View className="flex-row items-center gap-2">
            <ArrowRight size={22} color={colors.notesIcon} />
            {notesCount > 0 ? (
              <View className="rounded-full border px-3.5 py-0.5" style={{ backgroundColor: colors.notesCardBorder, borderColor: '#484e5a' }}>
                <Text className="text-xs font-black text-white">{notesCount}</Text>
              </View>
            ) : null}
            <Text className="text-base font-black tracking-tight text-white">My Tasks & Notes</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Plus size={18} color="#fff" />
            <ChevronRight size={20} color="rgba(255,255,255,0.6)" />
          </View>
        </View>
      </Pressable>
    </View>
  );
}
