import { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { FontAwesome6 } from '@expo/vector-icons';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { BottomSheetHeader } from '@/components/ui/bottom-sheet-header';

export interface InviteMemberSheetProps {
  visible: boolean;
  onClose: () => void;
  invitationCode?: string;
  heightRatio?: number;
  headerFinalTranslateY?: number;
}

const MOCK_CODE = 'ABCD-EFGH';

export function InviteMemberSheet({
  visible,
  onClose,
  invitationCode = MOCK_CODE,
  heightRatio = 0.75,
  headerFinalTranslateY = 0.17,
}: InviteMemberSheetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(invitationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const header = (
    <BottomSheetHeader
      visible={visible}
      title="Invitar miembro"
      subtitle="Comparte este código con tu pareja"
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
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-3"
      >
        {/* Código de invitación */}
        <View className="mt-3 items-center gap-1 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2">
          <Text className="text-sm font-medium text-[#64748B]">
            Código de invitación
          </Text>
          <Text className="text-2xl font-bold tracking-[0.3em] text-[#10B981]">
            {invitationCode}
          </Text>
        </View>

        {/* QR Code */}
        <View className="mt-3 items-center">
          <View className="items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white p-5">
            <Text className="mb-4 text-sm font-medium text-[#64748B]">
              Escanea para unirte
            </Text>
            <View className="h-56 w-56 items-center justify-center rounded-xl bg-white">
              <QRCode value={invitationCode} size={180} />
            </View>
          </View>
        </View>

        {/* Texto explicativo */}
        <View className="mt-3 rounded-2xl bg-[#ECFDF5] p-3">
          <Text className="text-[12px] leading-4 text-[#065F46]">
            Tu pareja debe ingresar este código en la sección "Unirse a grupo"
            de su app para conectarse contigo. El código expirará en 24 horas.
          </Text>
        </View>

        {/* Botón Copiar */}
        <Pressable
          onPress={handleCopy}
          className="mt-3 flex-row items-center justify-center gap-2 rounded-xl bg-[#10B981] py-4 active:opacity-80"
        >
          <FontAwesome6
            name={copied ? 'circle-check' : 'copy'}
            size={16}
            color="#FFFFFF"
          />
          <Text className="text-base font-semibold text-white">
            {copied ? '¡Copiado!' : 'Copiar código'}
          </Text>
        </Pressable>

        {/* Placeholders para futuras acciones */}
        <View className="mt-8 gap-3">
          <Text className="text-center text-xs font-medium uppercase tracking-wider text-[#94A3B8]">
            Próximamente
          </Text>

          {[
            { icon: 'share-nodes', label: 'Compartir código' },
            { icon: 'rotate', label: 'Regenerar código' },
            { icon: 'link', label: 'Invitar mediante enlace' },
          ].map((item) => (
            <View
              key={item.icon}
              className="flex-row items-center gap-3 rounded-xl border border-dashed border-[#E2E8F0] px-4 py-3 opacity-40"
            >
              <View className="h-10 w-10 items-center justify-center rounded-full bg-[#E2E8F0]">
                <FontAwesome6 name={item.icon} size={16} color="#94A3B8" />
              </View>
              <Text className="text-sm font-medium text-[#94A3B8]">
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </BottomSheet>
  );
}
