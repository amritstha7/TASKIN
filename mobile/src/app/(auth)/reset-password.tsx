import { useRouter } from 'expo-router';
import { Mail } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { TextField } from '@/components/ui/TextField';
import { useAuth } from '@/providers/auth-provider';

export default function ResetPasswordScreen() {
  const { requestPasswordReset } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('Enter the email address on your account.');
      return;
    }
    setError(null);
    setLoading(true);
    const { error: resetError } = await requestPasswordReset(email);
    setLoading(false);
    if (resetError) setError(resetError);
    else setSent(true);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-surface dark:bg-surface-dark">
      <ScreenHeader title="Reset Password" onBack={() => router.back()} />
      <View className="flex-1 px-6 py-8">
        {sent ? (
          <View className="gap-2">
            <Text className="text-lg font-bold text-ink dark:text-ink-dark">Check your email</Text>
            <Text className="text-sm text-ink/60 dark:text-ink-dark/60">
              If an account exists for {email}, a password reset link is on its way. Open it on this device to set a new
              password.
            </Text>
          </View>
        ) : (
          <View className="gap-4">
            <Text className="text-sm text-ink/60 dark:text-ink-dark/60">
              Enter your email and we&apos;ll send you a link to reset your password.
            </Text>
            <TextField
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="you@store.com"
            />
            {error ? <Text className="text-sm text-red-500">{error}</Text> : null}
            <Button onPress={handleSubmit} loading={loading} icon={Mail}>
              Send Reset Link
            </Button>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
