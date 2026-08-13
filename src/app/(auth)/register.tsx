import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthHeader } from '@/components/auth/auth-header';
import { AuthDivider } from '@/components/auth/auth-divider';
import { SocialLoginButton } from '@/components/auth/social-login-button';
import { AuthFooter } from '@/components/auth/auth-footer';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useAuth } from '@/hooks/use-auth';
import { AlertModal } from '@/components/ui/alert-modal';
import { extractErrorMessage } from '@/utils/errors';
import * as authService from '@/services/api/auth';
import { tokenStorage, refreshTokenStorage } from '@/storage/token';

const EMAIL_REGEX = /^[^\s@]{2,}@[^\s@]{2,}\.[A-Za-z]{2,}$/;

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function RegisterScreen() {
  const { signIn } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    onClose?: () => void;
  } | null>(null);

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      newErrors.email = 'Ingresa un email válido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleRegister() {
    if (!validate()) return;

    setIsLoading(true);

    setErrors((prev) => ({
      ...prev,
      general: undefined,
    }));

    try {
      await authService.register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      const authResponse = await authService.login({
        email: email.trim().toLowerCase(),
        password,
      });

      await tokenStorage.set(authResponse.access_token);
      await refreshTokenStorage.set(authResponse.refresh_token);

      const user = await authService.getProfile();

      await signIn(user, authResponse.access_token, authResponse.refresh_token);

      setModal({
        type: 'success',
        title: 'Registro exitoso',
        message: 'Tu cuenta ha sido creada correctamente.',
        onClose: () => {
          setModal(null);
          router.replace('/(protected)');
        },
      });
    } catch (err: any) {
      if (err?.response?.status === 409) {
        setModal({
          type: 'error',
          title: 'Correo ya registrado',
          message: 'Ya existe una cuenta asociada a este correo electrónico.',
          onClose: () => setModal(null),
        });
      } else {
        setModal({
          type: 'error',
          title: 'Error',
          message: extractErrorMessage(
            err,
            'No fue posible crear la cuenta. Intenta de nuevo.',
          ),
          onClose: () => setModal(null),
        });
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
        <AuthHeader subtitle="Crea tu cuenta" />

        <View className="gap-2">
          <Input
            label="Nombre"
            placeholder="Tu nombre"
            iconLeft="user"
            value={firstName}
            onChangeText={(text) => {
              setFirstName(text);
              if (errors.firstName)
                setErrors((prev) => ({
                  ...prev,
                  firstName: undefined,
                  general: undefined,
                }));
            }}
            error={errors.firstName}
          />

          <Input
            label="Apellido"
            placeholder="Tu apellido"
            iconLeft="user"
            value={lastName}
            onChangeText={(text) => {
              setLastName(text);
              if (errors.lastName)
                setErrors((prev) => ({
                  ...prev,
                  lastName: undefined,
                  general: undefined,
                }));
            }}
            error={errors.lastName}
          />

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
                setErrors((prev) => ({
                  ...prev,
                  email: undefined,
                  general: undefined,
                }));
            }}
            error={errors.email}
          />

          <Input
            label="Contraseña"
            placeholder="••••••••"
            iconLeft="lock"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password)
                setErrors((prev) => ({
                  ...prev,
                  password: undefined,
                  general: undefined,
                }));
            }}
            error={errors.password}
          />

          <Input
            label="Confirmar contraseña"
            placeholder="••••••••"
            iconLeft="lock"
            secureTextEntry
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (errors.confirmPassword)
                setErrors((prev) => ({
                  ...prev,
                  confirmPassword: undefined,
                  general: undefined,
                }));
            }}
            error={errors.confirmPassword}
          />
          {errors.general && (
            <Text className="text-center text-sm text-[#EF4444]">
              {errors.general}
            </Text>
          )}

          <Button
            text="Crear Cuenta"
            iconLeft="user-plus"
            variant="primary"
            className="mt-2 rounded-full py-4 shadow-md"
            isLoading={isLoading}
            onPress={handleRegister}
          />
        </View>

        <AuthDivider />
        <SocialLoginButton
          provider="google"
          onPress={() =>
            setModal({
              type: 'info',
              title: 'Próximamente',
              message: 'Inicio de sesión con Google estará disponible pronto.',
              onClose: () => setModal(null),
            })
          }
        />

        <AuthFooter
          question="¿Ya tienes cuenta?"
          action="Iniciar sesión"
          href="/login"
        />
      </ScrollView>

      {modal && (
        <AlertModal
          visible
          type={modal.type}
          title={modal.title}
          message={modal.message}
          onClose={modal.onClose ?? (() => setModal(null))}
        />
      )}
    </SafeAreaView>
  );
}
