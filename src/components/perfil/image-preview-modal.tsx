import { useEffect } from 'react';
import { Modal, View, Pressable, Dimensions, StatusBar } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { FontAwesome6 } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CIRCLE_SIZE = SCREEN_WIDTH * 0.7;
const MIN_SCALE = 1;
const MAX_SCALE = 5;

interface ImagePreviewModalProps {
  visible: boolean;
  imageUri: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ImagePreviewModal({
  visible,
  imageUri,
  onConfirm,
  onCancel,
}: ImagePreviewModalProps) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = 1;
      savedScale.value = 1;
      translateX.value = 0;
      translateY.value = 0;
      savedTranslateX.value = 0;
      savedTranslateY.value = 0;
    }
  }, [visible]);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      const newScale = Math.min(
        Math.max(savedScale.value * e.scale, MIN_SCALE),
        MAX_SCALE,
      );
      scale.value = newScale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .minPointers(1)
    .onUpdate((e) => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <StatusBar barStyle="light-content" />
      <View className="flex-1 bg-black/80 justify-center items-center">
        <View
          style={{
            width: CIRCLE_SIZE,
            height: CIRCLE_SIZE,
            borderRadius: CIRCLE_SIZE / 2,
            overflow: 'hidden',
            borderWidth: 4,
            borderColor: '#10B981',
          }}
        >
          <GestureDetector gesture={composedGesture}>
            <Animated.View
              style={[{ flex: 1 }, imageAnimatedStyle]}
            >
              <Image
                source={{ uri: imageUri }}
                style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
                contentFit="cover"
              />
            </Animated.View>
          </GestureDetector>
        </View>

        <View className="flex-row justify-center gap-8 mt-10">
          <Pressable
            onPress={onCancel}
            className="w-14 h-14 rounded-full bg-white/20 justify-center items-center active:bg-white/30"
          >
            <FontAwesome6 name="xmark" size={22} color="#fff" />
          </Pressable>
          <Pressable
            onPress={onConfirm}
            className="w-14 h-14 rounded-full bg-[#10B981] justify-center items-center active:bg-[#059669]"
          >
            <FontAwesome6 name="check" size={22} color="#fff" />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
