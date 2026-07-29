import { View, Text } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

interface Participant {
  name: string;
  initials: string;
  amount: number;
  percentage: number;
  isPayer: boolean;
}

interface ExpenseSplitProps {
  participants: Participant[];
}

export function ExpenseSplit({ participants }: ExpenseSplitProps) {
  const colors = ['#006c49', '#8B5CF6', '#3B82F6', '#F97316'];

  return (
    <View
      className="mx-5 rounded-2xl border border-[#E2E8F0] bg-white p-5"
      style={{
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
      }}
    >
      <Text className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
        Distribución de Gastos
      </Text>

      <View className="mb-3">
        <View className="mb-1 flex-row justify-between">
          {participants.map((p, i) => (
            <Text
              key={p.name}
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: colors[i % colors.length] }}
            >
              {p.percentage}%
            </Text>
          ))}
        </View>
        <View className="h-3 w-full flex-row overflow-hidden rounded-full bg-[#ECEEF0]">
          {participants.map((p, i) => (
            <View
              key={p.name}
              className="h-full"
              style={{
                width: `${p.percentage}%`,
                backgroundColor: colors[i % colors.length],
              }}
            />
          ))}
        </View>
      </View>

      <View className="flex-row items-end justify-between">
        {participants.map((p, i) => (
          <View key={p.name} className="flex-col items-center gap-1">
            <View
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{
                backgroundColor: `${colors[i % colors.length]}1A`,
                borderWidth: 2,
                borderColor: colors[i % colors.length],
              }}
            >
              <Text
                className="text-sm font-bold"
                style={{ color: colors[i % colors.length] }}
              >
                {p.initials}
              </Text>
            </View>
            <Text className="text-xs font-semibold text-[#0F172A]">
              {p.name}
            </Text>
            {p.isPayer && (
              <View className="rounded-full bg-[#006c49]/10 px-2 py-0.5">
                <Text className="text-[10px] font-semibold text-[#006c49]">
                  Pagó
                </Text>
              </View>
            )}
            <Text
              className="text-sm font-bold"
              style={{
                fontFamily: 'JetBrains Mono',
                color: colors[i % colors.length],
              }}
            >
              ${p.amount.toLocaleString('es-CL')}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
