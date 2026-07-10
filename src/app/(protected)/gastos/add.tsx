import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ScreenHeader } from '@/components/ui/screen-header';

export default function AddExpenseScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      <ScreenHeader title="Nuevo gasto" subtitle="Registra un gasto compartido" onBack={() => router.back()} />
      <View className="flex-1 items-center justify-center px-5">
        <Text className="text-base text-[#64748B]">Próximamente...</Text>
      </View>
    </SafeAreaView>
  );
}
