import { View, Text } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

interface PartnerBalanceProps {
  userName: string;
  partnerName: string;
  userAmount: number;
  partnerAmount: number;
}

export function PartnerBalance({
  userName,
  partnerName,
  userAmount,
  partnerAmount,
}: PartnerBalanceProps) {
  const total = userAmount + partnerAmount;
  const userPercent = total > 0 ? Math.round((userAmount / total) * 100) : 50;
  const partnerPercent = 100 - userPercent;
  const difference = Math.abs(userAmount - partnerAmount);
  const isUserHigher = userAmount >= partnerAmount;

  return (
    <View className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
      <Text className="mb-4 text-base font-bold text-[#0F172A]">
        Balance por Pareja
      </Text>

      <View className="mb-1 flex-row items-center gap-2">
        <View className="h-8 w-8 items-center justify-center rounded-full bg-[#10B981]/10">
          <FontAwesome6 name="user" size={14} color="#10B981" solid />
        </View>
        <View className="flex-1">
          <Text className="text-xs text-[#64748B]">{userName}</Text>
          <Text className="text-sm font-semibold text-[#0F172A]">
            ${userAmount.toLocaleString('es-CL')}
          </Text>
        </View>
        <Text className="text-xs font-medium text-[#64748B]">
          {userPercent}%
        </Text>
      </View>

      <View className="h-2 w-full overflow-hidden rounded-full bg-[#eceef0]">
        <View
          className="h-full rounded-full bg-[#10B981]"
          style={{ width: `${userPercent}%` }}
        />
      </View>

      <View className="mt-3 flex-row items-center gap-2">
        <View className="h-8 w-8 items-center justify-center rounded-full bg-[#8B5CF6]/10">
          <FontAwesome6 name="user" size={14} color="#8B5CF6" solid />
        </View>
        <View className="flex-1">
          <Text className="text-xs text-[#64748B]">{partnerName}</Text>
          <Text className="text-sm font-semibold text-[#0F172A]">
            ${partnerAmount.toLocaleString('es-CL')}
          </Text>
        </View>
        <Text className="text-xs font-medium text-[#64748B]">
          {partnerPercent}%
        </Text>
      </View>

      <View
        className={`mt-4 flex-row items-center justify-between rounded-lg p-3 ${
          isUserHigher ? 'bg-[#F0FDF4]' : 'bg-[#FFF7ED]'
        }`}
      >
        <Text
          className={`text-xs font-medium ${
            isUserHigher ? 'text-[#166534]' : 'text-[#9A3412]'
          }`}
        >
          Diferencia
        </Text>
        <Text
          className={`text-sm font-bold ${
            isUserHigher ? 'text-[#16A34A]' : 'text-[#9A3412]'
          }`}
        >
          ${difference.toLocaleString('es-CL')}
        </Text>
      </View>
    </View>
  );
}
