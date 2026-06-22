import { type ReactNode } from 'react';
import { View, type ViewStyle } from 'react-native';
import { useWindowDimensions } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
  ClipPath,
} from 'react-native-svg';

interface AppHeroProps {
  children?: ReactNode;
  height?: number;
  style?: ViewStyle;
}

export function AppHero({
  children,
  height = 270,
  style,
}: AppHeroProps) {
  const { width } = useWindowDimensions();

  return (
    <View
      style={[
        {
          height,
          overflow: 'hidden',
          borderBottomLeftRadius: 60,
          borderBottomRightRadius: 60,
        },
        style,
      ]}
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
        {children}
      </View>
    </View>
  );
}
