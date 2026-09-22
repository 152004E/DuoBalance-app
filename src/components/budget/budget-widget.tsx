import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useBudget } from '@/hooks/use-budget';

interface BudgetWidgetProps {
  onConfigurePress: () => void;
  onHistoryPress: () => void;
}

export function BudgetWidget({ onConfigurePress, onHistoryPress }: BudgetWidgetProps) {
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const { budget, isLoading } = useBudget(month, year);

  if (isLoading) {
    return (
      <View className="mb-6 rounded-3xl bg-white p-5 shadow-sm border border-[#E2E8F0]">
        <Text className="text-center text-[#64748B]">Cargando resumen...</Text>
      </View>
    );
  }

  const limit = budget?.budget || budget?.income || 0;
  const spent = budget?.totalSpent || 0;
  const progress = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const isOverBudget = spent > limit;

  return (
    <View className="mb-6 rounded-3xl bg-white p-5 shadow-sm border border-[#E2E8F0]">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-bold text-[#0F172A]">Mi Dinero Disponible</Text>
        <TouchableOpacity onPress={onHistoryPress} className="flex-row items-center gap-1">
          <Text className="text-sm font-semibold text-[#059669]">Historial</Text>
          <FontAwesome6 name="chevron-right" size={12} color="#059669" />
        </TouchableOpacity>
      </View>

      {!budget ? (
        <View className="items-center py-4">
          <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-orange-100">
            <FontAwesome6 name="wallet" size={20} color="#F97316" />
          </View>
          <Text className="mb-3 text-center text-sm text-[#64748B]">
            No has definido tu ingreso para este mes.
          </Text>
          <TouchableOpacity
            onPress={onConfigurePress}
            className="rounded-xl bg-[#0F172A] px-6 py-2.5"
          >
            <Text className="font-bold text-white">Configurar mes</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <View className="mb-2 flex-row justify-between items-end">
            <View>
              <Text className="text-xs font-semibold text-[#64748B] uppercase">Gastado</Text>
              <Text className={`text-2xl font-black ${isOverBudget ? 'text-red-500' : 'text-[#0F172A]'}`}>
                ${spent.toLocaleString('es-CL')}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-xs font-semibold text-[#64748B] uppercase">Límite</Text>
              <Text className="text-lg font-bold text-[#64748B]">
                ${limit.toLocaleString('es-CL')}
              </Text>
            </View>
          </View>

          <View className="h-3 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
            <View
              className={`h-full rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-[#059669]'}`}
              style={{ width: `${progress}%` }}
            />
          </View>

          <View className="mt-4 flex-row justify-between items-center border-t border-[#F1F5F9] pt-4">
            <Text className="text-xs font-medium text-[#64748B]">
              Basado en tu flujo de caja real
            </Text>
            <TouchableOpacity onPress={onConfigurePress}>
              <FontAwesome6 name="gear" size={16} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
