import { useRef } from 'react';
import { View, Text, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

interface PercentageSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const STEP = 5;
const THUMB_SIZE = 24;
const TRACK_H_MARGIN = 16;

function snapToStep(value: number): number {
  return Math.round(value / STEP) * STEP;
}

export function PercentageSlider({ value, onChange }: PercentageSliderProps) {
  const containerWidth = useRef(0);
  const thumbPosition = useSharedValue(0);

  const updateThumb = (pct: number) => {
    const usable = containerWidth.current - TRACK_H_MARGIN * 2 - THUMB_SIZE;
    thumbPosition.value = withTiming(
      TRACK_H_MARGIN + THUMB_SIZE / 2 + (pct / 100) * usable,
      {
        duration: 150,
        easing: Easing.out(Easing.cubic),
      },
    );
  };

  const pctFromX = (x: number): number => {
    const usable = containerWidth.current - TRACK_H_MARGIN * 2 - THUMB_SIZE;
    const raw = ((x - TRACK_H_MARGIN - THUMB_SIZE / 2) / usable) * 100;
    return Math.max(0, Math.min(100, snapToStep(raw)));
  };

  const panGesture = Gesture.Pan()
    .onBegin((event) => {
      const pct = pctFromX(event.x);
      updateThumb(pct);
      runOnJS(onChange)(pct);
    })
    .onUpdate((event) => {
      const pct = pctFromX(event.x);
      const usable = containerWidth.current - TRACK_H_MARGIN * 2 - THUMB_SIZE;
      const pos = TRACK_H_MARGIN + THUMB_SIZE / 2 + (pct / 100) * usable;
      thumbPosition.value = pos;
    })
    .onEnd((event) => {
      const pct = pctFromX(event.x);
      updateThumb(pct);
      runOnJS(onChange)(pct);
    });

  const filledStyle = useAnimatedStyle(() => ({
    width: thumbPosition.value - TRACK_H_MARGIN - THUMB_SIZE / 2,
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbPosition.value - THUMB_SIZE / 2 }],
  }));

  const handleLayout = (e: LayoutChangeEvent) => {
    containerWidth.current = e.nativeEvent.layout.width;
    const pct = value;
    const usable = containerWidth.current - TRACK_H_MARGIN * 2 - THUMB_SIZE;
    thumbPosition.value =
      TRACK_H_MARGIN + THUMB_SIZE / 2 + (pct / 100) * usable;
  };

  return (
    <View>
      <GestureDetector gesture={panGesture}>
        <View className="relative h-10 justify-center" onLayout={handleLayout}>
          <View
            className="absolute h-2 rounded-full bg-[#E2E8F0]"
            style={{
              left: TRACK_H_MARGIN + THUMB_SIZE / 2,
              right: TRACK_H_MARGIN + THUMB_SIZE / 2,
            }}
          />
          <Animated.View
            className="absolute h-2 rounded-full bg-[#10B981]"
            style={{
              left: TRACK_H_MARGIN + THUMB_SIZE / 2,
              ...filledStyle,
            }}
          />
          <Animated.View
            className="absolute top-1/2 h-6 w-6 rounded-full bg-white shadow-md"
            style={[
              thumbStyle,
              {
                marginTop: -THUMB_SIZE / 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                elevation: 4,
                borderWidth: 2,
                borderColor: '#10B981',
              },
            ]}
          />
        </View>
      </GestureDetector>
      <Text className="mt-3 text-center text-lg font-bold text-[#0F172A]">
        {value}%
      </Text>
    </View>
  );
}
