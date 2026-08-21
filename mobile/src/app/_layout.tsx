import '../global.css';

import * as Linking from 'expo-linking';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { type PropsWithChildren, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { applyRecoverySessionFromUrl } from '@/lib/auth-deep-link';
import { configureNotifications } from '@/lib/notifications';
import { AuthProvider, useAuth } from '@/providers/auth-provider';
import { QueryProvider } from '@/providers/query-provider';
import { SettingsProvider } from '@/providers/settings-provider';
import { ToastProvider } from '@/providers/toast-provider';

SplashScreen.preventAutoHideAsync();

function AppReadyGate({ children }: PropsWithChildren) {
  const { isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) void SplashScreen.hideAsync();
  }, [isLoading]);

  useEffect(() => {
    void configureNotifications();
  }, []);

  useEffect(() => {
    const handleUrl = async (url: string) => {
      const applied = await applyRecoverySessionFromUrl(url);
      if (applied) router.push('/update-password');
    };
    Linking.getInitialURL().then((url) => {
      if (url) void handleUrl(url);
    });
    const subscription = Linking.addEventListener('url', (event) => {
      void handleUrl(event.url);
    });
    return () => subscription.remove();
  }, [router]);

  if (isLoading) return null;
  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryProvider>
          <AuthProvider>
            <SettingsProvider>
              <ToastProvider>
                <AppReadyGate>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="modals/add-task" options={{ presentation: 'modal' }} />
                    <Stack.Screen name="modals/edit-profile" options={{ presentation: 'modal' }} />
                    <Stack.Screen name="modals/export-report" options={{ presentation: 'modal' }} />
                    <Stack.Screen name="modals/legend" options={{ presentation: 'modal' }} />
                    <Stack.Screen name="modals/notifications" options={{ presentation: 'modal' }} />
                    <Stack.Screen name="modals/photo-proof/[taskId]" options={{ presentation: 'modal' }} />
                    <Stack.Screen name="modals/photo-preview" options={{ presentation: 'modal' }} />
                    <Stack.Screen name="modals/attachment/[commId]" options={{ presentation: 'modal' }} />
                  </Stack>
                </AppReadyGate>
              </ToastProvider>
            </SettingsProvider>
          </AuthProvider>
        </QueryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
