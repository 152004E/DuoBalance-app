import { View, Text } from 'react-native';

interface DistributionBarProps {
  yourPercentage: number;
  partnerPercentage: number;
}

export function DistributionBar({
  yourPercentage,
  partnerPercentage,
}: DistributionBarProps) {
  return (
    <View className="relative">
      <View className="h-11 w-full flex-row overflow-hidden rounded-full">
        <View
          style={{
            width: `${yourPercentage}%`,
            backgroundColor: '#10B981',
          }}
        />

        <View
          style={{
            width: `${partnerPercentage}%`,
            backgroundColor: '#0F766E',
          }}
        />
      </View>

      <View className="absolute inset-0 flex-row items-center justify-between px-4">
        <Text className="font-semibold text-white">{yourPercentage}%</Text>

        <Text className="font-semibold text-white">{partnerPercentage}%</Text>
      </View>
    </View>
  );
}
