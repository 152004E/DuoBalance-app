import { View, Text } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { CoupleDetailHeader } from '@components/couple/couple-detail-header';

export default function CoupleDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <View className="flex-1">
        <View className="">
          <CoupleDetailHeader
            title="Ana  Juan"
            subtitle="Creada hace 3 meses"
            onBack={() => router.push('/(protected)/pareja')}
            onMenu={() => {}}
          />
        </View>

        <View className="flex-1 items-center justify-center px-5">
          <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-[#10B981]/10">
            <FontAwesome6 name="heart" size={24} color="#10B981" />
          </View>
          <Text className="text-xl font-bold text-[#0F172A]">Detalle de Pareja</Text>
          <Text className="mt-1 text-base text-[#64748B]">ID: {id}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
