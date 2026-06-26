import { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  type SharedValue,
} from 'react-native-reanimated';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheet } from '@/components/ui/bottom-sheet';

export type CoupleMenuAction = 'invite' | 'settings' | 'export' | 'history' | 'leave';

interface MenuItem {
  action: CoupleMenuAction;
  icon: string;
  label: string;
  iconBg: string;
  isDestructive?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  { action: 'invite', icon: 'user-plus', label: 'Invitar miembro', iconBg: '#10B981' },
  { action: 'settings', icon: 'gear', label: 'Configuración del grupo', iconBg: '#0F766E' },
  { action: 'export', icon: 'file-export', label: 'Exportar gastos', iconBg: '#3B82F6' },
  { action: 'history', icon: 'clock-rotate-left', label: 'Historial liquidaciones', iconBg: '#8B5CF6' },
  { action: 'leave', icon: 'right-from-bracket', label: 'Salir del grupo', iconBg: '#EF4444', isDestructive: true },
];

interface CoupleMenuSheetProps {
  visible: boolean;
  onClose: () => void;
  onAction: (action: CoupleMenuAction) => void;
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
            <FontAwesome6 name={item.icon as any} size={18} color={item.iconBg} />
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
      {index < MENU_ITEMS.length - 1 && !MENU_ITEMS[index + 1]?.isDestructive && (
        <View className="ml-16 border-b border-[#F1F5F9]" />
      )}
    </Animated.View>
  );
}

export function CoupleMenuSheet({ visible, onClose, onAction }: CoupleMenuSheetProps) {
  const insets = useSafeAreaInsets();

  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(20);

  const itemAnimations: ItemAnimationState[] = MENU_ITEMS.map(() => ({
    opacity: useSharedValue(0),
    translateX: useSharedValue(30),
  }));

  useEffect(() => {
    if (visible) {
      const t1 = setTimeout(() => {
        titleOpacity.value = withTiming(1, { duration: 350, easing: Easing.out(Easing.cubic) });
        titleTranslateY.value = withTiming(0, { duration: 350, easing: Easing.out(Easing.cubic) });
      }, 950);
      const t2 = setTimeout(() => {
        subtitleOpacity.value = withTiming(1, { duration: 350, easing: Easing.out(Easing.cubic) });
        subtitleTranslateY.value = withTiming(0, { duration: 350, easing: Easing.out(Easing.cubic) });
      }, 1100);

      const itemTimers = itemAnimations.map((state, idx) =>
        setTimeout(() => {
          state.opacity.value = withTiming(1, { duration: 350, easing: Easing.out(Easing.cubic) });
          state.translateX.value = withTiming(0, { duration: 350, easing: Easing.out(Easing.cubic) });
        }, 1150 + idx * 100)
      );

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        itemTimers.forEach(clearTimeout);
      };
    } else {
      titleOpacity.value = 0;
      titleTranslateY.value = 20;
      subtitleOpacity.value = 0;
      subtitleTranslateY.value = 20;
      itemAnimations.forEach((state) => {
        state.opacity.value = 0;
        state.translateX.value = 30;
      });
    }
  }, [visible]);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const header = (
    <View
      style={{
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        overflow: 'hidden',
      }}
    >
      <LinearGradient
        colors={['#10B981', '#0F766E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1 justify-end px-5 pt-17"
        style={{ padding: insets.top + 10, paddingBottom: insets.bottom + 50 }}
      >
        <Pressable
          onPress={onClose}
          className="h-8 w-8 items-center justify-center rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
        >
          <FontAwesome6 name="arrow-left" size={18} color="#FFFFFF" />
        </Pressable>

        <Animated.View style={titleStyle}>
          <Text className="mt-5 text-[28px] font-extrabold tracking-tight text-white">
            Opciones del grupo
          </Text>
        </Animated.View>

        <Animated.View style={subtitleStyle}>
          <Text className="mt-1.5 text-base leading-5 text-white/80">
            Administra tu grupo de gastos compartidos
          </Text>
        </Animated.View>
      </LinearGradient>
    </View>
  );

  return (
    <BottomSheet visible={visible} onClose={onClose} header={header} heightRatio={0}>
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
