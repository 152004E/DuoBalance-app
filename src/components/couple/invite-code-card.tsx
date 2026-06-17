import { View, Text } from 'react-native';

interface InviteCodeCardProps {
  code: string;
}

export function InviteCodeCard({ code }: InviteCodeCardProps) {
  return (
    <View className="items-center gap-2 rounded-2xl bg-white p-6 shadow-sm">
      <Text className="text-sm text-[#64748B]">Código de invitación</Text>
      <Text className="text-3xl font-bold tracking-widest text-[#10B981]">
        {code}
      </Text>
      <Text className="text-xs text-[#64748B]">
        Comparte este código con tu pareja
      </Text>
    </View>
  );
}
