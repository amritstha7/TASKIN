import { LinearGradient } from 'expo-linear-gradient';
import type { LucideIcon } from 'lucide-react-native';
import { Text, View } from 'react-native';

interface GradientBannerProps {
  icon: LucideIcon;
  title: string;
  count?: number;
  description: string;
  gradientColors: [string, string, ...string[]];
  countTextColor: string;
  shadowColor: string;
}

export function GradientBanner({ icon: Icon, title, count, description, gradientColors, countTextColor, shadowColor }: GradientBannerProps) {
  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        borderRadius: 16,
        padding: 18,
        shadowColor,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 14,
        elevation: 6,
      }}
    >
      <View className="flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-xl border border-white/30 bg-white/20">
          <Icon size={20} color="#fff" />
        </View>
        <View className="flex-1 gap-0.5">
          <View className="flex-row items-center gap-2">
            <Text className="text-xl font-black tracking-tight text-white">{title}</Text>
            {count !== undefined ? (
              <View className="rounded-full bg-white px-2.5 py-0.5">
                <Text className="text-xs font-black" style={{ color: countTextColor }}>
                  {count}
                </Text>
              </View>
            ) : null}
          </View>
          <Text className="text-xs font-medium text-white/90">{description}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}
