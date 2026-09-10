import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Share,
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

  const inviteUrl = `https://duobalance.pages.dev/join?code=${invitationCode}`;

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareLink = async () => {
    try {
      await Share.share({
        message: `¡Únete a mi grupo en DuoBalance!\n\nHaz clic en este enlace para entrar directamente:\n${inviteUrl}`,
      });
    } catch (error) {
      console.error('Error al compartir', error);
    }
  };

  const header = (
    <BottomSheetHeader
      visible={visible}
      title="Invitar miembro"
      subtitle="Comparte este enlace para que otros se unan al grupo"
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
              Escanea con tu cámara para unirte
            </Text>
            <View className="h-62 w-62 items-center justify-center rounded-xl bg-white">
              <QRCode value={inviteUrl} size={180} />
            </View>
          </View>
        </View>

        {/* Texto explicativo */}
        <View className="mt-3 rounded-2xl bg-[#ECFDF5] p-3">
          <Text className="text-[12px] leading-4 text-[#065F46]">
            También puedes escanear este código QR. El enlace expirará en 24 horas.
          </Text>
        </View>

        {/* Botón 1: Compartir Enlace (Principal) */}
        <Pressable
          onPress={handleShareLink}
          className="mt-4 flex-row items-center justify-center gap-2 rounded-xl bg-[#10B981] py-4 active:opacity-80"
          style={{
            shadowColor: '#10B981',
            shadowOpacity: 0.25,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
            elevation: 6,
          }}
        >
          <FontAwesome6 name="share-nodes" size={16} color="#FFFFFF" />
          <Text className="text-base font-semibold text-white">
            Compartir enlace
          </Text>
        </Pressable>

        {/* Botón 2: Copiar Enlace (Secundario) */}
        <Pressable
          onPress={handleCopyLink}
          className="mt-3 flex-row items-center justify-center gap-2 rounded-xl border border-[#10B981] bg-white py-4 active:opacity-80"
        >
          <FontAwesome6
            name={copied ? 'circle-check' : 'link'}
            size={16}
            color="#10B981"
          />
          <Text className="text-base font-semibold text-[#10B981]">
            {copied ? '¡Enlace copiado!' : 'Copiar enlace'}
          </Text>
        </Pressable>

        {/* Botón 3: Regenerar código (Terciario ghost) */}
        <Pressable
          onPress={onRegenerate}
          disabled={isRegenerating}
          className="mt-2 flex-row items-center justify-center gap-2 py-4 active:opacity-60"
        >
          {isRegenerating ? (
            <ActivityIndicator size="small" color="#64748B" />
          ) : (
            <>
              <FontAwesome6 name="rotate" size={14} color="#64748B" />
              <Text className="text-sm font-semibold text-[#64748B]">
                Regenerar enlace de invitación
              </Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </BottomSheet>
  );
}
