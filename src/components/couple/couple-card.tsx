import { View, Text } from 'react-native';

interface CoupleCardProps {
  partnerName?: string;
  partnerEmail?: string;
  onLeave?: () => void;
}

export function CoupleCard({ partnerName, partnerEmail }: CoupleCardProps) {
  return (
    <View className="rounded-2xl bg-[#0F766E] p-6 shadow-sm">
      <Text className="text-sm text-white/70">Tu pareja</Text>
      <Text className="mt-1 text-xl font-bold text-white">
        {partnerName ?? 'Esperando pareja...'}
      </Text>
      {partnerEmail && (
        <Text className="mt-1 text-sm text-white/70">{partnerEmail}</Text>
      )}
    </View>
  );
}
