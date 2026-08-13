import { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/hooks/use-auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { ProfileCard } from '@/components/perfil/profile-card';
import { ImagePreviewModal } from '@/components/perfil/image-preview-modal';
import { AlertModal } from '@/components/ui/alert-modal';
import { extractErrorMessage } from '@/utils/errors';
import * as authService from '@/services/api/auth';

const EMAIL_REGEX = /^[^\s@]{2,}@[^\s@]{2,}\.[A-Za-z]{2,}$/;

export default function EditarPerfilScreen() {
  const { user, updateUser } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [emailError, setEmailError] = useState<string>();
  const [localPhotoUri, setLocalPhotoUri] = useState<string | null>(null);
  const [localPhotoSource, setLocalPhotoSource] = useState<any>(null);
  const [pendingPhotoUri, setPendingPhotoUri] = useState<string | null>(null);
  const [pendingPhotoSource, setPendingPhotoSource] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState<string>();

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
        name: asset.fileName ?? asset.uri.split('/').pop() ?? 'avatar.jpg',
        type: asset.mimeType ?? 'image/jpeg',
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
    if (!email.trim()) {
      setEmailError('El correo es requerido');
      return;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setEmailError('Ingresa un correo válido');
      return;
    }

    setSaving(true);
    try {
      let currentUser = user;

      if (localPhotoSource) {
        const updated = await authService.uploadAvatar(localPhotoSource);
        currentUser = updated;
      }

      const profileUpdated = await authService.updateProfile({
        firstName,
        lastName,
        email,
      });
      const merged = {
        ...profileUpdated,
        avatarUrl: currentUser?.avatarUrl ?? profileUpdated.avatarUrl,
      };
      await updateUser(merged);
      setShowSuccess(true);
    } catch (error) {
      setShowError(
        extractErrorMessage(
          error,
          'No se pudo guardar el perfil. Intenta de nuevo.',
        ),
      );
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

          <View className="mx-5 mt-8 gap-5">
            <Input
              label="Nombre"
              iconLeft="user"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Tu nombre"
            />
            <Input
              label="Apellido"
              iconLeft="user"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Tu apellido"
            />
            <Input
              label="Correo electrónico"
              iconLeft="envelope"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError(undefined);
              }}
              placeholder="tu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailError}
            />
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

        <AlertModal
          visible={!!showError}
          type="error"
          title="No se pudo guardar"
          message={showError ?? ''}
          buttonText="Entendido"
          onClose={() => setShowError(undefined)}
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
