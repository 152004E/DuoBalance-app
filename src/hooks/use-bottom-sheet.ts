import { useEffect, useRef, useState, useCallback } from 'react';
import { Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const DISMISS_THRESHOLD = 100;
const DISMISS_VELOCITY = 500;

enum TransitionState {
  Idle,
  Opening,
  Closing,
}

interface UseBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  headerFinalTranslateY: number;
  onOpenComplete?: () => void;
  onCloseComplete?: () => void;
}

export function useBottomSheet({
  visible,
  onClose,
  headerFinalTranslateY,
  onOpenComplete,
  onCloseComplete,
}: UseBottomSheetProps) {
  const [internalVisible, setInternalVisible] = useState(false);

  const prevVisible = useRef(false);
  const transitionStateRef = useRef(TransitionState.Idle);

  const translateY = useSharedValue(SCREEN_HEIGHT);
  const overlayOpacity = useSharedValue(0);
  const scale = useSharedValue(0.97);

  const headerTranslateY = useSharedValue(SCREEN_HEIGHT);
  const headerOpacity = useSharedValue(0);

  const open = useCallback(() => {
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
  }, []);

  const finishClose = useCallback(() => {
    if (transitionStateRef.current !== TransitionState.Closing) return;
    transitionStateRef.current = TransitionState.Idle;
    prevVisible.current = false;
    setInternalVisible(false);
    onClose();
    onCloseComplete?.();
  }, [onClose, onCloseComplete]);

  const startClose = useCallback(() => {
    if (transitionStateRef.current === TransitionState.Closing) return;
    transitionStateRef.current = TransitionState.Closing;

    translateY.value = withTiming(
      SCREEN_HEIGHT,
      { duration: 250 },
      (finished) => {
        if (finished) {
          runOnJS(finishClose)();
        }
      },
    );

    overlayOpacity.value = withTiming(0, {
      duration: 250,
    });

    scale.value = withTiming(0.97, {
      duration: 250,
    });

    headerTranslateY.value = withTiming(SCREEN_HEIGHT, {
      duration: 250,
    });

    headerOpacity.value = withTiming(0, {
      duration: 250,
    });
  }, [finishClose]);

  const fireOpenComplete = useCallback(() => {
    onOpenComplete?.();
  }, [onOpenComplete]);

  useEffect(() => {
    if (visible) {
      if (transitionStateRef.current === TransitionState.Idle) {
        transitionStateRef.current = TransitionState.Opening;
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

          runOnJS(fireOpenComplete)();
        }, 500);

        prevVisible.current = true;

        return () => {
          clearTimeout(sheetTimer);
          clearTimeout(headerTimer);
        };
      }
    } else {
      if (prevVisible.current) {
        startClose();
      }
      prevVisible.current = false;
    }
  }, [visible, open, headerFinalTranslateY, startClose, fireOpenComplete]);

  const handleClose = useCallback(() => {
    startClose();
  }, [startClose]);

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
        startClose();
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