import { View, Text } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

interface ExpenseHeroCardProps {
  name: string;
  amount: number;
  category: string;
  categoryIcon: string;
  categoryColor: string;
  date: string;
  groupType: 'PERSONAL' | 'COUPLE' | 'GROUP';
  status: 'personal' | 'shared';
}

const STATUS_LABEL: Record<string, string> = {
  personal: 'Personal',
  shared: 'Compartido',
};

const GROUP_TYPE_ICON: Record<string, string> = {
  PERSONAL: 'user',
  COUPLE: 'heart',
  GROUP: 'users',
};

export function ExpenseHeroCard({
  name,
  amount,
  category,
  categoryIcon,
  categoryColor,
  date,
  groupType,
  status,
}: ExpenseHeroCardProps) {
  return (
    <View
      className="mx-5 flex-col items-center rounded-2xl border border-[#E2E8F0] bg-white p-6 text-center"
      style={{
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
      }}
    >
      <View className="absolute right-4 top-4">
        <View className="flex-row items-center gap-1 rounded-full bg-[#10B981]/10 px-3 py-1">
          <FontAwesome6
            name={GROUP_TYPE_ICON[groupType]}
            size={12}
            color="#006c49"
            solid
          />
          <Text className="text-[11px] font-semibold uppercase tracking-wider text-[#006c49]">
            {STATUS_LABEL[status]}
          </Text>
        </View>
      </View>

      <View
        className="mb-4 h-20 w-20 items-center justify-center rounded-2xl shadow-sm"
        style={{ backgroundColor: `${categoryColor}1A` }}
      >
        <FontAwesome6
          name={categoryIcon as any}
          size={36}
          color={categoryColor}
          solid
        />
      </View>

      <Text
        className="mb-1 text-center text-[22px] font-bold text-[#0F172A]"
        style={{ fontFamily: 'Hanken Grotesk' }}
      >
        {name}
      </Text>

      <Text
        className="mb-4 text-center text-2xl font-bold text-[#006c49]"
        style={{ fontFamily: 'JetBrains Mono' }}
      >
        ${amount.toLocaleString('es-CL')}
      </Text>

      <View className="flex-row flex-wrap items-center justify-center gap-2">
        <View
          className="rounded-full px-3 py-1"
          style={{ backgroundColor: `${categoryColor}1A` }}
        >
          <Text
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: categoryColor }}
          >
            {category}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <FontAwesome6 name="calendar" size={12} color="#64748B" />
          <Text className="text-xs text-[#64748B]">{date}</Text>
        </View>
      </View>
    </View>
  );
}
