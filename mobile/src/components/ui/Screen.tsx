import type { PropsWithChildren } from 'react';
import { View, type ViewProps } from 'react-native';

export function Screen({ children, className, ...rest }: PropsWithChildren<ViewProps>) {
  return (
    <View className={`flex-1 bg-surface dark:bg-surface-dark ${className ?? ''}`} {...rest}>
      {children}
    </View>
  );
}
