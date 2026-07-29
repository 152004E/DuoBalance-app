import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ScreenHeader } from '@/components/ui/screen-header';
import {
  RecentExpensesCard,
  type RecentExpense,
} from '@/components/expenses/recent-expenses-card';
import { FloatingAddButton } from '@/components/dashboard/FloatingAddButton';
import { CreateExpenseSheet } from '@/components/movements/create-expense-sheet';
import { getGroup } from '@/services/api/groups';
import { getExpenses, createExpense } from '@/services/api/expenses';
import { useAuth } from '@/hooks/use-auth';
import type { GroupResponse, ExpenseResponse } from '@/types/api';

const CATEGORY_ICONS: Record<string, { icon: string; bg: string }> = {
  ALIMENTACIÓN: { icon: 'basket-shopping', bg: '#F97316' },
  TRANSPORTE: { icon: 'car', bg: '#8B5CF6' },
  VIVIENDA: { icon: 'house', bg: '#3B82F6' },
  SERVICIOS: { icon: 'bolt', bg: '#F59E0B' },
  ENTRETENCIÓN: { icon: 'film', bg: '#06B6D4' },
  OTROS: { icon: 'tag', bg: '#64748B' },
};

const DATE_FILTERS = [
  'Este mes',
  'Últimos 3 meses',
  'Este año',
  'Todo',
] as const;
const CATEGORY_FILTERS = [
  { label: '📋 Todas', value: 'all' },
  { label: '🍔 Comida', value: 'ALIMENTACIÓN' },
  { label: '🚗 Transporte', value: 'TRANSPORTE' },
  { label: '🏠 Vivienda', value: 'VIVIENDA' },
  { label: '💡 Servicios', value: 'SERVICIOS' },
  { label: '🎉 Entretención', value: 'ENTRETENCIÓN' },
  { label: '📦 Otros', value: 'OTROS' },
] as const;

function expenseToRecent(e: ExpenseResponse, userId: string): RecentExpense {
  const payer = e.splits?.find((s) => s.userId === e.paidById)
    ? undefined
    : undefined;
  const cat = CATEGORY_ICONS[e.category] ?? { icon: 'tag', bg: '#64748B' };
  return {
    id: e.id,
    name: e.description,
    amount: e.amount,
    paidBy: e.paidById === userId ? 'Tú' : 'Otro',
    date: new Date(e.createdAt).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    category: e.category,
    icon: cat.icon,
    iconBg: cat.bg,
  };
}

export default function GroupExpensesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [group, setGroup] = useState<GroupResponse | null>(null);
  const [expenses, setExpenses] = useState<ExpenseResponse[]>([]);
  const [selectedDateFilter, setSelectedDateFilter] =
    useState<string>('Este mes');
  const [selectedCategoryFilter, setSelectedCategoryFilter] =
    useState<string>('all');
  const [sheetVisible, setSheetVisible] = useState(false);

  useEffect(() => {
    if (!id) return;
    getGroup(id).then(setGroup);
    loadExpenses();
  }, [id]);

  const loadExpenses = async () => {
    if (!id) return;
    const data = await getExpenses({ groupId: id });
    setExpenses(data);
  };

  if (!group || !user) return null;

  const members = group.members.map((m) => ({
    id: m.user.id,
    name: m.user.id === user.id ? 'Tú' : m.user.firstName,
  }));

  const recentExpenses = expenses.map((e) => expenseToRecent(e, user.id));

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title={group.name}
          subtitle="Todos los gastos del grupo"
          onBack={() => router.push(`/grupos/${id}`)}
        />

        {/* Date Filter */}
        <View className="mt-5">
          <Text className="mb-3 px-5 text-sm font-semibold text-[#64748B]">
            Período
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-5"
            contentContainerClassName="flex-row gap-2"
          >
            {DATE_FILTERS.map((filter) => {
              const isActive = selectedDateFilter === filter;
              return (
                <Pressable
                  key={filter}
                  onPress={() => setSelectedDateFilter(filter)}
                  className={`rounded-full px-5 py-2.5 ${
                    isActive
                      ? 'bg-[#10B981]'
                      : 'border border-[#E2E8F0] bg-white'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      isActive ? 'text-white' : 'text-[#64748B]'
                    }`}
                  >
                    {filter}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Category Filter */}
        <View className="mt-4">
          <Text className="mb-3 px-5 text-sm font-semibold text-[#64748B]">
            Categoría
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-5"
            contentContainerClassName="flex-row gap-2"
          >
            {CATEGORY_FILTERS.map((filter) => {
              const isActive = selectedCategoryFilter === filter.value;
              return (
                <Pressable
                  key={filter.value}
                  onPress={() => setSelectedCategoryFilter(filter.value)}
                  className={`rounded-full px-5 py-2.5 ${
                    isActive
                      ? 'bg-[#10B981]'
                      : 'border border-[#E2E8F0] bg-white'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      isActive ? 'text-white' : 'text-[#64748B]'
                    }`}
                  >
                    {filter.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Expenses List */}
        <View className="mt-6 px-5">
          <RecentExpensesCard
            expenses={recentExpenses}
            onExpensePress={(expense) =>
              router.push(`/gastos/detalle/${expense.id}`)
            }
          />
        </View>

        {/* Load More Button */}
        <View className="mt-5 px-5">
          <Pressable className="flex-row items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white py-4 active:opacity-80">
            <Text className="font-semibold text-[#0F766E]">
              Cargar más movimientos
            </Text>
            <Text className="text-[#0F766E] opacity-40">›</Text>
          </Pressable>
        </View>
      </ScrollView>

      <FloatingAddButton onPress={() => setSheetVisible(true)} />

      <CreateExpenseSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        group={group}
        members={members}
        onCreateExpense={async (payload) => {
          await createExpense(payload as any);
          setSheetVisible(false);
          loadExpenses();
        }}
      />
    </SafeAreaView>
  );
}
