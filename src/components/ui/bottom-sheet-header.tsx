import { useEffect } from 'react';
import { View, Text, Image, Pressable, type ImageSourcePropType } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BottomSheetHeaderProps {
  visible: boolean;
  title: string;
  subtitle: string;
  onClose: () => void;
  logo?: ImageSourcePropType;
  gradientColors?: [string, string, ...string[]];
  gradientPaddingBottom?: number;
  titleAnimationDelay?: number;
  subtitleAnimationDelay?: number;
}

export function BottomSheetHeader({
  visible,
  title,
  subtitle,
  onClose,
  logo,
  gradientColors = ['#10B981', '#0F766E'],
  gradientPaddingBottom = 100,
  titleAnimationDelay = 950,
  subtitleAnimationDelay = 1100,
}: BottomSheetHeaderProps) {
  const insets = useSafeAreaInsets();

  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(20);

  useEffect(() => {
    if (visible) {
      const t1 = setTimeout(() => {
        titleOpacity.value = withTiming(1, { duration: 350, easing: Easing.out(Easing.cubic) });
        titleTranslateY.value = withTiming(0, { duration: 350, easing: Easing.out(Easing.cubic) });
      }, titleAnimationDelay);
      const t2 = setTimeout(() => {
        subtitleOpacity.value = withTiming(1, { duration: 350, easing: Easing.out(Easing.cubic) });
        subtitleTranslateY.value = withTiming(0, { duration: 350, easing: Easing.out(Easing.cubic) });
      }, subtitleAnimationDelay);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      titleOpacity.value = 0;
      titleTranslateY.value = 20;
      subtitleOpacity.value = 0;
      subtitleTranslateY.value = 20;
    }
  }, [visible, titleAnimationDelay, subtitleAnimationDelay]);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  return (
    <View
      style={{
       
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        overflow: 'hidden',
      }}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1 justify-end px-5"
        style={{ padding: insets.top + 10, paddingBottom: insets.bottom + gradientPaddingBottom }}
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
            {title}
          </Text>
        </Animated.View>

        <Animated.View style={subtitleStyle}>
          <Text className="mt-1.5 text-base leading-5 text-white/80">
            {subtitle}
          </Text>
        </Animated.View>

        {logo && (
          <View className="pt-20 items-center">
            <Image
              source={logo}
              style={{ width: 80, height: 80 }}
              resizeMode="contain"
            />
          </View>
        )}
      </LinearGradient>
    </View>
  );
}
