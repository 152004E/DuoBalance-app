import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { APP_NAME } from '@/constants/config';

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="flex-1 items-center justify-center px-4">
        <View className="items-center gap-4">
          <Text className="text-5xl font-bold text-white">{APP_NAME}</Text>
          <Text className="text-center text-base text-gray-400">
            Controla tus gastos compartidos en pareja
          </Text>
          <View className="mt-4 h-1 w-16 rounded-full bg-blue-500" />
        </View>
      </View>
    </SafeAreaView>
  );
}
