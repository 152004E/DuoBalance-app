  import { View, Text } from 'react-native';
  import { FontAwesome6 } from '@expo/vector-icons';

  export interface Transaction {
    id: string;
    description: string;
    paidBy: string;
    amount: number;
    date: string;
    category: string;
    status: 'paid' | 'pending';
  }

  interface RecentTransactionsProps {
    transactions: Transaction[];
    onViewAll?: () => void;
  }

  const categoryIcons: Record<string, string> = {
    FOOD: 'utensils',
    TRANSPORT: 'car',
    RENT: 'house',
    SERVICES: 'bolt',
    ENTERTAINMENT: 'film',
    OTHER: 'circle',
  };

  const categoryColors: Record<string, string> = {
    FOOD: '#F97316',
    TRANSPORT: '#8B5CF6',
    RENT: '#3B82F6',
    SERVICES: '#EC4899',
    ENTERTAINMENT: '#06B6D4',
    OTHER: '#64748B',
  };

  export function RecentTransactions({
    transactions,
    onViewAll,
  }: RecentTransactionsProps) {
    return (
      <View>
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-xl font-bold text-[#0F172A]">
            Movimientos Recientes
          </Text>
          <Text
            className="text-xs font-semibold text-[#10B981]"
            onPress={onViewAll}
          >
            Ver Todos
          </Text>
        </View>

        <View className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
          {transactions.map((tx, index) => {
            const color = categoryColors[tx.category] ?? '#64748B';
            const icon = categoryIcons[tx.category] ?? 'circle';

            return (
              <View
                key={tx.id}
                className={`flex-row items-center justify-between p-3 ${
                  index < transactions.length - 1 ? 'border-b border-[#E2E8F0]' : ''
                }`}
              >
                <View className="flex-row items-center gap-3">
                  <View
                    className="h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <FontAwesome6
                      name={icon}
                      size={16}
                      color={color}
                      solid
                    />
                  </View>
                  <View>
                    <Text className="text-sm font-semibold text-[#0F172A]">
                      {tx.paidBy} pagó {tx.description}
                    </Text>
                    <View className="mt-0.5 flex-row items-center gap-2">
                      <Text className="text-[10px] text-[#64748B]">
                        {tx.date}
                      </Text>
                      <View
                        className={`h-1.5 w-1.5 rounded-full ${
                          tx.status === 'paid' ? 'bg-[#22C55E]' : 'bg-[#F59E0B]'
                        }`}
                      />
                    </View>
                  </View>
                </View>
                <Text className="text-sm font-medium text-[#EF4444]">
                  -${tx.amount.toLocaleString('es-CL')}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
