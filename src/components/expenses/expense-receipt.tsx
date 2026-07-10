import { View, Text, Pressable } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

interface ExpenseReceiptProps {
  receipt?: string;
  onPress?: () => void;
}

export function ExpenseReceipt({ receipt, onPress }: ExpenseReceiptProps) {
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
      <Text className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
        Comprobante
      </Text>

      {receipt ? (
        <Pressable
          onPress={onPress}
          className="relative min-h-[160px] items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#bbcabf] bg-[#f2f4f6] active:opacity-80"
        >
          <FontAwesome6 name="image" size={64} color="#bbcabf" />
          <Text className="mt-2 text-sm text-[#64748B]">Ver comprobante</Text>
        </Pressable>
      ) : (
        <View className="flex-col items-center justify-center rounded-xl border border-dashed border-[#bbcabf] bg-[#f2f4f6] py-8">
          <FontAwesome6 name="receipt" size={40} color="#bbcabf" />
          <Text className="mt-3 text-sm font-medium text-[#64748B]">
            No hay comprobante asociado
          </Text>
        </View>
      )}
    </View>
  );
}
