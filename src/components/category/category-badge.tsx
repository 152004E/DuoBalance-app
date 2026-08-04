import { View, Text } from 'react-native';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/constants/categories';

interface CategoryBadgeProps {
  category: string;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const color = CATEGORY_COLORS[category] ?? '#64748B';
  const label = CATEGORY_LABELS[category] ?? category;

  return (
    <View
      className="rounded-full px-2.5 py-0.5"
      style={{ backgroundColor: `${color}20` }}
    >
      <Text className="text-xs font-medium" style={{ color }}>
        {label}
      </Text>
    </View>
  );
}
