import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { BottomSheetHeader } from '@/components/ui/bottom-sheet-header';
import { Button } from '@/components/ui/button';
import { AlertModal } from '@/components/ui/alert-modal';
import { PercentageSlider } from '@/components/ui/percentage-slider';
import { DistributionBar } from '@/components/ui/distribution-bar';

interface CreateCoupleSheetProps {
  visible: boolean;
  onClose: () => void;
  heightRatio?: number;
  headerFinalTranslateY?: number;
}

export function CreateCoupleSheet({ visible, onClose, heightRatio = 0.95, headerFinalTranslateY }: CreateCoupleSheetProps) {
  const [coupleName, setCoupleName] = useState('');
  const [yourPercentage, setYourPercentage] = useState(50);
  const [showWarning, setShowWarning] = useState(false);

  const partnerPercentage = 100 - yourPercentage;
  const isDisabled = coupleName.trim().length === 0;

  useEffect(() => {
    if (visible) {
      const t3 = setTimeout(() => setShowWarning(true), 1600);
      return () => clearTimeout(t3);
    }
  }, [visible]);

  const header = (
    <BottomSheetHeader
      visible={visible}
      title="Opciones del grupo"
      subtitle="Administra tu grupo de gastos compartidos"
      onClose={onClose}
      gradientPaddingBottom={500}
      logo={require('@/assets/images/logo-white-green-bg-without.png')}
    />
  );

  return (
    <BottomSheet visible={visible} onClose={onClose} header={header} heightRatio={heightRatio} headerFinalTranslateY={headerFinalTranslateY}>
      <View className="flex-1" style={{

        height: 250,
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


            <View className="mt-1 flex-row items-center justify-center gap-4">
              <Pressable
                onPress={() => setYourPercentage(Math.max(0, yourPercentage - 5))}
                className="h-12 w-12 items-center justify-center rounded-full bg-[#10B981]"
                style={{
                  shadowColor: '#10B981',
                  shadowOpacity: 0.25,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <Text className="text-xl font-bold text-white">−</Text>
              </Pressable>

              <Text className="text-3xl font-extrabold text-[#10B981]">
                {yourPercentage}%
              </Text>

              <Pressable
                onPress={() => setYourPercentage(Math.min(100, yourPercentage + 5))}
                className="h-12 w-12 items-center justify-center rounded-full bg-[#10B981]"
                style={{
                  shadowColor: '#10B981',
                  shadowOpacity: 0.25,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <Text className="text-xl font-bold text-white">+</Text>
              </Pressable>
            </View>
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
