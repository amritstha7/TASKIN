import { forwardRef } from 'react';
import { Text, TextInput, type TextInputProps, View } from 'react-native';

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string | null;
}

export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  { label, error, className, style, ...rest },
  ref
) {
  return (
    <View className="gap-1.5">
      {label ? <Text className="text-xs font-bold text-ink dark:text-ink-dark">{label}</Text> : null}
      <TextInput
        ref={ref}
        placeholderTextColor="#9a9a9e"
        className={`min-h-[44px] rounded-xl border border-[#e5e5ea] bg-white px-4 py-2.5 text-sm text-ink dark:border-[#5d3f3c] dark:bg-[#25282c] dark:text-ink-dark ${error ? 'border-red-500' : ''} ${className ?? ''}`}
        {...rest}
      />
      {error ? <Text className="text-xs text-red-500">{error}</Text> : null}
    </View>
  );
});
