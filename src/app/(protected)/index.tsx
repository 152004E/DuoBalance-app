import { useCallback, useState, useRef } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useScrollToTop, router } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';
import { useGroups } from '@/hooks/use-groups';
import { HeroSection } from '@/components/layout/HeroSection';
import { GroupSelector } from '@/components/ui/group-selector';
import { GroupSection } from '@/components/ui/group-section';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { TopCategory } from '@/components/dashboard/TopCategory';
import { PartnerBalance } from '@/components/dashboard/PartnerBalance';
import { FloatingAddButton } from '@/components/dashboard/FloatingAddButton';
import type { FilterState } from '@/types/filter';

const MOCK_BALANCE = {
  amount: 185000,
  partnerShare: 50000,
  direction: 'I_OWE' as const,
};

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
  const { personalGroups, coupleGroups, sharedGroups } = useGroups();
  const [focusCount, setFocusCount] = useState(0);
  const [filter, setFilter] = useState<FilterState>({
    category: 'all',
    groupId: null,
  });
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);

  const showPersonal =
    filter.category === 'all' || filter.category === 'personal';
  const showCouple = filter.category === 'all' || filter.category === 'couple';
  const showGroup = filter.category === 'all' || filter.category === 'group';

  useFocusEffect(
    useCallback(() => {
      setFocusCount((c) => c + 1);
      console.log('[Dashboard] Sesión activa, token vigente');
    }, []),
  );

  return (
    <SafeAreaView className="relative flex-1 bg-[#F8FAFC]" edges={['top']}>
      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}
      >
        <HeroSection
          key={focusCount}
          userName={user?.firstName ?? 'Usuario'}
          variant="dashboard"
          balance={MOCK_BALANCE.amount}
          partnerShare={MOCK_BALANCE.partnerShare}
          direction={MOCK_BALANCE.direction}
          rightAction={
            <GroupSelector
              value={filter}
              onChange={setFilter}
              personalGroups={personalGroups}
              coupleGroups={coupleGroups}
              sharedGroups={sharedGroups}
              variant="dark"
            />
          }
        />

        <View className="px-5 pt-8">
          <Text className="mb-4 text-2xl font-bold text-[#0F172A]">
            Tus Grupos
          </Text>

          {showPersonal && (
            <GroupSection
              title="Personal"
              groups={personalGroups}
              horizontal
              onPress={(group) => router.push(`/grupos/${group.id}`)}
              currentUserId={user?.id}
            />
          )}

          {showCouple && (
            <GroupSection
              title="Parejas"
              groups={coupleGroups}
              horizontal
              onPress={(group) => router.push(`/grupos/${group.id}`)}
              currentUserId={user?.id}
            />
          )}

          {showGroup && (
            <GroupSection
              title="Grupos"
              groups={sharedGroups}
              horizontal
              onPress={(group) => router.push(`/grupos/${group.id}`)}
              currentUserId={user?.id}
            />
          )}
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
