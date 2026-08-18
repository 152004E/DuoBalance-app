import { View, Text } from 'react-native';

interface EmptyStateCardProps {
  title: string;
  description?: string;
}

export function EmptyStateCard({ title, description }: EmptyStateCardProps) {
  return (
    <View className="items-center rounded-xl border border-dashed border-[#E2E8F0] bg-white px-6 py-10">
      <Text className="text-center text-base font-semibold text-[#0F172A]">
        {title}
      </Text>
      {description && (
        <Text className="mt-1 text-center text-sm text-[#64748B]">
          {description}
        </Text>
      )}
    </View>
  );
}
