import { View, Text } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

interface Participant {
  name: string;
  initials: string;
  isPayer: boolean;
}

interface ExpenseParticipantsProps {
  participants: Participant[];
}

export function ExpenseParticipants({
  participants,
}: ExpenseParticipantsProps) {
  return (
    <View
      className="mx-5 rounded-2xl border border-[#E2E8F0] bg-white p-5"
      style={{
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
      }}
    >
      <Text className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
        Participantes
      </Text>

      <View className="gap-3">
        {participants.map((p) => (
          <View key={p.name} className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E2E8F0]">
                <Text className="text-sm font-bold text-[#64748B]">
                  {p.initials}
                </Text>
              </View>
              <View>
                <Text className="text-base font-semibold text-[#0F172A]">
                  {p.name}
                </Text>
                {p.isPayer && (
                  <View className="mt-0.5">
                    <Text className="text-[11px] font-semibold text-[#006c49]">
                      Pagó
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <FontAwesome6
              name={p.isPayer ? 'circle-check' : 'circle-user'}
              size={20}
              color={p.isPayer ? '#006c49' : '#94A3B8'}
              solid={p.isPayer}
            />
          </View>
        ))}
      </View>
    </View>
  );
}
