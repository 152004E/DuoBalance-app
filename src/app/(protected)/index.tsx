import { useCallback, useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useScrollToTop, router } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';
import { useGroups } from '@/hooks/use-groups';
import { useGroupSummaries } from '@/hooks/use-group-summaries';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { useSettlementSuggestions } from '@/hooks/use-settlement-suggestions';
import { HeroSection } from '@/components/layout/HeroSection';
import { GroupSelector } from '@/components/ui/group-selector';
import { GroupSection } from '@/components/ui/group-section';
import { Loading } from '@/components/ui/loading';
import {
  RecentExpensesCard,
  type RecentExpense,
} from '@/components/expenses/recent-expenses-card';
import { TopCategory } from '@/components/dashboard/TopCategory';
import { PartnerBalance } from '@/components/dashboard/PartnerBalance';
import { FloatingAddButton } from '@/components/dashboard/FloatingAddButton';
import { useWorkspace } from '@/hooks/use-workspace';
import Toast from 'react-native-toast-message';

const fmt = (value: number) =>
  `$${Math.round(value).toLocaleString('es-CL')}`;

export default function DashboardScreen() {
  const { user } = useAuth();
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
  const [focusCount, setFocusCount] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);
  const showPersonal =
    workspace.category === 'all' || workspace.category === 'personal';
  const showCouple =
    workspace.category === 'all' || workspace.category === 'couple';
  const showGroup =
    workspace.category === 'all' || workspace.category === 'group';

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
    }, [refetch, refetchSuggestions]),
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
      text2: 'Toca para liquidar y saldar',
      visibilityTime: 6000,
      onPress: () => router.push(`/grupos/${primary.groupId}?liquidar=1`),
    });
  }, [dues, totalDue]);

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
            <View className="items-center rounded-xl border border-dashed border-[#E2E8F0] bg-white px-6 py-10">
              <Text className="text-center text-base font-semibold text-[#0F172A]">
                Sin gastos este mes
              </Text>
              <Text className="mt-1 text-center text-sm text-[#64748B]">
                Registra tu primer gasto para ver tu resumen aquí.
              </Text>
            </View>
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

      <FloatingAddButton />
    </SafeAreaView>
  );
}
