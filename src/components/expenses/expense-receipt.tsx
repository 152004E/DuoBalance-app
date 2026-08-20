import { useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { FontAwesome6 } from '@expo/vector-icons';
import { resolveImageUrl } from '@/utils/image-url';

interface ExpenseReceiptProps {
  receipt?: string | null;
  onPress?: () => void;
  onAdd?: () => void;
  onRemove?: () => void;
}

export function ExpenseReceipt({
  receipt,
  onPress,
  onAdd,
  onRemove,
}: ExpenseReceiptProps) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const imageUri = resolveImageUrl(receipt);

  function handlePress() {
    if (onPress) {
      onPress();
    } else {
      setPreviewVisible(true);
    }
  }

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
        <>
          <Pressable
            onPress={handlePress}
            className="relative h-[200px] items-center justify-center overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#f2f4f6] active:opacity-80"
          >
            <Image
              source={{ uri: imageUri ?? '' }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />
          </Pressable>

          {onRemove && (
            <Pressable
              onPress={onRemove}
              className="mt-3 flex-row items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white py-2.5 active:bg-[#F2F4F6]"
            >
              <FontAwesome6 name="trash-can" size={13} color="#EF4444" />
              <Text className="text-sm font-semibold text-[#EF4444]">
                Eliminar comprobante
              </Text>
            </Pressable>
          )}
        </>
      ) : (
        <Pressable
          onPress={onAdd}
          disabled={!onAdd}
          className="flex-col items-center justify-center rounded-xl border border-dashed border-[#bbcabf] bg-[#f2f4f6] py-8"
        >
          {onAdd ? (
            <>
              <FontAwesome6 name="camera" size={40} color="#006c49" />
              <Text className="mt-3 text-sm font-medium text-[#006c49]">
                Agregar comprobante
              </Text>
            </>
          ) : (
            <>
              <FontAwesome6 name="receipt" size={40} color="#bbcabf" />
              <Text className="mt-3 text-sm font-medium text-[#64748B]">
                No hay comprobante asociado
              </Text>
            </>
          )}
        </Pressable>
      )}

      <Modal
        visible={previewVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewVisible(false)}
      >
        <View className="flex-1 bg-black/90">
          <Pressable
            onPress={() => setPreviewVisible(false)}
            className="absolute right-5 top-12 z-10 h-11 w-11 items-center justify-center rounded-full bg-white/15 active:bg-white/25"
          >
            <FontAwesome6 name="xmark" size={20} color="#fff" />
          </Pressable>
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={{ width: '100%', height: '100%' }}
              contentFit="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
}
