import { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthHeader } from '@/components/auth/auth-header';
import { AuthFooter } from '@/components/auth/auth-footer';

const EMAIL_REGEX = /^[^\s@]{2,}@[^\s@]{2,}\.[A-Za-z]{2,}$/;

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>();

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

  function handleSendLink() {
    validate();
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow justify-center px-6 py-10"
        keyboardShouldPersistTaps="handled"
      >
        <AuthHeader subtitle="Recupera tu contraseña" />

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

          <Button
            text="Enviar enlace"
            variant="primary"
            className="rounded-full py-4 shadow-md"
            onPress={handleSendLink}
          />
        </View>

        <AuthFooter question="Volver a" action="Iniciar sesión" href="/login" />
      </ScrollView>
    </SafeAreaView>
  );
}
