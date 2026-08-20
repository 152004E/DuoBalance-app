import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { BottomSheetHeader } from '@/components/ui/bottom-sheet-header';

interface JoinGroupSheetProps {
  visible: boolean;
  onClose: () => void;
  onJoin?: (code: string) => void;
  isLoading?: boolean;
  heightRatio?: number;
  headerFinalTranslateY?: number;
}

export function JoinGroupSheet({
  visible,
  onClose,
  onJoin,
  isLoading = false,
  heightRatio = 0.75,
  headerFinalTranslateY = Math.max(0.01, 0.37 - heightRatio * 0.75),
}: JoinGroupSheetProps) {
  const [code, setCode] = useState('');

  const isDisabled = code.trim().length === 0 || isLoading;

  const handleJoin = () => {
    if (code.trim().length === 0) return;
    onJoin?.(code.trim());
  };

  const header = (
    <BottomSheetHeader
      visible={visible}
      title="Unirse a un grupo"
      subtitle="Ingresa el código de invitación del grupo al que quieres unirte."
      onClose={onClose}
      gradientPaddingBottom={600}
      logo={require('@/assets/images/logo-white-green-bg-without.png')}
    />
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      header={header}
      heightRatio={heightRatio}
      headerFinalTranslateY={headerFinalTranslateY}
    >
      <View className="flex-1">
        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-6"
        >
          {/* Sección 1: Ingresar código manual */}
          <Text className="mb-2 mt-2 text-sm font-semibold text-[#0F172A]">
            Ingresar código
          </Text>

          <TextInput
            className="rounded-2xl border border-[#E2E8F0] bg-white px-4 py-4 text-center text-base font-medium tracking-[3px] text-[#0F172A] shadow-sm"
            placeholder="ABCD-1234"
            placeholderTextColor="#94A3B8"
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
            maxLength={9}
            editable={!isLoading}
          />

          <Pressable
            onPress={handleJoin}
            disabled={isDisabled}
            className={`mt-4 h-14 w-full items-center justify-center rounded-2xl ${
              isDisabled ? 'bg-[#94A3B8]' : 'bg-[#10B981]'
            }`}
            style={
              !isDisabled
                ? {
                    shadowColor: '#10B981',
                    shadowOpacity: 0.25,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 6 },
                    elevation: 6,
                  }
                : undefined
            }
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text className="text-base font-semibold text-white">Unirme</Text>
            )}
          </Pressable>

          {/* Sección 2: QR Scanner placeholder */}
          <Text className="mb-2 mt-4 text-sm font-semibold text-[#0F172A]">
            Escanear código QR
          </Text>

          <View className="aspect-[4/3] w-full overflow-hidden rounded-3xl bg-[#ECEEF0]">
            {/* Viewfinder corners */}
            <View className="absolute left-4 top-4 h-10 w-10 rounded-tl-[20px] border-l-[3px] border-t-[3px] border-white" />
            <View className="absolute right-4 top-4 h-10 w-10 rounded-tr-[20px] border-r-[3px] border-t-[3px] border-white" />
            <View className="absolute bottom-4 left-4 h-10 w-10 rounded-bl-[20px] border-b-[3px] border-l-[3px] border-white" />
            <View className="absolute bottom-4 right-4 h-10 w-10 rounded-br-[20px] border-b-[3px] border-r-[3px] border-white" />

            {/* Center QR icon */}
            <View className="flex-1 items-center justify-center">
              <View className="h-24 w-24 items-center justify-center rounded-full bg-white/80">
                <FontAwesome6 name="qrcode" size={40} color="#64748B" />
              </View>
            </View>
          </View>

          <Pressable
            onPress={() => {
              // TODO: implementar escáner QR (placeholder por ahora)
            }}
            className="mt-4 h-14 w-full items-center justify-center rounded-2xl bg-[#10B981]"
            style={{
              shadowColor: '#10B981',
              shadowOpacity: 0.25,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
              elevation: 6,
            }}
          >
            <View className="flex-row items-center gap-2">
              <FontAwesome6 name="camera" size={16} color="white" />
              <Text className="text-base font-semibold text-white">
                Tomar foto o escanear
              </Text>
            </View>
          </Pressable>
        </ScrollView>
      </View>
    </BottomSheet>
  );
}
