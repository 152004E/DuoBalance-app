import { useEffect, useRef } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface StaggeredEntranceOptions {
  delayBetweenItems?: number;
  duration?: number;
  fromOffset?: number;
  trigger?: number;
}

export function useStaggeredEntrance(
  index: number,
  options?: StaggeredEntranceOptions,
) {
  const delay = index * (options?.delayBetweenItems ?? 80);
  const duration = options?.duration ?? 400;
  const fromOffset = options?.fromOffset ?? 35;
  const trigger = options?.trigger ?? 0;

  const prevTrigger = useRef(trigger);

  const opacity = useSharedValue(0);
  const translateX = useSharedValue(fromOffset);

  useEffect(() => {
    if (prevTrigger.current === trigger && trigger !== 0) return;
    prevTrigger.current = trigger;

    opacity.value = 0;
    translateX.value = fromOffset;

    const timer = setTimeout(() => {
      opacity.value = withDelay(
        delay,
        withTiming(1, { duration, easing: Easing.out(Easing.cubic) }),
      );

      translateX.value = withDelay(
        delay,
        withTiming(0, { duration, easing: Easing.out(Easing.cubic) }),
      );
    }, 16);

    return () => clearTimeout(timer);
  }, [trigger]);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));
}
