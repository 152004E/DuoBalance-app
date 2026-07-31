import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  Easing,
  useWindowDimensions,
} from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
  ClipPath,
  Circle,
} from 'react-native-svg';
import Reanimated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withDelay,
  withSequence,
  Easing as ReEasing,
} from 'react-native-reanimated';
import { CoupleSelector } from '@/components/dashboard/CoupleSelector';
import { useDashboardHeroAnimation } from '@/hooks/use-dashboard-hero-animation';

const AnimatedCircle = Reanimated.createAnimatedComponent(Circle);
const AnimatedPath = Reanimated.createAnimatedComponent(Path);

type BalanceDirection = 'OWED_TO_ME' | 'I_OWE' | 'SETTLED';

interface DashboardVariantProps {
  variant: 'dashboard';
  balance: number;
  partnerShare: number;
  direction: BalanceDirection;
  coupleName?: string;
  onCouplePress?: () => void;
  rightAction?: React.ReactNode;
}

interface PageVariantProps {
  variant: 'page';
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
}

type HeroSectionProps = {
  userName: string;
  height?: number;
} & (DashboardVariantProps | PageVariantProps);

const PAGE_ICONS: Record<string, string[]> = {
  Gastos: [
    'M4 5h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2z',
    'M2 9h20',
  ],
  Grupos: [
    'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2',
    'M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    'M23 21v-2a4 4 0 0 0-3-3.87',
    'M16 3.13a4 4 0 0 1 0 7.75',
  ],
  Reportes: ['M18 20V10', 'M12 20V4', 'M6 20v-6'],
};

function AnimatedCircles({ width, height }: { width: number; height: number }) {
  const c1 = useSharedValue(0);
  const c2 = useSharedValue(0);
  const c3 = useSharedValue(0);

  useEffect(() => {
    c1.value = withTiming(1, {
      duration: 500,
      easing: ReEasing.out(ReEasing.cubic),
    });
    c2.value = withDelay(
      150,
      withTiming(1, { duration: 500, easing: ReEasing.out(ReEasing.cubic) }),
    );
    c3.value = withDelay(
      300,
      withTiming(1, { duration: 500, easing: ReEasing.out(ReEasing.cubic) }),
    );
  }, []);

  const props1 = useAnimatedProps(() => ({
    r: Math.max(0, c1.value * 75),
    opacity: Math.max(0, c1.value * 0.04),
  }));

  const props2 = useAnimatedProps(() => ({
    r: Math.max(0, c2.value * 85),
    opacity: Math.max(0, c2.value * 0.05),
  }));

  const props3 = useAnimatedProps(() => ({
    r: Math.max(0, c3.value * 45),
    opacity: Math.max(0, c3.value * 0.03),
  }));

  return (
    <>
      <AnimatedCircle
        animatedProps={props1}
        cx={width * 0.85}
        cy={-20}
        fill="white"
        clipPath="url(#heroClip)"
      />
      <AnimatedCircle
        animatedProps={props2}
        cx={-30}
        cy={height * 0.65}
        fill="white"
        clipPath="url(#heroClip)"
      />
      <AnimatedCircle
        animatedProps={props3}
        cx={width * 0.6}
        cy={height * 0.3}
        fill="white"
        clipPath="url(#heroClip)"
      />
    </>
  );
}

function AnimatedWave({ width, height }: { width: number; height: number }) {
  const o1 = useSharedValue(0);
  const o2 = useSharedValue(0);
  const mid = useSharedValue(0);

  useEffect(() => {
    o1.value = withSequence(
      withTiming(8, { duration: 500, easing: ReEasing.inOut(ReEasing.sin) }),
      withTiming(-4, { duration: 400, easing: ReEasing.inOut(ReEasing.sin) }),
      withTiming(2, { duration: 350, easing: ReEasing.inOut(ReEasing.sin) }),
      withTiming(-1, { duration: 300, easing: ReEasing.inOut(ReEasing.sin) }),
      withTiming(0, { duration: 450, easing: ReEasing.out(ReEasing.cubic) }),
    );

    o2.value = withDelay(
      180,
      withSequence(
        withTiming(7, { duration: 450, easing: ReEasing.inOut(ReEasing.sin) }),
        withTiming(-3, { duration: 350, easing: ReEasing.inOut(ReEasing.sin) }),
        withTiming(1, { duration: 300, easing: ReEasing.inOut(ReEasing.sin) }),
        withTiming(-0.5, {
          duration: 300,
          easing: ReEasing.inOut(ReEasing.sin),
        }),
        withTiming(0, { duration: 450, easing: ReEasing.out(ReEasing.cubic) }),
      ),
    );

    mid.value = withDelay(
      90,
      withSequence(
        withTiming(5, { duration: 400, easing: ReEasing.inOut(ReEasing.sin) }),
        withTiming(-2, { duration: 350, easing: ReEasing.inOut(ReEasing.sin) }),
        withTiming(1, { duration: 350, easing: ReEasing.inOut(ReEasing.sin) }),
        withTiming(0, { duration: 450, easing: ReEasing.out(ReEasing.cubic) }),
      ),
    );
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    d: [
      `M0 ${height - 70}`,
      `C${width * 0.25} ${height - 110 + o1.value},`,
      ` ${width * 0.3} ${height - 90 + o2.value},`,
      ` ${width * 0.45} ${height - 70 + mid.value}`,
      `C${width * 0.65} ${height - 50 + o2.value},`,
      ` ${width * 0.8} ${height - 20 + o1.value},`,
      ` ${width} ${height - 70 + mid.value}`,
      `L${width} ${height}`,
      `L0 ${height}`,
      `Z`,
    ].join('\n'),
  }));

  return (
    <AnimatedPath
      animatedProps={animatedProps}
      fill="#0B4436"
      opacity={0.27}
      clipPath="url(#heroClip)"
    />
  );
}

