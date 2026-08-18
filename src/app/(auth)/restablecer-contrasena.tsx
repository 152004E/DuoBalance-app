import { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthHeader } from '@/components/auth/auth-header';
import { AuthFooter } from '@/components/auth/auth-footer';
import { extractErrorMessage } from '@/utils/errors';
import { resetPassword } from '@/services/api/auth';

type ResetState = 'form' | 'submitting' | 'success' | 'error';

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string>();
  const [confirmError, setConfirmError] = useState<string>();
  const [state, setState] = useState<ResetState>('form');
  const [errorMessage, setErrorMessage] = useState('');

  function validate(): boolean {
    if (newPassword.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    setPasswordError(undefined);

    if (!confirmPassword) {
      setConfirmError('Confirma tu nueva contraseña');
      return false;
    }
    if (confirmPassword !== newPassword) {
      setConfirmError('Las contraseñas no coinciden');
      return false;
    }
    setConfirmError(undefined);
    return true;
  }

  async function handleSubmit() {
    if (!token || !validate()) return;

    setState('submitting');
    try {
      await resetPassword({ token, newPassword });
      setState('success');
    } catch (err) {
      setErrorMessage(
        extractErrorMessage(
          err,
          'No pudimos restablecer tu contraseña. Solicita un nuevo enlace.',
        ),
      );
      setState('error');
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow justify-center px-6 py-10"
        keyboardShouldPersistTaps="handled"
      >
        <AuthHeader subtitle="Nueva contraseña" />

        {state === 'success' && (
          <View className="items-center">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-[#10B981]/10">
              <FontAwesome6 name="circle-check" size={30} color="#10B981" />
            </View>
            <Text className="mt-6 text-center text-xl font-bold text-[#0F172A]">
              ¡Contraseña restablecida!
            </Text>
            <Text className="mt-2 text-center text-sm leading-6 text-[#64748B]">
              Tu contraseña fue actualizada correctamente. Ya puedes iniciar
              sesión con tu nueva contraseña.
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
            <Text className="mt-6 text-center text-xl font-bold text-[#0F172A]">
              No pudimos restablecer tu contraseña
            </Text>
            <Text className="mt-2 text-center text-sm leading-6 text-[#64748B]">
              {errorMessage}
            </Text>

            <Button
              text="Solicitar nuevo enlace"
              variant="primary"
              className="mt-8 w-full rounded-full py-4 shadow-md"
              onPress={() => router.replace('/forgot-password')}
            />
          </View>
        )}

        {state !== 'success' && state !== 'error' && (
          <View className="gap-5">
            <Text className="text-center text-sm text-[#64748B]">
              Ingresa tu nueva contraseña. Debe tener al menos 6 caracteres.
            </Text>

            <Input
              label="Nueva contraseña"
              iconLeft="lock"
              placeholder="••••••••"
              secureTextEntry
              autoCapitalize="none"
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                if (passwordError) setPasswordError(undefined);
              }}
              error={passwordError}
            />

            <Input
              label="Confirmar contraseña"
              iconLeft="lock"
              placeholder="••••••••"
              secureTextEntry
              autoCapitalize="none"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (confirmError) setConfirmError(undefined);
              }}
              error={confirmError}
            />

            <Button
              text="Restablecer contraseña"
              variant="primary"
              className="rounded-full py-4 shadow-md"
              isLoading={state === 'submitting'}
              disabled={state === 'submitting'}
              onPress={handleSubmit}
            />
          </View>
        )}

        <AuthFooter question="Volver a" action="Iniciar sesión" href="/login" />
      </ScrollView>
    </SafeAreaView>
  );
}
