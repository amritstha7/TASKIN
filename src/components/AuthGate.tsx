import React, { useEffect } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { useAuthRoute } from '../hooks/useAuthRoute';
import { AppProvider } from '../context/AppContext';
import { LoginScreen } from '../screens/LoginScreen';
import { SignupScreen } from '../screens/SignupScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { UpdatePasswordScreen } from '../screens/UpdatePasswordScreen';
import { BrandMark } from './BrandMark';
import { MainLayout } from './MainLayout';

export const AuthGate: React.FC = () => {
  const { session, isLoading, isPasswordRecovery } = useAuth();
  const { route, navigate } = useAuthRoute();

  // A password-recovery session always shows UpdatePasswordScreen, regardless
  // of the current path — but keep the URL itself in sync with that state.
  useEffect(() => {
    if (isPasswordRecovery && route !== '/reset-password') navigate('/reset-password');
  }, [isPasswordRecovery, route, navigate]);

  // Once signed in (and not mid password-recovery), drop the auth-page path
  // from the address bar — the main app itself isn't route-based.
  useEffect(() => {
    if (session && !isPasswordRecovery && window.location.pathname !== '/') {
      window.history.replaceState({}, '', '/');
    }
  }, [session, isPasswordRecovery]);

  if (isLoading) {
    return (
      <div className="bg-[#F7F7F8] dark:bg-[#191c1f] min-h-screen flex items-center justify-center">
        <BrandMark size={48} />
      </div>
    );
  }

  if (isPasswordRecovery) {
    return <UpdatePasswordScreen />;
  }

  if (!session) {
    if (route === '/signup') return <SignupScreen navigate={navigate} />;
    if (route === '/forgot-password') return <ForgotPasswordScreen navigate={navigate} />;
    return <LoginScreen navigate={navigate} />;
  }

  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};
