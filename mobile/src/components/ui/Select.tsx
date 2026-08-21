import { Check, ChevronDown, X } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';

interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface SelectProps<T extends string> {
  label: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  leadingIcon?: React.ReactNode;
}

export function Select<T extends string>({ label, value, options, onChange, leadingIcon }: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const selected = options.find((o) => o.value === value);

  return (
    <View className="gap-1.5">
      <Text className="text-xs font-bold text-ink dark:text-ink-dark">{label}</Text>
      <Pressable
        onPress={() => setOpen(true)}
        className="min-h-[44px] flex-row items-center justify-between rounded-xl border border-[#e5e5ea] bg-white px-4 py-2.5 dark:border-[#5d3f3c] dark:bg-[#25282c]"
      >
        <View className="flex-row items-center gap-2">
          {leadingIcon}
          <Text className="text-sm text-ink dark:text-ink-dark">{selected?.label ?? ''}</Text>
        </View>
        <ChevronDown size={18} color={colors.neutralTextLight} />
      </Pressable>

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <Pressable className="flex-1 justify-end bg-black/40" onPress={() => setOpen(false)}>
          <View style={{ paddingBottom: insets.bottom + 12 }} className="max-h-[70%] rounded-t-3xl bg-surface dark:bg-surface-dark">
            <View className="flex-row items-center justify-between border-b border-[#e5e5ea] p-4 dark:border-[#35383c]">
              <Text className="text-base font-bold text-ink dark:text-ink-dark">{label}</Text>
              <Pressable onPress={() => setOpen(false)} hitSlop={8}>
                <X size={20} color={colors.neutralTextLight} />
              </Pressable>
            </View>
            <FlatList
              data={options}
              keyExtractor={(o) => o.value}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                  className="flex-row items-center justify-between border-b border-[#e5e5ea] px-4 py-3.5 dark:border-[#2e3134]"
                >
                  <Text className="text-sm text-ink dark:text-ink-dark">{item.label}</Text>
                  {item.value === value ? <Check size={18} color={colors.brand} /> : null}
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
