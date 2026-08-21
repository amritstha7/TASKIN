import { Text, View } from 'react-native';

type Tone = 'urgent' | 'high' | 'medium' | 'low' | 'success' | 'neutral' | 'info';

const TONE_STYLES: Record<Tone, string> = {
  urgent: 'bg-red-100 dark:bg-red-500/20',
  high: 'bg-orange-100 dark:bg-orange-500/20',
  medium: 'bg-amber-100 dark:bg-amber-500/20',
  low: 'bg-blue-100 dark:bg-blue-500/20',
  success: 'bg-emerald-100 dark:bg-emerald-500/20',
  neutral: 'bg-black/5 dark:bg-white/10',
  info: 'bg-brand/10 dark:bg-brand/20',
};

const TONE_TEXT: Record<Tone, string> = {
  urgent: 'text-red-700 dark:text-red-300',
  high: 'text-orange-700 dark:text-orange-300',
  medium: 'text-amber-700 dark:text-amber-300',
  low: 'text-blue-700 dark:text-blue-300',
  success: 'text-emerald-700 dark:text-emerald-300',
  neutral: 'text-ink/70 dark:text-ink-dark/70',
  info: 'text-brand',
};

export function Chip({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  return (
    <View className={`self-start rounded-full px-2.5 py-1 ${TONE_STYLES[tone]}`}>
      <Text className={`text-xs font-semibold ${TONE_TEXT[tone]}`}>{label}</Text>
    </View>
  );
}

export function priorityTone(priority: string): Tone {
  switch (priority) {
    case 'urgent':
      return 'urgent';
    case 'high':
      return 'high';
    case 'medium':
      return 'medium';
    default:
      return 'low';
  }
}
