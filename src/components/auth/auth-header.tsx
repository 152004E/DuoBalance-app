import { View, Text, Image } from 'react-native';

interface AuthHeaderProps {
  subtitle?: string;
}

export function AuthHeader({ subtitle }: AuthHeaderProps) {
  return (
    <View className="mt-5 items-center">
      <Image
        source={require('../../../assets/images/logo-green.png')}
        style={{
          width: 60,
          height: 60,

        }}
        resizeMode="contain"
      />
      <Text className="text-2xl font-bold tracking-tight text-[#0F172A]">
        DuoBalance
      </Text>
      {subtitle && (
        <Text className="mt-1 text-sm text-[#64748B]">{subtitle}</Text>
      )}
    </View>
  );
}