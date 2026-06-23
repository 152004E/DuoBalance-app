import { View, Text } from 'react-native';

interface DistributionBarProps {
  yourPercentage: number;
  partnerPercentage: number;
}

export function DistributionBar({ yourPercentage, partnerPercentage }: DistributionBarProps) {
  return (
    <View className="h-11 w-full flex-row overflow-hidden rounded-full shadow-sm">
      <View
        className="flex-row items-center px-4"
        style={{
          width: `${yourPercentage}%`,
          backgroundColor: '#10B981',
        }}
      >
        <Text className="text-sm font-semibold text-white">{yourPercentage}%</Text>
      </View>
      <View
        className="flex-row items-center justify-end px-4"
        style={{
          width: `${partnerPercentage}%`,
          backgroundColor: '#0F766E',
        }}
      >
        <Text className="text-sm font-semibold text-white">{partnerPercentage}%</Text>
      </View>
    </View>
  );
}
