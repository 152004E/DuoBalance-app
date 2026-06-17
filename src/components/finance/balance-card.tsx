import { View, Text } from 'react-native';
import type { BalanceDirection } from '@/types/api';

interface BalanceCardProps {
  amount: number;
  direction: BalanceDirection;
  partnerName?: string;
}

export function BalanceCard({
  amount,
  direction,
  partnerName,
}: BalanceCardProps) {
  const isOwed = direction === 'OWED_TO_ME';
  const isSettled = direction === 'SETTLED';

  return (
    <View className="rounded-2xl bg-white p-6 shadow-sm">
      <Text className="text-sm text-[#64748B]">
        {isSettled
          ? 'Estás al día'
          : isOwed
            ? `${partnerName ?? 'Tu pareja'} te debe`
            : 'Le debes a'}
      </Text>
      <Text
        className={`mt-1 text-3xl font-bold ${isSettled ? 'text-[#22C55E]' : isOwed ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}
      >
        ${amount.toLocaleString('es-CL')}
      </Text>
    </View>
  );
}
