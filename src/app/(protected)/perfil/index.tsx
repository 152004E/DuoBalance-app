import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import { router, useScrollToTop } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';
import { Loading } from '@/components/ui/loading';
import { ProfileCard } from '@/components/perfil/profile-card';
import { AlertModal } from '@/components/ui/alert-modal';
import { extractErrorMessage } from '@/utils/errors';
import * as authService from '@/services/api/auth';
import { useState, useRef } from 'react';

const menuItems = [
  { icon: 'pen-to-square', label: 'Editar Perfil', route: '/perfil/editar' },
  { icon: 'bell', label: 'Notificaciones', route: '/perfil/notificaciones' },
  { icon: 'shield-halved', label: 'Seguridad', route: '/perfil/seguridad' },
  { icon: 'circle-info', label: 'Acerca de', route: '/perfil/acerca' },
] as const;

export default function PerfilScreen() {
  const { user, signOut, isLoading } = useAuth();
  const [sending, setSending] = useState(false);
  const [modal, setModal] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
  } | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);

  const isVerified = !!user?.emailVerifiedAt;

  const handleLogout = async () => {
    await signOut();
  };

  const handleResend = async () => {
    if (!user?.email) return;

    setSending(true);
    try {
      await authService.resendVerification(user.email);
      setModal({
        type: 'success',
        title: 'Correo reenviado',
        message: `Te enviamos un nuevo enlace de verificación a ${user.email}.`,
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

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
        <Loading message="Cargando perfil..." />
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#E8E4F0', '#F4F2F7', '#F8FAFC']}
        locations={[0, 0.5, 1]}
        className="absolute inset-0"
      />
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerClassName="pb-8"
          showsVerticalScrollIndicator={false}
        >
          <Text className="mt-6 text-center text-2xl font-bold text-[#0F172A]">
            Perfil
          </Text>

          <ProfileCard
            firstName={user?.firstName ?? ''}
            lastName={user?.lastName ?? ''}
            email={user?.email ?? ''}
            avatarUrl={user?.avatarUrl}
          />

          {isVerified ? (
            <View className="mx-5 mt-3 flex-row items-center justify-center gap-2">
              <FontAwesome6 name="circle-check" size={14} color="#10B981" />
              <Text className="text-xs font-medium text-[#10B981]">
                Correo verificado
              </Text>
            </View>
          ) : (
            <View className="mx-5 mt-3 flex-row items-center justify-between rounded-xl border border-[#FBBF24]/40 bg-[#FEF3C7] px-4 py-2.5">
              <View className="flex-row items-center gap-2">
                <FontAwesome6 name="clock" size={14} color="#B45309" />
                <Text className="text-xs font-medium text-[#B45309]">
                  Por verificar tu correo
                </Text>
              </View>
              <Pressable onPress={handleResend} disabled={sending}>
                <Text className="text-xs font-semibold text-[#B45309] underline">
                  {sending ? 'Enviando...' : 'Reenviar'}
                </Text>
              </Pressable>
            </View>
          )}

          <View className="mx-5 mt-10 rounded-2xl bg-white shadow-sm">
            {menuItems.map((item, index) => (
              <Pressable
                key={item.label}
                onPress={() => router.push(item.route)}
                className="flex-row items-center justify-between px-4 py-4 active:bg-[#F8FAFC]"
              >
                <View className="flex-row items-center gap-4">
                  <View
                    className="h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: '#10B98126' }}
                  >
                    <FontAwesome6 name={item.icon} size={16} color="#10B981" />
                  </View>
                  <Text className="text-base font-semibold text-[#0F172A]">
                    {item.label}
                  </Text>
                </View>
                <FontAwesome6 name="chevron-right" size={14} color="#CBD5E1" />
              </Pressable>
            ))}
          </View>

          <View className="mx-5 mt-4 rounded-2xl bg-white shadow-sm">
            <Pressable
              onPress={handleLogout}
              className="flex-row items-center justify-center gap-3 px-4 py-4 active:bg-[#F8FAFC]"
            >
              <FontAwesome6
                name="right-from-bracket"
                size={16}
                color="#EF4444"
              />
              <Text className="text-base font-semibold text-[#EF4444]">
                Cerrar sesión
              </Text>
            </Pressable>
          </View>
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
    </View>
  );
}
