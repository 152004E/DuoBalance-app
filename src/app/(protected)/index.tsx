import { View, Text, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/use-auth';
import { HeroSection } from '@/components/dashboard/HeroSection';
import { CoupleCard } from '@/components/dashboard/CoupleCard';
import { FloatingAddButton } from '@/components/dashboard/FloatingAddButton';

const MOCK_BALANCE = {
  amount: 185000,
  partnerShare: 50000,
  direction: 'I_OWE' as const,
};

const MOCK_COUPLES = [
  { id: '1', name: 'Andrea', balance: 250000, status: 'positive' as const },
  { id: '2', name: 'Carlos', balance: 0, status: 'neutral' as const },
];

export default function DashboardScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView className="relative flex-1 bg-[#F8FAFC]" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}
      >
        <HeroSection
          userName={user?.firstName ?? 'Usuario'}
          balance={MOCK_BALANCE.amount}
          partnerShare={MOCK_BALANCE.partnerShare}
          direction={MOCK_BALANCE.direction}
          coupleName="Space"
        />

        <View className="px-5 pt-8">
          <Text className="mb-4 text-2xl font-bold text-[#0F172A]">
            Tus Parejas
          </Text>

          <FlatList
            data={MOCK_COUPLES}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-4"
            renderItem={({ item }) => (
              <CoupleCard
                name={item.name}
                balance={item.balance}
                status={item.status}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </ScrollView>

      <FloatingAddButton />
    </SafeAreaView>
  );
}
