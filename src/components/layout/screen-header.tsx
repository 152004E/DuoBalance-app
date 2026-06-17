import { View, Text } from 'react-native';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
}

export function ScreenHeader({ title, subtitle }: ScreenHeaderProps) {
  return (
    <View className="px-4 pb-2 pt-4">
      <Text className="text-2xl font-bold text-[#0F172A]">{title}</Text>
      {subtitle && (
        <Text className="mt-1 text-sm text-[#64748B]">{subtitle}</Text>
      )}
    </View>
  );
}
