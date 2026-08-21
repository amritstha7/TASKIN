import React, { useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { AppProvider } from '../context/AppContext';
import { LoginScreen } from '../screens/LoginScreen';
import { SignupScreen } from '../screens/SignupScreen';
import { UpdatePasswordScreen } from '../screens/UpdatePasswordScreen';
import { BrandMark } from './BrandMark';
import { MainLayout } from './MainLayout';

export const AuthGate: React.FC = () => {
  const { session, isLoading, isPasswordRecovery } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');

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
    return mode === 'login' ? (
      <LoginScreen onSwitchToSignup={() => setMode('signup')} />
    ) : (
      <SignupScreen onSwitchToLogin={() => setMode('login')} />
    );
  }

  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};
