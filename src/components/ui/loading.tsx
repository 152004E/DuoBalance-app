import { ActivityIndicator, View, Text } from 'react-native';

interface LoadingProps {
  message?: string;
}

export function Loading({ message }: LoadingProps) {
  return (
    <View className="flex-1 items-center justify-center gap-3">
      <ActivityIndicator size="large" color="#10B981" />
      {message && <Text className="text-sm text-[#64748B]">{message}</Text>}
    </View>
  );
}
