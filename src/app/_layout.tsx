import '../global.css';

import { LogBox } from 'react-native';
import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useFonts } from 'expo-font';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import { AuthProvider } from '@/features/auth/auth.context';
import { SessionExpiredAlert } from '@/components/auth/session-expired-alert';
import { appToastConfig } from '@/components/ui/app-toast';
import { SeoHead } from '@/components/common/seo-head';

LogBox.ignoreLogs([
  'props.pointerEvents is deprecated',
  '"shadow*" style props are deprecated',
]);

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    ...FontAwesome6.font,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <SeoHead />
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
