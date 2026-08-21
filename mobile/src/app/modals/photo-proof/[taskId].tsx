import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Camera, CheckCircle2, Image as ImageIcon, X } from 'lucide-react-native';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { useFeedback } from '@/hooks/use-feedback';
import { useTasks } from '@/hooks/use-tasks';
import { colors } from '@/theme/colors';
import { useToast } from '@/providers/toast-provider';

export default function TaskPhotoProofModal() {
  const router = useRouter();
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const { showToast } = useToast();
  const { celebrate } = useFeedback();
  const { tasks, completeWithPhoto, attachPhoto } = useTasks();

  const task = tasks.find((item) => item.id === taskId);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [saving, setSaving] = useState(false);

  if (!task) {
    return (
      <View className="flex-1 items-center justify-center bg-surface p-6 dark:bg-surface-dark">
        <Text className="text-center text-sm text-ink/60 dark:text-ink-dark/60">Task not found.</Text>
        <Button variant="secondary" onPress={() => router.back()} className="mt-4">
          Cancel
        </Button>
      </View>
    );
  }

  const pickImage = async (source: 'camera' | 'library') => {
    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.9 })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.9 });
    if (!result.canceled && result.assets[0]) setImageUri(result.assets[0].uri);
  };

  const handleSubmit = async () => {
    if (!imageUri) return;
    setSaving(true);
    try {
      if (task.completed) {
        await attachPhoto({ task, localUri: imageUri, caption });
        showToast('Photo proof attached to task!');
      } else {
        await completeWithPhoto({ task, localUri: imageUri, caption });
        celebrate();
        showToast('Task marked complete with photo proof!');
      }
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 justify-center bg-black/60 p-3">
      <View className="max-h-[92%] overflow-hidden rounded-2xl border border-[#FFD8CC] bg-white dark:border-[#5d3f3c] dark:bg-surface-dark">
        <View className="flex-row items-center justify-between border-b border-[#e5e5ea] bg-[#F7F7F8] p-4 dark:border-[#35383c] dark:bg-[#26282b]">
          <View className="flex-1 flex-row items-center gap-2.5">
            <View className="h-8 w-8 items-center justify-center rounded-lg bg-[#FFF0EB] dark:bg-[#35383c]">
              <Camera size={18} color={colors.brand} />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-black text-ink dark:text-ink-dark" numberOfLines={1}>
                {task.completed ? 'Attach Photo Proof' : 'Complete with Photo Proof'}
              </Text>
              <Text className="text-[11px] text-[#8E8E93] dark:text-[#8e9095]" numberOfLines={1}>
                {task.title}
              </Text>
            </View>
          </View>
          <Pressable onPress={() => router.back()} hitSlop={8} className="rounded-lg p-1.5">
            <X size={20} color={colors.neutralTextLight} />
          </Pressable>
        </View>

        <ScrollView contentContainerClassName="gap-4 p-4">
          <View className="flex-row items-start gap-2.5 rounded-xl border border-[#FFD8CC] bg-[#FFF9F6] p-3 dark:border-[#5d3f3c] dark:bg-[#25282c]">
            <CheckCircle2 size={18} color={colors.brand} />
            <View className="flex-1">
              <Text className="text-xs font-bold text-ink dark:text-ink-dark">{task.title}</Text>
              <Text className="mt-0.5 text-[11px] text-[#8E8E93] dark:text-[#8e9095]">
                Category: <Text className="font-semibold">{task.category}</Text> · Due: {task.due_date}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => pickImage('camera')}
            className="aspect-video max-h-56 items-center justify-center overflow-hidden rounded-xl border border-[#e5e5ea] bg-black/5 dark:border-[#35383c] dark:bg-white/5"
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} className="h-full w-full" />
            ) : (
              <View className="items-center gap-2 p-5">
                <View className="h-12 w-12 items-center justify-center rounded-full bg-[#FFF0EB] dark:bg-[#35383c]">
                  <Camera size={24} color={colors.brand} />
                </View>
                <Text className="text-xs font-bold text-ink dark:text-ink-dark">Tap to capture a photo</Text>
                <Text className="text-center text-[11px] text-[#8E8E93] dark:text-[#8e9095]">Use the camera or pick from your library below</Text>
              </View>
            )}
          </Pressable>

          <View className="flex-row gap-2">
            <Pressable
              onPress={() => pickImage('camera')}
              className="flex-1 flex-row items-center justify-center gap-1.5 rounded-xl bg-brand px-3.5 py-2"
            >
              <Camera size={16} color="#fff" />
              <Text className="text-xs font-bold text-white">Take Photo</Text>
            </Pressable>
            <Pressable
              onPress={() => pickImage('library')}
              className="flex-1 flex-row items-center justify-center gap-1.5 rounded-xl border border-[#e5e5ea] bg-white px-3.5 py-2 dark:border-[#35383c] dark:bg-surface-dark"
            >
              <ImageIcon size={16} color={colors.ink} />
              <Text className="text-xs font-bold text-ink dark:text-ink-dark">Choose Photo</Text>
            </Pressable>
          </View>

          <View className="gap-1">
            <Text className="text-xs font-bold text-ink dark:text-ink-dark">Caption</Text>
            <TextInput
              value={caption}
              onChangeText={setCaption}
              placeholder="Add a caption (optional)"
              placeholderTextColor="#9a9a9e"
              multiline
              numberOfLines={2}
              textAlignVertical="top"
              className="min-h-16 rounded-xl border border-[#e5e5ea] bg-white p-2.5 text-xs text-ink dark:border-[#35383c] dark:bg-[#25282c] dark:text-ink-dark"
            />
          </View>
        </ScrollView>

        <View className="flex-row items-center justify-between gap-2 border-t border-[#e5e5ea] bg-[#F7F7F8] p-4 dark:border-[#35383c] dark:bg-[#26282b]">
          <Pressable onPress={() => router.back()} className="rounded-xl border border-[#e5e5ea] px-4 py-2.5 dark:border-[#35383c]">
            <Text className="text-xs font-bold text-ink dark:text-ink-dark">Cancel</Text>
          </Pressable>
          <Button onPress={handleSubmit} disabled={!imageUri} loading={saving} icon={CheckCircle2} className="flex-1">
            {task.completed ? 'Attach Photo' : 'Complete Task'}
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
