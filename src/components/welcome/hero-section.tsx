import { View, Text, Image } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Polygon } from 'react-native-svg';

interface HeroSectionProps {
  width: number;
  height: number;
}

export function HeroSection({ width, height }: HeroSectionProps) {
  return (
    <View style={{ height, overflow: 'hidden' }}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="heroGrad" x1={0} y1={0} x2={1} y2={1}>
            <Stop offset="0%" stopColor="#10B981" />
            <Stop offset="100%" stopColor="#006C49" />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={height} fill="url(#heroGrad)" />
        <Polygon
          fill="#F8FAFC"
          points={`${width},${height * 0.8} ${width},${height} 0,${height}`}
        />
      </Svg>

      <View className="absolute inset-0 items-center justify-center px-6">
        <View className="mb-6 h-16 w-16 items-center justify-center rounded-xl bg-white/20">
          <Image
            source={require('../../../assets/images/logo-white-green-bg.png')}
            className="h-12 w-12"
            resizeMode="contain"
          />
        </View>
        <Text className="max-w-[280px] text-center text-2xl font-semibold text-white">
          ¡Bienvenido a DuoBalance!
        </Text>
      </View>
    </View>
  );
}
