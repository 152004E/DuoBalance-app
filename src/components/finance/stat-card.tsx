import { View, Text } from 'react-native';

interface StatCardProps {
  label: string;
  value: string | number;
  color?: string;
}

export function StatCard({ label, value, color = '#0F172A' }: StatCardProps) {
  return (
    <View className="rounded-2xl bg-white p-4 shadow-sm">
      <Text className="text-xs text-[#64748B]">{label}</Text>
      <Text className="mt-1 text-xl font-bold" style={{ color }}>
        {value}
      </Text>
    </View>
  );
}
