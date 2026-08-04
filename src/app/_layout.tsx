import '../global.css';

import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';

import { AuthProvider } from '@/features/auth/auth.context';
import { SessionExpiredAlert } from '@/components/auth/session-expired-alert';
import { appToastConfig } from '@/components/ui/app-toast';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast
        config={appToastConfig}
        position="top"
        topOffset={12}
        visibilityTime={3000}
        autoHide
      />
      <SessionExpiredAlert />
    </AuthProvider>
  );
}
