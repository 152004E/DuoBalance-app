import { View, Text } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

interface ExpenseInformationProps {
  description: string;
  groupName: string;
  groupType: 'PERSONAL' | 'COUPLE' | 'GROUP';
  paidByName: string;
  paidByInitials: string;
  createdAt: string;
  updatedAt?: string;
}

const GROUP_TYPE_LABEL: Record<string, string> = {
  PERSONAL: 'Personal',
  COUPLE: 'Pareja',
  GROUP: 'Grupo',
};

export function ExpenseInformation({
  description,
  groupName,
  groupType,
  paidByName,
  paidByInitials,
  createdAt,
  updatedAt,
}: ExpenseInformationProps) {
  return (
    <View
      className="mx-5 rounded-2xl border border-[#E2E8F0] bg-white p-5"
      style={{
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
      }}
    >
      <View className="flex-row items-start justify-between border-b border-[#E2E8F0] pb-4">
        <View className="flex-1">
          <Text className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
            Descripción
          </Text>
          <Text className="text-base font-semibold text-[#0F172A]">
            {description}
          </Text>
        </View>
        <FontAwesome6 name="file-lines" size={18} color="#64748B" />
      </View>

      <View className="mt-4 flex-row gap-4">
        <View className="flex-1">
          <Text className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
            Grupo
          </Text>
          <Text className="text-base font-semibold text-[#0F172A]">
            {groupName}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
            Tipo
          </Text>
          <Text className="text-base font-semibold text-[#0F172A]">
            {GROUP_TYPE_LABEL[groupType]}
          </Text>
        </View>
      </View>

      <View className="mt-4 flex-row items-center justify-between border-t border-[#E2E8F0] pt-4">
        <View>
          <Text className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
            Pagado por
          </Text>
          <Text className="text-base font-semibold text-[#006c49]">
            {paidByName}
          </Text>
        </View>
        <View className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4edea3]">
          <Text className="text-[12px] font-bold text-[#002113]">
            {paidByInitials}
          </Text>
        </View>
      </View>

      {updatedAt && (
        <View className="mt-3 flex-row items-center gap-2 border-t border-[#E2E8F0] pt-3">
          <FontAwesome6 name="clock" size={12} color="#94A3B8" />
          <Text className="text-xs text-[#94A3B8]">
            Creado {createdAt} · Actualizado {updatedAt}
          </Text>
        </View>
      )}
    </View>
  );
}
