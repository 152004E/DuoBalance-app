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
  height?: number; // Ignoramos el height que viene, usamos uno fijo
}

export function HeroSection({ width }: HeroSectionProps) {
  // ✅ ALTURA FIJA - la diagonal siempre cae en el mismo lugar
  const HEADER_HEIGHT = 250;

  return (
    <View
      style={{
        height: HEADER_HEIGHT,
        overflow: 'hidden',
        backgroundColor: 'white',
      }}
    >
      <Svg
        width={width}
        height={HEADER_HEIGHT + 50}
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

        {/* Fondo gradiente */}
        <Rect
          x={0}
          y={0}
          width={width}
          height={HEADER_HEIGHT}
          fill="url(#heroGradient)"
        />

        {/* Diagonal oscura - COORDENADAS FIJAS */}
        <Polygon
          fill="#0A5D4A"
          opacity={0.45}
          points={`
            ${width * 0.99},0
            ${width},0
            ${width},${HEADER_HEIGHT}
            0,${HEADER_HEIGHT}
          `}
        />


      </Svg>

      {/* Contenido */}
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          source={require('../../../assets/images/logo-white-green-bg-without.png')}
          style={{
            width: 60,
            height: 60,
            
          }}
          resizeMode="contain"
        />

        <Text
          style={{
            fontSize: 32,
            fontWeight: '800',
            color: '#fff',
            textAlign: 'center',
            lineHeight: 38,
          }}
        >
          ¡Bienvenido a{'\n'}DuoBalance!
        </Text>
      </View>
    </View>
  );
}