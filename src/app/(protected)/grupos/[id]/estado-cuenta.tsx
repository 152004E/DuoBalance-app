import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useQueries } from '@tanstack/react-query';
import { getSettlement } from '@/services/api/payments';
import { ScreenHeader } from '@/components/ui/screen-header';
import { FontAwesome6 } from '@expo/vector-icons';
import { Loading } from '@/components/ui/loading';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const getMonthsToFetch = () => {
  const result = [];
  const date = new Date();
  for (let i = 0; i < 6; i++) {
    result.push({ month: date.getMonth() + 1, year: date.getFullYear() });
    date.setMonth(date.getMonth() - 1);
  }
  return result;
};

export default function EstadoCuentaScreen() {
  const { id } = useLocalSearchParams();
  const months = getMonthsToFetch();

  const queries = useQueries({
    queries: months.map((m) => ({
      queryKey: ['settlement', id, m.month, m.year],
      queryFn: () => getSettlement(id as string, m.month, m.year),
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);

  const fmt = (val: number | string) => {
    const num = Number(val);
    return isNaN(num) ? '$0' : '$' + num.toLocaleString('es-CL');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-10 pt-2"
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="Estado de cuenta"
          subtitle="Historial mensual de deudas y pagos"
          onBack={() => router.back()}
        />

        {isLoading ? (
          <View className="mt-20">
            <Loading />
          </View>
        ) : (
          <View className="px-5 mt-4 flex-col" style={{ gap: 16 }}>
            {months.map((m, index) => {
              const data = queries[index].data;
              if (!data) return null;

              // Mostrar meses con actividad o el mes actual
              const hasActivity =
                Number(data.totalExpenses) > 0 ||
                Number(data.paymentsMade) > 0 ||
                Number(data.paymentsReceived) > 0 ||
                Number(data.balanceAmount) > 0;

              if (!hasActivity && index !== 0) return null;

              const isOwed = data.settlementDirection === 'OWED_TO_ME';
              const isOwe = data.settlementDirection === 'I_OWE';

              return (
                <View
                  key={`${m.month}-${m.year}`}
                  className="rounded-xl border border-[#E2E8F0] bg-white p-4"
                  style={{
                    shadowColor: '#0F172A',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.05,
                    shadowRadius: 12,
                    elevation: 2,
                  }}
                >
                  <View className="mb-3 border-b border-[#E2E8F0] pb-3">
                    <Text className="text-sm font-bold uppercase tracking-wider text-[#64748B]">
                      {MONTH_NAMES[m.month - 1]} {m.year}
                    </Text>
                  </View>

                  <View className="flex-col" style={{ gap: 12 }}>
                    {/* Deuda generada por gastos */}
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center" style={{ gap: 8 }}>
                        <View className="h-6 w-6 items-center justify-center rounded-full bg-slate-100">
                          <FontAwesome6 name="receipt" size={10} color="#64748B" />
                        </View>
                        <Text className="text-sm text-[#475569]">Deuda por gastos</Text>
                      </View>
                      <Text className={`text-sm font-semibold ${
                        data.balanceDirection === 'OWED_TO_ME'
                          ? 'text-[#F59E0B]'
                          : data.balanceDirection === 'I_OWE'
                            ? 'text-[#EF4444]'
                            : 'text-[#64748B]'
                      }`}>
                        {data.balanceDirection === 'OWED_TO_ME' ? '+' : data.balanceDirection === 'I_OWE' ? '-' : ''}
                        {fmt(data.balanceAmount)}
                      </Text>
                    </View>

                    {/* Pagos realizados */}
                    {Number(data.paymentsMade) > 0 && (
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center" style={{ gap: 8 }}>
                          <View className="h-6 w-6 items-center justify-center rounded-full bg-slate-100">
                            <FontAwesome6 name="money-bill-transfer" size={10} color="#64748B" />
                          </View>
                          <Text className="text-sm text-[#475569]">Pagos realizados</Text>
                        </View>
                        <Text className="text-sm font-semibold text-[#10B981]">
                          +{fmt(data.paymentsMade)}
                        </Text>
                      </View>
                    )}

                    {/* Pagos recibidos */}
                    {Number(data.paymentsReceived) > 0 && (
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center" style={{ gap: 8 }}>
                          <View className="h-6 w-6 items-center justify-center rounded-full bg-slate-100">
                            <FontAwesome6 name="money-bill-transfer" size={10} color="#64748B" />
                          </View>
                          <Text className="text-sm text-[#475569]">Pagos recibidos</Text>
                        </View>
                        <Text className="text-sm font-semibold text-[#EF4444]">
                          -{fmt(data.paymentsReceived)}
                        </Text>
                      </View>
                    )}

                    {/* Resultado final del mes */}
                    <View className="mt-2 pt-3 border-t border-slate-100 flex-row items-center justify-between">
                      <Text className="text-[15px] font-bold text-[#0F172A]">Balance del mes</Text>
                      <Text className={`text-[15px] font-bold ${
                        isOwed ? 'text-[#F59E0B]' : isOwe ? 'text-[#EF4444]' : 'text-[#10B981]'
                      }`}>
                        {isOwed ? `Te deben ${fmt(data.netSettlement)}` : isOwe ? `Debes ${fmt(data.netSettlement)}` : 'Mes saldado'}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
