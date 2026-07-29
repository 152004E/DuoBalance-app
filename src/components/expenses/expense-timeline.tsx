import { View, Text } from 'react-native';

interface TimelineEntry {
  label: string;
  value: string;
}

interface ExpenseTimelineProps {
  entries: TimelineEntry[];
}

export function ExpenseTimeline({ entries }: ExpenseTimelineProps) {
  return (
    <View className="mx-5">
      <Text className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
        Actividad
      </Text>
      <View className="ml-2 flex-col gap-0 border-l-2 border-[#E2E8F0] pl-5">
        {entries.map((entry, index) => (
          <View
            key={entry.label}
            className={`relative ${index < entries.length - 1 ? 'mb-4' : ''}`}
          >
            <View
              className={`absolute -left-[27px] top-1 h-4 w-4 rounded-full border-4 border-[#F8FAFC] shadow-sm ${
                index === 0 ? 'bg-[#006c49]' : 'bg-[#E2E8F0]'
              }`}
            />
            <Text className="text-sm font-semibold text-[#0F172A]">
              {entry.label}
            </Text>
            <Text className="text-sm text-[#64748B]">{entry.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
