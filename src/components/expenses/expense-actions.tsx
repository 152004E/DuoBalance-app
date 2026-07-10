import { View, Text, Pressable } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

interface ExpenseActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
}

export function ExpenseActions({ onEdit, onDelete, onShare }: ExpenseActionsProps) {
  return (
    <View className="mx-5 mt-4 flex-col gap-3">
      <Pressable
        onPress={onEdit}
        className="w-full flex-row items-center justify-center gap-2 rounded-2xl border-2 border-[#006c49] py-4 active:opacity-80"
      >
        <FontAwesome6 name="pen-to-square" size={16} color="#006c49" />
        <Text className="text-lg font-bold text-[#006c49]" style={{ fontFamily: 'Hanken Grotesk' }}>
          Editar gasto
        </Text>
      </Pressable>

      {onShare && (
        <Pressable
          onPress={onShare}
          className="w-full flex-row items-center justify-center gap-2 rounded-2xl border-2 border-[#E2E8F0] py-4 active:opacity-80"
        >
          <FontAwesome6 name="share-nodes" size={16} color="#64748B" />
          <Text className="text-lg font-bold text-[#64748B]" style={{ fontFamily: 'Hanken Grotesk' }}>
            Compartir
          </Text>
        </Pressable>
      )}

      <Pressable
        onPress={onDelete}
        className="w-full flex-row items-center justify-center gap-2 rounded-2xl py-4 active:opacity-80"
      >
        <FontAwesome6 name="trash" size={16} color="#EF4444" />
        <Text className="text-lg font-bold text-[#EF4444]" style={{ fontFamily: 'Hanken Grotesk' }}>
          Eliminar gasto
        </Text>
      </Pressable>
    </View>
  );
}
