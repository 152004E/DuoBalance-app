import { useCallback, useState, useRef } from 'react';
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

const MOCK_COUPLE_RAW = [
  { id: '1', name: 'Andrea', partnerName: 'Ana', totalExpenses: 1200000, partnerExpenses: 800000, transactionCount: 15 },
  { id: '2', name: 'Carlos', partnerName: 'María', totalExpenses: 450000, partnerExpenses: 350000, transactionCount: 8 },
  { id: '3', name: 'Daniela', partnerName: 'Luis', totalExpenses: 280000, partnerExpenses: 190000, transactionCount: 5 },
];

const MOCK_EXPENSES: RecentExpense[] = [
  { id: '1', name: 'Pizza Hut', amount: 80000, paidBy: 'Ana', date: '15 Jun', category: 'ALIMENTACIÓN', icon: 'utensils', iconBg: '#F97316' },
  { id: '2', name: 'Artículos de Aseo', amount: 120000, paidBy: 'Carlos', date: 'Hace 2 días', category: 'HOGAR', icon: 'soap', iconBg: '#3B82F6' },
  { id: '3', name: 'Uber a Aeropuerto', amount: 45000, paidBy: 'Ana', date: '14 Jun', category: 'TRANSPORTE', icon: 'car', iconBg: '#8B5CF6' },
  { id: '4', name: 'Cine Colombia', amount: 62500, paidBy: 'Andrea', date: '12 Jun', category: 'ENTRETENCIÓN', icon: 'film', iconBg: '#06B6D4' },
  { id: '5', name: 'Juan Valdez', amount: 12000, paidBy: 'Emerson', date: 'Ayer', category: 'ALIMENTACIÓN', icon: 'mug-hot', iconBg: '#F97316' },
];

export default function GastosScreen() {
  const { user } = useAuth();
  const { groups } = useGroups();
  const [focusCount, setFocusCount] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  useFocusEffect(
    useCallback(() => {
      setFocusCount(c => c + 1);
    }, []),
  );

  const totalExpensesAll = MOCK_COUPLE_RAW.reduce(
    (sum, c) => sum + c.totalExpenses + c.partnerExpenses, 0,
  );
  const totalTransactionsAll = MOCK_COUPLE_RAW.reduce(
    (sum, c) => sum + c.transactionCount, 0,
  );

  const filteredGroups = selectedGroup === 'all'
    ? groups
    : groups.filter(g => g.id === selectedGroup);

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
          subtitle="Gastos totales por pareja"
          height={220}
          rightAction={
            <GroupSelector
              selectedId={selectedGroup}
              onSelect={(g: GroupOption) => setSelectedGroup(g.id)}
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
              expenses={MOCK_EXPENSES}
              onExpensePress={(expense) => router.push(`/gastos/detalle/${expense.id}`)}
            />
          </View>

          <Pressable className="mt-5 flex-row items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white py-4 active:opacity-80">
            <Text className="font-semibold text-[#0F766E]">Cargar más movimientos</Text>
            <Text className="text-[#0F766E] opacity-40">›</Text>
          </Pressable>
        </View>
      </ScrollView>

      <FloatingAddButton onPress={() => router.push('/gastos/add')} />
    </SafeAreaView>
  );
}
