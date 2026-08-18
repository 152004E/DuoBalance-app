import { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthHeader } from '@/components/auth/auth-header';
import { AuthFooter } from '@/components/auth/auth-footer';
import { extractErrorMessage } from '@/utils/errors';
import { forgotPassword } from '@/services/api/auth';

const EMAIL_REGEX = /^[^\s@]{2,}@[^\s@]{2,}\.[A-Za-z]{2,}$/;

type ScreenState = 'form' | 'sending' | 'sent';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>();
  const [state, setState] = useState<ScreenState>('form');
  const [sentError, setSentError] = useState<string>();

  function validate(): boolean {
    if (!email.trim()) {
      setError('El email es requerido');
      return false;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setError('Ingresa un email válido');
      return false;
    }
    setError(undefined);
    return true;
  }

  async function handleSendLink() {
    if (!validate()) return;

    setState('sending');
    setSentError(undefined);
    try {
      await forgotPassword(email.trim().toLowerCase());
      setState('sent');
    } catch (err) {
      setSentError(
        extractErrorMessage(
          err,
          'No se pudo enviar el correo. Intenta de nuevo.',
        ),
      );
      setState('form');
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow justify-center px-6 py-10"
        keyboardShouldPersistTaps="handled"
      >
        <AuthHeader subtitle="Recupera tu contraseña" />

        {state === 'sent' ? (
          <View className="items-center">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-[#10B981]/10">
              <FontAwesome6
                name="envelope-circle-check"
                size={30}
                color="#10B981"
              />
            </View>
            <Text className="mt-6 text-center text-xl font-bold text-[#0F172A]">
              Revisa tu correo
            </Text>
            <Text className="mt-2 text-center text-sm leading-6 text-[#64748B]">
              Te enviamos un enlace para restablecer tu contraseña. Si no lo
              ves, revisa también la carpeta de spam. El enlace tiene una
              validez de 60 minutos.
            </Text>

            <Button
              text="Volver a iniciar sesión"
              variant="primary"
              iconLeft="arrow-right-to-bracket"
              className="mt-8 w-full rounded-full py-4 shadow-md"
              onPress={() => router.replace('/login')}
            />
          </View>
        ) : (
          <View className="gap-5">
            <Text className="text-center text-sm text-[#64748B]">
              Ingresa tu email y te enviaremos un enlace para restablecer tu
              contraseña.
            </Text>

            <Input
              label="Email"
              placeholder="tu@email.com"
              iconLeft="envelope"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) setError(undefined);
              }}
              error={error}
            />

            {sentError && (
              <Text className="text-center text-xs text-[#EF4444]">
                {sentError}
              </Text>
            )}

            <Button
              text="Enviar enlace"
              variant="primary"
              className="rounded-full py-4 shadow-md"
              isLoading={state === 'sending'}
              disabled={state === 'sending'}
              onPress={handleSendLink}
            />
          </View>
        )}

        <AuthFooter question="Volver a" action="Iniciar sesión" href="/login" />
      </ScrollView>
    </SafeAreaView>
  );
}
