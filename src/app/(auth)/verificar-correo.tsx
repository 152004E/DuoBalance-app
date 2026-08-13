import { useEffect, useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';

import { Button } from '@/components/ui/button';
import { AuthHeader } from '@/components/auth/auth-header';
import { AuthFooter } from '@/components/auth/auth-footer';
import { AlertModal } from '@/components/ui/alert-modal';
import { extractErrorMessage } from '@/utils/errors';
import * as authService from '@/services/api/auth';

const RESEND_COOLDOWN_SECONDS = 60;

export default function VerificarCorreoScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [sending, setSending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [modal, setModal] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleResend = async () => {
    if (!email) return;

    setSending(true);
    try {
      await authService.resendVerification(email.trim().toLowerCase());
      setSecondsLeft(RESEND_COOLDOWN_SECONDS);
      setModal({
        type: 'success',
        title: 'Correo reenviado',
        message: `Te enviamos un nuevo enlace de verificación a ${email}.`,
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
        <AuthHeader subtitle="Revisa tu correo · Verificación de cuenta" />

        <View className="items-center">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-[#10B981]/10">
            <FontAwesome6 name="envelope-open-text" size={30} color="#10B981" />
          </View>

          <Text className="mt-6 text-center text-sm leading-6 text-[#64748B]">
            Te enviamos un correo de verificación a{' '}
            <Text className="font-semibold text-[#0F172A]">
              {email ?? 'tu correo'}
            </Text>
            . Toca el botón{' '}
            <Text className="font-semibold">{'“Confirmar tu correo”'}</Text> del
            email para activar tu cuenta.
          </Text>

          <Text className="mt-3 text-center text-xs leading-5 text-[#94A3B8]">
            ¿No lo ves? Revisa la carpeta de spam o solicita un nuevo enlace.
          </Text>
        </View>

        <View className="mt-8 gap-3">
          <Button
            text={
              secondsLeft > 0
                ? `Reenviar en ${secondsLeft}s`
                : 'Reenviar correo'
            }
            variant="secondary"
            iconLeft="paper-plane"
            isLoading={sending}
            disabled={secondsLeft > 0 || !email}
            onPress={handleResend}
          />

          <Button
            text="Ya verifiqué mi correo"
            variant="primary"
            iconLeft="check"
            onPress={() => router.replace('/login')}
          />
        </View>

        <AuthFooter
          question="¿Cambiaste de idea?"
          action="Volver a iniciar sesión"
          href="/login"
        />
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
