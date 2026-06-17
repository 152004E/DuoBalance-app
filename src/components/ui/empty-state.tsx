import { View, Text } from 'react-native';

interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <Text className="text-lg font-semibold text-[#0F172A]">{title}</Text>
      {description && (
        <Text className="mt-2 text-center text-sm text-[#64748B]">
          {description}
        </Text>
      )}
    </View>
  );
}
