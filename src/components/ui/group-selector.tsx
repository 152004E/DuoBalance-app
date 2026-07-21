import { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

export interface GroupOption {
  id: string;
  name: string;
  type: 'personal' | 'couple' | 'group';
}

const MOCK_GROUPS: GroupOption[] = [
  { id: 'all', name: 'Todos', type: 'personal' },
  { id: 'personal', name: 'Mis Finanzas', type: 'personal' },
  { id: '1', name: 'Andrea', type: 'couple' },
  { id: '2', name: 'Daniela', type: 'couple' },
  { id: '3', name: 'Apartamento', type: 'group' },
  { id: '4', name: 'Viaje Cartagena', type: 'group' },
];

const TYPE_ICONS: Record<GroupOption['type'], { icon: string; color: string }> = {
  personal: { icon: 'user', color: '#0F766E' },
  couple: { icon: 'heart', color: '#EC4899' },
  group: { icon: 'users', color: '#8B5CF6' },
};

interface GroupSelectorProps {
  selectedId?: string;
  onSelect?: (group: GroupOption) => void;
  variant?: 'light' | 'dark';
  options?: GroupOption[];
}

export function GroupSelector({ selectedId, onSelect, variant = 'light', options }: GroupSelectorProps) {
  const [open, setOpen] = useState(false);
  const items = options ?? MOCK_GROUPS;
  const selected = items.find(g => g.id === (selectedId ?? 'all')) ?? items[0];
  const selIcon = TYPE_ICONS[selected.type];

  return (
    <View className="relative">
      <Pressable
        onPress={() => setOpen(true)}
        className={`flex-row items-center gap-2 rounded-xl border px-4 py-2.5 shadow-sm active:opacity-80 ${
          variant === 'dark'
            ? 'border-white/30 bg-white/10'
            : 'border-[#E2E8F0] bg-white'
        }`}
      >
        <FontAwesome6 name={selIcon.icon} size={14} color={variant === 'dark' ? 'white' : selIcon.color} solid />
        <Text className={`font-semibold ${variant === 'dark' ? 'text-white' : 'text-[#0F172A]'}`}>{selected.name}</Text>
        <FontAwesome6 name="chevron-down" size={12} color={variant === 'dark' ? 'white' : '#64748B'} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable className="flex-1 bg-black/30" onPress={() => setOpen(false)}>
          <View className="mt-32 mx-4 rounded-xl bg-white border border-[#E2E8F0] shadow-lg overflow-hidden">
            <FlatList
              data={items}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {
                const icon = TYPE_ICONS[item.type];
                const isSelected = item.id === (selectedId ?? 'all');
                return (
                  <Pressable
                    onPress={() => {
                      onSelect?.(item);
                      setOpen(false);
                    }}
                    className={`flex-row items-center gap-3 px-4 py-3.5 active:bg-[#F8FAFC] ${
                      isSelected ? 'bg-[#10B981]/10 border-l-4 border-[#10B981]' : ''
                    }`}
                  >
                    <FontAwesome6 name={icon.icon} size={16} color={isSelected ? '#10B981' : icon.color} solid />
                    <Text className={`text-base ${isSelected ? 'font-bold text-[#10B981]' : 'font-medium text-[#0F172A]'}`}>
                      {item.name}
                    </Text>
                  </Pressable>
                );
              }}
              ListFooterComponent={() => (
                <>
                  <View className="h-px bg-[#E2E8F0]" />
                  <Pressable
                    onPress={() => setOpen(false)}
                    className="flex-row items-center gap-3 px-4 py-3.5 active:bg-[#F8FAFC]"
                  >
                    <FontAwesome6 name="plus" size={16} color="#10B981" solid />
                    <Text className="text-base font-semibold text-[#10B981]">Crear grupo</Text>
                  </Pressable>
                </>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
