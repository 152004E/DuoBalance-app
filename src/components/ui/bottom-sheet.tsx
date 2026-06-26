import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, Dimensions, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  header?: React.ReactNode;
  heightRatio?: number;
  headerFinalTranslateY?: number;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const MIN_HEIGHT_RATIO = 0.55;
const MAX_HEIGHT_RATIO = 0.85;

const HEADER_HEIGHT = SCREEN_HEIGHT * 0.35;

const DISMISS_THRESHOLD = 100;
const DISMISS_VELOCITY = 500;

export function BottomSheet({ visible, onClose, children, header, heightRatio = 0.65, headerFinalTranslateY = 0.17 }: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const [internalVisible, setInternalVisible] = useState(false);
  const prevVisible = useRef(false);
  const closingRef = useRef(false);

  const SHEET_HEIGHT = Math.min(
    Math.max(SCREEN_HEIGHT * heightRatio, SCREEN_HEIGHT * MIN_HEIGHT_RATIO),
    SCREEN_HEIGHT * MAX_HEIGHT_RATIO,
  );

  const HEADER_FINAL_TRANSLATE_Y = SCREEN_HEIGHT * headerFinalTranslateY;

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
    overlayOpacity.value = withTiming(0.6, { duration: 300 });
    scale.value = withTiming(1, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
  };

  const close = (callback: () => void) => {
    closingRef.current = true;
    translateY.value = withTiming(SCREEN_HEIGHT, { duration: 250 }, () => {
      runOnJS(callback)();
    });
    overlayOpacity.value = withTiming(0, { duration: 250 });
    scale.value = withTiming(0.97, { duration: 250 });
    headerTranslateY.value = SCREEN_HEIGHT;
    headerOpacity.value = 0;
  };

  useEffect(() => {
    if (visible) {
      closingRef.current = false;
      setInternalVisible(true);
      const sheetTimer = setTimeout(open, 50);
      const headerTimer = setTimeout(() => {
        headerTranslateY.value = withTiming(HEADER_FINAL_TRANSLATE_Y, {
          duration: 400,
          easing: Easing.out(Easing.cubic),
        });
        headerOpacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) });
      }, 500);
      return () => { clearTimeout(sheetTimer); clearTimeout(headerTimer); };
    } else if (prevVisible.current && !closingRef.current) {
      close(() => {
        setInternalVisible(false);
        onClose();
      });
    }
    prevVisible.current = visible;
  }, [visible]);

  const handleClose = () => close(() => {
    setInternalVisible(false);
    onClose();
  });

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
      if (event.translationY > DISMISS_THRESHOLD || event.velocityY > DISMISS_VELOCITY) {
        close(() => {
          setInternalVisible(false);
          onClose();
        });
      } else {
        translateY.value = withTiming(0, {
          duration: 250,
          easing: Easing.out(Easing.cubic),
        });
        overlayOpacity.value = withTiming(0.6, { duration: 250 });
      }
    });

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: headerTranslateY.value }],
    opacity: headerOpacity.value,
  }));

  return (
    <Modal
      visible={internalVisible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={StyleSheet.absoluteFill}>
        <Animated.View
          style={[overlayAnimatedStyle, StyleSheet.absoluteFill, { backgroundColor: '#000000', zIndex: 10 }]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={handleClose}
          />
        </Animated.View>

        {header && (
          <Animated.View
            style={[
              headerAnimatedStyle,
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: HEADER_HEIGHT,
                zIndex: 50,
              },
            ]}
            pointerEvents="box-none"
          >
            {header}
          </Animated.View>
        )}

        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              sheetAnimatedStyle,
              {
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: SHEET_HEIGHT,
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
                paddingBottom: insets.bottom,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -8 },
                shadowOpacity: 0.12,
                shadowRadius: 24,
                elevation: 24,
                zIndex: 100,
              },
            ]}
          >
            <View className="items-center py-3">
              <View className="h-1 w-10 rounded-full bg-[#D1D5DB]" />
            </View>

            <View className="flex-1">{children}</View>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}
