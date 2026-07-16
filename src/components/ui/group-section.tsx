import { View, Text, FlatList } from 'react-native';
import type { GroupResponse } from '@/types/api';
import { GroupCard } from './group-card';

interface GroupSectionProps {
  title: string
  groups: GroupResponse[]
  horizontal?: boolean
  showMenu?: boolean
  onPress?: (group: GroupResponse) => void
  onMenu?: (group: GroupResponse) => void
  currentUserId?: string
}

export function GroupSection({
  title,
  groups,
  horizontal = false,
  showMenu = false,
  onPress,
  onMenu,
  currentUserId,
}: GroupSectionProps) {
  if (groups.length === 0) return null;

  return (
    <View className="mb-6">
      <Text className="mb-3 text-base font-bold text-[#0F172A]">
        {title}
      </Text>

      {horizontal ? (
        <View className="flex-row gap-4">
          {groups.map((group) => (
            <View key={group.id} className="min-w-[260px]">
              <GroupCard
                group={group}
                showMenu={showMenu}
                onPress={() => onPress?.(group)}
                onMenu={() => onMenu?.(group)}
                currentUserId={currentUserId}
              />
            </View>
          ))}
        </View>
      ) : (
        <View className="gap-3">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              showMenu={showMenu}
              onPress={() => onPress?.(group)}
              onMenu={() => onMenu?.(group)}
              currentUserId={currentUserId}
            />
          ))}
        </View>
      )}
    </View>
  );
}