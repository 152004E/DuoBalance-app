import { useCallback, useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useScrollToTop, router, Redirect } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';
import { useGroups } from '@/hooks/use-groups';
import { useGroupSummaries } from '@/hooks/use-group-summaries';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { useSettlementSuggestions } from '@/hooks/use-settlement-suggestions';
import { usePendingIncomingPayments } from '@/hooks/use-pending-incoming-payments';
import { HeroSection } from '@/components/layout/HeroSection';
import { PwaInstallBanner } from '@/components/ui/pwa-install-banner';
import { GroupSelector } from '@/components/ui/group-selector';
import { GroupSection } from '@/components/ui/group-section';
import { EmptyStateCard } from '@/components/ui/empty-state-card';
import { Loading } from '@/components/ui/loading';
import {
  RecentExpensesCard,
  type RecentExpense,
} from '@/components/expenses/recent-expenses-card';
import { TopCategory } from '@/components/dashboard/TopCategory';
import { PartnerBalance } from '@/components/dashboard/PartnerBalance';
import { DashboardActionMenu } from '@/components/dashboard/dashboard-action-menu';
import { CreateCoupleSheet } from '@/components/couple/create-couple-sheet';
import { JoinGroupSheet } from '@/components/couple/join-group-sheet';
import { DestinationSelector } from '@/components/movements/destination-selector';
import { CreateExpenseSheet } from '@/components/movements/create-expense-sheet';
import { createExpense, uploadExpenseReceipt } from '@/services/api/expenses';
import { joinGroup } from '@/services/api/groups';
import type { GroupResponse } from '@/types/api';
import { useWorkspace } from '@/hooks/use-workspace';
import { WelcomeModal } from '@/components/auth/welcome-modal';
import Toast from 'react-native-toast-message';

const fmt = (value: number) => `$${Math.round(value).toLocaleString('es-CL')}`;

