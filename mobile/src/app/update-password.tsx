import { useRouter } from 'expo-router';
import { KeyRound } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { useAuth } from '@/providers/auth-provider';

/** Reached only via the recovery deep link (see lib/auth-deep-link.ts) — the app already
 * exchanged the recovery token for a session by the time this screen renders. */
export default function UpdatePasswordScreen() {
  const { updatePassword, signOut } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setError(null);
    setLoading(true);
    const { error: updateError } = await updatePassword(password);
    setLoading(false);
    if (updateError) {
      setError(updateError);
      return;
    }
    router.replace('/(tabs)/dashboard');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-surface dark:bg-surface-dark">
      <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }} className="flex-1 justify-center px-6 py-12">
        <Text className="mb-1 text-2xl font-bold text-ink dark:text-ink-dark">Set a new password</Text>
        <Text className="mb-6 text-sm text-ink/60 dark:text-ink-dark/60">Choose a new password for your TASKN account.</Text>

        <View className="gap-4">
          <TextField label="New Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="At least 6 characters" />
          <TextField label="Confirm Password" value={confirm} onChangeText={setConfirm} secureTextEntry placeholder="Repeat password" />
          {error ? <Text className="text-sm text-red-500">{error}</Text> : null}
          <Button onPress={handleSubmit} loading={loading} icon={KeyRound}>
            Update Password
          </Button>
          <Button variant="ghost" onPress={() => void signOut().then(() => router.replace('/(auth)/login'))}>
            Cancel
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
