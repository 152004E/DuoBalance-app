import { useState, useMemo } from 'react';
import { View, Text, Pressable, Modal, FlatList } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import type { GroupResponse } from '@/types/api';
import type { FilterState, FilterCategory } from '@/types/filter';

type ViewLevel = 'main' | 'couples' | 'groups';

interface GroupSelectorProps {
  value: FilterState;
  onChange: (filter: FilterState) => void;
  personalGroups: GroupResponse[];
  coupleGroups: GroupResponse[];
  sharedGroups: GroupResponse[];
  variant?: 'light' | 'dark';
}

const TYPE_ICONS: Record<string, { icon: string; color: string }> = {
  personal: { icon: 'user', color: '#0F766E' },
  couple: { icon: 'heart', color: '#EC4899' },
  group: { icon: 'users', color: '#8B5CF6' },
};

function getButtonLabel(
  value: FilterState,
  personalGroups: GroupResponse[],
  coupleGroups: GroupResponse[],
  sharedGroups: GroupResponse[],
): string {
  if (value.category === 'all') return 'Todos';
  if (value.category === 'personal') return 'Personal';
  if (value.category === 'couple') {
    if (value.groupId) {
      const g = coupleGroups.find((g) => g.id === value.groupId);
      return g ? g.name : 'Parejas';
    }
    return 'Parejas';
  }
  if (value.category === 'group') {
    if (value.groupId) {
      const g = sharedGroups.find((g) => g.id === value.groupId);
      return g ? g.name : 'Grupos';
    }
    return 'Grupos';
  }
  return 'Todos';
}

