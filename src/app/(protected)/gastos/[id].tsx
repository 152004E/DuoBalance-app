import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ScreenHeader } from '@/components/ui/screen-header';

export default function ExpenseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      <ScreenHeader title="Detalle del gasto" subtitle={`Gasto #${id}`} onBack={() => router.back()} />
      <View className="flex-1 items-center justify-center px-5">
        <Text className="text-base text-[#64748B]">Próximamente...</Text>
      </View>
    </SafeAreaView>
  );
}
