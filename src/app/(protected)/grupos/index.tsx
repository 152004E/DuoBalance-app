import { useState, useRef, useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { router, useFocusEffect } from 'expo-router';
import { HeroSection } from '@/components/layout/HeroSection';
import { CoupleCard } from '@/components/dashboard/CoupleCard';
import { FloatingAddMenu } from '@/components/dashboard/FloatingAddMenu';
import { CoupleMenuSheet, type CoupleMenuAction } from '@/components/couple/couple-menu-sheet';
import { InviteMemberSheet } from '@/components/couple/invite-member-sheet';
import { JoinGroupSheet } from '@/components/couple/join-group-sheet';
import { AlertModal } from '@/components/ui/alert-modal';
import { useAuth } from '@/hooks/use-auth';
import { useStaggeredEntrance } from '@/hooks/use-staggered-entrance';

const MOCK_COUPLES = [
  { id: '1', name: 'Andrea', balance: 250000, status: 'positive' as const },
  { id: '2', name: 'Carlos', balance: 80000, status: 'positive' as const },
  { id: '3', name: 'María', balance: 15000, status: 'neutral' as const },
  { id: '4', name: 'Pedro', balance: 120000, status: 'negative' as const },
];

function StaggeredCoupleCard({
  item,
  index,
  onPress,
  onMenu,
  focusCount,
}: {
  item: (typeof MOCK_COUPLES)[number];
  index: number;
  onPress: () => void;
  onMenu: () => void;
  focusCount: number;
}) {
  const animatedStyle = useStaggeredEntrance(index, { trigger: focusCount });
  return (
    <Animated.View style={animatedStyle}>
      <CoupleCard
        id={item.id}
        name={item.name}
        balance={item.balance}
        status={item.status}
        onPress={onPress}
        onMenu={onMenu}
      />
    </Animated.View>
  );
}

export default function ParejaScreen() {
  const { user } = useAuth();
  const [focusCount, setFocusCount] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setFocusCount(c => c + 1);
    }, []),
  );
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [inviteVisible, setInviteVisible] = useState(false);
  const [showJoinSheet, setShowJoinSheet] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const lastActionRef = useRef<CoupleMenuAction | null>(null);

  const handleMenuAction = (action: CoupleMenuAction) => {
    switch (action) {
      case 'invite':
        lastActionRef.current = 'invite';
        setMenuVisible(false);
        break;
      case 'settings':
        lastActionRef.current = 'settings';
        setMenuVisible(false);
        break;
      case 'export':
      case 'history':
        lastActionRef.current = action;
        setMenuVisible(false);
        break;
      case 'leave':
        lastActionRef.current = 'leave';
        setMenuVisible(false);
        break;
    }
  };

  const handleMenuCloseComplete = useCallback(() => {
    const action = lastActionRef.current;
    lastActionRef.current = null;
    switch (action) {
      case 'invite':
        setInviteVisible(true);
        break;
      case 'settings':
        router.push(`/grupos/${selectedCardId ?? '1'}/configuracion`);
        break;
      case 'export':
      case 'history':
        setShowComingSoon(true);
        break;
      case 'leave':
        setShowLeaveConfirm(true);
        break;
    }
  }, [selectedCardId]);

  return (
    <SafeAreaView className="relative flex-1 bg-[#F8FAFC]" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-24"
        showsVerticalScrollIndicator={false}
      >
        <HeroSection
          key={focusCount}
          variant="page"
          userName={user?.firstName ?? 'Usuario'}
          title="Grupos"
          subtitle="Administra tus grupos"
          height={220}
        />

        <View className="px-5 pt-8">
          <Text className="mb-4 text-2xl font-bold text-[#0F172A]">
            Tus Grupos
          </Text>

          <View className="gap-4">
            {MOCK_COUPLES.map((item, index) => (
              <StaggeredCoupleCard
                key={item.id}
                item={item}
                index={index}
                focusCount={focusCount}
                onPress={() => router.push(`/grupos/${item.id}`)}
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
        onJoinCouple={() => setShowJoinSheet(true)}
      />

      <CoupleMenuSheet
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onAction={handleMenuAction}
        onCloseComplete={handleMenuCloseComplete}
        heightRatio={0.55}
        headerFinalTranslateY={0.27}
      />

      <InviteMemberSheet
        visible={inviteVisible}
        onClose={() => setInviteVisible(false)}
        heightRatio={0.65}
        headerFinalTranslateY={0.17}
      />

      <JoinGroupSheet
        visible={showJoinSheet}
        onClose={() => setShowJoinSheet(false)}
        heightRatio={0.7}
        headerFinalTranslateY={0.1}
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
