import { View, Text } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

interface ProfileCardProps {
  firstName?: string;
  lastName?: string;
  email?: string;
  showChangePhoto?: boolean;
}

export function ProfileCard({
  firstName,
  lastName,
  email,
  showChangePhoto = false,
}: ProfileCardProps) {
  return (
    <View className="mx-5 mt-8 rounded-2xl bg-white px-6 py-8 items-center shadow-sm">
      <View className="h-[100px] w-[100px] items-center justify-center rounded-full bg-[#E2E8F0] border-[4px] border-[#10B981]">
        <FontAwesome6 name="user" size={36} color="#94A3B8" />
      </View>
      {showChangePhoto && (
        <Text className="mt-2 text-sm font-medium text-[#10B981]">
          Cambiar foto
        </Text>
      )}
      <Text className="mt-4 text-2xl font-bold text-[#0F172A]">
        {firstName} {lastName}
      </Text>
      <Text className="mt-1 text-sm text-[#64748B]">
        {email}
      </Text>
    </View>
  );
}
