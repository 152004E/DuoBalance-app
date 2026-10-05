import { View, Text, ScrollView, Dimensions } from 'react-native';
import type { GroupResponse } from '@/types/api';
import type { DashboardViewMode } from '@/storage/preferences';
import { GroupCard } from './group-card';
import type { GroupSummary } from '@/hooks/use-group-summaries';

const CARD_WIDTH = Dimensions.get('window').width * 0.82;

interface GroupSectionProps {
  title: string;
  groups: GroupResponse[];
  summaries?: Record<string, GroupSummary>;
  horizontal?: boolean;
  showMenu?: boolean;
  viewMode?: DashboardViewMode;
  onPress?: (group: GroupResponse) => void;
  onMenu?: (group: GroupResponse) => void;
  onPressFixedExpenses?: (group: GroupResponse) => void;
  currentUserId?: string;
}

export function GroupSection({
  title,
  groups,
  summaries,
  horizontal = false,
  showMenu = false,
  viewMode = 'monthly',
  onPress,
  onMenu,
  onPressFixedExpenses,
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
                  summary={summaries?.[group.id]}
                  showMenu={showMenu}
                  viewMode={viewMode}
                  onPress={() => onPress?.(group)}
                  onMenu={() => onMenu?.(group)}
                  onPressFixedExpenses={() => onPressFixedExpenses?.(group)}
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
                summary={summaries?.[group.id]}
                showMenu={showMenu}
                viewMode={viewMode}
                onPress={() => onPress?.(group)}
                onMenu={() => onMenu?.(group)}
                onPressFixedExpenses={() => onPressFixedExpenses?.(group)}
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
              summary={summaries?.[group.id]}
              showMenu={showMenu}
              viewMode={viewMode}
              onPress={() => onPress?.(group)}
              onMenu={() => onMenu?.(group)}
              onPressFixedExpenses={() => onPressFixedExpenses?.(group)}
              currentUserId={currentUserId}
            />
          ))}
        </View>
      )}
    </View>
  );
}
