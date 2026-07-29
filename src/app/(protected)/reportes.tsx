import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeroSection } from '@/components/layout/HeroSection';
import { useCallback, useState, useRef } from 'react';
import { useFocusEffect, useScrollToTop } from 'expo-router';
import { BarChart } from '@/components/dashboard/BarChart';
import { DonutChart } from '@/components/dashboard/DonutChart';
import { useAuth } from '@/hooks/use-auth';

const BAR_DATA = [
  { label: 'Comida', value: 180000, color: '#F97316' },
  { label: 'Hogar', value: 120000, color: '#3B82F6' },
  { label: 'Transporte', value: 80000, color: '#8B5CF6' },
  { label: 'Entretenimiento', value: 60000, color: '#06B6D4' },
  { label: 'Servicios', value: 40000, color: '#EC4899' },
];

const DONUT_DATA = [
  { label: 'Emerson', value: 320000, color: '#10B981' },
  { label: 'Andrea', value: 280000, color: '#8B5CF6' },
];

export default function ReportesScreen() {
  const { user } = useAuth();
  const [focusCount, setFocusCount] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);

  useFocusEffect(
    useCallback(() => {
      setFocusCount((c) => c + 1);
    }, []),
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerClassName="pb-24"
        showsVerticalScrollIndicator={false}
      >
        <HeroSection
          key={focusCount}
          variant="page"
          userName={user?.firstName ?? 'Usuario'}
          title="Reportes"
          subtitle="Visualiza tus estadísticas"
          height={220}
        />

        <View className="gap-6 px-5 pt-8">
          <View className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <Text className="mb-4 text-base font-bold text-[#0F172A]">
              Gastos por Categoría
            </Text>
            <BarChart data={BAR_DATA} />
          </View>

          <View className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <Text className="mb-4 text-center text-base font-bold text-[#0F172A]">
              Aportes por Pareja
            </Text>
            <DonutChart data={DONUT_DATA} />
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <Text className="text-xs text-[#64748B]">Gasto Promedio</Text>
              <Text className="mt-1 text-lg font-bold text-[#0F172A]">
                $96k
              </Text>
              <Text className="mt-0.5 text-[10px] text-[#22C55E]">
                +12% vs mes anterior
              </Text>
            </View>
            <View className="flex-1 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <Text className="text-xs text-[#64748B]">Transacciones</Text>
              <Text className="mt-1 text-lg font-bold text-[#0F172A]">47</Text>
              <Text className="mt-0.5 text-[10px] text-[#22C55E]">
                +8% vs mes anterior
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
