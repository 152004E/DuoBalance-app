import { View, Text } from 'react-native';

interface BarItem {
  label: string;
  value: number;
  color: string;
}

interface BarChartProps {
  data: BarItem[];
  maxValue?: number;
}

export function BarChart({ data, maxValue }: BarChartProps) {
  const max = maxValue ?? Math.max(...data.map((d) => d.value));

  return (
    <View className="gap-3">
      {data.map((item) => {
        const percent = (item.value / max) * 100;
        return (
          <View key={item.label}>
            <View className="mb-1 flex-row items-center justify-between">
              <Text className="text-xs text-[#64748B]">{item.label}</Text>
              <Text className="text-xs font-semibold text-[#0F172A]">
                ${item.value.toLocaleString('es-CL')}
              </Text>
            </View>
            <View className="h-3 w-full overflow-hidden rounded-full bg-[#eceef0]">
              <View
                className="h-full rounded-full"
                style={{ width: `${percent}%`, backgroundColor: item.color }}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}
