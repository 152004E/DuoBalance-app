import { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, Easing } from 'react-native';
import { useWindowDimensions } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
  ClipPath,
} from 'react-native-svg';
import { CoupleSelector } from '@/components/dashboard/CoupleSelector';

type BalanceDirection = 'OWED_TO_ME' | 'I_OWE' | 'SETTLED';

interface DashboardVariantProps {
  variant: 'dashboard';
  balance: number;
  partnerShare: number;
  direction: BalanceDirection;
  coupleName?: string;
  onCouplePress?: () => void;
}

interface PageVariantProps {
  variant: 'page';
  title: string;
  subtitle?: string;
}

type HeroSectionProps = {
  userName: string;
  height?: number;
} & (DashboardVariantProps | PageVariantProps);

export function HeroSection(props: HeroSectionProps) {
  const { variant, userName, height = 270 } = props;
  const { width } = useWindowDimensions();

  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentSlideUp = useRef(new Animated.Value(20)).current;
  const numberScale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.timing(contentOpacity, {
      toValue: 1,
      duration: 550,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.timing(contentSlideUp, {
      toValue: 0,
      duration: 550,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    if (variant === 'dashboard') {
      Animated.spring(numberScale, {
        toValue: 1,
        friction: 8,
        tension: 50,
        delay: 250,
        useNativeDriver: true,
      }).start();
    }
  }, []);

  return (
    <View
      style={{
        height,
        overflow: 'hidden',
        borderBottomLeftRadius: 60,
        borderBottomRightRadius: 60,
      }}
    >
      <Svg
        width={width}
        height={height + 40}
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
                V${height - 40}
                Q${width} ${height - 10}, ${width * 0.5} ${height}
                Q0 ${height - 10}, 0 ${height - 40}
                Z
              `}
            />
          </ClipPath>
        </Defs>

        <Path
          d={`
            M0 0
            H${width}
            V${height - 40}
            Q${width} ${height - 10}, ${width * 0.5} ${height}
            Q0 ${height - 10}, 0 ${height - 40}
            Z
          `}
          fill="url(#heroGradient)"
          clipPath="url(#heroClip)"
        />

        {variant === 'dashboard' && (
          <Path
            d={`
      M0 ${height - 70}
      C${width * 0.25} ${height - 110},
       ${width * 0.3} ${height - 90},
       ${width * 0.45} ${height - 70}
      C${width * 0.65} ${height - 50},
       ${width * 0.8} ${height - 20},
       ${width} ${height - 70}
      L${width} ${height}
      L0 ${height}
      Z
    `}
            fill="#0B4436"
            opacity={0.27}
            clipPath="url(#heroClip)"
          />
        )}
      </Svg>

      <Animated.View
        style={{
          flex: 1,
          paddingTop: 26,
          paddingHorizontal: 20,
          opacity: contentOpacity,
          transform: [{ translateY: contentSlideUp }],
        }}
      >
        {variant === 'dashboard' ? (
          <>
            <View className="flex-row items-center gap-2">
              <Image
                source={require('@/assets/images/logo-white-green-bg-without.png')}
                style={{ width: 25, height: 25 }}
                resizeMode="contain"
              />
              <Text className="text-base text-white">
                Bienvenido,{' '}
                <Text className="font-semibold">{userName}</Text>
              </Text>
            </View>

            <View className="mt-8 items-center">
              <Animated.View
                style={{ transform: [{ scale: numberScale }] }}
              >
                <Text className="text-5xl font-bold tracking-tight text-white">
                  ${props.balance.toLocaleString('es-CL')}
                </Text>
              </Animated.View>

              <View
                className={`mt-4 rounded-full px-5 py-1.5 ${props.direction === 'SETTLED' ? 'bg-green-200' : 'bg-red-100'}`}
              >
                <Text
                  className={`text-sm font-medium ${props.direction === 'SETTLED' ? 'text-green-800' : 'text-red-700'}`}
                >
                  {props.direction === 'SETTLED'
                    ? 'Cuentas equilibradas'
                    : props.direction === 'OWED_TO_ME'
                      ? `Te deben $${props.partnerShare.toLocaleString('es-CL')}`
                      : `Tú debes $${props.partnerShare.toLocaleString('es-CL')}`}
                </Text>
              </View>

              <CoupleSelector
                coupleName={props.coupleName ?? ''}
                onPress={props.onCouplePress}
              />
            </View>
          </>
        ) : (
          <>
            <View className="flex-row items-center gap-2">
              <Image
                source={require('@/assets/images/logo-white-green-bg-without.png')}
                style={{ width: 25, height: 25 }}
                resizeMode="contain"
              />
              <Text className="text-base text-white">
                Bienvenido,{' '}
                <Text className="font-semibold">{userName}</Text>
              </Text>
            </View>

            <View className="mt-8 items-center">
              <Text className="text-3xl font-bold text-white">
                {props.title}
              </Text>
              {props.subtitle && (
                <Text className="mt-1 text-base text-white/80">
                  {props.subtitle}
                </Text>
              )}
            </View>
          </>
        )}
      </Animated.View>
    </View>
  );
}
