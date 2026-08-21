import type { LucideIcon } from 'lucide-react-native';
import type { PropsWithChildren } from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps {
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  className?: string;
}

const VARIANT_STYLES: Record<Variant, { container: string; text: string; iconColor: string }> = {
  primary: { container: 'bg-brand active:bg-brand-dark', text: 'text-white', iconColor: '#fff' },
  secondary: {
    container: 'bg-black/5 dark:bg-white/10 active:bg-black/10 dark:active:bg-white/20',
    text: 'text-ink dark:text-ink-dark',
    iconColor: '#2C2C2E',
  },
  danger: { container: 'bg-red-600 active:bg-red-700', text: 'text-white', iconColor: '#fff' },
  ghost: { container: 'bg-transparent', text: 'text-brand', iconColor: '#FF5500' },
};

export function Button({
  children,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  icon: Icon,
  className,
}: PropsWithChildren<ButtonProps>) {
  const styles = VARIANT_STYLES[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`flex-row items-center justify-center gap-2 rounded-2xl px-5 py-3.5 ${styles.container} ${isDisabled ? 'opacity-50' : ''} ${className ?? ''}`}
    >
      {loading ? (
        <ActivityIndicator size="small" color={styles.iconColor} />
      ) : (
        <>
          {Icon ? <Icon size={18} color={styles.iconColor} /> : null}
          <Text className={`text-base font-semibold ${styles.text}`}>{children}</Text>
        </>
      )}
    </Pressable>
  );
}
