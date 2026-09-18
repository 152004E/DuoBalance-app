import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Pressable, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  type SharedValue,
} from 'react-native-reanimated';
import { FontAwesome6 } from '@expo/vector-icons';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { BottomSheetHeader } from '@/components/ui/bottom-sheet-header';

interface DashboardActionMenuProps {
  onCreateExpense?: () => void;
  onCreateGroup?: () => void;
  onJoinGroup?: () => void;
}

interface MenuItem {
  action: 'create-expense' | 'create-group' | 'join-group';
  icon: string;
  label: string;
  iconBg: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    action: 'create-expense',
    icon: 'money-bill-wave',
    label: 'Registrar Gasto',
    iconBg: '#F59E0B',
  },
  {
    action: 'create-group',
    icon: 'user-plus',
    label: 'Crear Grupo',
    iconBg: '#10B981',
  },
  {
    action: 'join-group',
    icon: 'link',
    label: 'Unirse a un Grupo',
    iconBg: '#3B82F6',
  },
];

interface ItemAnimationState {
  opacity: SharedValue<number>;
  translateX: SharedValue<number>;
}

function MenuItemRow({
  item,
  animation,
  onPress,
}: {
  item: MenuItem;
  animation: ItemAnimationState;
  onPress: () => void;
}) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: animation.opacity.value,
    transform: [{ translateX: animation.translateX.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        className="flex-row items-center justify-between rounded-2xl px-1 py-4 active:bg-[#F8FAFC]"
      >
        <View className="flex-row items-center gap-4">
          <View
            className="h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: `${item.iconBg}26` }}
          >
            <FontAwesome6
              name={item.icon as any}
              size={18}
              color={item.iconBg}
            />
          </View>
          <Text className="text-base font-semibold text-[#0F172A]">
            {item.label}
          </Text>
        </View>
        <FontAwesome6 name="chevron-right" size={14} color="#CBD5E1" />
      </Pressable>
    </Animated.View>
  );
}

export function DashboardActionMenu({
  onCreateExpense,
  onCreateGroup,
  onJoinGroup,
}: DashboardActionMenuProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  const pendingActionRef = useRef<'create-expense' | 'create-group' | 'join-group' | null>(null);
  const rotation = useSharedValue(0);

  const itemAnimations: ItemAnimationState[] = MENU_ITEMS.map(() => ({
    opacity: useSharedValue(0),
    translateX: useSharedValue(30),
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  useEffect(() => {
    if (menuVisible) {
      itemAnimations.forEach((state) => {
        state.opacity.value = 0;
        state.translateX.value = 30;
      });

      const itemTimers = itemAnimations.map((state, idx) =>
        setTimeout(
          () => {
            state.opacity.value = withTiming(1, {
              duration: 350,
              easing: Easing.out(Easing.cubic),
            });
            state.translateX.value = withTiming(0, {
              duration: 350,
              easing: Easing.out(Easing.cubic),
            });
          },
          1150 + idx * 100,
        ),
      );

      return () => {
        itemTimers.forEach(clearTimeout);
      };
    }
  }, [menuVisible]);

  const handleOpenMenu = useCallback(() => {
    setMenuVisible(true);
    rotation.value = withTiming(180, { duration: 300 });
  }, [rotation]);

  const handleCloseMenu = useCallback(() => {
    setMenuVisible(false);
    rotation.value = withTiming(0, { duration: 300 });
  }, [rotation]);

  const handleMenuCloseComplete = useCallback(() => {
    if (pendingActionRef.current === 'create-expense') {
      pendingActionRef.current = null;
      onCreateExpense?.();
    } else if (pendingActionRef.current === 'create-group') {
      pendingActionRef.current = null;
      onCreateGroup?.();
    } else if (pendingActionRef.current === 'join-group') {
      pendingActionRef.current = null;
      onJoinGroup?.();
    }
  }, [onCreateExpense, onCreateGroup, onJoinGroup]);

  const header = (
    <BottomSheetHeader
      visible={menuVisible}
      title="Acciones Rápidas"
      subtitle="¿Qué te gustaría hacer?"
      onClose={handleCloseMenu}
      logo={require('@/assets/images/logo-white-green-bg-without.png')}
    />
  );

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          if (menuVisible) {
            handleCloseMenu();
          } else {
            handleOpenMenu();
          }
        }}
        className="absolute bottom-6 right-6 z-50 h-12 w-12 items-center justify-center rounded-full bg-[#10B981] shadow-lg"
        activeOpacity={0.8}
      >
        <Animated.View style={animatedIconStyle}>
          <FontAwesome6 name="angle-up" size={22} color="white" />
        </Animated.View>
      </TouchableOpacity>

      <BottomSheet
        visible={menuVisible}
        onClose={handleCloseMenu}
        onCloseComplete={handleMenuCloseComplete}
        header={header}
      >
        <View className="flex-1 px-5 pt-2">
          {MENU_ITEMS.map((item, index) => (
            <MenuItemRow
              key={item.action}
              item={item}
              animation={itemAnimations[index]}
              onPress={() => {
                pendingActionRef.current = item.action;
                handleCloseMenu();
              }}
            />
          ))}
        </View>
      </BottomSheet>
    </>
  );
}
