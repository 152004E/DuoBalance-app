import { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { AlertModal } from '@/components/ui/alert-modal';
import { changePassword } from '@/services/api/auth';

export default function SeguridadScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!currentPassword.trim()) {
      newErrors.currentPassword = 'La contraseña actual es requerida';
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = 'La nueva contraseña es requerida';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Mínimo 6 caracteres';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirma tu nueva contraseña';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      await changePassword({
        currentPassword,
        newPassword,
      });
      setShowSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al cambiar la contraseña';
      setErrors({ general: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.back();
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#E8E4F0', '#F4F2F7', '#F8FAFC']}
        locations={[0, 0.5, 1]}
        className="absolute inset-0"
      />
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-8"
          showsVerticalScrollIndicator={false}
        >
          <ScreenHeader
            title="Seguridad"
            subtitle="Gestiona tu contraseña y datos personales"
            onBack={() => router.back()}
            actionIcon="shield-halved"
          />

          <View className="mx-5 mt-6 rounded-2xl bg-white shadow-sm">
            <View className="flex-row items-center gap-4 px-4 py-4">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-[#10B98126]">
                <FontAwesome6 name="lock" size={16} color="#10B981" />
              </View>
              <View>
                <Text className="text-base font-semibold text-[#0F172A]">
                  Contraseña
                </Text>
                <Text className="text-sm text-[#64748B]">
                  Cambia tu contraseña actual
                </Text>
              </View>
            </View>
          </View>

          <View className="mx-5 mt-6 gap-5">
            <Input
              label="Contraseña actual"
              value={currentPassword}
              onChangeText={(text) => {
                setCurrentPassword(text);
                if (errors.currentPassword)
                  setErrors((prev) => ({
                    ...prev,
                    currentPassword: undefined,
                  }));
              }}
              placeholder="Ingresa tu contraseña actual"
              iconLeft="lock"
              secureTextEntry
              error={errors.currentPassword}
            />
            <Input
              label="Nueva contraseña"
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                if (errors.newPassword)
                  setErrors((prev) => ({ ...prev, newPassword: undefined }));
              }}
              placeholder="Mínimo 6 caracteres"
              iconLeft="lock"
              secureTextEntry
              error={errors.newPassword}
            />
            <Input
              label="Confirmar nueva contraseña"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword)
                  setErrors((prev) => ({
                    ...prev,
                    confirmPassword: undefined,
                  }));
              }}
              placeholder="Repite la nueva contraseña"
              iconLeft="lock"
              secureTextEntry
              error={errors.confirmPassword}
            />
          </View>

          {errors.general && (
            <Text className="mx-5 mt-4 text-center text-sm text-[#EF4444]">
              {errors.general}
            </Text>
          )}

          <View className="mx-5 mt-10">
            <Button
              text="Cambiar contraseña"
              iconLeft="lock"
              variant="primary"
              onPress={handleChangePassword}
              isLoading={isSubmitting}
              loadingText="Cambiando..."
            />
          </View>

          <View className="mx-5 mt-10 rounded-2xl bg-white shadow-sm">
            <Pressable className="flex-row items-center justify-center gap-3 px-4 py-4 active:bg-[#FEF2F2]">
              <FontAwesome6 name="trash-can" size={16} color="#EF4444" />
              <Text className="text-base font-semibold text-[#EF4444]">
                Eliminar cuenta
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>

      <AlertModal
        visible={showSuccess}
        type="success"
        title="¡Contraseña actualizada!"
        message="Tu contraseña se ha cambiado correctamente."
        buttonText="Continuar"
        onClose={handleSuccessClose}
      />

      {errors.general && (
        <AlertModal
          visible={!!errors.general}
          type="error"
          title="Error"
          message={errors.general}
          buttonText="Cerrar"
          onClose={() => setErrors((prev) => ({ ...prev, general: undefined }))}
        />
      )}
    </View>
  );
}
