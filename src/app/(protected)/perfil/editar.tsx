import { useState } from 'react';
import { View, Text, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { ProfileCard } from '@/components/perfil/profile-card';
import { ImagePreviewModal } from '@/components/perfil/image-preview-modal';
import { AlertModal } from '@/components/ui/alert-modal';
import * as authService from '@/services/api/auth';

export default function EditarPerfilScreen() {
  const { user, updateUser } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [localPhotoUri, setLocalPhotoUri] = useState<string | null>(null);
  const [localPhotoSource, setLocalPhotoSource] = useState<any>(null);
  const [pendingPhotoUri, setPendingPhotoUri] = useState<string | null>(null);
  const [pendingPhotoSource, setPendingPhotoSource] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const displayAvatar = localPhotoUri ?? user?.avatarUrl ?? null;

  const handleChangePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      exif: false,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const source = (asset as any).file ?? {
        uri: asset.uri,
        name: asset.fileName ?? asset.uri.split("/").pop() ?? "avatar.jpg",
        type: asset.mimeType ?? "image/jpeg",
      };
      setPendingPhotoUri(asset.uri);
      setPendingPhotoSource(source);
      setShowPreview(true);
    }
  };

  const handlePreviewConfirm = () => {
    setLocalPhotoUri(pendingPhotoUri);
    setLocalPhotoSource(pendingPhotoSource);
    setShowPreview(false);
  };

  const handlePreviewCancel = () => {
    setPendingPhotoUri(null);
    setPendingPhotoSource(null);
    setShowPreview(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let currentUser = user;

      if (localPhotoSource) {
        const updated = await authService.uploadAvatar(localPhotoSource);
        currentUser = updated;
      }

      const profileUpdated = await authService.updateProfile({ firstName, lastName, email });
      const merged = { ...profileUpdated, avatarUrl: currentUser?.avatarUrl ?? profileUpdated.avatarUrl };
      await updateUser(merged);
      setShowSuccess(true);
    } catch {
      Alert.alert('Error', 'No se pudo guardar el perfil. Intenta de nuevo.');
    } finally {
      setSaving(false);
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
            title="Editar Perfil"
            subtitle="Actualiza tu información personal"
            onBack={() => router.back()}
            actionIcon="pen-to-square"
          />

          <ProfileCard
            firstName={firstName}
            lastName={lastName}
            email={email}
            avatarUrl={displayAvatar}
            showChangePhoto
            onChangePhoto={handleChangePhoto}
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

          <View className="mx-5 mt-10 gap-3">
            <Button
              text="Cancelar"
              variant="secondary"
              iconLeft="xmark"
              onPress={() => router.back()}
            />
            <Button
              text="Guardar cambios"
              variant="primary"
              iconLeft="floppy-disk"
              onPress={handleSave}
              isLoading={saving}
              loadingText="Guardando..."
            />
          </View>
        </ScrollView>

        <AlertModal
          visible={showSuccess}
          type="success"
          title="¡Perfil actualizado!"
          message="Tus datos se han guardado correctamente."
          buttonText="Continuar"
          onClose={handleSuccessClose}
        />

        <ImagePreviewModal
          visible={showPreview}
          imageUri={pendingPhotoUri ?? ''}
          onConfirm={handlePreviewConfirm}
          onCancel={handlePreviewCancel}
        />
      </SafeAreaView>
    </View>
  );
}
