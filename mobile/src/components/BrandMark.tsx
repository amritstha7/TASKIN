import { Text, View } from 'react-native';

/** App logo mark: a bold "T" on a solid dark-orange rounded square. */
export function BrandMark({ size = 36 }: { size?: number }) {
  return (
    <View
      style={{ height: size, width: size, borderRadius: size * 0.28, backgroundColor: '#E04800' }}
      className="items-center justify-center"
    >
      <Text style={{ fontSize: size * 0.52, lineHeight: size * 0.6 }} className="font-black text-white">
        T
      </Text>
    </View>
  );
}
