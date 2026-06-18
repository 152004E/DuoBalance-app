import { useState } from 'react';
import { View, ScrollView, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthHeader } from '@/components/auth/auth-header';
import { AuthDivider } from '@/components/auth/auth-divider';
import { SocialLoginButton } from '@/components/auth/social-login-button';
import { AuthFooter } from '@/components/auth/auth-footer';

import { useAuth } from '@/hooks/use-auth';
import * as authService from '@/services/api/auth';
import { tokenStorage } from '@/storage/token';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginScreen() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      newErrors.email = 'Ingresa un email válido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const authResponse = await authService.login({
        email: email.trim(),
        password,
      });

      await tokenStorage.set(authResponse.access_token);

      const user = await authService.getProfile();

      await signIn(user, authResponse.access_token);

      router.replace('/(protected)');
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Error al iniciar sesión. Intenta de nuevo.';

      if (typeof message === 'string') {
        setErrors({ general: message });
      } else {
        setErrors({ general: 'Error al iniciar sesión. Intenta de nuevo.' });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow justify-center px-6 py-10"
        keyboardShouldPersistTaps="handled"
      >
        <AuthHeader />

        <View className="gap-5">
          <Input
            label="Email"
            placeholder="tu@email.com"
            iconLeft="envelope"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email)
                setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            error={errors.email}
          />

          <View className="gap-1">
            <Input
              label="Contraseña"
              placeholder="••••••••"
              iconLeft="lock"
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password)
                  setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              error={errors.password}
            />
            <Pressable
              onPress={() => router.push('/(auth)/forgot-password')}
              className="self-end"
            >
              <Text className="text-sm text-[#64748B]">
                ¿Olvidaste tu contraseña?
              </Text>
            </Pressable>
          </View>

          {errors.general && (
            <Text className="text-center text-sm text-[#EF4444]">
              {errors.general}
            </Text>
          )}

          <Button
            text="Iniciar Sesión"
            variant="primary"
            iconLeft="arrow-right-to-bracket"
            className="mt-1 rounded-full py-4 shadow-md"
            isLoading={isLoading}
            onPress={handleLogin}
          />
        </View>

        <AuthDivider />

        <SocialLoginButton provider="google" />

        <AuthFooter
          question="¿No tienes cuenta?"
          action="Crear cuenta"
          href="/register"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
