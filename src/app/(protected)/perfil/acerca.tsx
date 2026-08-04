import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router, useScrollToTop } from 'expo-router';
import { ScreenHeader } from '@/components/ui/screen-header';
import { useRef } from 'react';

const FEATURES = [
  {
    icon: 'user-group',
    title: 'Espacios compartidos',
    description:
      'Crea espacios personales, de pareja o grupales y organiza tus finanzas en un solo lugar.',
  },
  {
    icon: 'receipt',
    title: 'Registro de gastos',
    description:
      'Lleva el control de cada gasto con categorías, quién lo pagó y cómo se reparte.',
  },
  {
    icon: 'scale-balanced',
    title: 'Repartos claros',
    description:
      'Gastos al 50/50, por porcentaje o personales, con división automática entre quienes participan.',
  },
  {
    icon: 'chart-pie',
    title: 'Reportes y estadísticas',
    description:
      'Visualiza tus gastos por categoría y por miembro, con comparación entre períodos.',
  },
  {
    icon: 'hand-holding-dollar',
    title: 'Control de deudas',
    description:
      'Sabe cuánto te deben o cuánto debes en cada espacio compartido.',
  },
  {
    icon: 'shield-halved',
    title: 'Cuenta segura',
    description:
      'Inicio de sesión protegido, cambio de contraseña y sesión con renovación automática.',
  },
];

const HISTORY = [
  {
    period: 'Fundación',
    icon: 'seedling',
    title: 'El inicio',
    description:
      'DuoBalance nació con una idea simple: hacer que compartir gastos entre dos personas fuera fácil, transparente y sin conflictos.',
  },
  {
    period: 'Crecimiento',
    icon: 'people-group',
    title: 'De pareja a grupos',
    description:
      'La plataforma creció para incluir espacios personales y grupos, manteniendo el reparto justo sin importar cuántos participen.',
  },
  {
    period: 'Hoy',
    icon: 'chart-line',
    title: 'Una app completa',
    description:
      'Cada pantalla se construyó con atención al detalle: animaciones, feedback visual y datos en tiempo real para que la experiencia sea fluida y clara.',
  },
];

const STACK = [
  'React Native',
  'Expo SDK 56',
  'TypeScript',
  'Expo Router',
  'NativeWind',
  'Tailwind CSS',
];

export default function AcercaScreen() {
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);

  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#E8E4F0', '#F4F2F7', '#F8FAFC']}
        locations={[0, 0.5, 1]}
        className="absolute inset-0"
      />
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScreenHeader
          title="Acerca de"
          subtitle="Sobre DuoBalance"
          onBack={() => router.back()}
          actionIcon="circle-info"
        />

        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerClassName="pb-10"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View className="px-5 pt-4">
            <LinearGradient
              colors={['#065238ff', '#04c88aff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="items-center overflow-hidden rounded-2xl px-6 py-8"
            >
              <View className="h-16 w-16 items-center justify-center rounded-full bg-white/15">
                <FontAwesome6 name="scale-balanced" size={26} color="#FFFFFF" />
              </View>
              <Text className="mt-3 text-2xl font-bold text-white">
                DuoBalance
              </Text>
              <Text className="mt-1 text-sm text-white/80">
                Finanzas compartidas, sin complicaciones
              </Text>
              <View className="mt-4 rounded-full bg-white/15 px-4 py-1.5">
                <Text className="text-xs font-semibold text-white">
                  Versión {appVersion}
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* Qué es */}
          <View className="px-5 pt-6">
            <View className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <Text className="text-base font-bold text-[#0F172A]">
                ¿Qué es DuoBalance?
              </Text>
              <Text className="mt-2 text-sm leading-6 text-[#64748B]">
                DuoBalance es una aplicación de gestión de gastos compartidos
                que ayuda a personas, parejas y grupos a registrar, repartir y
                entender sus finanzas en conjunto. Todo se ve claro: cuánto se
                gastó, quién pagó y cómo se divide.
              </Text>
            </View>
          </View>

          {/* Funcionalidades */}
          <View className="px-5 pt-6">
            <Text className="mb-3 text-lg font-bold text-[#0F172A]">
              Funcionalidades
            </Text>
            <View className="gap-3">
              {FEATURES.map((feature) => (
                <View
                  key={feature.title}
                  className="flex-row items-start gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm"
                >
                  <View className="h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#10B981]/10">
                    <FontAwesome6
                      name={feature.icon as any}
                      size={16}
                      color="#10B981"
                    />
                  </View>
                  <View className="min-w-0 flex-1">
                    <Text className="text-sm font-semibold text-[#0F172A]">
                      {feature.title}
                    </Text>
                    <Text className="mt-0.5 text-[13px] leading-5 text-[#64748B]">
                      {feature.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Historia */}
          <View className="px-5 pt-6">
            <Text className="mb-3 text-lg font-bold text-[#0F172A]">
              Nuestra historia
            </Text>
            <View className="gap-3">
              {HISTORY.map((item) => (
                <View
                  key={item.period}
                  className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm"
                >
                  <View className="flex-row items-center gap-3">
                    <View className="h-9 w-9 items-center justify-center rounded-full bg-[#065238]/10">
                      <FontAwesome6
                        name={item.icon as any}
                        size={14}
                        color="#065238"
                      />
                    </View>
                    <View>
                      <Text className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                        {item.period}
                      </Text>
                      <Text className="text-sm font-semibold text-[#0F172A]">
                        {item.title}
                      </Text>
                    </View>
                  </View>
                  <Text className="mt-2 text-[13px] leading-5 text-[#64748B]">
                    {item.description}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Stack */}
          <View className="px-5 pt-6">
            <Text className="mb-3 text-lg font-bold text-[#0F172A]">
              Tecnología
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {STACK.map((tech) => (
                <View
                  key={tech}
                  className="rounded-full border border-[#E2E8F0] bg-white px-4 py-2"
                >
                  <Text className="text-sm font-medium text-[#0F172A]">
                    {tech}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Footer */}
          <View className="items-center px-5 pt-8">
            <Text className="text-center text-xs text-[#94A3B8]">
              DuoBalance · Hecho con dedicación y atención al detalle
            </Text>
            <Text className="mt-1 text-center text-xs text-[#CBD5E1]">
              © 2026 DuoBalance
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
