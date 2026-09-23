import { View, Text, Pressable } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface ContributionCardProps {
  groupId: string;
  userName: string;
  partnerName: string;
  userAmount: number;
  partnerAmount: number;
  expectedUserPercent: number;
  expectedPartnerPercent: number;
}

const fmt = (value: number) => `$${Math.round(value).toLocaleString('es-CL')}`;

export function ContributionCard({
  groupId,
  userName,
  partnerName,
  userAmount,
  partnerAmount,
  expectedUserPercent,
  expectedPartnerPercent,
}: ContributionCardProps) {
  const router = useRouter();
  
  const total = userAmount + partnerAmount;
  const actualUserPercent = total > 0 ? (userAmount / total) * 100 : 50;
  const actualPartnerPercent = total > 0 ? (partnerAmount / total) * 100 : 50;

  return (
    <View
      className="rounded-xl border border-[#E2E8F0] bg-white p-5"
      style={{
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
      }}
    >
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-[14px] font-bold uppercase tracking-wider text-[#0F172A]">
          Aportes del Grupo
        </Text>
        <Pressable
          onPress={() => router.push(`/grupos/${groupId}/configuracion`)}
          className="flex-row items-center justify-center gap-1.5 rounded-full bg-[#F1F5F9] px-3 py-1.5"
        >
          <FontAwesome6 name="gear" size={10} color="#64748B" />
          <Text className="text-xs font-bold text-[#64748B]">
            {expectedUserPercent}% / {expectedPartnerPercent}%
          </Text>
        </Pressable>
      </View>

      {/* Progress Bar (Actual Contributions) */}
      <View className="h-10 flex-row overflow-hidden rounded-xl bg-[#ECEEF0]">
        <View
          className="h-full items-center justify-center bg-[#006c49]"
          style={{ width: `${actualUserPercent}%` }}
        >
          {actualUserPercent >= 15 && (
            <Text className="text-xs font-bold text-white">
              {Math.round(actualUserPercent)}%
            </Text>
          )}
        </View>
        <View
          className="h-full items-center justify-center bg-[#8B5CF6]"
          style={{ width: `${actualPartnerPercent}%` }}
        >
          {actualPartnerPercent >= 15 && (
            <Text className="text-xs font-bold text-white">
              {Math.round(actualPartnerPercent)}%
            </Text>
          )}
        </View>
      </View>

      <View className="mt-4 flex-row justify-between gap-4">
        {/* User Stats */}
        <View className="flex-1 rounded-xl bg-[#006c49]/5 p-3">
          <View className="flex-row items-center gap-2 mb-1">
            <View className="h-2 w-2 rounded-full bg-[#006c49]" />
            <Text className="text-xs font-semibold text-[#64748B]">{userName}</Text>
          </View>
          <Text className="text-base font-bold text-[#0F172A]" style={{ fontFamily: 'monospace' }}>
            {fmt(userAmount)}
          </Text>
        </View>

        {/* Partner Stats */}
        <View className="flex-1 rounded-xl bg-[#8B5CF6]/5 p-3">
          <View className="flex-row items-center gap-2 mb-1">
            <View className="h-2 w-2 rounded-full bg-[#8B5CF6]" />
            <Text className="text-xs font-semibold text-[#64748B]">{partnerName}</Text>
          </View>
          <Text className="text-base font-bold text-[#0F172A]" style={{ fontFamily: 'monospace' }}>
            {fmt(partnerAmount)}
          </Text>
        </View>
      </View>
    </View>
  );
}
