import { View, Text, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/use-auth';
import { HeroSection } from '@/components/layout/HeroSection';
import { CoupleCard } from '@/components/dashboard/CoupleCard';
import { AddCoupleCard } from '@/components/dashboard/AddCoupleCard';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { TopCategory } from '@/components/dashboard/TopCategory';
import { PartnerBalance } from '@/components/dashboard/PartnerBalance';
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

const MOCK_TRANSACTIONS = [
  {
    id: '1',
    description: 'Netflix',
    paidBy: 'Andrea',
    amount: 50000,
    date: 'Hoy, 14:30',
    category: 'ENTERTAINMENT',
    status: 'pending' as const,
  },
  {
    id: '2',
    description: 'Mercado Libre',
    paidBy: 'Emerson',
    amount: 25000,
    date: 'Ayer, 09:15',
    category: 'OTHER',
    status: 'paid' as const,
  },
  {
    id: '3',
    description: 'Cena',
    paidBy: 'Andrea',
    amount: 35000,
    date: '27 Jun, 20:00',
    category: 'FOOD',
    status: 'paid' as const,
  },
];

const MOCK_TOP_CATEGORY = {
  category: 'Comida',
  amount: 180000,
  percentage: 35,
  icon: 'utensils',
  color: '#F97316',
};

const MOCK_PARTNER_BALANCE = {
  userName: 'Emerson',
  partnerName: 'Andrea',
  userAmount: 250000,
  partnerAmount: 300000,
};

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
          variant="dashboard"
          balance={MOCK_BALANCE.amount}
          partnerShare={MOCK_BALANCE.partnerShare}
          direction={MOCK_BALANCE.direction}
          coupleName="spi"
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
            ListFooterComponent={<AddCoupleCard />}
          />
        </View>

        <View className="mt-6 space-y-6 px-5">
          <RecentTransactions transactions={MOCK_TRANSACTIONS} />
          <TopCategory
            category={MOCK_TOP_CATEGORY.category}
            amount={MOCK_TOP_CATEGORY.amount}
            percentage={MOCK_TOP_CATEGORY.percentage}
            icon={MOCK_TOP_CATEGORY.icon}
            color={MOCK_TOP_CATEGORY.color}
          />
          <PartnerBalance
            userName={MOCK_PARTNER_BALANCE.userName}
            partnerName={MOCK_PARTNER_BALANCE.partnerName}
            userAmount={MOCK_PARTNER_BALANCE.userAmount}
            partnerAmount={MOCK_PARTNER_BALANCE.partnerAmount}
          />
        </View>
      </ScrollView>

      <FloatingAddButton />
    </SafeAreaView>
  );
}
