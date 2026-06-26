import { View, Text, Pressable } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

type CoupleStatus = 'positive' | 'neutral' | 'negative';

interface CoupleCardProps {
  id?: string;
  name: string;
  balance: number;
  status: CoupleStatus;
  onPress?: () => void;
  onMenu?: () => void;
}

export function CoupleCard({ id, name, balance, status, onPress, onMenu }: CoupleCardProps) {
  const dotColor =
    status === 'positive'
      ? '#10B981'
      : status === 'negative'
        ? '#EF4444'
        : '#F59E0B';

  return (
    <Pressable onPress={onPress} className="min-w-[240px] flex-row items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
      <View className="h-12 w-12 items-center justify-center rounded-full border-2 border-[#bbcabf] bg-[#eceef0]">
        <FontAwesome6 name="user" size={18} color="#64748B" />
      </View>
      <View className="flex-1">
        <Text className="mb-1 text-sm font-semibold text-[#0F172A]">
          Pareja: {name}
        </Text>
        <View className="flex-row items-center gap-1.5 self-start rounded-full bg-[#10B981]/10 px-2.5 py-1">
          <View
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: dotColor }}
          />
          <Text className="text-xs font-medium text-[#10B981]">
            ${balance.toLocaleString('es-CL')}
          </Text>
        </View>
      </View>

      {onMenu && (
        <Pressable
          onPress={onMenu}
          className="h-10 w-10 items-center justify-center"
        >
          <FontAwesome6 name="ellipsis-vertical" size={18} color="#64748B" />
        </Pressable>
      )}
    </Pressable>
  );
}
