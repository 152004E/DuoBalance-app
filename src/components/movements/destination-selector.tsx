import { View, Text, Pressable, FlatList } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { BottomSheetHeader } from '@/components/ui/bottom-sheet-header';
import type { GroupResponse } from '@/types/api';
import type { FilterState } from '@/types/filter';

interface DestinationSelectorProps {
  visible: boolean;
  onClose: () => void;
  filter: FilterState;
  personalGroups: GroupResponse[];
  coupleGroups: GroupResponse[];
  sharedGroups: GroupResponse[];
  onSelect: (group: GroupResponse) => void;
  heightRatio?: number;
  headerFinalTranslateY?: number;
}

interface DestItem {
  group: GroupResponse;
  icon: string;
  iconColor: string;
  label: string;
}

const TYPE_CONFIG: Record<string, { icon: string; iconColor: string }> = {
  PERSONAL: { icon: 'user', iconColor: '#0F766E' },
  COUPLE: { icon: 'heart', iconColor: '#EC4899' },
  GROUP: { icon: 'users', iconColor: '#8B5CF6' },
};

export function DestinationSelector({
  visible,
  onClose,
  filter,
  personalGroups,
  coupleGroups,
  sharedGroups,
  onSelect,
  heightRatio = 0.5,
  headerFinalTranslateY,
}: DestinationSelectorProps) {
  const getHeaderConfig = () => {
    switch (filter.category) {
      case 'couple':
        return {
          title: 'Seleccionar pareja',
          subtitle: 'Elige la pareja donde registrarás este gasto.',
        };
      case 'group':
        return {
          title: 'Seleccionar grupo',
          subtitle: 'Elige el grupo donde registrarás este gasto.',
        };
      default:
        return {
          title: 'Seleccionar destino',
          subtitle: 'Selecciona dónde deseas registrar el gasto.',
        };
    }
  };

  const buildItems = (): DestItem[] => {
    switch (filter.category) {
      case 'couple':
        return coupleGroups.map((g) => ({
          group: g,
          ...TYPE_CONFIG.COUPLE,
          label: g.name,
        }));
      case 'group':
        return sharedGroups.map((g) => ({
          group: g,
          ...TYPE_CONFIG.GROUP,
          label: g.name,
        }));
      default:
        return [
          ...personalGroups.map((g) => ({
            group: g,
            ...TYPE_CONFIG.PERSONAL,
            label: g.name,
          })),
          ...coupleGroups.map((g) => ({
            group: g,
            ...TYPE_CONFIG.COUPLE,
            label: g.name,
          })),
          ...sharedGroups.map((g) => ({
            group: g,
            ...TYPE_CONFIG.GROUP,
            label: g.name,
          })),
        ];
    }
  };

  const items = buildItems();
  const config = getHeaderConfig();

  const header = (
    <BottomSheetHeader
      visible={visible}
      title={config.title}
      subtitle={config.subtitle}
      onClose={onClose}
      gradientPaddingBottom={500}
      logo={require('@/assets/images/logo-white-green-bg-without.png')}
    />
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      header={header}
      heightRatio={heightRatio}
      headerFinalTranslateY={headerFinalTranslateY}
    >
      <View className="flex-1 px-5 pt-2">
        <FlatList
          data={items}
          keyExtractor={(item) => item.group.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                onSelect(item.group);
              }}
              className="flex-row items-center gap-4 rounded-2xl px-1 py-4 active:bg-[#F8FAFC]"
            >
              <View
                className="h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: `${item.iconColor}26` }}
              >
                <FontAwesome6
                  name={item.icon as any}
                  size={18}
                  color={item.iconColor}
                />
              </View>
              <Text className="text-base font-semibold text-[#0F172A]">
                {item.label}
              </Text>
            </Pressable>
          )}
        />
      </View>
    </BottomSheet>
  );
}
