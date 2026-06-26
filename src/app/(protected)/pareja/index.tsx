import { useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppHero } from '@/components/layout/AppHero';
import { CoupleCard } from '@/components/dashboard/CoupleCard';
import { FloatingAddButton } from '@/components/dashboard/FloatingAddButton';
import { CreateCoupleSheet } from '@/components/couple/create-couple-sheet';
import { useAuth } from '@/hooks/use-auth';

const MOCK_COUPLES = [
  { id: '1', name: 'Andrea', balance: 250000, status: 'positive' as const },
  { id: '2', name: 'Carlos', balance: 80000, status: 'positive' as const },
  { id: '3', name: 'María', balance: 15000, status: 'neutral' as const },
  { id: '4', name: 'Pedro', balance: 120000, status: 'negative' as const },
];

export default function ParejaScreen() {
  const { user } = useAuth();
  const [showCreateSheet, setShowCreateSheet] = useState(false);

  return (
    <SafeAreaView className="relative flex-1 bg-[#F8FAFC]" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-24"
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
            <Text className="text-2xl font-bold text-white">Pareja</Text>
            <Text className="mt-1 text-base text-white/80">
              Administra tus vínculos
            </Text>
          </View>
        </AppHero>

        <View className="px-5 pt-8">
          <Text className="mb-4 text-2xl font-bold text-[#0F172A]">
            Tus Parejas
          </Text>

          <View className="gap-4">
            {MOCK_COUPLES.map((item) => (
              <CoupleCard
                key={item.id}
                id={item.id}
                name={item.name}
                balance={item.balance}
                status={item.status}
                onPress={() => router.push(`/pareja/${item.id}`)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <FloatingAddButton
        icon="user-plus"
        size={25}
        onPress={() => setShowCreateSheet(true)}
      />

      <CreateCoupleSheet
        visible={showCreateSheet}
        onClose={() => setShowCreateSheet(false)}
        heightRatio={0.65}
        headerFinalTranslateY={0.17}
      />
    </SafeAreaView>
  );
}
