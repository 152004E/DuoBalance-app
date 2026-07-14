import { useCallback, useState, useRef } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect, useScrollToTop } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { HeroSection } from '@/components/layout/HeroSection';
import { useAuth } from '@/hooks/use-auth';
import { GroupSelector, type GroupOption } from '@/components/ui/group-selector';
import { RecentExpensesCard, type RecentExpense } from '@/components/expenses/recent-expenses-card';
import { FloatingAddButton } from '@/components/dashboard/FloatingAddButton';

interface CoupleExpense {
  id: string;
  name: string;
  partnerName: string;
  totalExpenses: number;
  partnerExpenses: number;
  transactionCount: number;
}

const MOCK_COUPLE_EXPENSES: CoupleExpense[] = [
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

function CoupleExpenseCard({ couple }: { couple: CoupleExpense }) {
  const total = couple.totalExpenses + couple.partnerExpenses;
  const userPercent = total > 0 ? (couple.totalExpenses / total) * 100 : 0;
  const partnerPercent = total > 0 ? (couple.partnerExpenses / total) * 100 : 0;

  return (
    <Pressable
      onPress={() => router.push(`/grupos/${couple.id}`)}
      className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm active:opacity-80"
      style={{
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
      }}
    >
      <View className="p-5">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="flex h-12 w-12 items-center justify-center rounded-full bg-[#10B981]/10">
              <FontAwesome6 name="heart" size={18} color="#10B981" solid />
            </View>
            <View>
              <Text className="text-lg font-bold text-[#0F172A]">
                {couple.name}
              </Text>
              <Text className="text-sm text-[#64748B]">
                {couple.transactionCount} transacciones este mes
              </Text>
            </View>
          </View>
          <View className="items-end">
            <Text
              className="text-lg font-bold text-[#006c49]"
              style={{ fontFamily: 'JetBrains Mono' }}
            >
              ${total.toLocaleString('es-CL')}
            </Text>
            <Text className="text-xs text-[#64748B]">Total</Text>
          </View>
        </View>

        <View className="mt-4">
          <View className="h-3 flex-row overflow-hidden rounded-full bg-[#ECEEF0]">
            <View
              className="h-full rounded-l-full bg-[#006c49]"
              style={{ width: `${userPercent}%` }}
            />
            <View
              className="h-full rounded-r-full bg-[#8B5CF6]"
              style={{ width: `${partnerPercent}%` }}
            />
          </View>
          <View className="mt-2 flex-row justify-between">
            <View className="flex-row items-center gap-1.5">
              <View className="h-2.5 w-2.5 rounded-full bg-[#006c49]" />
              <Text className="text-xs text-[#64748B]">
                {couple.name}: ${couple.totalExpenses.toLocaleString('es-CL')}
              </Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <View className="h-2.5 w-2.5 rounded-full bg-[#8B5CF6]" />
              <Text className="text-xs text-[#64748B]">
                {couple.partnerName}: ${couple.partnerExpenses.toLocaleString('es-CL')}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function GastosScreen() {
  const { user } = useAuth();
  const [focusCount, setFocusCount] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  useFocusEffect(
    useCallback(() => {
      setFocusCount(c => c + 1);
    }, []),
  );

  const totalExpensesAll = MOCK_COUPLE_EXPENSES.reduce(
    (sum, c) => sum + c.totalExpenses + c.partnerExpenses, 0,
  );
  const totalTransactionsAll = MOCK_COUPLE_EXPENSES.reduce(
    (sum, c) => sum + c.transactionCount, 0,
  );

  const filteredCouples = selectedGroup === 'all'
    ? MOCK_COUPLE_EXPENSES
    : MOCK_COUPLE_EXPENSES.filter(c => c.id === selectedGroup);

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

          <View className="gap-4">
            {filteredCouples.map((couple) => (
              <CoupleExpenseCard key={couple.id} couple={couple} />
            ))}
          </View>

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
