import { View, Text, Image } from 'react-native';
import { useWindowDimensions } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Polygon,
} from 'react-native-svg';
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
  const { width } = useWindowDimensions();
  const isOwed = direction === 'OWED_TO_ME';
  const isSettled = direction === 'SETTLED';
  const HEADER_HEIGHT = 380;

  const pillText = isSettled
    ? 'Cuentas equilibradas'
    : isOwed
      ? `Te deben $${partnerShare.toLocaleString('es-CL')}`
      : `Tú debes $${partnerShare.toLocaleString('es-CL')}`;

  return (
    <View
      style={{
        height: HEADER_HEIGHT,
        overflow: 'hidden',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
      }}
    >
      <Svg
        width={width}
        height={HEADER_HEIGHT + 30}
        style={{ position: 'absolute' }}
      >
        <Defs>
          <LinearGradient id="heroGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#10B981" />
            <Stop offset="100%" stopColor="#059669" />
          </LinearGradient>
        </Defs>

        <Rect
          x={0}
          y={0}
          width={width}
          height={HEADER_HEIGHT}
          fill="url(#heroGradient)"
        />

        <Polygon
          fill="#0A5D4A"
          opacity={0.3}
          points={`
            ${width * 0.99},0
            ${width},0
            ${width},${HEADER_HEIGHT}
            0,${HEADER_HEIGHT}
          `}
        />


      </Svg>

      <View
        style={{
          flex: 1,
          paddingTop: 26,
          paddingHorizontal: 20,
        }}
      >
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
            className={`mt-4 rounded-full px-5 py-1.5 ${
              isSettled ? 'bg-green-200' : 'bg-red-100'
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                isSettled ? 'text-green-800' : 'text-red-700'
              }`}
            >
              {pillText}
            </Text>
          </View>

          <CoupleSelector coupleName={coupleName} onPress={onCouplePress} />
        </View>
      </View>
    </View>
  );
}
