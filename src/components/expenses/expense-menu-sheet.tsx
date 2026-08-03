import { useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  type SharedValue,
} from 'react-native-reanimated';
import { FontAwesome6 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { BottomSheetHeader } from '@/components/ui/bottom-sheet-header';

export type ExpenseMenuAction = 'edit' | 'delete';

interface MenuItem {
  action: ExpenseMenuAction;
  icon: string;
  label: string;
  iconBg: string;
  isDestructive?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  {
    action: 'edit',
    icon: 'pen-to-square',
    label: 'Editar gasto',
    iconBg: '#006c49',
  },
  {
    action: 'delete',
    icon: 'trash',
    label: 'Eliminar gasto',
    iconBg: '#EF4444',
    isDestructive: true,
  },
];

interface ExpenseMenuSheetProps {
  visible: boolean;
  onClose: () => void;
  onAction: (action: ExpenseMenuAction) => void;
  heightRatio?: number;
  headerFinalTranslateY?: number;
  onCloseComplete?: () => void;
}

interface ItemAnimationState {
  opacity: SharedValue<number>;
  translateX: SharedValue<number>;
}

function MenuItemRow({
  item,
  animation,
  onPress,
  index,
}: {
  item: MenuItem;
  animation: ItemAnimationState;
  onPress: () => void;
  index: number;
}) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: animation.opacity.value,
    transform: [{ translateX: animation.translateX.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      {item.isDestructive && (
        <View className="my-3 border-t border-[#E2E8F0]" />
      )}
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
          <Text
            className={`text-base font-semibold ${
              item.isDestructive ? 'text-[#EF4444]' : 'text-[#0F172A]'
            }`}
          >
            {item.label}
          </Text>
        </View>
        <FontAwesome6 name="chevron-right" size={14} color="#CBD5E1" />
      </Pressable>
      {index < MENU_ITEMS.length - 1 &&
        !MENU_ITEMS[index + 1]?.isDestructive && (
          <View className="ml-16 border-b border-[#F1F5F9]" />
        )}
    </Animated.View>
  );
}

export function ExpenseMenuSheet({
  visible,
  onClose,
  onAction,
  heightRatio = 0.5,
  headerFinalTranslateY,
  onCloseComplete,
}: ExpenseMenuSheetProps) {
  const insets = useSafeAreaInsets();

  const itemAnimations: ItemAnimationState[] = MENU_ITEMS.map(() => ({
    opacity: useSharedValue(0),
    translateX: useSharedValue(30),
  }));

  useEffect(() => {
    if (visible) {
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
  }, [visible]);

  const header = (
    <BottomSheetHeader
      visible={visible}
      title="Opciones del gasto"
      subtitle="Administra este gasto"
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
      onCloseComplete={onCloseComplete}
    >
      <View className="flex-1">
        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        >
          {MENU_ITEMS.map((item, index) => (
            <MenuItemRow
              key={item.action}
              item={item}
              animation={itemAnimations[index]}
              onPress={() => onAction(item.action)}
              index={index}
            />
          ))}
        </ScrollView>
      </View>
    </BottomSheet>
  );
}
