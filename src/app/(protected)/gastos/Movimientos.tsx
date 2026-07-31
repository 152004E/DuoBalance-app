import { View, Text, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import {
  RecentExpensesCard,
  type RecentExpense,
} from '@/components/expenses/recent-expenses-card';
import { getExpenses } from '@/services/api/expenses';
import { useAuth } from '@/hooks/use-auth';
import type { ExpenseResponse } from '@/types/api';
import { FontAwesome6 } from '@expo/vector-icons';
import { FloatingAddButton } from '@/components/dashboard/FloatingAddButton';

const CATEGORY_ICONS: Record<string, { icon: string; bg: string }> = {
  FOOD: { icon: 'basket-shopping', bg: '#F97316' },
  TRANSPORT: { icon: 'car', bg: '#8B5CF6' },
  RENT: { icon: 'house', bg: '#3B82F6' },
  SERVICES: { icon: 'bolt', bg: '#F59E0B' },
  ENTERTAINMENT: { icon: 'film', bg: '#06B6D4' },
  OTHER: { icon: 'tag', bg: '#64748B' },
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
    amount: Number(e.amount),
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

export default function MovimientosScreen() {
  const { user } = useAuth();
  const [allExpenses, setAllExpenses] = useState<ExpenseResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      getExpenses()
        .then((data) => {
          if (active) setAllExpenses(data);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
    }, []),
  );

  const recentExpenses = allExpenses.map((e) =>
    expenseToRecent(e, user?.id ?? ''),
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      <ScreenHeader
        title="Movimientos"
        subtitle="Historial de tu actividad financiera"
        onBack={() => router.back()}
      />
      <View className="px-5 pb-5 pt-4">
        {/* Buscador + Filtros */}
        <View className="flex-row items-center gap-3">
          <View className="flex-1 flex-row items-center rounded-full bg-white px-4 py-3">
            <FontAwesome6 name="magnifying-glass" size={16} color="#94A3B8" />
            <TextInput
              placeholder="Buscar movimientos..."
              placeholderTextColor="#94A3B8"
              className="ml-3 flex-1 text-[15px] text-[#0F172A]"
            />
          </View>

          <Pressable className="flex-row items-center rounded-full bg-[#00795D] px-5 py-3 active:opacity-80">
            <FontAwesome6 name="sliders" size={14} color="#FFFFFF" />
            <Text className="ml-2 font-semibold text-white">Filtros</Text>
          </Pressable>
        </View>

        {/* Fechas */}
        <Pressable className="mt-4 flex-row items-center justify-between rounded-2xl bg-white px-4 py-4 shadow-sm">
          <View className="flex-row items-center">
            <FontAwesome6 name="calendar" size={16} color="#64748B" />
            <Text className="ml-2 font-medium text-[#334155]">
              Desde: 01/07
            </Text>
          </View>

          <Text className="text-[#94A3B8]">—</Text>

          <View className="flex-row items-center">
            <FontAwesome6 name="calendar" size={16} color="#64748B" />
            <Text className="ml-2 font-medium text-[#334155]">
              Hasta: 28/07
            </Text>
          </View>

          <FontAwesome6 name="chevron-right" size={14} color="#94A3B8" />
        </Pressable>
      </View>

      {loading ? (
        <Loading message="Cargando movimientos..." />
      ) : recentExpenses.length === 0 ? (
        <View className="flex-1 items-center justify-center px-5">
          <EmptyState
            title="Sin movimientos aún"
            description="Cuando registres gastos aparecerán aquí"
          />
        </View>
      ) : (
        <View className="flex-1 px-5 pt-4">
          <RecentExpensesCard
            expenses={recentExpenses}
            onExpensePress={(expense) =>
              router.push(`/gastos/detalle/${expense.id}`)
            }
          />
          {/* Load More Button */}
          <View className="mt-5 px-5">
            <Pressable className="flex-row items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white py-4 active:opacity-80">
              <Text className="font-semibold text-[#0F766E]">
                Cargar más movimientos
              </Text>
              <Text className="text-[#0F766E] opacity-40">›</Text>
            </Pressable>
          </View>
        </View>
      )}
      <FloatingAddButton onPress={() => router.push('/gastos/Movimientos')} />
    </SafeAreaView>
  );
}
