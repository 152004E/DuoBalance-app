import { View, Text, Pressable } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import type { GroupResponse } from '@/types/api';

interface GroupBalanceMock {
  userAmount: number;
  partnerAmount: number;
}

const MOCK_BALANCE_DETAIL: Record<string, GroupBalanceMock> = {
  '1': { userAmount: 250000, partnerAmount: 80000 },
  '2': { userAmount: 80000, partnerAmount: 45000 },
  '3': { userAmount: 15000, partnerAmount: 10000 },
  '4': { userAmount: 120000, partnerAmount: 60000 },
};

const DEFAULT_BALANCE: GroupBalanceMock = {
  userAmount: 60000,
  partnerAmount: 40000,
};

interface GroupCardProps {
  group: GroupResponse;
  showMenu?: boolean;
  onPress?: () => void;
  onMenu?: () => void;
  currentUserId?: string;
}

export function GroupCard({
  group,
  showMenu = false,
  onPress,
  onMenu,
  currentUserId,
}: GroupCardProps) {
  const balances = MOCK_BALANCE_DETAIL[group.id] ?? DEFAULT_BALANCE;
  const total = balances.userAmount + balances.partnerAmount;
  const userPercent = total > 0 ? (balances.userAmount / total) * 100 : 0;
  const partnerPercent = total > 0 ? (balances.partnerAmount / total) * 100 : 0;

  const isCouple = group.type === 'COUPLE';
  const membersCount = group.members.length;
  const transactionCount = membersCount > 0 ? membersCount : 0;

  let userLabel: string;
  let partnerLabel: string;

  if (isCouple && currentUserId) {
    const currentUser = group.members.find((m) => m.user.id === currentUserId);
    const partner = group.members.find((m) => m.user.id !== currentUserId);
    userLabel = currentUser?.user.firstName ?? 'Tú';
    partnerLabel = partner?.user.firstName ?? 'Pareja';
  } else if (isCouple) {
    userLabel = 'Tú';
    partnerLabel = 'Pareja';
  } else {
    userLabel = 'Tú';
    partnerLabel = 'Grupo';
  }

  return (
    <Pressable
      onPress={onPress}
      className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm active:opacity-80"
      style={{
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
      }}
    >
      <View className="p-5">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="flex h-12 w-12 items-center justify-center rounded-full bg-[#10B981]/10">
              <FontAwesome6 name="heart" size={18} color="#10B981" solid />
            </View>
            <View>
              <Text className="text-lg font-bold text-[#0F172A]">
                {group.name}
              </Text>
              <Text className="text-sm text-[#64748B]">
                {transactionCount} transacciones este mes
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            <View className="items-end">
              <Text
                className="text-lg font-bold text-[#006c49]"
                style={{ fontFamily: 'JetBrains Mono' }}
              >
                ${total.toLocaleString('es-CL')}
              </Text>
              <Text className="text-xs text-[#64748B]">Total</Text>
            </View>

            {showMenu && onMenu && (
              <Pressable
                onPress={onMenu}
                className="ml-2 h-10 w-10 items-center justify-center"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <FontAwesome6
                  name="ellipsis-vertical"
                  size={18}
                  color="#64748B"
                />
              </Pressable>
            )}
          </View>
        </View>

        <View className="mt-4">
          <View className="h-3 flex-row overflow-hidden rounded-full bg-[#ECEEF0]">
            <View
              className="h-full rounded-l-full bg-[#006c49]"
              style={{ width: `${userPercent}%` }}
            />
            <View
              className="h-full rounded-r-full bg-[#8B5CF6]"
              style={{ width: `${partnerPercent}%` }}
            />
          </View>
          <View className="mt-2 flex-row justify-between">
            <View className="flex-row items-center gap-1.5">
              <View className="h-2.5 w-2.5 rounded-full bg-[#006c49]" />
              <Text className="text-xs text-[#64748B]">
                {userLabel}: ${balances.userAmount.toLocaleString('es-CL')}
              </Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <View className="h-2.5 w-2.5 rounded-full bg-[#8B5CF6]" />
              <Text className="text-xs text-[#64748B]">
                {partnerLabel}: ${balances.partnerAmount.toLocaleString('es-CL')}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
