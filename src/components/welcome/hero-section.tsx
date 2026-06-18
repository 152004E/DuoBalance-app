import { View, Text, Image } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Polygon,
} from 'react-native-svg';
import { Path } from 'react-native-svg';
interface HeroSectionProps {
  width: number;
  height: number;
}

export function HeroSection({ width, height }: HeroSectionProps) {
  return (
    <View
      style={{
        height,
        overflow: 'hidden',
      }}
    >
      <Svg
        width={width}
        height={height}
        style={{
          position: 'absolute',
        }}
      >
        <Defs>
          <LinearGradient id="heroGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#18C784" />
            <Stop offset="100%" stopColor="#0E7C66" />
          </LinearGradient>
        </Defs>

        {/* Fondo */}
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="url(#heroGradient)"
        />

        {/* Diagonal oscura */}
        <Polygon
          fill="#0A5D4A"
          opacity={0.45}
          points={`
            ${width * 0.99},0
            ${width},0
            ${width},${height}
            ${width * 0.0},${height}
          `}
        />
        <Polygon
          fill="#F8FAFC"
          points={`
        -10,${height}
        ${width + 10},${height * 0.84}
        ${width + 10},${height + 10}
        -10,${height + 10}
          `}
        />
        
      </Svg>
      

      {/* Contenido */}
      <View className="absolute inset-0 w-full items-center ">
        <Image
          source={require('../../../assets/images/logo-white-green-bg-without.png')}
          style={{
            marginTop: 40,
            width: 60,
            height: 60,
          }}
          resizeMode="contain"
        />

        <Text
          className="mt-2 text-center font-extrabold text-white"
          style={{
            fontSize: 32,
            lineHeight: 38,
          }}
        >
          ¡Bienvenido a{'\n'}
          DuoBalance!
        </Text>
      </View>
    </View>
  );
}
