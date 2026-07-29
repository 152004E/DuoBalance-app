import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { FontAwesome6 } from '@expo/vector-icons';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { BottomSheetHeader } from '@/components/ui/bottom-sheet-header';

export interface InviteMemberSheetProps {
  visible: boolean;
  onClose: () => void;
  invitationCode?: string;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  heightRatio?: number;
  headerFinalTranslateY?: number;
}

export function InviteMemberSheet({
  visible,
  onClose,
  invitationCode = '------',
  onRegenerate,
  isRegenerating = false,
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
      subtitle="Comparte este código para que otros se unan al grupo"
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
        <View className="mt-1 items-center rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2">
          <Text className="text-sm font-medium text-[#64748B]">
            Código de invitación
          </Text>
          <Text className="text-2xl font-bold tracking-[0.3em] text-[#10B981]">
            {invitationCode}
          </Text>
        </View>

        {/* QR Code */}
        <View className="mt-3 items-center">
          <View className="items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3">
            <Text className="mb-3 text-sm font-medium text-[#64748B]">
              Escanea para unirte
            </Text>
            <View className="h-62 w-62 items-center justify-center rounded-xl bg-white">
              <QRCode value={invitationCode} size={180} />
            </View>
          </View>
        </View>

        {/* Texto explicativo */}
        <View className="mt-3 rounded-2xl bg-[#ECFDF5] p-3">
          <Text className="text-[12px] leading-4 text-[#065F46]">
            Los miembros deben ingresar este código en "Unirse a grupo" para
            conectarse al grupo. El código expirará en 24 horas.
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

        {/* Regenerar código */}
        <Pressable
          onPress={onRegenerate}
          disabled={isRegenerating}
          className={`mt-4 flex-row items-center justify-center gap-2 rounded-xl py-4 ${
            isRegenerating ? 'bg-[#10B981]/50' : 'bg-[#10B981]'
          }`}
        >
          {isRegenerating ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <FontAwesome6 name="rotate" size={16} color="#FFFFFF" />
              <Text className="text-base font-semibold text-white">
                Regenerar código
              </Text>
            </>
          )}
        </Pressable>

        {/* Placeholders para futuras acciones */}
        <View className="mt-4 gap-3">
          {[
            { icon: 'share-nodes', label: 'Compartir código' },
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
