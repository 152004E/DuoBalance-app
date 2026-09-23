import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { useQueries } from '@tanstack/react-query';
import { getPersonalBudget } from '@/services/api/budget';
import { ScreenHeader } from '@/components/ui/screen-header';

const getMonthsToFetch = () => {
  const result = [];
  const date = new Date();
  for (let i = 0; i < 6; i++) {
    result.push({ month: date.getMonth() + 1, year: date.getFullYear() });
    date.setMonth(date.getMonth() - 1);
  }
  return result;
};

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function HistorialPresupuestoScreen() {
  const months = getMonthsToFetch();

  const queries = useQueries({
    queries: months.map((m) => ({
      queryKey: ['budget', m.month, m.year],
      queryFn: () => getPersonalBudget(m.month, m.year),
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView className="flex-1" contentContainerClassName="pb-10 pt-2" showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Historial de Gastos"
          subtitle="Resumen de tu actividad mensual"
          onBack={() => router.navigate('/')}
        />

        <View className="px-5 pt-6">
          <Text className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#64748B]">
            Últimos 6 meses
          </Text>

        {isLoading ? (
          <Text className="text-center text-[#64748B] py-10">Cargando historial...</Text>
        ) : (
          <View className="space-y-4">
            {queries.map((query, index) => {
              const data = query.data;
              const monthInfo = months[index];
              const limit = data?.budget || data?.income || 0;
              const spent = data?.totalSpent || 0;
              const isOver = spent > limit;
              const progress = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
              
              if (!data?.income && spent === 0) {
                return (
                  <View key={`${monthInfo.month}-${monthInfo.year}`} className="rounded-2xl border border-[#E2E8F0] bg-white p-4 opacity-50">
                    <Text className="font-bold text-[#0F172A]">{MONTH_NAMES[monthInfo.month - 1]} {monthInfo.year}</Text>
                    <Text className="text-sm text-[#64748B]">Sin información configurada</Text>
                  </View>
                );
              }

              return (
                <View key={`${monthInfo.month}-${monthInfo.year}`} className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
                  <View className="mb-3 flex-row items-center justify-between">
                    <Text className="text-base font-bold text-[#0F172A]">
                      {MONTH_NAMES[monthInfo.month - 1]} {monthInfo.year}
                    </Text>
                    {isOver ? (
                      <View className="rounded-full bg-red-100 px-2 py-1">
                        <Text className="text-xs font-bold text-red-600">Excedido</Text>
                      </View>
                    ) : (
                      <View className="rounded-full bg-green-100 px-2 py-1">
                        <Text className="text-xs font-bold text-[#059669]">En verde</Text>
                      </View>
                    )}
                  </View>

                  <View className="mb-2 flex-row justify-between items-end">
                    <View>
                      <Text className="text-xs font-semibold text-[#64748B] uppercase">Gastado</Text>
                      <Text className={`text-xl font-black ${isOver ? 'text-red-500' : 'text-[#0F172A]'}`}>
                        ${spent.toLocaleString('es-CL')}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-xs font-semibold text-[#64748B] uppercase">Límite</Text>
                      <Text className="text-base font-bold text-[#64748B]">
                        ${limit.toLocaleString('es-CL')}
                      </Text>
                    </View>
                  </View>

                  <View className="h-2 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
                    <View
                      className={`h-full rounded-full ${isOver ? 'bg-red-500' : 'bg-[#059669]'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
