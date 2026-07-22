import { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';

export default function SeguridadScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = () => {
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

          <View className="mx-5 mt-6 space-y-5">
            <View>
              <Text className="mb-2 text-sm font-semibold text-[#0F172A]">
                Contraseña actual
              </Text>
              <TextInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Ingresa tu contraseña actual"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-3.5 text-base text-[#0F172A]"
              />
            </View>
            <View>
              <Text className="mb-2 text-sm font-semibold text-[#0F172A]">
                Nueva contraseña
              </Text>
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-3.5 text-base text-[#0F172A]"
              />
            </View>
            <View>
              <Text className="mb-2 text-sm font-semibold text-[#0F172A]">
                Confirmar nueva contraseña
              </Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repite la nueva contraseña"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-3.5 text-base text-[#0F172A]"
              />
            </View>
          </View>

          <View className="mx-5 mt-10">
            <Button
              text="Cambiar contraseña"
              variant="primary"
              onPress={handleChangePassword}
            />
          </View>

          <View className="mx-5 mt-10 rounded-2xl bg-white shadow-sm">
            <Pressable
              className="flex-row items-center justify-center gap-3 px-4 py-4 active:bg-[#FEF2F2]"
            >
              <FontAwesome6
                name="trash-can"
                size={16}
                color="#EF4444"
              />
              <Text className="text-base font-semibold text-[#EF4444]">
                Eliminar cuenta
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
