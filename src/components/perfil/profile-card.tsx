import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { FontAwesome6 } from '@expo/vector-icons';

interface ProfileCardProps {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string | null;
  showChangePhoto?: boolean;
  onChangePhoto?: () => void;
}

function resolveAvatar(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  const base = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";
  return `${base}${url}`;
}

function capitalize(str: string): string {
  if (!str) return str;
  return str
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function ProfileCard({
  firstName,
  lastName,
  email,
  avatarUrl,
  showChangePhoto = false,
  onChangePhoto,
}: ProfileCardProps) {
  const imageUri = resolveAvatar(avatarUrl);

  return (
    <View className="mx-5 mt-8 rounded-2xl bg-white px-6 py-8 items-center shadow-sm">
      <View className="h-[100px] w-[100px] items-center justify-center rounded-full bg-[#E2E8F0] border-[4px] border-[#10B981] overflow-hidden">
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            className="h-full w-full"
            contentFit="cover"
          />
        ) : (
          <FontAwesome6 name="user" size={36} color="#94A3B8" />
        )}
      </View>
      {showChangePhoto && (
        <Pressable onPress={onChangePhoto} className="mt-2">
          <Text className="text-sm font-medium text-[#10B981]">
            Cambiar foto
          </Text>
        </Pressable>
      )}
      <Text
        className="mt-4 text-2xl font-bold text-[#0F172A]"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {capitalize(firstName ?? '')} {capitalize(lastName ?? '')}
      </Text>
      <Text className="mt-1 text-sm text-[#64748B]">
        {email}
      </Text>
    </View>
  );
}
