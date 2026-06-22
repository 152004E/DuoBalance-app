import { View, Text } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

interface TopCategoryProps {
  category: string;
  amount: number;
  percentage: number;
  icon: string;
  color: string;
}

export function TopCategory({
  category,
  amount,
  percentage,
  icon,
  color,
}: TopCategoryProps) {
  return (
    <View className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
      <View className="mb-3 flex-row items-center gap-2">
        <View
          className="h-8 w-8 items-center justify-center rounded-full"
          style={{ backgroundColor: `${color}20` }}
        >
          <FontAwesome6 name={icon} size={14} color={color} solid />
        </View>
        <Text className="text-sm font-semibold text-[#0F172A]">
          {category}
        </Text>
        <Text className="ml-auto text-sm font-medium text-[#0F172A]">
          ${amount.toLocaleString('es-CL')}
        </Text>
      </View>

      <View className="mb-1 h-2 w-full overflow-hidden rounded-full bg-[#eceef0]">
        <View
          className="h-full rounded-full"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </View>

      <Text className="text-xs text-[#64748B]">
        {percentage}% del gasto mensual
      </Text>
    </View>
  );
}
