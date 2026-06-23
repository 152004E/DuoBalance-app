import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
} from 'react-native';
import AnimatedReanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { AlertModal } from '@/components/ui/alert-modal';
import { PercentageSlider } from '@/components/ui/percentage-slider';
import { DistributionBar } from '@/components/ui/distribution-bar';

interface CreateCoupleSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function CreateCoupleSheet({ visible, onClose }: CreateCoupleSheetProps) {
  const insets = useSafeAreaInsets();

  const [coupleName, setCoupleName] = useState('');
  const [yourPercentage, setYourPercentage] = useState(50);
  const [showWarning, setShowWarning] = useState(false);

  const partnerPercentage = 100 - yourPercentage;
  const isDisabled = coupleName.trim().length === 0;

  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(20);

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
      const t3 = setTimeout(() => setShowWarning(true), 1600);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    } else {
      titleOpacity.value = 0;
      titleTranslateY.value = 20;
      subtitleOpacity.value = 0;
      subtitleTranslateY.value = 20;
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
        className="flex-1 justify-end px-5 pt-17 "
        style={{ padding: insets.top + 10, paddingBottom: insets.bottom + 50 }}
      >
        <Pressable
          onPress={onClose}
          className="h-8 w-8  items-center justify-center rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)', }}
        >
          <FontAwesome6 name="arrow-left" size={18} color="#FFFFFF" />
        </Pressable>

        <AnimatedReanimated.View style={titleStyle}>
          <Text className="mt-5 text-[28px] font-extrabold tracking-tight text-white">
            Crear nueva pareja
          </Text>
        </AnimatedReanimated.View>

        <AnimatedReanimated.View style={subtitleStyle}>
          <Text className="mt-1.5 text-base leading-5 text-white/80">
            Configura cómo compartirán sus gastos de manera justa.
          </Text>
        </AnimatedReanimated.View>
      </LinearGradient>
    </View>
  );

  return (
    <BottomSheet visible={visible} onClose={onClose} header={header} heightRatio={0}>
      <View className="flex-1" style={{
        
        height: 240,
      }}>
        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          contentContainerClassName=""
        >
          <Text className="mb-2 mt-2 text-sm font-semibold text-[#0F172A]">
            Nombre de la pareja
          </Text>
          <TextInput
            className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-3.5 text-base text-[#0F172A] shadow-sm"
            placeholder="Ej: Hogar, Viaje a Italia"
            placeholderTextColor="#94A3B8"
            value={coupleName}
            onChangeText={setCoupleName}
          />

          <Text className="mb-4 mt-7 text-sm font-semibold text-[#0F172A]">
            Distribución de gastos
          </Text>

          <View className="flex-row gap-3">
            <View className="flex-1 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <View className="mb-3 flex-row items-center gap-2">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-[#10B981]/10">
                  <FontAwesome6 name="user" size={14} color="#10B981" />
                </View>
                <Text className="text-sm font-medium text-[#0F172A]">Tú</Text>
              </View>
              <Text className="text-2xl font-extrabold text-[#10B981]">
                {yourPercentage}%
              </Text>
            </View>

            <View className="flex-1 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <View className="mb-3 flex-row items-center gap-2">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-[#0F766E]/10">
                  <FontAwesome6 name="user-group" size={14} color="#0F766E" />
                </View>
                <Text className="text-sm font-medium text-[#0F172A]">
                  Tu pareja
                </Text>
              </View>
              <Text className="text-2xl font-extrabold text-[#0F766E]">
                {partnerPercentage}%
              </Text>
            </View>
          </View>

          <View className="mt-6">
            <PercentageSlider value={yourPercentage} onChange={setYourPercentage} />
          </View>

          <View className="mb-2 mt-5">
            <DistributionBar
              yourPercentage={yourPercentage}
              partnerPercentage={partnerPercentage}
            />
          </View>

        </ScrollView>

        <View className="border-t border-[#E2E8F0] px-5 pb-2 pt-4">
          <Button
            text="Crear pareja"
            iconRight="arrow-right"
            onPress={onClose}
            disabled={isDisabled}
            className="rounded-full py-4"
          />
        </View>
      </View>



{/*
<AlertModal
  visible={showWarning}
  type="warning"
  title="Distribución de gastos"
  message="Puedes modificar estos porcentajes más adelante."
  buttonText="Entendido"
  onClose={() => setShowWarning(false)}
/>
*/}
    </BottomSheet>
  );
}
