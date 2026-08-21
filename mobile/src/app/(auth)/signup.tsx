import { Link, useRouter } from 'expo-router';
import { UserPlus } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { useBranchSearch } from '@/hooks/use-branch-search';
import { useAuth } from '@/providers/auth-provider';

export default function SignupScreen() {
  const { signUp } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [branchName, setBranchName] = useState('');
  const [showBranchOptions, setShowBranchOptions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const { data: branchMatches } = useBranchSearch(branchName);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !password || !branchName.trim()) {
      setError('Fill in your name, email, password, and store/branch name.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError(null);
    setLoading(true);
    const { error: signUpError, needsEmailConfirmation } = await signUp({
      name,
      email,
      password,
      role,
      branchName,
    });
    setLoading(false);
    if (signUpError) {
      setError(signUpError);
      return;
    }
    if (needsEmailConfirmation) {
      setConfirmationSent(true);
    } else {
      router.replace('/(tabs)/dashboard');
    }
  };

  if (confirmationSent) {
    return (
      <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }} className="flex-1 items-center justify-center gap-3 bg-surface px-8 dark:bg-surface-dark">
        <Text className="text-center text-xl font-bold text-ink dark:text-ink-dark">Check your email</Text>
        <Text className="text-center text-sm text-ink/60 dark:text-ink-dark/60">
          We sent a confirmation link to {email}. Verify your address, then log in.
        </Text>
        <Button onPress={() => router.replace('/(auth)/login')} className="mt-4">
          Back to Log In
        </Button>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-surface dark:bg-surface-dark">
      <ScrollView
        contentContainerClassName="px-6 py-12"
        contentContainerStyle={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-8 gap-1">
          <Text className="text-2xl font-bold text-ink dark:text-ink-dark">Create your account</Text>
          <Text className="text-sm text-ink/60 dark:text-ink-dark/60">
            Join your store&apos;s shared TASKN workspace — teammates at the same branch see the same tasks.
          </Text>
        </View>

        <View className="gap-4">
          <TextField label="Full Name" value={name} onChangeText={setName} placeholder="Jane Smith" autoComplete="name" />
          <TextField
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            placeholder="you@store.com"
          />
          <TextField label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="At least 6 characters" />
          <TextField label="Role / Position (optional)" value={role} onChangeText={setRole} placeholder="Store Associate" />

          <View className="gap-1.5">
            <TextField
              label="Store / Branch Name"
              value={branchName}
              onChangeText={(v) => {
                setBranchName(v);
                setShowBranchOptions(true);
              }}
              onFocus={() => setShowBranchOptions(true)}
              placeholder="e.g. Branch #402 (Metro Central)"
            />
            {showBranchOptions && branchMatches && branchMatches.length > 0 ? (
              <View className="overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
                {branchMatches.map((branch) => (
                  <Pressable
                    key={branch.id}
                    onPress={() => {
                      setBranchName(branch.name);
                      setShowBranchOptions(false);
                    }}
                    className="border-b border-black/5 bg-white px-4 py-3 last:border-b-0 dark:border-white/5 dark:bg-white/5"
                  >
                    <Text className="text-sm text-ink dark:text-ink-dark">{branch.name}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
            <Text className="text-xs text-ink/50 dark:text-ink-dark/50">
              Matches an existing store exactly? Tap it above. Otherwise a new store workspace is created for you.
            </Text>
          </View>

          {error ? <Text className="text-sm text-red-500">{error}</Text> : null}

          <Button onPress={handleSubmit} loading={loading} icon={UserPlus}>
            Create Account
          </Button>
        </View>

        <View className="mt-10 flex-row justify-center gap-1.5">
          <Text className="text-sm text-ink/60 dark:text-ink-dark/60">Already have an account?</Text>
          <Link href="/(auth)/login" className="text-sm font-semibold text-brand">
            Log in
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
