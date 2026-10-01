import { useEffect, useRef } from 'react';
import { Modal, View, Text, Pressable, Animated, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { FontAwesome6 } from '@expo/vector-icons';

interface MonthlyResetModalProps {
  visible: boolean;
  onClose: () => void;
  onGoToSettings: () => void;
}

export function MonthlyResetModal({
  visible,
  onClose,
  onGoToSettings,
}: MonthlyResetModalProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (visible) {
      const isNative = Platform.OS !== 'web';
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: isNative,
        }),
        Animated.spring(scale, {
          toValue: 1,
          damping: 12,
          stiffness: 150,
          mass: 0.8,
          useNativeDriver: isNative,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: 14,
          stiffness: 140,
          useNativeDriver: isNative,
        }),
      ]).start();
    } else {
      opacity.setValue(0);
      scale.setValue(0.8);
      translateY.setValue(30);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Animated.View
        style={{
          flex: 1,
          opacity,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
        }}
      >
        <BlurView
          intensity={30}
          tint="dark"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
          }}
        />

        <Animated.View
          style={{
            width: '100%',
            maxWidth: 380,
            backgroundColor: '#FFFFFF',
            borderRadius: 32,
            paddingHorizontal: 24,
            paddingBottom: 24,
            paddingTop: 52,
            transform: [{ scale }, { translateY }],
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.15,
            shadowRadius: 24,
            elevation: 12,
          }}
        >
          {/* Icono flotante superior */}
          <View
            style={{
              position: 'absolute',
              top: -38,
              left: 0,
              right: 0,
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 76,
                height: 76,
                borderRadius: 38,
                backgroundColor: '#006c49',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#006c49',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.35,
                shadowRadius: 16,
                elevation: 12,
              }}
            >
              <FontAwesome6
                name="calendar-check"
                size={32}
                color="#FFFFFF"
                solid
              />
            </View>
          </View>

          {/* Título */}
          <Text className="mb-2 text-center text-2xl font-bold text-[#0F172A]">
            ¡Tus gastos están seguros!
          </Text>

          {/* Badge o subtítulo suave */}
          <View className="mb-4 self-center rounded-full bg-[#10B981]/10 px-3 py-1">
            <Text className="text-xs font-semibold text-[#059669]">
              Enfoque mensual del Inicio
            </Text>
          </View>

          {/* Explicación principal */}
          <Text className="text-center text-[14px] leading-6 text-[#64748B]">
            Al iniciar cada mes, el Inicio muestra tus balances en{' '}
            <Text className="font-bold text-[#0F172A]">$0</Text> para darte un
            control fresco del mes en curso.
          </Text>

          <View className="my-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-3.5">
            <View className="flex-row items-start gap-2.5">
              <FontAwesome6
                name="shield-halved"
                size={16}
                color="#10B981"
                style={{ marginTop: 2 }}
              />
              <Text className="flex-1 text-xs leading-5 text-[#475569]">
                Tus movimientos anteriores siguen intactos en cada uno de tus{' '}
                <Text className="font-semibold text-[#0F172A]">Grupos</Text> y
                en la pestaña{' '}
                <Text className="font-semibold text-[#0F172A]">Gastos</Text>. Si
                prefieres ver siempre el total acumulado en el Inicio, puedes
                cambiarlo en Configuración.
              </Text>
            </View>
          </View>

          {/* Botones de acción */}
          <View className="gap-2.5">
            <Pressable
              onPress={onClose}
              className="w-full items-center justify-center rounded-2xl bg-[#006c49] py-3.5 shadow-sm active:opacity-90"
            >
              <Text className="text-base font-bold text-white">
                Entendido, ver este mes
              </Text>
            </Pressable>

            <Pressable
              onPress={onGoToSettings}
              className="w-full flex-row items-center justify-center gap-2 rounded-2xl border border-[#E2E8F0] bg-white py-3.5 active:bg-[#F8FAFC]"
            >
              <FontAwesome6 name="gear" size={14} color="#64748B" />
              <Text className="text-sm font-semibold text-[#64748B]">
                Ir a Ajustes para ver todo
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
