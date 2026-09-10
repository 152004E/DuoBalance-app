import { useRef, useEffect } from 'react';
import { Animated, Easing, Platform } from 'react-native';

export function useDashboardHeroAnimation() {
  const greetingOpacity = useRef(new Animated.Value(0)).current;
  const greetingTranslateY = useRef(new Animated.Value(15)).current;
  const balanceOpacity = useRef(new Animated.Value(0)).current;
  const numberScale = useRef(new Animated.Value(0.85)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const badgeTranslateY = useRef(new Animated.Value(10)).current;
  const selectorOpacity = useRef(new Animated.Value(0)).current;
  const selectorTranslateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    const isNative = Platform.OS !== 'web';
    Animated.stagger(180, [
      Animated.parallel([
        Animated.timing(greetingOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: isNative,
        }),
        Animated.timing(greetingTranslateY, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: isNative,
        }),
      ]),
      Animated.parallel([
        Animated.timing(balanceOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: isNative,
        }),
        Animated.spring(numberScale, {
          toValue: 1,
          friction: 8,
          tension: 50,
          useNativeDriver: isNative,
        }),
      ]),
      Animated.parallel([
        Animated.timing(badgeOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: isNative,
        }),
        Animated.timing(badgeTranslateY, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: isNative,
        }),
      ]),
      Animated.parallel([
        Animated.timing(selectorOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: isNative,
        }),
        Animated.timing(selectorTranslateY, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: isNative,
        }),
      ]),
    ]).start();
  }, []);

  return {
    greetingOpacity,
    greetingTranslateY,
    balanceOpacity,
    numberScale,
    badgeOpacity,
    badgeTranslateY,
    selectorOpacity,
    selectorTranslateY,
  };
}
