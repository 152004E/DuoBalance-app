import { Modal, Pressable, Dimensions, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';

import { useBottomSheet } from '@/hooks/use-bottom-sheet';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  header?: React.ReactNode;
  heightRatio?: number;
  headerFinalTranslateY?: number;
  onOpenComplete?: () => void;
  onCloseComplete?: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const MIN_HEIGHT_RATIO = 0.3;
const MAX_HEIGHT_RATIO = 0.85;

const HEADER_HEIGHT = SCREEN_HEIGHT * 0.35;

export function BottomSheet({
  visible,
  onClose,
  children,
  header,
  heightRatio = 0.65,
  headerFinalTranslateY = 0.17,
  onOpenComplete,
  onCloseComplete,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets();

  const SHEET_HEIGHT = Math.min(
    Math.max(SCREEN_HEIGHT * heightRatio, SCREEN_HEIGHT * MIN_HEIGHT_RATIO),
    SCREEN_HEIGHT * MAX_HEIGHT_RATIO,
  );

  const HEADER_FINAL_TRANSLATE_Y =
    SCREEN_HEIGHT * headerFinalTranslateY;

  const {
    internalVisible,
    handleClose,
    panGesture,
    sheetAnimatedStyle,
    overlayAnimatedStyle,
    headerAnimatedStyle,
  } = useBottomSheet({
    visible,
    onClose,
    headerFinalTranslateY: HEADER_FINAL_TRANSLATE_Y,
    onOpenComplete,
    onCloseComplete,
  });

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
          style={[
            overlayAnimatedStyle,
            StyleSheet.absoluteFill,
            {
              backgroundColor: '#000000',
              zIndex: 10,
            },
          ]}
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

            <View className="flex-1">
              {children}
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}