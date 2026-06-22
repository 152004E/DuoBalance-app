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
    <View className="min-w-[240px] flex-row items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
      <View className="h-12 w-12 items-center justify-center rounded-full border-2 border-[#bbcabf] bg-[#eceef0]">
        <FontAwesome6 name="user" size={18} color="#64748B" />
      </View>
      <View className="flex-1">
        <Text className="mb-1 text-sm font-semibold text-[#0F172A]">
          Pareja: {name}
        </Text>
        <View className="flex-row items-center gap-1.5 self-start rounded-full bg-[#10B981]/10 px-2.5 py-1">
          <View
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: dotColor }}
          />
          <Text className="text-xs font-medium text-[#10B981]">
            ${balance.toLocaleString('es-CL')}
          </Text>
        </View>
      </View>
    </View>
  );
}
