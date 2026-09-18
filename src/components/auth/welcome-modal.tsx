import { getUserDisplayName } from '@/utils/user';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { BottomSheetHeader } from '@/components/ui/bottom-sheet-header';
import { Button } from '@/components/ui/button';
import { welcomeStorage } from '@/storage/token';
import { useAuth } from '@/hooks/use-auth';
import { usePwaInstall } from '@/hooks/use-pwa-install';

export function WelcomeModal() {
  const { user } = useAuth();
  const { isInstallable, isIosPrompt, promptInstall } = usePwaInstall();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    async function checkWelcome() {
      if (!user) return;

      try {
        const hasSeen = await welcomeStorage.get();
        if (hasSeen) return;

        // Mostrar a todos los usuarios que no lo hayan visto (una sola vez)
        setTimeout(() => setVisible(true), 1200);
      } catch (error) {
        // Ignorar errores de almacenamiento
      }
    }
    
    checkWelcome();
  }, [user]);

  const handleClose = async () => {
    setVisible(false);
    await welcomeStorage.set(true);
  };

  const goToTerms = async () => {
    await handleClose();
    // Esperar a que se cierre el modal antes de navegar
    setTimeout(() => router.push('/terminos'), 400);
  };

  const goToPrivacy = async () => {
    await handleClose();
    setTimeout(() => router.push('/privacidad'), 400);
  };

  if (!user) return null;

  const header = (
    <BottomSheetHeader
      visible={visible}
      title={`¡Hola, ${getUserDisplayName(user)}!`}
      subtitle="Te damos la bienvenida a DuoBalance."
      onClose={handleClose}
      logo={require('@/assets/images/logo-white-green-bg-without.png')}
    />
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      header={header}
    >
      <View className="px-6 pb-6 pt-5 items-center flex-1">
        
        <Text className="text-[15px] leading-6 text-[#475569] text-center mb-6">
          Gracias por confiar en DuoBalance. Hemos creado esta aplicación con mucha dedicación para ayudarte a llevar tus finanzas de la forma más sencilla.
        </Text>

        <View className="w-full bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-4 mb-6 shadow-sm">
          <Text className="text-sm text-[#475569] text-center leading-6">
            Recuerda que puedes consultar nuestros{' '}
            <Text onPress={goToTerms} className="font-bold text-[#10B981] active:text-[#059669]">
              Términos y Condiciones
            </Text>
            {' '}y la{' '}
            <Text onPress={goToPrivacy} className="font-bold text-[#10B981] active:text-[#059669]">
              Política de Privacidad
            </Text>
            {' '}en cualquier momento desde la sección Acerca de en tu Perfil.
          </Text>
        </View>

        <View className="w-full gap-3">
          {isInstallable && (
            <Button
              text="Añadir a pantalla de inicio"
              iconLeft="arrow-down"
              variant="secondary"
              onPress={promptInstall}
              className="w-full rounded-xl py-4"
            />
          )}

          {isIosPrompt && (
            <View className="w-full bg-blue-50 p-3 rounded-xl border border-blue-100 items-center">
              <Text className="text-xs text-blue-800 text-center">
                <FontAwesome6 name="circle-info" size={12} color="#1E40AF" />{' '}
                Para añadir la app a tu inicio, toca el botón Compartir y elige "Agregar a Inicio".
              </Text>
            </View>
          )}

          <Button
            text="¡Empezar a registrar gastos!"
            iconLeft="rocket"
            variant="primary"
            onPress={handleClose}
            className="w-full rounded-xl py-4 shadow-md"
          />
        </View>
      </View>
    </BottomSheet>
  );
}
