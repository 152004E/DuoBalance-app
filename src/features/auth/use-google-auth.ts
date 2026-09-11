import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';

import { useAuth } from '@/hooks/use-auth';
import { loginWithGoogle } from '@/services/api/auth';
import { tokenStorage, refreshTokenStorage } from '@/storage/token';
import { extractErrorMessage } from '@/utils/errors';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const webClientId =
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
    process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;

  const configuredClientId =
    Platform.select({
      ios: iosClientId,
      android: androidClientId,
      default: webClientId,
    }) || webClientId;

  const isConfigured = Boolean(configuredClientId);
  const placeholderClientId = 'unconfigured-google-client-id';

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId: webClientId || placeholderClientId,
    iosClientId: iosClientId || placeholderClientId,
    androidClientId: androidClientId || placeholderClientId,
    clientId: webClientId || placeholderClientId,
  });

  const handleBackendGoogleAuth = useCallback(
    async (idToken: string) => {
      setIsLoading(true);
      try {
        const data = await loginWithGoogle(idToken);

        await tokenStorage.set(data.access_token);
        await refreshTokenStorage.set(data.refresh_token);

        await signIn(data.user, data.access_token, data.refresh_token);

        Toast.show({
          type: 'success',
          text1: '¡Bienvenido!',
          text2: `Sesión iniciada como ${data.user.firstName}`,
        });

        router.replace('/(protected)');
      } catch (err: unknown) {
        const errorObj = err as {
          response?: { status?: number; data?: { message?: string } };
        };
        const serverMessage = errorObj?.response?.data?.message;
        const isSuspended =
          typeof serverMessage === 'string' &&
          serverMessage.toLowerCase().includes('suspendid');

        if (isSuspended) {
          Toast.show({
            type: 'error',
            text1: 'Cuenta Suspendida',
            text2:
              serverMessage ||
              'Tu cuenta ha sido suspendida por un administrador.',
            visibilityTime: 6000,
          });
          return;
        }

        const msg = extractErrorMessage(err, 'Error al autenticar con Google');
        Toast.show({
          type: 'error',
          text1: 'Error con Google',
          text2: msg,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [signIn],
  );

  useEffect(() => {
    if (!response) return;

    if (response.type === 'success') {
      const idToken = response.params?.id_token;
      if (idToken) {
        queueMicrotask(() => {
          void handleBackendGoogleAuth(idToken);
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error con Google',
          text2: 'No se recibió el token de identidad de Google.',
        });
      }
    } else if (response.type === 'error') {
      Toast.show({
        type: 'error',
        text1: 'Error de autenticación',
        text2: response.error?.message || 'No se pudo conectar con Google.',
      });
    }
  }, [response, handleBackendGoogleAuth]);

  async function signInWithGoogle() {
    if (!isConfigured) {
      Toast.show({
        type: 'info',
        text1: 'Google OAuth no configurado',
        text2:
          'Agrega EXPO_PUBLIC_GOOGLE_CLIENT_ID en tus variables de entorno (.env) para habilitarlo.',
        visibilityTime: 6000,
      });
      return;
    }

    try {
      await promptAsync();
    } catch (err: unknown) {
      const errorObj = err as Error;
      Toast.show({
        type: 'error',
        text1: 'Error al abrir Google',
        text2:
          errorObj?.message || 'No se pudo iniciar el flujo de autenticación.',
      });
    }
  }

  return {
    signInWithGoogle,
    isLoading,
    isReady: Boolean(request),
  };
}