export function HeroSection(props: HeroSectionProps) {
  const { variant, userName, height = 270 } = props;
  const { width } = useWindowDimensions();

  const contentOpacity = useRef(
    new Animated.Value(variant === 'dashboard' ? 1 : 0),
  ).current;
  const contentSlideUp = useRef(
    new Animated.Value(variant === 'dashboard' ? 0 : 20),
  ).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleSlideUp = useRef(new Animated.Value(10)).current;

  const dashAnim = useDashboardHeroAnimation();

  useEffect(() => {
    if (variant !== 'dashboard') {
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

      if (props.subtitle) {
        Animated.parallel([
          Animated.timing(subtitleOpacity, {
            toValue: 1,
            duration: 400,
            delay: 200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(subtitleSlideUp, {
            toValue: 0,
            duration: 400,
            delay: 200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  }, []);

  const iconPaths = variant === 'page' ? PAGE_ICONS[props.title] : undefined;

  return (
    <View
      style={{
        height,
        overflow: 'hidden',
        borderBottomLeftRadius: 60,
        borderBottomRightRadius: 60,
      }}
    >
      <Svg width={width} height={height + 40} style={{ position: 'absolute' }}>
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
          <AnimatedWave width={width} height={height} />
        )}

        {variant === 'page' && (
          <AnimatedCircles width={width} height={height} />
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
            <Animated.View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                opacity: dashAnim.greetingOpacity,
                transform: [{ translateY: dashAnim.greetingTranslateY }],
              }}
            >
              <Image
                source={require('@/assets/images/logo-white-green-bg-without.png')}
                style={{ width: 25, height: 25 }}
                resizeMode="contain"
              />
              <Text className="text-base text-white">
                Bienvenido,{' '}
                <Text className="font-semibold">
                  {userName
                    .split(' ')
                    .map(
                      (w) =>
                        w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
                    )
                    .join(' ')}
                </Text>
              </Text>
            </Animated.View>

            <View className="mt-4 items-center">
              <Animated.View
                style={{
                  opacity: dashAnim.balanceOpacity,
                  transform: [{ scale: dashAnim.numberScale }],
                }}
              >
                <Text className="text-5xl font-bold tracking-tight text-white">
                  $ {props.balance.toLocaleString('es-CL')}
                </Text>
              </Animated.View>

              <Animated.View
                style={{
                  opacity: dashAnim.badgeOpacity,
                  transform: [{ translateY: dashAnim.badgeTranslateY }],
                }}
              >
                <View
                  className={`mt-1 rounded-full px-5 py-1.5 ${props.direction === 'SETTLED' ? 'bg-green-200' : 'bg-red-100'}`}
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
              </Animated.View>

              <Animated.View
                style={{
                  marginTop: 20,
                  opacity: dashAnim.selectorOpacity,
                  transform: [{ translateY: dashAnim.selectorTranslateY }],
                }}
              >
                {props.rightAction ?? (
                  <CoupleSelector
                    coupleName={props.coupleName ?? ''}
                    onPress={props.onCouplePress}
                  />
                )}
              </Animated.View>
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
                <Text className="font-semibold">
                  {userName
                    .split(' ')
                    .map(
                      (w) =>
                        w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
                    )
                    .join(' ')}
                </Text>
              </Text>
            </View>

            <View className="mt-8 items-center">
              <View className="flex-row items-center gap-2">
                {iconPaths && (
                  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                    {iconPaths.map((d, i) => (
                      <Path
                        key={i}
                        d={d}
                        stroke="white"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ))}
                  </Svg>
                )}
                <Text className="text-3xl font-bold text-white">
                  {props.title}
                </Text>
              </View>

              {props.subtitle && (
                <Animated.View
                  style={{
                    opacity: subtitleOpacity,
                    transform: [{ translateY: subtitleSlideUp }],
                  }}
                >
                  <Text className="mt-1 text-base text-white/80">
                    {props.subtitle}
                  </Text>
                </Animated.View>
              )}

              {props.rightAction && (
                <View className="mt-3">{props.rightAction}</View>
              )}
            </View>
          </>
        )}
      </Animated.View>
    </View>
  );
}
