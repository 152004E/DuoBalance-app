import { View, Text } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

interface BenefitCardProps {
  icon: string;
  title: string;
  description: string;
  iconColor: string;
}

export function BenefitCard({ icon, title, description, iconColor }: BenefitCardProps) {
  return (
    <View className="flex-row items-start gap-4 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
      <View className="h-12 w-12 items-center justify-center rounded-full bg-[#F2F4F6]">
        <FontAwesome6 name={icon} size={22} color={iconColor} />
      </View>
      <View className="flex-1 flex-col">
        <Text className="mb-1 text-[17px] font-semibold text-[#0F172A]">{title}</Text>
        <Text className="text-sm leading-5 text-[#64748B]">{description}</Text>
      </View>
    </View>
  );
}
