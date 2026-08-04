import { useCallback, useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect, useScrollToTop } from 'expo-router';
import { HeroSection } from '@/components/layout/HeroSection';
import { useAuth } from '@/hooks/use-auth';
import { useGroups } from '@/hooks/use-groups';
import { GroupSelector } from '@/components/ui/group-selector';
import { GroupSection } from '@/components/ui/group-section';
import { LoadMoreButton } from '@/components/ui/load-more-button';
import {
  RecentExpensesCard,
  type RecentExpense,
} from '@/components/expenses/recent-expenses-card';
import { FloatingAddButton } from '@/components/dashboard/FloatingAddButton';
import { CreateExpenseSheet } from '@/components/movements/create-expense-sheet';
import { DestinationSelector } from '@/components/movements/destination-selector';
import { getExpenses, createExpense } from '@/services/api/expenses';
import { useWorkspace } from '@/hooks/use-workspace';
import { getCategoryMeta } from '@/constants/categories';
import type { ExpenseResponse, GroupResponse } from '@/types/api';

function expenseToRecent(e: ExpenseResponse, userId: string): RecentExpense {
  const meta = getCategoryMeta(e.category);
  return {
    id: e.id,
    name: e.description,
    amount: Number(e.amount),
    paidBy: e.paidById === userId ? 'Tú' : 'Otro',
    date: new Date(e.createdAt).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
    }),
    category: e.category,
    icon: meta.icon,
    iconBg: meta.color,
  };
}

export default function GastosScreen() {
  const { user } = useAuth();
  const { groups, personalGroups, coupleGroups, sharedGroups } = useGroups();
  const [focusCount, setFocusCount] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);
  const { workspace, setWorkspace } = useWorkspace();
  const [allExpenses, setAllExpenses] = useState<ExpenseResponse[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [destSelectorVisible, setDestSelectorVisible] = useState(false);
  const [creatingExpenseGroup, setCreatingExpenseGroup] = useState<{
    group: GroupResponse;
    members: { id: string; name: string }[];
  } | null>(null);

  useFocusEffect(
    useCallback(() => {
      setFocusCount((c) => c + 1);
      getExpenses().then(setAllExpenses);
    }, []),
  );

  // Al cambiar el filtro/workspace, reiniciar el número visible de movimientos
  useEffect(() => {
    setVisibleCount(5);
  }, [workspace]);

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
        name: m.user.firstName,
      }));
      setCreatingExpenseGroup({ group, members });
    } else {
      setDestSelectorVisible(true);
    }
  }, [workspace, groups]);

  const handleDestSelect = useCallback((group: GroupResponse) => {
    setDestSelectorVisible(false);
    const members = group.members.map((m) => ({
      id: m.user.id,
      name: m.user.firstName,
    }));
    setCreatingExpenseGroup({ group, members });
  }, []);

  const handleCloseCreateSheet = useCallback(() => {
    setCreatingExpenseGroup(null);
  }, []);

  const filteredGroups = useMemo(
    () =>
      groups.filter((g) => {
        if (workspace.category === 'all') return true;
        if (workspace.category === 'personal' && g.type === 'PERSONAL')
          return true;
        if (workspace.category === 'couple' && g.type === 'COUPLE') {
          return workspace.groupId ? g.id === workspace.groupId : true;
        }
        if (workspace.category === 'group' && g.type === 'GROUP') {
          return workspace.groupId ? g.id === workspace.groupId : true;
        }
        return false;
      }),
    [groups, workspace],
  );

  const filteredGroupIds = useMemo(
    () => new Set(filteredGroups.map((g) => g.id)),
    [filteredGroups],
  );

  const filteredExpenses = useMemo(
    () => allExpenses.filter((e) => filteredGroupIds.has(e.groupId)),
    [allExpenses, filteredGroupIds],
  );

  const totalExpensesAll = useMemo(
    () => filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0),
    [filteredExpenses],
  );

  const totalTransactionsAll = filteredExpenses.length;

  const recentExpenses = useMemo(
    () => filteredExpenses.map((e) => expenseToRecent(e, user?.id ?? '')),
    [filteredExpenses, user?.id],
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}
      >
        <HeroSection
          key={focusCount}
          variant="page"
          userName={user?.firstName ?? 'Usuario'}
          title="Gastos"
          subtitle="Gastos totales"
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

        <View className="mt-5 px-5">
          <View className="mb-6 flex-row gap-3">
            <View className="flex-1 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <Text className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Total Gastado
              </Text>
              <Text
                className="text-2xl font-bold text-[#006c49]"
                style={{ fontFamily: 'JetBrains Mono' }}
              >
                $ {totalExpensesAll.toLocaleString('es-CL')}
              </Text>
            </View>
            <View className="flex-1 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <Text className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Transacciones
              </Text>
              <Text
                className="text-2xl font-bold text-[#0F172A]"
                style={{ fontFamily: 'JetBrains Mono' }}
              >
                {totalTransactionsAll}
              </Text>
            </View>
          </View>

          <Text className="mb-4 text-base font-bold text-[#0F172A]">
            Gastos por Pareja
          </Text>

          <GroupSection
            title=""
            groups={filteredGroups}
            onPress={(group) => router.push(`/grupos/${group.id}`)}
            currentUserId={user?.id}
          />

          <View className="mt-6">
            <Text className="mb-3 text-base font-bold text-[#0F172A]">
              Últimos Movimientos
            </Text>
            <RecentExpensesCard
              expenses={recentExpenses}
              maxItems={visibleCount}
              onViewAll={() => router.push('/gastos/Movimientos')}
              onExpensePress={(expense) =>
                router.push(`/gastos/detalle/${expense.id}`)
              }
            />
          </View>

          <View className="mt-5">
            <LoadMoreButton
              visibleCount={visibleCount}
              totalCount={filteredExpenses.length}
              step={5}
              onLoadMore={setVisibleCount}
            />
          </View>
        </View>
      </ScrollView>

      <FloatingAddButton onPress={handleCreateExpense} />

      <DestinationSelector
        visible={destSelectorVisible}
        onClose={() => setDestSelectorVisible(false)}
        filter={workspace}
        personalGroups={personalGroups}
        coupleGroups={coupleGroups}
        sharedGroups={sharedGroups}
        onSelect={handleDestSelect}
        heightRatio={0.35}
        headerFinalTranslateY={0.45}
      />

      {creatingExpenseGroup && (
        <CreateExpenseSheet
          visible={!!creatingExpenseGroup}
          onClose={handleCloseCreateSheet}
          group={creatingExpenseGroup.group}
          members={creatingExpenseGroup.members}
          heightRatio={0.65}
          headerFinalTranslateY={0.19}
          onCreateExpense={async (payload) => {
            try {
              await createExpense(payload);
              handleCloseCreateSheet();
              getExpenses().then(setAllExpenses);
            } catch (error) {
              console.error('Error al crear gasto:', error);
            }
          }}
        />
      )}
    </SafeAreaView>
  );
}
