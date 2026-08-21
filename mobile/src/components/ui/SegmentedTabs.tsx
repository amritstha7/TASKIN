import { Pressable, Text, View } from 'react-native';

interface SegmentedTabsProps<T extends string> {
  options: { key: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  activeClassName?: string;
}

export function SegmentedTabs<T extends string>({ options, value, onChange, activeClassName = 'bg-brand' }: SegmentedTabsProps<T>) {
  return (
    <View className="flex-row items-center gap-2 rounded-xl border border-[#e5e5ea] bg-white p-1.5 dark:border-[#35383c] dark:bg-surface-dark">
      {options.map((option) => {
        const active = option.key === value;
        return (
          <Pressable
            key={option.key}
            onPress={() => onChange(option.key)}
            className={`flex-1 items-center rounded-lg py-1.5 ${active ? activeClassName : ''}`}
          >
            <Text className={`text-xs font-bold ${active ? 'text-white' : 'text-[#8E8E93] dark:text-[#8e9095]'}`}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
