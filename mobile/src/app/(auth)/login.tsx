import { Link, useRouter } from 'expo-router';
import { LogIn } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/BrandMark';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { useAuth } from '@/providers/auth-provider';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setError(null);
    setLoading(true);
    const { error: signInError } = await signIn(email, password);
    setLoading(false);
    if (signInError) setError(signInError);
    else router.replace('/(tabs)/dashboard');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-surface dark:bg-surface-dark">
      <ScrollView
        contentContainerClassName="flex-1 justify-center px-6 py-12"
        contentContainerStyle={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-10 gap-3">
          <BrandMark size={56} />
          <View className="gap-1">
            <Text className="text-3xl font-black tracking-tight text-ink dark:text-ink-dark">TASKN</Text>
            <Text className="text-base text-ink/60 dark:text-ink-dark/60">Retail Store Operations & Task Execution</Text>
          </View>
        </View>

        <View className="gap-4">
          <TextField
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            placeholder="you@store.com"
          />
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            placeholder="••••••••"
          />

          {error ? <Text className="text-sm text-red-500">{error}</Text> : null}

          <Button onPress={handleSubmit} loading={loading} icon={LogIn}>
            Log In
          </Button>

          <Link href="/(auth)/reset-password" className="self-center py-2 text-sm font-medium text-brand">
            Forgot your password?
          </Link>
        </View>

        <View className="mt-10 flex-row justify-center gap-1.5">
          <Text className="text-sm text-ink/60 dark:text-ink-dark/60">New to this store?</Text>
          <Link href="/(auth)/signup" className="text-sm font-semibold text-brand">
            Create an account
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
