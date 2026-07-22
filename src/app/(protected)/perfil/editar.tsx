import { useState } from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { ProfileCard } from '@/components/perfil/profile-card';

export default function EditarPerfilScreen() {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');

  const handleSave = () => {
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
            title="Editar Perfil"
            subtitle="Actualiza tu información personal"
            onBack={() => router.back()}
            actionIcon="pen-to-square"
          />

          <ProfileCard
            firstName={firstName}
            lastName={lastName}
            email={email}
            showChangePhoto
          />

          <View className="mx-5 mt-8 space-y-5">
            <View>
              <Text className="mb-2 text-sm font-semibold text-[#0F172A]">
                Nombre
              </Text>
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Tu nombre"
                placeholderTextColor="#94A3B8"
                className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-3.5 text-base text-[#0F172A]"
              />
            </View>
            <View>
              <Text className="mb-2 text-sm font-semibold text-[#0F172A]">
                Apellido
              </Text>
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder="Tu apellido"
                placeholderTextColor="#94A3B8"
                className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-3.5 text-base text-[#0F172A]"
              />
            </View>
            <View>
              <Text className="mb-2 text-sm font-semibold text-[#0F172A]">
                Correo electrónico
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="tu@email.com"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-3.5 text-base text-[#0F172A]"
              />
            </View>
          </View>

          <View className="mx-5 mt-10">
            <Button
              text="Guardar cambios"
              variant="primary"
              onPress={handleSave}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
