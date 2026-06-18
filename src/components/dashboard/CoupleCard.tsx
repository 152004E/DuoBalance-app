import { View, Text } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

type CoupleStatus = 'positive' | 'neutral' | 'negative';

interface CoupleCardProps {
  name: string;
  balance: number;
  status: CoupleStatus;
}

export function CoupleCard({ name, balance, status }: CoupleCardProps) {
  const dotColor =
    status === 'positive'
      ? '#10B981'
      : status === 'negative'
        ? '#EF4444'
        : '#F59E0B';

  return (
    <View className="min-w-[280px] flex-row items-center gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
      <View className="h-12 w-12 items-center justify-center rounded-full border-2 border-[#bbcabf] bg-[#eceef0]">
        <FontAwesome6 name="user" size={20} color="#64748B" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-[#0F172A]">
          Pareja: {name}
        </Text>
        <View className="mt-1 flex-row items-center gap-2">
          <View
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: dotColor }}
          />
          <Text className="text-sm font-medium text-[#10B981]">
            ${balance.toLocaleString('es-CL')}
          </Text>
        </View>
      </View>
    </View>
  );
}
