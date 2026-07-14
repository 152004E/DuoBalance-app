import { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ScreenHeader } from '@/components/ui/screen-header';
import { RecentExpensesCard, type RecentExpense } from '@/components/expenses/recent-expenses-card';
import { FloatingAddButton } from '@/components/dashboard/FloatingAddButton';
import { CreateExpenseSheet } from '@/components/movements/create-expense-sheet';

const MOCK_GROUP_NAMES: Record<string, string> = {
  '1': 'Andrea',
  '2': 'Carlos',
  '3': 'Daniela',
  '4': 'Viaje Cartagena',
};

const MOCK_MEMBERS: Record<string, { id: string; name: string }[]> = {
  '1': [{ id: 'user1', name: 'Tú' }, { id: 'user2', name: 'Ana' }],
  '2': [{ id: 'user1', name: 'Tú' }, { id: 'user3', name: 'María' }],
  '3': [{ id: 'user1', name: 'Tú' }, { id: 'user4', name: 'Luis' }],
  '4': [{ id: 'user1', name: 'Tú' }, { id: 'user5', name: 'Pedro' }, { id: 'user6', name: 'Sofía' }],
};

const DATE_FILTERS = ['Este mes', 'Últimos 3 meses', 'Este año', 'Todo'] as const;

const CATEGORY_FILTERS = [
  { label: '📋 Todas', value: 'all' },
  { label: '🍔 Comida', value: 'ALIMENTACIÓN' },
  { label: '🚗 Transporte', value: 'TRANSPORTE' },
  { label: '🏠 Vivienda', value: 'VIVIENDA' },
  { label: '💡 Servicios', value: 'SERVICIOS' },
  { label: '🎉 Entretención', value: 'ENTRETENCIÓN' },
  { label: '📦 Otros', value: 'OTROS' },
] as const;

const MOCK_EXPENSES: RecentExpense[] = [
  { id: '1', name: 'Mercado Semanal', amount: 185000, paidBy: 'Ana', date: '15 Jun 2026', category: 'ALIMENTACIÓN', icon: 'basket-shopping', iconBg: '#F97316' },
  { id: '2', name: 'Cuenta de Luz', amount: 95000, paidBy: 'Juan', date: '12 Jun 2026', category: 'SERVICIOS', icon: 'bolt', iconBg: '#F59E0B' },
  { id: '3', name: 'Cine + Cena', amount: 120000, paidBy: 'Ana', date: '10 Jun 2026', category: 'ENTRETENCIÓN', icon: 'film', iconBg: '#06B6D4' },
  { id: '4', name: 'Gasolina', amount: 85000, paidBy: 'Juan', date: '8 Jun 2026', category: 'TRANSPORTE', icon: 'gas-pump', iconBg: '#8B5CF6' },
  { id: '5', name: 'Arriendo', amount: 800000, paidBy: 'Ana', date: '5 Jun 2026', category: 'VIVIENDA', icon: 'house', iconBg: '#3B82F6' },
  { id: '6', name: 'Uber', amount: 15000, paidBy: 'Juan', date: '3 Jun 2026', category: 'TRANSPORTE', icon: 'car', iconBg: '#8B5CF6' },
];

export default function GroupExpensesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('Este mes');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [sheetVisible, setSheetVisible] = useState(false);

  const groupName = MOCK_GROUP_NAMES[id ?? ''] ?? 'Grupo';
  const members = MOCK_MEMBERS[id ?? ''] ?? [];

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title={groupName}
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
            expenses={MOCK_EXPENSES}
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
        groupId={id ?? ''}
        groupName={groupName}
        members={members}
      />
    </SafeAreaView>
  );
}
