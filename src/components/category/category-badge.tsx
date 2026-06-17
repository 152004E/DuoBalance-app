import { View, Text } from 'react-native';

const categoryColors: Record<string, string> = {
  FOOD: '#F97316',
  TRANSPORT: '#8B5CF6',
  RENT: '#3B82F6',
  SERVICES: '#EC4899',
  ENTERTAINMENT: '#06B6D4',
  OTHER: '#64748B',
};

const categoryLabels: Record<string, string> = {
  FOOD: 'Alimentación',
  TRANSPORT: 'Transporte',
  RENT: 'Hogar',
  SERVICES: 'Servicios',
  ENTERTAINMENT: 'Entretenimiento',
  OTHER: 'Otros',
};

interface CategoryBadgeProps {
  category: string;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const color = categoryColors[category] ?? '#64748B';
  const label = categoryLabels[category] ?? category;

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
