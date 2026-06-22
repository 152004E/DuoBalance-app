import { View, Text, Pressable } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

interface AddCoupleCardProps {
  onPress?: () => void;
}

export function AddCoupleCard({ onPress }: AddCoupleCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="min-w-[240px] flex-row items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 opacity-60 shadow-sm"
    >
      <View className="h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-[#bbcabf]">
        <FontAwesome6 name="plus" size={18} color="#64748B" />
      </View>
      <View>
        <Text className="text-sm font-medium text-[#64748B]">
          Añadir Pareja
        </Text>
      </View>
    </Pressable>
  );
}
