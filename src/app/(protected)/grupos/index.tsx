import { useState, useRef, useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { joinGroup, leaveGroup, regenerateInviteCode } from '@/services/api/groups';
import { HeroSection } from '@/components/layout/HeroSection';
import { GroupSelector } from '@/components/ui/group-selector';
import { FloatingAddMenu } from '@/components/dashboard/FloatingAddMenu';
import {
  CoupleMenuSheet,
  type CoupleMenuAction,
} from '@/components/couple/couple-menu-sheet';
import { InviteMemberSheet } from '@/components/couple/invite-member-sheet';
import { JoinGroupSheet } from '@/components/couple/join-group-sheet';
import { AlertModal } from '@/components/ui/alert-modal';
import { GroupSection } from '@/components/ui/group-section';
import { useAuth } from '@/hooks/use-auth';
import { useGroups } from '@/hooks/use-groups';
import { useWorkspace } from '@/hooks/use-workspace';
import type { GroupResponse } from '@/types/api';

export default function ParejaScreen() {
  const { user } = useAuth();
  const { personalGroups, coupleGroups, sharedGroups, refetch } = useGroups();
  const { workspace, setWorkspace } = useWorkspace();

  const showPersonal =
    workspace.category === 'all' || workspace.category === 'personal';
  const showCouple =
    workspace.category === 'all' || workspace.category === 'couple';
  const showGroup = workspace.category === 'all' || workspace.category === 'group';
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupResponse | null>(
    null,
  );
  const [inviteVisible, setInviteVisible] = useState(false);
  const [showJoinSheet, setShowJoinSheet] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [leaveSuccess, setLeaveSuccess] = useState(false);
  const [leaveError, setLeaveError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerateSuccess, setRegenerateSuccess] = useState(false);
  const [regenerateError, setRegenerateError] = useState<string | null>(null);
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

  const handleLeaveGroup = useCallback(async () => {
    if (!selectedGroup || isLeaving) return;
    setIsLeaving(true);
    setLeaveError(null);
    try {
      await leaveGroup(selectedGroup.id);
      setShowLeaveConfirm(false);
      setSelectedGroup(null);
      setLeaveSuccess(true);
      refetch();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al salir del grupo';
      setShowLeaveConfirm(false);
      setLeaveError(message);
    } finally {
      setIsLeaving(false);
    }
  }, [selectedGroup, isLeaving, refetch]);

  const handleJoinGroup = useCallback(
    async (code: string) => {
      setIsJoining(true);
      setJoinError(null);
      try {
        await joinGroup({ inviteCode: code });
        setShowJoinSheet(false);
        setJoinSuccess(true);
        refetch();
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Error al unirse al grupo';
        setJoinError(message);
      } finally {
        setIsJoining(false);
      }
    },
    [refetch],
  );

  const handleRegenerateCode = useCallback(async () => {
    if (!selectedGroup) return;
    setIsRegenerating(true);
    setRegenerateError(null);
    try {
      const updated = await regenerateInviteCode(selectedGroup.id);
      setSelectedGroup(updated);
      setInviteVisible(false);
      setRegenerateSuccess(true);
      refetch();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al regenerar el código';
      setRegenerateError(message);
    } finally {
      setIsRegenerating(false);
    }
  }, [selectedGroup, refetch]);

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
          rightAction={
            <GroupSelector
              value={workspace}
              onChange={setWorkspace}
              personalGroups={personalGroups}
              coupleGroups={coupleGroups}
              sharedGroups={sharedGroups}
              variant="dark"
            />
          }
        />

        <View className="px-5 pt-8">
          <Text className="mb-4 text-2xl font-bold text-[#0F172A]">
            Tus Grupos
          </Text>

          {showPersonal && (
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
          )}

          {showCouple && (
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
          )}

          {showGroup && (
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
          )}
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
        invitationCode={selectedGroup?.inviteCode ?? ''}
        onRegenerate={handleRegenerateCode}
        isRegenerating={isRegenerating}
        heightRatio={0.65}
        headerFinalTranslateY={0.17}
      />

      <JoinGroupSheet
        visible={showJoinSheet}
        onClose={() => {
          if (!isJoining) setShowJoinSheet(false);
        }}
        onJoin={handleJoinGroup}
        isLoading={isJoining}
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
        buttonText={isLeaving ? 'Saliendo...' : 'Sí, salir'}
        cancelText="Cancelar"
        onCancel={() => {
          if (!isLeaving) setShowLeaveConfirm(false);
        }}
        onClose={() => {
          if (!isLeaving) handleLeaveGroup();
        }}
      />

      <AlertModal
        visible={leaveSuccess}
        type="success"
        title="Has salido del grupo"
        message="Ya no tienes acceso a este grupo."
        buttonText="Entendido"
        onClose={() => setLeaveSuccess(false)}
      />

      <AlertModal
        visible={leaveError !== null}
        type="error"
        title="Error al salir del grupo"
        message={leaveError ?? ''}
        buttonText="Cerrar"
        onClose={() => setLeaveError(null)}
      />

      <AlertModal
        visible={joinSuccess}
        type="success"
        title="¡Te has unido!"
        message="Ahora formas parte del grupo. Puedes empezar a registrar gastos compartidos."
        buttonText="Entendido"
        onClose={() => setJoinSuccess(false)}
      />

      <AlertModal
        visible={joinError !== null}
        type="error"
        title="Error al unirse"
        message={joinError ?? ''}
        buttonText="Cerrar"
        onClose={() => setJoinError(null)}
      />

      <AlertModal
        visible={regenerateSuccess}
        type="success"
        title="Código regenerado"
        message="El código de invitación se ha actualizado. Ahora puedes compartir el nuevo código."
        buttonText="Entendido"
        onClose={() => setRegenerateSuccess(false)}
      />

      <AlertModal
        visible={regenerateError !== null}
        type="error"
        title="Error al regenerar"
        message={regenerateError ?? ''}
        buttonText="Cerrar"
        onClose={() => setRegenerateError(null)}
      />
    </SafeAreaView>
  );
}
