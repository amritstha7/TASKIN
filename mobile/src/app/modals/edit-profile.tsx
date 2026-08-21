import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Camera, CircleUserRound, LogOut, X } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { BUCKETS, getPublicUrl, uploadImage } from '@/lib/storage';
import { colors } from '@/theme/colors';
import { useAuth } from '@/providers/auth-provider';
import { useSettings } from '@/providers/settings-provider';
import { useToast } from '@/providers/toast-provider';

export default function EditProfileModal() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { profile, updateProfile } = useSettings();
  const { showToast } = useToast();

  const [name, setName] = useState(profile?.name ?? '');
  const [role, setRole] = useState(profile?.role ?? '');
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(profile?.avatar_url ?? null);
  const [avatarChanged, setAvatarChanged] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.9, allowsEditing: true, aspect: [1, 1] });
    if (result.canceled || !result.assets[0] || !user) return;
    setUploadingAvatar(true);
    try {
      const path = `${user.id}/avatar.jpg`;
      await uploadImage(BUCKETS.avatars, path, result.assets[0].uri, 400);
      // Cache-bust: the storage path is stable, so the public URL alone won't
      // change after replacing the file — force reload with a version param.
      setAvatarPreviewUrl(`${getPublicUrl(BUCKETS.avatars, path)}?v=${Date.now()}`);
      setAvatarChanged(true);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const confirmSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          void signOut().then(() => router.replace('/(auth)/login'));
        },
      },
    ]);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const resolvedAvatarUrl = avatarChanged ? avatarPreviewUrl : (profile?.avatar_url ?? null);
      await updateProfile({ name: name.trim(), role: role.trim() || 'Store Associate', avatar_url: resolvedAvatarUrl });
      showToast('Associate profile updated!');
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 justify-center bg-black/60 p-3">
      <View className="max-h-[92%] overflow-hidden rounded-2xl border border-[#FFD8CC] bg-white dark:border-[#5d3f3c] dark:bg-surface-dark">
        <View className="flex-row items-center justify-between border-b border-[#e5e5ea] bg-[#F7F7F8] p-4 dark:border-[#35383c] dark:bg-[#26282b]">
          <View className="flex-row items-center gap-2.5">
            <View className="h-8 w-8 items-center justify-center rounded-lg bg-[#FFF0EB] dark:bg-[#35383c]">
              <CircleUserRound size={20} color={colors.brand} />
            </View>
            <View>
              <Text className="text-sm font-black text-ink dark:text-ink-dark">Edit Profile</Text>
              <Text className="text-[11px] text-[#8E8E93] dark:text-[#8e9095]">Update your associate details</Text>
            </View>
          </View>
          <Pressable onPress={() => router.back()} hitSlop={8} className="rounded-lg p-1.5">
            <X size={20} color={colors.neutralTextLight} />
          </Pressable>
        </View>

        <ScrollView contentContainerClassName="gap-4 p-4">
          <View className="items-center gap-3">
            <Pressable onPress={pickAvatar} className="relative">
              <View
                className="h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#e5e5ea] dark:bg-[#35383c]"
                style={{ borderWidth: 2, borderColor: colors.brand }}
              >
                {uploadingAvatar ? (
                  <ActivityIndicator color={colors.brand} />
                ) : avatarPreviewUrl ? (
                  <Image source={{ uri: avatarPreviewUrl }} className="h-full w-full" />
                ) : (
                  <Text className="text-2xl font-bold text-brand">{name.slice(0, 1).toUpperCase() || '?'}</Text>
                )}
              </View>
              <View
                className="absolute bottom-0 right-0 h-7 w-7 items-center justify-center rounded-full bg-brand"
                style={{ borderWidth: 2, borderColor: '#fff' }}
              >
                <Camera size={14} color="#fff" />
              </View>
            </Pressable>
            <Text className="text-[11px] font-bold text-[#8E8E93] dark:text-[#8e9095]">Tap to change photo</Text>
          </View>

          <TextField label="Full Name *" value={name} onChangeText={setName} placeholder="Jane Smith" />
          <TextField label="Email Address" value={user?.email ?? ''} editable={false} className="opacity-60" />
          <TextField label="Role / Designation" value={role} onChangeText={setRole} placeholder="Store Operations Lead" />

          {error ? <Text className="text-xs font-bold text-red-500">{error}</Text> : null}

          <Pressable
            onPress={confirmSignOut}
            className="flex-row items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-3.5 dark:border-red-500/20 dark:bg-red-500/10"
          >
            <LogOut size={16} color="#dc2626" />
            <Text className="text-sm font-semibold text-red-600">Sign Out</Text>
          </Pressable>
        </ScrollView>

        <View className="flex-row items-center justify-end gap-2.5 border-t border-[#e5e5ea] bg-[#F7F7F8] p-4 dark:border-[#35383c] dark:bg-[#26282b]">
          <Pressable onPress={() => router.back()} className="rounded-xl border border-[#e5e5ea] px-4 py-2.5 dark:border-[#35383c]">
            <Text className="text-xs font-bold text-ink dark:text-ink-dark">Cancel</Text>
          </Pressable>
          <Button onPress={handleSave} loading={saving} className="px-5 py-2.5">
            Save Changes
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
