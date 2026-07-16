import { useState, useRef, useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { HeroSection } from '@/components/layout/HeroSection';
import { FloatingAddMenu } from '@/components/dashboard/FloatingAddMenu';
import { CoupleMenuSheet, type CoupleMenuAction } from '@/components/couple/couple-menu-sheet';
import { InviteMemberSheet } from '@/components/couple/invite-member-sheet';
import { JoinGroupSheet } from '@/components/couple/join-group-sheet';
import { AlertModal } from '@/components/ui/alert-modal';
import { GroupSection } from '@/components/ui/group-section';
import { useAuth } from '@/hooks/use-auth';
import { useGroups } from '@/hooks/use-groups';
import type { GroupResponse } from '@/types/api';

export default function ParejaScreen() {
  const { user } = useAuth();
  const { personalGroups, coupleGroups, sharedGroups } = useGroups();
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupResponse | null>(null);
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
        router.push(`/grupos/${selectedGroup?.id ?? '1'}/configuracion`);
        break;
      case 'export':
      case 'history':
        setShowComingSoon(true);
        break;
      case 'leave':
        setShowLeaveConfirm(true);
        break;
    }
  }, [selectedGroup]);

  return (
    <SafeAreaView className="relative flex-1 bg-[#F8FAFC]" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-24"
        showsVerticalScrollIndicator={false}
      >
        <HeroSection
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

          <GroupSection
            title="Personal"
            groups={personalGroups}
            showMenu
            onPress={(group) => router.push(`/grupos/${group.id}`)}
            onMenu={(group) => {
              setSelectedGroup(group);
              setMenuVisible(true);
            }}
            currentUserId={user?.id}
          />

          <GroupSection
            title="Parejas"
            groups={coupleGroups}
            showMenu
            onPress={(group) => router.push(`/grupos/${group.id}`)}
            onMenu={(group) => {
              setSelectedGroup(group);
              setMenuVisible(true);
            }}
            currentUserId={user?.id}
          />

          <GroupSection
            title="Grupos"
            groups={sharedGroups}
            showMenu
            onPress={(group) => router.push(`/grupos/${group.id}`)}
            onMenu={(group) => {
              setSelectedGroup(group);
              setMenuVisible(true);
            }}
            currentUserId={user?.id}
          />
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