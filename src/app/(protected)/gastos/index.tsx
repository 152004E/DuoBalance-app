import { useCallback, useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect, useScrollToTop } from 'expo-router';
import { HeroSection } from '@/components/layout/HeroSection';
import { useAuth } from '@/hooks/use-auth';
import { useGroups } from '@/hooks/use-groups';
import { GroupSelector, type GroupOption } from '@/components/ui/group-selector';
import { GroupSection } from '@/components/ui/group-section';
import { RecentExpensesCard, type RecentExpense } from '@/components/expenses/recent-expenses-card';
import { FloatingAddButton } from '@/components/dashboard/FloatingAddButton';
import { getExpenses } from '@/services/api/expenses';
import type { ExpenseResponse } from '@/types/api';

const FILTER_OPTIONS: GroupOption[] = [
  { id: 'all', name: 'Todos', type: 'personal' },
  { id: 'personal', name: 'Personal', type: 'personal' },
  { id: 'couple', name: 'Parejas', type: 'couple' },
  { id: 'group', name: 'Grupos', type: 'group' },
];

const CATEGORY_ICONS: Record<string, { icon: string; bg: string }> = {
  ALIMENTACIÓN: { icon: 'basket-shopping', bg: '#F97316' },
  TRANSPORTE: { icon: 'car', bg: '#8B5CF6' },
  VIVIENDA: { icon: 'house', bg: '#3B82F6' },
  SERVICIOS: { icon: 'bolt', bg: '#F59E0B' },
  ENTRETENCIÓN: { icon: 'film', bg: '#06B6D4' },
  OTROS: { icon: 'tag', bg: '#64748B' },
};

function expenseToRecent(e: ExpenseResponse, userId: string): RecentExpense {
  const cat = CATEGORY_ICONS[e.category] ?? { icon: 'tag', bg: '#64748B' };
  return {
    id: e.id,
    name: e.description,
    amount: e.amount,
    paidBy: e.paidById === userId ? 'Tú' : 'Otro',
    date: new Date(e.createdAt).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
    }),
    category: e.category,
    icon: cat.icon,
    iconBg: cat.bg,
  };
}

export default function GastosScreen() {
  const { user } = useAuth();
  const { groups } = useGroups();
  const [focusCount, setFocusCount] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [allExpenses, setAllExpenses] = useState<ExpenseResponse[]>([]);

  useFocusEffect(
    useCallback(() => {
      setFocusCount(c => c + 1);
      getExpenses().then(setAllExpenses);
    }, []),
  );

  const showPersonal = selectedFilter === 'all' || selectedFilter === 'personal';
  const showCouple   = selectedFilter === 'all' || selectedFilter === 'couple';
  const showGroup    = selectedFilter === 'all' || selectedFilter === 'group';

  const filteredGroups = groups.filter((g) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'personal' && g.type === ('PERSONAL' as const)) return true;
    if (selectedFilter === 'couple' && g.type === ('COUPLE' as const)) return true;
    if (selectedFilter === 'group' && g.type === ('GROUP' as const)) return true;
    return false;
  });

  const filteredGroupIds = new Set(filteredGroups.map((g) => g.id));
  const filteredExpenses = allExpenses.filter((e) => filteredGroupIds.has(e.groupId));

  const totalExpensesAll = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalTransactionsAll = filteredExpenses.length;

  const recentExpenses = filteredExpenses
    .slice(0, 10)
    .map((e) => expenseToRecent(e, user?.id ?? ''));

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
              selectedId={selectedFilter}
              onSelect={(g: GroupOption) => setSelectedFilter(g.id)}
              options={FILTER_OPTIONS}
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
                ${totalExpensesAll.toLocaleString('es-CL')}
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
              onExpensePress={(expense) => router.push(`/gastos/detalle/${expense.id}`)}
            />
          </View>

          <Pressable className="mt-5 flex-row items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white py-4 active:opacity-80">
            <Text className="font-semibold text-[#0F766E]">Cargar más movimientos</Text>
            <Text className="text-[#0F766E] opacity-40">›</Text>
          </Pressable>
        </View>
      </ScrollView>

      <FloatingAddButton />
    </SafeAreaView>
  );
}
