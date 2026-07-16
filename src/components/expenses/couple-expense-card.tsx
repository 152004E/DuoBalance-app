import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';

export interface CoupleExpense {
  id: string;
  name: string;
  partnerName: string;
  totalExpenses: number;
  partnerExpenses: number;
  transactionCount: number;
}

interface CoupleExpenseCardProps {
  couple: CoupleExpense;
}

export function CoupleExpenseCard({ couple }: CoupleExpenseCardProps) {
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
