import { View, Text, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHero } from '@/components/layout/AppHero';
import { useAuth } from '@/hooks/use-auth';

export default function GastosScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}
      >
        <AppHero height={220}>
          <View className="flex-row items-center gap-2">
            <Image
              source={require('@/assets/images/logo-white-green-bg-without.png')}
              style={{ width: 25, height: 25 }}
              resizeMode="contain"
            />
            <Text className="text-base text-white">
              Bienvenido,{' '}
              <Text className="font-semibold">
                {user?.firstName ?? 'Usuario'}
              </Text>
            </Text>
          </View>

          <View className="mt-6 items-center">
            <Text className="text-2xl font-bold text-white">Gastos</Text>
            <Text className="mt-1 text-base text-white/80">
              Controla tus gastos compartidos
            </Text>
          </View>
        </AppHero>

        <View className="flex-1 items-center justify-center px-5 pt-20">
          <Text className="text-base text-[#64748B]">
            Próximamente...
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
