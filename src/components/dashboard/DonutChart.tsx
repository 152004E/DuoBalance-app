import { View, Text } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutSegment[];
}

export function DonutChart({ data }: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = 36;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const size = (radius + strokeWidth) * 2;
  const cx = size / 2;
  const cy = size / 2;

  let offset = 0;

  return (
    <View className="items-center">
      <View className="relative">
        <Svg width={size} height={size}>
          <G transform={`rotate(-90, ${cx}, ${cy})`}>
            {data.map((segment) => {
              const segmentLength =
                total > 0 ? (segment.value / total) * circumference : 0;
              const segmentOffset = offset;
              offset += segmentLength;

              return (
                <Circle
                  key={segment.label}
                  cx={cx}
                  cy={cy}
                  r={radius}
                  stroke={segment.color}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                  strokeDashoffset={-segmentOffset}
                />
              );
            })}
          </G>
        </Svg>
        <View className="absolute inset-0 items-center justify-center">
          <Text className="text-lg font-bold text-[#0F172A]">
            ${total.toLocaleString('es-CL')}
          </Text>
          <Text className="text-[10px] text-[#64748B]">Total</Text>
        </View>
      </View>

      <View className="mt-4 flex-row flex-wrap justify-center gap-x-4 gap-y-2">
        {data.map((segment) => {
          const percent =
            total > 0 ? Math.round((segment.value / total) * 100) : 0;
          return (
            <View key={segment.label} className="flex-row items-center gap-1.5">
              <View
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <Text className="text-xs text-[#64748B]">
                {segment.label} ({percent}%)
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
