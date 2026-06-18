import { View, Text } from 'react-native';

type BalanceDirection = 'OWED_TO_ME' | 'I_OWE' | 'SETTLED';

interface BalanceCardProps {
  amount: number;
  partnerShare: number;
  direction: BalanceDirection;
}

export function BalanceCard({
  amount,
  partnerShare,
  direction,
}: BalanceCardProps) {
  const isOwed = direction === 'OWED_TO_ME';
  const isSettled = direction === 'SETTLED';

  const pillText = isSettled
    ? 'Estás al día'
    : isOwed
      ? `Te deben $${partnerShare.toLocaleString('es-CL')}`
      : `Tú debes $${partnerShare.toLocaleString('es-CL')}`;

  return (
    <View className="items-center">
      <Text className="text-5xl font-bold tracking-tight text-white">
        ${amount.toLocaleString('es-CL')}
      </Text>
      <View
        className={`mt-4 rounded-full px-5 py-1.5 ${
          isSettled ? 'bg-green-200' : 'bg-red-100'
        }`}
      >
        <Text
          className={`text-sm font-medium ${
            isSettled ? 'text-green-800' : 'text-red-700'
          }`}
        >
          {pillText}
        </Text>
      </View>
    </View>
  );
}
