import { View, Text } from 'react-native';

interface AuthDividerProps {
  text?: string;
}

export function AuthDivider({ text = 'O continúa con' }: AuthDividerProps) {
  return (
    <View className="my-6 flex-row items-center">
      <View className="h-px flex-1 bg-[#E2E8F0]" />
      <Text className="px-3 text-sm text-[#64748B]">{text}</Text>
      <View className="h-px flex-1 bg-[#E2E8F0]" />
    </View>
  );
}
