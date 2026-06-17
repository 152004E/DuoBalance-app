import { View, Text, Image } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Polygon,
} from 'react-native-svg';

interface HeroSectionProps {
  width: number;
  height: number;
}

export function HeroSection({ width, height }: HeroSectionProps) {
  return (
    <View style={{ height, overflow: 'hidden' }}>
      <Svg
        width={width}
        height={height}
        style={{
          position: 'absolute',
        }}
      >
        <Defs>
          <LinearGradient id="heroGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#10B981" />
            <Stop offset="100%" stopColor="#006C49" />
          </LinearGradient>
        </Defs>

        {/* Fondo principal */}
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="url(#heroGrad)"
        />

        {/* Overlay diagonal oscuro */}
        <Polygon
          fill="#00583B"
          opacity={0.35}
          points={`
            ${width * 0.65},0
            ${width},0
            ${width},${height}
            ${width * 0.25},${height}
          `}
        />

        {/* Corte diagonal inferior */}
        <Polygon
          fill="#F8FAFC"
          points={`
            0,${height}
            ${width},${height * 0.72}
            ${width},${height}
          `}
        />
      </Svg>

      <View className="absolute inset-0 items-center justify-center px-8">
        {/* Glow */}
        <View className="absolute top-[28%] h-36 w-36 rounded-full bg-white/10" />

        {/* Logo */}
        <Image
          source={require('../../../assets/images/logo-white-green-bg.png')}
          className="mb-6 h-28 w-28"
          resizeMode="contain"
        />

        {/* Marca */}
        <Text className="text-lg font-semibold tracking-widest text-white/80">
          DUOBALANCE
        </Text>

        {/* Título */}
        <Text className="mt-4 text-center text-4xl font-extrabold tracking-tight text-white">
          ¡Bienvenido!
        </Text>

        {/* Subtítulo */}
        <Text className="mt-4 max-w-[320px] text-center text-base leading-6 text-white/80">
          Gestiona tus gastos compartidos de forma simple, transparente y en
          tiempo real.
        </Text>
      </View>
    </View>
  );
}