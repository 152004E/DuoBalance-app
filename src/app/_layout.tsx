import '../global.css';

import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';

import { AuthProvider } from '@/features/auth/auth.context';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </AuthProvider>
  );
}
