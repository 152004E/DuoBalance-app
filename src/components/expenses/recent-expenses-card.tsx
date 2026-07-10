import { View, Text, Pressable } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

export interface RecentExpense {
  id: string;
  name: string;
  amount: number;
  paidBy: string;
  date: string;
  category: string;
  icon: string;
  iconBg: string;
}

interface RecentExpensesCardProps {
  expenses: RecentExpense[];
  onViewAll?: () => void;
  onExpensePress?: (expense: RecentExpense) => void;
}

export function RecentExpensesCard({ expenses, onViewAll, onExpensePress }: RecentExpensesCardProps) {
  return (
    <View
      className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white"
      style={{
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
      }}
    >
      <View className="flex-row items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
        <Text className="text-[17px] font-bold text-[#0F172A]">
          Gastos Recientes
        </Text>
        <Pressable onPress={onViewAll}>
          <Text className="text-sm font-semibold text-[#006c49]">
            Ver todo
          </Text>
        </Pressable>
      </View>

      {expenses.map((expense, index) => (
        <Pressable
          key={expense.id}
          onPress={() => onExpensePress?.(expense)}
          className={`flex-row items-center justify-between px-5 py-4 ${index > 0 ? 'border-t border-[#E2E8F0]' : ''}`}
        >
          <View className="flex-row items-center gap-4">
            <View
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: `${expense.iconBg}1A` }}
            >
              <FontAwesome6
                name={expense.icon as any}
                size={16}
                color={expense.iconBg}
              />
            </View>
            <View>
              <Text className="font-semibold text-[#0F172A]">
                {expense.name}
              </Text>
              <Text className="text-xs text-[#64748B]">
                {expense.date} • Pagado por {expense.paidBy}
              </Text>
            </View>
          </View>
          <View className="items-end">
            <Text
              className="font-bold text-[#0F172A]"
              style={{ fontFamily: 'monospace' }}
            >
              ${expense.amount.toLocaleString('es-CL')}
            </Text>
            <Text className="text-[10px] uppercase tracking-tighter text-[#64748B]">
              {expense.category}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
