import { View, Text, Image } from 'react-native';
import { useWindowDimensions } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
  ClipPath,
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
  const HEADER_HEIGHT = 270;

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
        borderBottomLeftRadius: 60,
        borderBottomRightRadius: 60,
      }}
    >
      <Svg
        width={width}
        height={HEADER_HEIGHT + 40}
        style={{ position: 'absolute' }}
      >
        <Defs>
          <LinearGradient id="heroGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#065238ff" />
            <Stop offset="100%" stopColor="#04c88aff" />
          </LinearGradient>

          <LinearGradient id="waveGradient" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#0d523aff" />
            <Stop offset="100%" stopColor="#054d35ff" />
          </LinearGradient>

          <ClipPath id="heroClip">
            <Path
              d={`
          M0 0
          H${width}
          V${HEADER_HEIGHT - 40}
          Q${width} ${HEADER_HEIGHT - 10}, ${width * 0.5} ${HEADER_HEIGHT}
          Q0 ${HEADER_HEIGHT - 10}, 0 ${HEADER_HEIGHT - 40}
          Z
        `}
            />
          </ClipPath>
        </Defs>

        {/* Fondo principal */}
        <Path
          d={`
      M0 0
      H${width}
      V${HEADER_HEIGHT - 40}
      
      Q${width} ${HEADER_HEIGHT - 10}, ${width * 0.5} ${HEADER_HEIGHT}
      Q0 ${HEADER_HEIGHT - 10}, 0 ${HEADER_HEIGHT - 40}
      Z
    `}
          fill="url(#heroGradient)"
          clipPath="url(#heroClip)"
        />

        {/* Ola decorativa oscura */}
        <Path
          d={`
      M0 ${HEADER_HEIGHT - 70}

      C${width * 0.25} ${HEADER_HEIGHT - 110},
       ${width * 0.3} ${HEADER_HEIGHT - 90},
       ${width * 0.45} ${HEADER_HEIGHT - 70}

      C${width * 0.65} ${HEADER_HEIGHT - 50},
       ${width * 0.8} ${HEADER_HEIGHT - 20},
       ${width} ${HEADER_HEIGHT - 70}

      L${width} ${HEADER_HEIGHT}
      L0 ${HEADER_HEIGHT}
      Z
    `}
          fill="#0b4436ff"
          opacity={0.27}
          clipPath="url(#heroClip)"
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
            className={`mt-4 rounded-full px-5 py-1.5 ${isSettled ? 'bg-green-200' : 'bg-red-100'
              }`}
          >
            <Text
              className={`text-sm font-medium ${isSettled ? 'text-green-800' : 'text-red-700'
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