export default function DashboardScreen() {
  const { user } = useAuth();

  if (user?.role === 'SUPER_ADMIN') {
    return <Redirect href="/admin" />;
  }

  const { groups, personalGroups, coupleGroups, sharedGroups } = useGroups();
  const { workspace, setWorkspace } = useWorkspace();
  const { summaries } = useGroupSummaries(groups);
  const {
    isLoading,
    hasData,
    balance,
    partnerShare,
    direction,
    transactions,
    topCategory,
    memberSplit,
    refetch,
  } = useDashboardData(workspace, groups, user?.id);
  const {
    dues,
    totalDue,
    refetch: refetchSuggestions,
  } = useSettlementSuggestions({
    workspace,
    groups,
    userId: user?.id,
  });
  const {
    incomingPayments,
    totalIncoming,
    refetch: refetchIncoming,
  } = usePendingIncomingPayments({
    workspace,
    groups,
    userId: user?.id,
  });
  const [focusCount, setFocusCount] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);
  const showPersonal =
    workspace.category === 'all' || workspace.category === 'personal';
  const showCouple =
    workspace.category === 'all' || workspace.category === 'couple';
  const showGroup =
    workspace.category === 'all' || workspace.category === 'group';

  const [showCreateGroupSheet, setShowCreateGroupSheet] = useState(false);
  const [showJoinSheet, setShowJoinSheet] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [destSelectorVisible, setDestSelectorVisible] = useState(false);
  const [creatingExpenseGroup, setCreatingExpenseGroup] = useState<{
    group: GroupResponse;
    members: { id: string; name: string }[];
  } | null>(null);

  const handleCreateExpense = useCallback(() => {
    if (workspace.groupId) {
      const group = groups.find((g) => g.id === workspace.groupId);
      if (!group) {
        setWorkspace({ category: workspace.category, groupId: null });
        setDestSelectorVisible(true);
        return;
      }
      const members = group.members.map((m) => ({
        id: m.user.id,
        name: m.user.id === user?.id ? 'Tú' : m.user.firstName,
      }));
      setCreatingExpenseGroup({ group, members });
    } else {
      setDestSelectorVisible(true);
    }
  }, [workspace, groups, user?.id]);

  const handleDestSelect = useCallback((group: GroupResponse) => {
    setDestSelectorVisible(false);
    const members = group.members.map((m) => ({
      id: m.user.id,
      name: m.user.id === user?.id ? 'Tú' : m.user.firstName,
    }));
    setCreatingExpenseGroup({ group, members });
  }, [user?.id]);

  const handleJoinGroup = useCallback(async (code: string) => {
    setIsJoining(true);
    try {
      await joinGroup({ inviteCode: code });
      setShowJoinSheet(false);
      refetch();
      Toast.show({ type: 'success', text1: '¡Te has unido!', text2: 'Ahora formas parte del grupo.' });
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Error al unirse', text2: err.message || 'Intenta de nuevo' });
    } finally {
      setIsJoining(false);
    }
  }, [refetch]);

  const handleCloseCreateSheet = useCallback(() => {
    setCreatingExpenseGroup(null);
  }, []);


  // "Aportes del mes" solo aplica a parejas y grupos (comparación de quién pagó)
  const isPersonalMode =
    workspace.category === 'personal' ||
    (!!workspace.groupId &&
      groups.find((g) => g.id === workspace.groupId)?.type === 'PERSONAL');

  useFocusEffect(
    useCallback(() => {
      setFocusCount((c) => c + 1);
      refetch();
      refetchSuggestions();
      refetchIncoming();
    }, [refetch, refetchSuggestions, refetchIncoming]),
  );

  useEffect(() => {
    if (dues.length === 0) return;
    const primary = dues[0];
    Toast.show({
      type: 'warning',
      text1:
        dues.length === 1
          ? `Le debes a ${primary.toFirstName} ${fmt(totalDue)}`
          : `Tienes deudas por ${fmt(totalDue)}`,
      text2: 'Toca para pagar la cuenta',
      visibilityTime: 6000,
      onPress: () => router.push(`/grupos/${primary.groupId}?liquidar=1`),
    });
  }, [dues, totalDue]);

  useEffect(() => {
    if (incomingPayments.length === 0) return;
    const primary = incomingPayments[0];
    Toast.show({
      type: 'success',
      text1:
        incomingPayments.length === 1
          ? `${primary.fromFirstName} te pagó ${fmt(primary.amount)}`
          : `Tienes ${incomingPayments.length} pagos por confirmar`,
      text2: 'Toca para confirmar el pago',
      visibilityTime: 6000,
      onPress: () => router.push(`/grupos/${primary.groupId}?liquidar=1`),
    });
  }, [incomingPayments, totalIncoming]);

  return (
    <SafeAreaView className="relative flex-1 bg-[#F8FAFC]" edges={['top']}>
      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}
      >
        <HeroSection
          key={focusCount}
          userName={user?.firstName ?? 'Usuario'}
          variant="dashboard"
          balance={isLoading ? 0 : balance}
          partnerShare={partnerShare}
          direction={direction}
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

        <PwaInstallBanner />

        <View className="px-5 pt-8">
          <Text className="mb-4 text-2xl font-bold text-[#0F172A]">
            Tus Grupos
          </Text>

          {showPersonal && (
            <GroupSection
              title="Personal"
              groups={personalGroups}
              summaries={summaries}
              horizontal
              onPress={(group) => router.push(`/grupos/${group.id}`)}
              currentUserId={user?.id}
            />
          )}

          {showCouple && (
            <GroupSection
              title="Parejas"
              groups={coupleGroups}
              summaries={summaries}
              horizontal
              onPress={(group) => router.push(`/grupos/${group.id}`)}
              currentUserId={user?.id}
            />
          )}

          {showGroup && (
            <GroupSection
              title="Grupos"
              groups={sharedGroups}
              summaries={summaries}
              horizontal
              onPress={(group) => router.push(`/grupos/${group.id}`)}
              currentUserId={user?.id}
            />
          )}
        </View>

        <View className="mt-6 space-y-6 px-5">
          {isLoading ? (
            <Loading message="Cargando tu actividad..." />
          ) : !hasData ? (
            <EmptyStateCard
              title="Sin gastos este mes"
              description="Registra tu primer gasto para ver tu resumen aquí."
            />
          ) : (
            <>
              <RecentExpensesCard
                expenses={transactions}
                maxItems={5}
                onViewAll={() => router.push('/gastos/Movimientos')}
                onExpensePress={(expense: RecentExpense) =>
                  router.push(`/gastos/detalle/${expense.id}`)
                }
              />
              {topCategory && (
                <TopCategory
                  category={topCategory.category}
                  amount={topCategory.amount}
                  percentage={topCategory.percentage}
                  icon={topCategory.icon}
                  color={topCategory.color}
                />
              )}
              {!isPersonalMode && (
                <PartnerBalance
                  userName={memberSplit.userName}
                  partnerName={memberSplit.partnerName}
                  userAmount={memberSplit.userAmount}
                  partnerAmount={memberSplit.partnerAmount}
                  title="Aportes del mes"
                />
              )}
            </>
          )}
        </View>
      </ScrollView>

      
      <DashboardActionMenu 
        onCreateExpense={handleCreateExpense}
        onCreateGroup={() => setShowCreateGroupSheet(true)}
        onJoinGroup={() => setShowJoinSheet(true)}
      />

      <CreateCoupleSheet
        visible={showCreateGroupSheet}
        onClose={() => setShowCreateGroupSheet(false)}
      />

      <JoinGroupSheet
        visible={showJoinSheet}
        onClose={() => {
          if (!isJoining) setShowJoinSheet(false);
        }}
        onJoin={handleJoinGroup}
        isLoading={isJoining}
      />

      <DestinationSelector
        visible={destSelectorVisible}
        onClose={() => setDestSelectorVisible(false)}
        filter={workspace}
        personalGroups={personalGroups}
        coupleGroups={coupleGroups}
        sharedGroups={sharedGroups}
        onSelect={handleDestSelect}
      />

      {creatingExpenseGroup && (
        <CreateExpenseSheet
          visible={!!creatingExpenseGroup}
          onClose={handleCloseCreateSheet}
          group={creatingExpenseGroup.group}
          members={creatingExpenseGroup.members}
          currentUserId={user?.id}
          onCreateExpense={async (payload) => {
            try {
              const { receipt, ...expenseData } = payload;
              const created = await createExpense(expenseData);
              if (receipt) {
                try {
                  await uploadExpenseReceipt(created.id, receipt);
                } catch (receiptError) {
                  Toast.show({
                    type: 'warning',
                    text1: 'Gasto registrado',
                    text2: 'El gasto se guardó, pero no se pudo subir el comprobante.',
                  });
                  handleCloseCreateSheet();
                  refetch();
                  return;
                }
              }
              handleCloseCreateSheet();
              refetch();
              Toast.show({
                type: 'success',
                text1: 'Gasto registrado',
                text2: `${payload.description} · ${payload.amount.toLocaleString('es-CL')}`,
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'No se pudo registrar el gasto',
                text2: 'Revisa tu conexión e intenta de nuevo.',
              });
            }
          }}
        />
      )}

      <WelcomeModal />
    </SafeAreaView>
  );
}
