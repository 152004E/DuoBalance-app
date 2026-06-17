import { Pressable, View, Text } from 'react-native';
import { CategoryBadge } from '@/components/category/category-badge';

interface ExpenseCardProps {
  description: string;
  amount: number;
  category: string;
  paidByName: string;
  createdAt: string;
  onPress?: () => void;
}

export function ExpenseCard({
  description,
  amount,
  category,
  paidByName,
  createdAt,
  onPress,
}: ExpenseCardProps) {
  return (
    <Pressable onPress={onPress} className="rounded-2xl bg-white p-4 shadow-sm">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 gap-1">
          <Text
            className="text-base font-semibold text-[#0F172A]"
            numberOfLines={1}
          >
            {description}
          </Text>
          <Text className="text-xs text-[#64748B]">
            Pagado por {paidByName} ·{' '}
            {new Date(createdAt).toLocaleDateString('es-CL')}
          </Text>
        </View>
        <View className="items-end gap-1">
          <Text className="text-base font-bold text-[#0F172A]">
            ${amount.toLocaleString('es-CL')}
          </Text>
          <CategoryBadge category={category} />
        </View>
      </View>
    </Pressable>
  );
}
