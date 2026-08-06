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
import { CreateCoupleSheet } from '@/components/couple/create-couple-sheet';

interface FloatingAddMenuProps {
  heightRatio?: number;
  headerFinalTranslateY?: number;
  createCoupleHeightRatio?: number;
  createCoupleHeaderFinalTranslateY?: number;
  onJoinCouple?: () => void;
  openCreateSignal?: number;
}

interface MenuItem {
  action: 'create-couple' | 'join-couple';
  icon: string;
  label: string;
  iconBg: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    action: 'create-couple',
    icon: 'user-plus',
    label: 'Crear Grupo',
    iconBg: '#10B981',
  },
  {
    action: 'join-couple',
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

export function FloatingAddMenu({
  heightRatio = 0.45,
  headerFinalTranslateY = 0.27,
  createCoupleHeightRatio = 0.65,
  createCoupleHeaderFinalTranslateY = 0.17,
  onJoinCouple,
  openCreateSignal = 0,
}: FloatingAddMenuProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [showCreateSheet, setShowCreateSheet] = useState(false);

  useEffect(() => {
    if (openCreateSignal > 0) {
      setMenuVisible(false);
      setShowCreateSheet(true);
    }
  }, [openCreateSignal]);

  const pendingActionRef = useRef<'create-couple' | 'join-couple' | null>(null);
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

  const handleCreateCouple = useCallback(() => {
    pendingActionRef.current = 'create-couple';
    handleCloseMenu();
  }, [handleCloseMenu]);

  const handleJoinCouple = useCallback(() => {
    pendingActionRef.current = 'join-couple';
    handleCloseMenu();
  }, [handleCloseMenu]);

  const handleMenuCloseComplete = useCallback(() => {
    if (pendingActionRef.current === 'create-couple') {
      pendingActionRef.current = null;
      setShowCreateSheet(true);
    } else if (pendingActionRef.current === 'join-couple') {
      pendingActionRef.current = null;
      onJoinCouple?.();
    }
  }, [onJoinCouple]);

  const header = (
    <BottomSheetHeader
      visible={menuVisible}
      title="Agregar"
      subtitle="Crea o únete a un grupo para gestionar gastos"
      onClose={handleCloseMenu}
      gradientPaddingBottom={500}
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
        heightRatio={heightRatio}
        headerFinalTranslateY={headerFinalTranslateY}
      >
        <View className="flex-1 px-5 pt-2">
          {MENU_ITEMS.map((item, index) => (
            <MenuItemRow
              key={item.action}
              item={item}
              animation={itemAnimations[index]}
              onPress={() => {
                if (item.action === 'create-couple') {
                  handleCreateCouple();
                } else if (item.action === 'join-couple') {
                  handleJoinCouple();
                }
              }}
            />
          ))}
        </View>
      </BottomSheet>

      <CreateCoupleSheet
        visible={showCreateSheet}
        onClose={() => setShowCreateSheet(false)}
        heightRatio={createCoupleHeightRatio}
        headerFinalTranslateY={createCoupleHeaderFinalTranslateY}
      />
    </>
  );
}
