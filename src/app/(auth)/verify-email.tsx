import { useEffect, useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthHeader } from '@/components/auth/auth-header';
import { AlertModal } from '@/components/ui/alert-modal';
import { extractErrorMessage } from '@/utils/errors';
import * as authService from '@/services/api/auth';

type VerifyState = 'verifying' | 'success' | 'error' | 'no-token';

export default function VerifyEmailScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [state, setState] = useState<VerifyState>('verifying');
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string>();
  const [sending, setSending] = useState(false);
  const [modal, setModal] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setState('no-token');
        return;
      }

      try {
        await authService.verifyEmail(token);
        setState('success');
      } catch (error) {
        setErrorMessage(
          extractErrorMessage(
            error,
            'No pudimos verificar tu correo. Intenta de nuevo.',
          ),
        );
        setState('error');
      }
    };

    run();
  }, [token]);

  const handleResend = async () => {
    if (!email.trim()) {
      setEmailError('Ingresa tu correo para reenviar el enlace');
      return;
    }

    setSending(true);
    try {
      await authService.resendVerification(email.trim().toLowerCase());
      setModal({
        type: 'success',
        title: 'Enlace reenviado',
        message: `Te enviamos un nuevo enlace de verificación a ${email.trim()}.`,
      });
    } catch (error) {
      setModal({
        type: 'error',
        title: 'No se pudo reenviar',
        message: extractErrorMessage(
          error,
          'No se pudo enviar el correo. Intenta de nuevo.',
        ),
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow justify-center px-6 py-10"
        keyboardShouldPersistTaps="handled"
      >
        <AuthHeader subtitle="Verificación de correo" />

        {state === 'verifying' && (
          <View className="items-center">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-[#10B981]/10">
              <FontAwesome6 name="spinner" size={28} color="#10B981" />
            </View>
            <Text className="mt-6 text-center text-sm text-[#64748B]">
              Verificando tu correo...
            </Text>
          </View>
        )}

        {state === 'success' && (
          <View className="items-center">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-[#10B981]/10">
              <FontAwesome6 name="circle-check" size={30} color="#10B981" />
            </View>
            <Text className="mt-6 text-xl font-bold text-[#0F172A]">
              ¡Correo verificado!
            </Text>
            <Text className="mt-2 text-center text-sm leading-6 text-[#64748B]">
              Tu cuenta está activa. Ya puedes iniciar sesión con tu correo y
              contraseña.
            </Text>

            <Button
              text="Iniciar sesión"
              variant="primary"
              iconLeft="arrow-right-to-bracket"
              className="mt-8 w-full rounded-full py-4 shadow-md"
              onPress={() => router.replace('/login')}
            />
          </View>
        )}

        {state === 'error' && (
          <View className="items-center">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-[#EF4444]/10">
              <FontAwesome6
                name="triangle-exclamation"
                size={30}
                color="#EF4444"
              />
            </View>
            <Text className="mt-6 text-xl font-bold text-[#0F172A]">
              No pudimos verificar tu correo
            </Text>
            <Text className="mt-2 text-center text-sm leading-6 text-[#64748B]">
              {errorMessage}
            </Text>

            <View className="mt-8 w-full gap-4">
              <View>
                <Input
                  label="Tu correo"
                  iconLeft="envelope"
                  placeholder="tu@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) setEmailError(undefined);
                  }}
                  error={emailError}
                />
                <Button
                  text="Enviar nuevo enlace"
                  variant="secondary"
                  iconLeft="paper-plane"
                  className="mt-3 rounded-full py-4"
                  isLoading={sending}
                  onPress={handleResend}
                />
              </View>

              <Button
                text="Ir a iniciar sesión"
                variant="secondary"
                onPress={() => router.replace('/login')}
              />
            </View>
          </View>
        )}

        {state === 'no-token' && (
          <View className="items-center">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-[#10B981]/10">
              <FontAwesome6
                name="envelope-open-text"
                size={30}
                color="#10B981"
              />
            </View>
            <Text className="mt-6 text-xl font-bold text-[#0F172A]">
              Revisa tu correo
            </Text>
            <Text className="mt-2 text-center text-sm leading-6 text-[#64748B]">
              Abre el enlace de confirmación que te enviamos para activar tu
              cuenta.
            </Text>

            <Button
              text="Ir a iniciar sesión"
              variant="primary"
              iconLeft="arrow-right-to-bracket"
              className="mt-8 w-full rounded-full py-4 shadow-md"
              onPress={() => router.replace('/login')}
            />
          </View>
        )}
      </ScrollView>

      {modal && (
        <AlertModal
          visible
          type={modal.type}
          title={modal.title}
          message={modal.message}
          onClose={() => setModal(null)}
        />
      )}
    </SafeAreaView>
  );
}
