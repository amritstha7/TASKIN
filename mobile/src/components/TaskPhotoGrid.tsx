import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { Image, Pressable, View } from 'react-native';

import type { PhotoUI } from '@/types/app';

export function TaskPhotoGrid({ photos, onRemove }: { photos: PhotoUI[]; onRemove?: (photo: PhotoUI) => void }) {
  const router = useRouter();
  if (photos.length === 0) return null;

  return (
    <View className="flex-row flex-wrap gap-2">
      {photos.map((photo) => (
        <Pressable
          key={photo.id}
          onPress={() =>
            router.push({
              pathname: '/modals/photo-preview',
              params: {
                url: photo.url ?? '',
                title: photo.name ?? 'Photo',
                caption: photo.caption ?? '',
                user: photo.uploadedByName,
                time: photo.uploadedAt,
              },
            })
          }
          className="h-16 w-16 overflow-hidden rounded-xl bg-black/5 dark:bg-white/10"
        >
          {photo.url ? <Image source={{ uri: photo.url }} className="h-full w-full" /> : null}
          {onRemove ? (
            <Pressable
              onPress={() => onRemove(photo)}
              hitSlop={8}
              className="absolute right-1 top-1 h-5 w-5 items-center justify-center rounded-full bg-black/60"
            >
              <X size={12} color="#fff" />
            </Pressable>
          ) : null}
        </Pressable>
      ))}
    </View>
  );
}
