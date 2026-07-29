import { View, Text, ScrollView, Dimensions } from 'react-native';
import type { GroupResponse } from '@/types/api';
import { GroupCard } from './group-card';

const CARD_WIDTH = Dimensions.get('window').width * 0.82;

interface GroupSectionProps {
  title: string;
  groups: GroupResponse[];
  horizontal?: boolean;
  showMenu?: boolean;
  onPress?: (group: GroupResponse) => void;
  onMenu?: (group: GroupResponse) => void;
  currentUserId?: string;
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
      <Text className="mb-3 text-base font-bold text-[#0F172A]">{title}</Text>

      {horizontal ? (
        groups.length > 1 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              columnGap: 16,
              paddingRight: 20,
            }}
          >
            {groups.map((group) => (
              <View key={group.id} style={{ width: CARD_WIDTH }}>
                <GroupCard
                  group={group}
                  showMenu={showMenu}
                  onPress={() => onPress?.(group)}
                  onMenu={() => onMenu?.(group)}
                  currentUserId={currentUserId}
                />
              </View>
            ))}
          </ScrollView>
        ) : (
          <View>
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
        )
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