export function GroupSelector({
  value,
  onChange,
  personalGroups,
  coupleGroups,
  sharedGroups,
  variant = 'light',
}: GroupSelectorProps) {
  const [open, setOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewLevel>('main');

  const label = getButtonLabel(
    value,
    personalGroups,
    coupleGroups,
    sharedGroups,
  );

  const selectedTypeIcon = useMemo(() => {
    if (value.category === 'personal') return TYPE_ICONS.personal;
    if (value.category === 'couple') return TYPE_ICONS.couple;
    if (value.category === 'group') return TYPE_ICONS.group;
    return { icon: 'layer-group', color: '#0F766E' };
  }, [value.category]);

  const needsCoupleSubmenu = coupleGroups.length > 1;
  const needsGroupSubmenu = sharedGroups.length > 1;

  const handleOpen = () => {
    setCurrentView('main');
    setOpen(true);
  };

  const renderMainView = () => (
    <FlatList
      data={[
        {
          id: 'all',
          name: 'Todos',
          type: 'all' as const,
          icon: 'layer-group',
          color: '#64748B',
        },
        {
          id: 'personal',
          name: 'Personal',
          type: 'personal' as const,
          icon: 'user',
          color: '#0F766E',
        },
        ...(needsCoupleSubmenu
          ? [
              {
                id: '__couples__',
                name: 'Parejas',
                type: 'couple' as const,
                icon: 'chevron-right',
                color: '#EC4899',
                isSubmenu: true as const,
              },
            ]
          : coupleGroups.map((g) => ({
              id: g.id,
              name: g.name,
              type: 'couple' as const,
              icon: 'heart',
              color: '#EC4899',
              isSubmenu: false as const,
            }))),
        ...(needsGroupSubmenu
          ? [
              {
                id: '__groups__',
                name: 'Grupos',
                type: 'group' as const,
                icon: 'chevron-right',
                color: '#8B5CF6',
                isSubmenu: true as const,
              },
            ]
          : sharedGroups.map((g) => ({
              id: g.id,
              name: g.name,
              type: 'group' as const,
              icon: 'users',
              color: '#8B5CF6',
              isSubmenu: false as const,
            }))),
      ]}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const isSubmenu = 'isSubmenu' in item && item.isSubmenu;
        const isAll = item.id === 'all';
        const isPersonal = item.id === 'personal';
        const isSelected = isSubmenu
          ? value.category === item.type
          : isAll
            ? value.category === 'all'
            : isPersonal
              ? value.category === 'personal'
              : value.category === item.type && value.groupId === item.id;

        if ('isSubmenu' in item && item.isSubmenu) {
          return (
            <Pressable
              onPress={() => {
                if (item.id === '__couples__') setCurrentView('couples');
                if (item.id === '__groups__') setCurrentView('groups');
              }}
              className={`flex-row items-center gap-3 px-4 py-3.5 active:bg-[#F8FAFC] ${
                isSelected ? 'border-l-4 border-[#10B981] bg-[#10B981]/10' : ''
              }`}
            >
              <Text
                className={`flex-1 text-base ${isSelected ? 'font-bold text-[#10B981]' : 'font-medium text-[#0F172A]'}`}
              >
                {item.name}
              </Text>
              <FontAwesome6
                name="chevron-right"
                size={14}
                color={isSelected ? '#10B981' : '#CBD5E1'}
              />
            </Pressable>
          );
        }

        return (
          <Pressable
            onPress={() => {
              if (item.id === 'all')
                onChange({ category: 'all', groupId: null });
              else if (item.id === 'personal') {
                const pg = personalGroups[0];
                onChange({ category: 'personal', groupId: pg?.id ?? null });
              } else {
                onChange({
                  category: item.type as FilterCategory,
                  groupId: item.id,
                });
              }
              setOpen(false);
            }}
            className={`flex-row items-center gap-3 px-4 py-3.5 active:bg-[#F8FAFC] ${
              isSelected ? 'border-l-4 border-[#10B981] bg-[#10B981]/10' : ''
            }`}
          >
            <FontAwesome6
              name={item.icon as any}
              size={16}
              color={isSelected ? '#10B981' : item.color}
              solid
            />
            <Text
              className={`text-base ${isSelected ? 'font-bold text-[#10B981]' : 'font-medium text-[#0F172A]'}`}
            >
              {item.name}
            </Text>
          </Pressable>
        );
      }}
    />
  );

  const renderCouplesView = () => (
    <FlatList
      data={[
        { id: '__back__', name: 'Parejas', isBack: true },
        {
          id: '__all_couples__',
          name: 'Todas las parejas',
          groupId: null as string | null,
        },
        ...coupleGroups.map((g) => ({ id: g.id, name: g.name, groupId: g.id })),
      ]}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        if ('isBack' in item && item.isBack) {
          return (
            <Pressable
              onPress={() => setCurrentView('main')}
              className="flex-row items-center gap-3 px-4 py-3.5 active:bg-[#F8FAFC]"
            >
              <FontAwesome6 name="arrow-left" size={16} color="#0F172A" />
              <Text className="text-base font-semibold text-[#0F172A]">
                {item.name}
              </Text>
            </Pressable>
          );
        }

        const isSelected =
          value.category === 'couple' && value.groupId === item.groupId;

        return (
          <Pressable
            onPress={() => {
              onChange({
                category: 'couple',
                groupId: item.groupId as string | null,
              });
              setOpen(false);
            }}
            className={`flex-row items-center gap-3 px-4 py-3.5 active:bg-[#F8FAFC] ${
              isSelected ? 'border-l-4 border-[#10B981] bg-[#10B981]/10' : ''
            }`}
          >
            <FontAwesome6
              name="heart"
              size={16}
              color={isSelected ? '#10B981' : '#EC4899'}
              solid
            />
            <Text
              className={`text-base ${isSelected ? 'font-bold text-[#10B981]' : 'font-medium text-[#0F172A]'}`}
            >
              {item.name}
            </Text>
          </Pressable>
        );
      }}
    />
  );

  const renderGroupsView = () => (
    <FlatList
      data={[
        { id: '__back__', name: 'Grupos', isBack: true },
        {
          id: '__all_groups__',
          name: 'Todos los grupos',
          groupId: null as string | null,
        },
        ...sharedGroups.map((g) => ({ id: g.id, name: g.name, groupId: g.id })),
      ]}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        if ('isBack' in item && item.isBack) {
          return (
            <Pressable
              onPress={() => setCurrentView('main')}
              className="flex-row items-center gap-3 px-4 py-3.5 active:bg-[#F8FAFC]"
            >
              <FontAwesome6 name="arrow-left" size={16} color="#0F172A" />
              <Text className="text-base font-semibold text-[#0F172A]">
                {item.name}
              </Text>
            </Pressable>
          );
        }

        const isSelected =
          value.category === 'group' && value.groupId === item.groupId;

        return (
          <Pressable
            onPress={() => {
              onChange({
                category: 'group',
                groupId: item.groupId as string | null,
              });
              setOpen(false);
            }}
            className={`flex-row items-center gap-3 px-4 py-3.5 active:bg-[#F8FAFC] ${
              isSelected ? 'border-l-4 border-[#10B981] bg-[#10B981]/10' : ''
            }`}
          >
            <FontAwesome6
              name="users"
              size={16}
              color={isSelected ? '#10B981' : '#8B5CF6'}
              solid
            />
            <Text
              className={`text-base ${isSelected ? 'font-bold text-[#10B981]' : 'font-medium text-[#0F172A]'}`}
            >
              {item.name}
            </Text>
          </Pressable>
        );
      }}
    />
  );

  return (
    <View className="relative">
      <Pressable
        onPress={handleOpen}
        className={`flex-row items-center gap-2 rounded-xl border px-4 py-2.5 shadow-sm active:opacity-80 ${
          variant === 'dark'
            ? 'border-white/30 bg-white/10'
            : 'border-[#E2E8F0] bg-white'
        }`}
      >
        <FontAwesome6
          name={selectedTypeIcon.icon as any}
          size={14}
          color={variant === 'dark' ? 'white' : selectedTypeIcon.color}
          solid
        />
        <Text
          className={`font-semibold ${variant === 'dark' ? 'text-white' : 'text-[#0F172A]'}`}
        >
          {label}
        </Text>
        <FontAwesome6
          name="chevron-down"
          size={12}
          color={variant === 'dark' ? 'white' : '#64748B'}
        />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          className="flex-1 bg-black/30"
          onPress={() => setOpen(false)}
        >
          <View className="mx-4 mt-32 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-lg">
            {currentView === 'main' && renderMainView()}
            {currentView === 'couples' && renderCouplesView()}
            {currentView === 'groups' && renderGroupsView()}
            <View className="h-px bg-[#E2E8F0]" />
            <Pressable
              onPress={() => {
                setOpen(false);
                router.push('/grupos?create=1');
              }}
              className="flex-row items-center gap-3 px-4 py-3.5 active:bg-[#F8FAFC]"
            >
              <FontAwesome6 name="plus" size={16} color="#10B981" solid />
              <Text className="text-base font-semibold text-[#10B981]">
                Crear grupo
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
