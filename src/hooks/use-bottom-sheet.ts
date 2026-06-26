import { useEffect, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const DISMISS_THRESHOLD = 100;
const DISMISS_VELOCITY = 500;

interface UseBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  headerFinalTranslateY: number;
}

export function useBottomSheet({
  visible,
  onClose,
  headerFinalTranslateY,
}: UseBottomSheetProps) {
  const [internalVisible, setInternalVisible] = useState(false);

  const prevVisible = useRef(false);
  const closingRef = useRef(false);

  const translateY = useSharedValue(SCREEN_HEIGHT);
  const overlayOpacity = useSharedValue(0);
  const scale = useSharedValue(0.97);

  const headerTranslateY = useSharedValue(SCREEN_HEIGHT);
  const headerOpacity = useSharedValue(0);

  const open = () => {
    translateY.value = withTiming(0, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });

    overlayOpacity.value = withTiming(0.6, {
      duration: 300,
    });

    scale.value = withTiming(1, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
  };

  const close = (callback: () => void) => {
    closingRef.current = true;

    translateY.value = withTiming(
      SCREEN_HEIGHT,
      { duration: 250 },
      () => runOnJS(callback)(),
    );

    overlayOpacity.value = withTiming(0, {
      duration: 250,
    });

    scale.value = withTiming(0.97, {
      duration: 250,
    });

    headerTranslateY.value = SCREEN_HEIGHT;
    headerOpacity.value = 0;
  };

  useEffect(() => {
    if (visible) {
      closingRef.current = false;
      setInternalVisible(true);

      const sheetTimer = setTimeout(open, 50);

      const headerTimer = setTimeout(() => {
        headerTranslateY.value = withTiming(headerFinalTranslateY, {
          duration: 400,
          easing: Easing.out(Easing.cubic),
        });

        headerOpacity.value = withTiming(1, {
          duration: 400,
          easing: Easing.out(Easing.cubic),
        });
      }, 500);

      return () => {
        clearTimeout(sheetTimer);
        clearTimeout(headerTimer);
      };
    }

    if (prevVisible.current && !closingRef.current) {
      close(() => {
        setInternalVisible(false);
        onClose();
      });
    }

    prevVisible.current = visible;
  }, [visible]);

  const handleClose = () => {
    close(() => {
      setInternalVisible(false);
      onClose();
    });
  };

  const panGesture = Gesture.Pan()
    .activeOffsetY(10)
    .onUpdate((event) => {
      if (event.translationY > 0) {
        const progress = Math.min(event.translationY / SCREEN_HEIGHT, 1);

        translateY.value = event.translationY;
        overlayOpacity.value = 0.6 * (1 - progress);
      }
    })
    .onEnd((event) => {
      if (
        event.translationY > DISMISS_THRESHOLD ||
        event.velocityY > DISMISS_VELOCITY
      ) {
        close(() => {
          setInternalVisible(false);
          onClose();
        });
      } else {
        translateY.value = withTiming(0, {
          duration: 250,
          easing: Easing.out(Easing.cubic),
        });

        overlayOpacity.value = withTiming(0.6, {
          duration: 250,
        });
      }
    });

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: headerTranslateY.value }],
    opacity: headerOpacity.value,
  }));

  return {
    internalVisible,
    handleClose,
    panGesture,
    sheetAnimatedStyle,
    overlayAnimatedStyle,
    headerAnimatedStyle,
  };
}