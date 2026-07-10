import { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { HeroSection } from '@/components/layout/HeroSection';
import { useAuth } from '@/hooks/use-auth';
import { GroupSelector, type GroupOption } from '@/components/ui/group-selector';
import { RecentExpensesCard, type RecentExpense } from '@/components/expenses/recent-expenses-card';
import { FloatingAddButton } from '@/components/dashboard/FloatingAddButton';

type Category = 'Todas' | 'Comida' | 'Transporte' | 'Vivienda' | 'Servicios' | 'Entretención' | 'Otros';

const CATEGORIES: { label: Category; emoji: string }[] = [
  { label: 'Todas', emoji: '📋' },
  { label: 'Comida', emoji: '🍔' },
  { label: 'Transporte', emoji: '🚗' },
  { label: 'Vivienda', emoji: '🏠' },
  { label: 'Servicios', emoji: '💡' },
  { label: 'Entretención', emoji: '🎉' },
  { label: 'Otros', emoji: '📦' },
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
  const [focusCount, setFocusCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState<Category>('Todas');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  useFocusEffect(
    useCallback(() => {
      setFocusCount(c => c + 1);
    }, []),
  );

  const totalThisMonth = 850000;
  const transactionCount = 24;

  const filteredExpenses = MOCK_EXPENSES.filter(e => {
    const CATEGORY_MAP: Record<string, string> = {
      Comida: 'ALIMENTACIÓN',
      Transporte: 'TRANSPORTE',
      Vivienda: 'HOGAR',
      Servicios: 'SERVICIOS',
      Entretención: 'ENTRETENCIÓN',
      Otros: 'OTROS',
    };
    if (activeCategory !== 'Todas') {
      const targetCat = CATEGORY_MAP[activeCategory];
      if (targetCat && e.category !== targetCat) return false;
    }
    return true;
  });

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}
      >
        <HeroSection
          key={focusCount}
          variant="page"
          userName={user?.firstName ?? 'Usuario'}
          title="Gastos"
          subtitle="Controla tus gastos compartidos"
          height={220}
          rightAction={
            <GroupSelector
              selectedId={selectedGroup}
              onSelect={(g: GroupOption) => setSelectedGroup(g.id)}
              variant="dark"
            />
          }
        />

        <View className="px-5 mt-5">

          <View className="flex-row gap-3 mb-6">
            <View className="flex-1 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <Text className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                Gastado este mes
              </Text>
              <Text
                className="text-2xl font-bold text-[#006c49]"
                style={{ fontFamily: 'JetBrains Mono' }}
              >
                ${totalThisMonth.toLocaleString('es-CL')}
              </Text>
            </View>
            <View className="flex-1 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <Text className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                Transacciones
              </Text>
              <Text
                className="text-2xl font-bold text-[#0F172A]"
                style={{ fontFamily: 'JetBrains Mono' }}
              >
                {transactionCount}
              </Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-5 -mx-5 px-5"
          >
            <View className="flex-row gap-2">
              {CATEGORIES.map(cat => {
                const isActive = activeCategory === cat.label;
                return (
                  <Pressable
                    key={cat.label}
                    onPress={() => setActiveCategory(cat.label)}
                    className={`flex-row items-center gap-1.5 rounded-full px-4 py-2 ${
                      isActive
                        ? 'bg-[#10B981] shadow-sm'
                        : 'bg-white border border-[#E2E8F0]'
                    }`}
                  >
                    <Text className="text-sm">{cat.emoji}</Text>
                    <Text
                      className={`text-sm font-medium ${
                        isActive ? 'text-white font-bold' : 'text-[#64748B]'
                      }`}
                    >
                      {cat.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <RecentExpensesCard
            expenses={filteredExpenses}
            onExpensePress={(expense) => router.push(`/gastos/${expense.id}`)}
          />

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
