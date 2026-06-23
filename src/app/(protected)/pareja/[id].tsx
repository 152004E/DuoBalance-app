import { View, Text, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';

export default function CoupleDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <View className="flex-1 px-5 pt-4">
        <Pressable onPress={() => router.back()} className="h-10 w-10 items-center justify-center">
          <FontAwesome6 name="arrow-left" size={20} color="#0F172A" />
        </Pressable>

        <View className="mt-6 flex-1 items-center justify-center">
          <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-[#10B981]/10">
            <FontAwesome6 name="heart" size={32} color="#10B981" />
          </View>
          <Text className="text-xl font-bold text-[#0F172A]">Detalle de Pareja</Text>
          <Text className="mt-1 text-base text-[#64748B]">ID: {id}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
