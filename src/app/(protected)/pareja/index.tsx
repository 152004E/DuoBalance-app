import { useState, useRef } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppHero } from '@/components/layout/AppHero';
import { CoupleCard } from '@/components/dashboard/CoupleCard';
import { FloatingAddMenu } from '@/components/dashboard/FloatingAddMenu';
import { CoupleMenuSheet, type CoupleMenuAction } from '@/components/couple/couple-menu-sheet';
import { InviteMemberSheet } from '@/components/couple/invite-member-sheet';
import { AlertModal } from '@/components/ui/alert-modal';
import { useAuth } from '@/hooks/use-auth';

const MOCK_COUPLES = [
  { id: '1', name: 'Andrea', balance: 250000, status: 'positive' as const },
  { id: '2', name: 'Carlos', balance: 80000, status: 'positive' as const },
  { id: '3', name: 'María', balance: 15000, status: 'neutral' as const },
  { id: '4', name: 'Pedro', balance: 120000, status: 'negative' as const },
];

export default function ParejaScreen() {
  const { user } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [inviteVisible, setInviteVisible] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const pendingInviteAction = useRef(false);

  const handleMenuClose = () => {
    setMenuVisible(false);
    if (pendingInviteAction.current) {
      pendingInviteAction.current = false;
      setInviteVisible(true);
    }
  };

  const handleMenuAction = (action: CoupleMenuAction) => {
    switch (action) {
      case 'invite':
        pendingInviteAction.current = true;
        setMenuVisible(false);
        break;
      case 'settings':
      case 'export':
      case 'history':
        setMenuVisible(false);
        setShowComingSoon(true);
        break;
      case 'leave':
        setMenuVisible(false);
        setShowLeaveConfirm(true);
        break;
    }
  };

  return (
    <SafeAreaView className="relative flex-1 bg-[#F8FAFC]" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-24"
        showsVerticalScrollIndicator={false}
      >
        <AppHero height={220}>
          <View className="flex-row items-center gap-2">
            <Image
              source={require('@/assets/images/logo-white-green-bg-without.png')}
              style={{ width: 25, height: 25 }}
              resizeMode="contain"
            />
            <Text className="text-base text-white">
              Bienvenido,{' '}
              <Text className="font-semibold">
                {user?.firstName ?? 'Usuario'}
              </Text>
            </Text>
          </View>

          <View className="mt-6 items-center">
            <Text className="text-2xl font-bold text-white">Pareja</Text>
            <Text className="mt-1 text-base text-white/80">
              Administra tus vínculos
            </Text>
          </View>
        </AppHero>

        <View className="px-5 pt-8">
          <Text className="mb-4 text-2xl font-bold text-[#0F172A]">
            Tus Parejas
          </Text>

          <View className="gap-4">
            {MOCK_COUPLES.map((item) => (
              <CoupleCard
                key={item.id}
                id={item.id}
                name={item.name}
                balance={item.balance}
                status={item.status}
                onPress={() => router.push(`/pareja/${item.id}`)}
                onMenu={() => {
                  setSelectedCardId(item.id);
                  setMenuVisible(true);
                }}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <FloatingAddMenu
        heightRatio={0.1}
        headerFinalTranslateY={0.53}
        createCoupleHeightRatio={0.65}
        createCoupleHeaderFinalTranslateY={0.17}
      />

      <CoupleMenuSheet
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onAction={handleMenuAction}
        heightRatio={0.55}
        headerFinalTranslateY={0.27}
      />

      <InviteMemberSheet
        visible={inviteVisible}
        onClose={() => setInviteVisible(false)}
        heightRatio={0.75}
        headerFinalTranslateY={0.17}
      />

      <AlertModal
        visible={showComingSoon}
        type="info"
        title="Próximamente"
        message="Esta funcionalidad estará disponible en una próxima actualización. ¡Estamos trabajando en ello!"
        buttonText="Entendido"
        onClose={() => setShowComingSoon(false)}
      />

      <AlertModal
        visible={showLeaveConfirm}
        type="warning"
        title="Salir del grupo"
        message="¿Estás seguro de que quieres salir del grupo? Perderás acceso a todos los gastos y estadísticas compartidas."
        buttonText="Sí, salir"
        onClose={() => setShowLeaveConfirm(false)}
      />
    </SafeAreaView>
  );
}
