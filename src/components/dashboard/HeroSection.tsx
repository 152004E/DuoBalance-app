import { View, Text, Image } from 'react-native';
import { AppHero } from '@/components/layout/AppHero';
import { CoupleSelector } from './CoupleSelector';

type BalanceDirection = 'OWED_TO_ME' | 'I_OWE' | 'SETTLED';

interface HeroSectionProps {
  userName: string;
  balance: number;
  partnerShare: number;
  direction: BalanceDirection;
  coupleName: string;
  onCouplePress?: () => void;
}

export function HeroSection({
  userName,
  balance,
  partnerShare,
  direction,
  coupleName,
  onCouplePress,
}: HeroSectionProps) {
  const isOwed = direction === 'OWED_TO_ME';
  const isSettled = direction === 'SETTLED';

  const pillText = isSettled
    ? 'Cuentas equilibradas'
    : isOwed
      ? `Te deben $${partnerShare.toLocaleString('es-CL')}`
      : `Tú debes $${partnerShare.toLocaleString('es-CL')}`;

  return (
    <AppHero>
      <View className="flex-row items-center gap-2">
        <Image
          source={require('@/assets/images/logo-white-green-bg-without.png')}
          style={{ width: 25, height: 25 }}
          resizeMode="contain"
        />
        <Text className="text-base text-white">
          Bienvenido, <Text className="font-semibold">{userName}</Text>
        </Text>
      </View>

      <View className="mt-5 items-center">
        <Text className="text-5xl font-bold tracking-tight text-white">
          ${balance.toLocaleString('es-CL')}
        </Text>

        <View
          className={`mt-4 rounded-full px-5 py-1.5 ${isSettled ? 'bg-green-200' : 'bg-red-100'}`}
        >
          <Text
            className={`text-sm font-medium ${isSettled ? 'text-green-800' : 'text-red-700'}`}
          >
            {pillText}
          </Text>
        </View>

        <CoupleSelector coupleName={coupleName} onPress={onCouplePress} />
      </View>
    </AppHero>
  );
}
