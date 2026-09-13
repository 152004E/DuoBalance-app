import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Redirect } from 'expo-router';
import Toast from 'react-native-toast-message';

import { useAuth } from '@/hooks/use-auth';
import { WelcomeScreen } from '@/components/welcome/welcome-screen';
import { SeoHead } from '@/components/common/seo-head';
import { authenticateWithGoogleToken } from '@/features/auth/use-google-auth';
import { extractErrorMessage } from '@/utils/errors';

export default function Index() {
  const { isAuthenticated, isLoading, signIn } = useAuth();
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const hash = window.location.hash;
    if (!hash || !hash.includes('id_token=')) return;

    const params = new URLSearchParams(hash.replace(/^#/, ''));
    const idToken = params.get('id_token');

    if (idToken) {
      setIsProcessingOAuth(true);
      window.history.replaceState(null, '', window.location.pathname);

      authenticateWithGoogleToken(idToken, signIn).catch((err) => {
        const msg = extractErrorMessage(err, 'Error al autenticar con Google');
        Toast.show({
          type: 'error',
          text1: 'Error con Google',
          text2: msg,
        });
        setIsProcessingOAuth(false);
      });
    }
  }, [signIn]);

  if (isLoading || isProcessingOAuth) {
    return <SeoHead />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(protected)" />;
  }

  return (
    <>
      <SeoHead />
      <WelcomeScreen />
    </>
  );
}
