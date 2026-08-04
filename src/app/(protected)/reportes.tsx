import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeroSection } from '@/components/layout/HeroSection';
import { useCallback, useState, useRef } from 'react';
import { useFocusEffect, useScrollToTop } from 'expo-router';
import { BarChart } from '@/components/dashboard/BarChart';
import { DonutChart } from '@/components/dashboard/DonutChart';
import { useAuth } from '@/hooks/use-auth';
import { useGroups } from '@/hooks/use-groups';
import { useReportsData, type ReportPeriod } from '@/hooks/use-reports-data';
import { GroupSelector } from '@/components/ui/group-selector';
import { useWorkspace } from '@/hooks/use-workspace';
import { Loading } from '@/components/ui/loading';
import { FilterSheet } from '@/components/movements/filter-sheet';
import { FontAwesome6 } from '@expo/vector-icons';

const DEFAULT_PERIOD: ReportPeriod = 'Este mes';

const PERIOD_DESCRIPTIONS: Record<ReportPeriod, string> = {
  'Este mes': 'Comparado con el mes anterior',
  'Últimos 3 meses': 'Comparado con el trimestre anterior',
  'Este año': 'Comparado con el año anterior',
  Todo: 'Todos los registros',
};

const COMPARISON_SUFFIX: Record<Exclude<ReportPeriod, 'Todo'>, string> = {
  'Este mes': 'vs mes anterior',
  'Últimos 3 meses': 'vs trimestre anterior',
  'Este año': 'vs año anterior',
};

export default function ReportesScreen() {
  const { user } = useAuth();
  const { groups, personalGroups, coupleGroups, sharedGroups } = useGroups();
  const { workspace, setWorkspace } = useWorkspace();
  const [selectedPeriod, setSelectedPeriod] =
    useState<ReportPeriod>(DEFAULT_PERIOD);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const {
    barData,
    donutData,
    count,
    average,
    countComparison,
    averageComparison,
    isLoading,
    hasData,
    refetch,
  } = useReportsData(workspace, groups, selectedPeriod);
  const [focusCount, setFocusCount] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);

  useFocusEffect(
    useCallback(() => {
      setFocusCount((c) => c + 1);
      refetch();
    }, [refetch]),
  );

  const fmt = (value: number) =>
    `$${Math.round(value).toLocaleString('es-CL')}`;
  const activeFilterCount = selectedPeriod !== DEFAULT_PERIOD ? 1 : 0;

  // Las comparaciones solo aplican cuando hay un período anterior equivalente
  const showComparison = selectedPeriod !== 'Todo';
  const comparisonSuffix = showComparison
    ? COMPARISON_SUFFIX[selectedPeriod]
    : '';

  const formatComparison = (value: number | null) =>
    value == null
      ? 'Sin datos del periodo anterior'
      : value > 0
        ? `+${value}% ${comparisonSuffix}`
        : `${value}% ${comparisonSuffix}`;

  const comparisonColor = (value: number | null) =>
    value == null ? '#64748B' : value >= 0 ? '#22C55E' : '#EF4444';

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
          rightAction={
            <GroupSelector
              value={workspace}
              onChange={setWorkspace}
              personalGroups={personalGroups}
              coupleGroups={coupleGroups}
              sharedGroups={sharedGroups}
              variant="dark"
            />
          }
        />

        {/* Filtro de período (estilo Movimientos) */}
        <View className="flex-row items-center justify-between px-5 pt-5">
          <View className="flex-1 pr-3">
            <Text className="text-sm font-semibold text-[#0F172A]">
              Período de análisis
            </Text>
            <Text className="mt-0.5 text-xs text-[#94A3B8]">
              {PERIOD_DESCRIPTIONS[selectedPeriod]}
            </Text>
          </View>

          <Pressable
            onPress={() => setFiltersVisible(true)}
            className="flex-row items-center gap-2 rounded-full bg-[#10B981] px-4 py-2.5 active:opacity-80"
          >
            <FontAwesome6 name="calendar-days" size={14} color="#FFFFFF" />
            <Text className="text-sm font-semibold text-white">
              {selectedPeriod}
            </Text>
            <FontAwesome6 name="chevron-down" size={12} color="#FFFFFF" />
            {activeFilterCount > 0 && (
              <View className="h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5">
                <Text className="text-xs font-bold text-[#10B981]">
                  {activeFilterCount}
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        {isLoading ? (
          <View className="mt-8">
            <Loading message="Calculando estadísticas..." />
          </View>
        ) : !hasData ? (
          <View className="px-5 pt-8">
            <View className="items-center rounded-xl border border-dashed border-[#E2E8F0] bg-white px-6 py-10">
              <Text className="text-center text-base font-semibold text-[#0F172A]">
                Sin datos para este periodo
              </Text>
              <Text className="mt-1 text-center text-sm text-[#64748B]">
                No hay gastos registrados en el período «{selectedPeriod}» para{' '}
                {workspace.groupId
                  ? 'este grupo'
                  : workspace.category === 'all'
                    ? 'tus grupos'
                    : 'esta categoría'}
                .
              </Text>
            </View>
          </View>
        ) : (
          <View className="gap-6 px-5 pt-8">
            <View className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <Text className="mb-4 text-base font-bold text-[#0F172A]">
                Gastos por Categoría
              </Text>
              <BarChart data={barData} />
            </View>

            <View className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <Text className="mb-4 text-center text-base font-bold text-[#0F172A]">
                Aportes por Miembro
              </Text>
              <DonutChart data={donutData} />
            </View>

            <View className="flex-row gap-4">
              <View className="flex-1 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
                <Text className="text-xs text-[#64748B]">Gasto Promedio</Text>
                <Text className="mt-1 text-lg font-bold text-[#0F172A]">
                  {fmt(average)}
                </Text>
                {showComparison && (
                  <Text
                    className="mt-0.5 text-[10px]"
                    style={{ color: comparisonColor(averageComparison) }}
                  >
                    {formatComparison(averageComparison)}
                  </Text>
                )}
              </View>
              <View className="flex-1 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
                <Text className="text-xs text-[#64748B]">Transacciones</Text>
                <Text className="mt-1 text-lg font-bold text-[#0F172A]">
                  {count}
                </Text>
                {showComparison && (
                  <Text
                    className="mt-0.5 text-[10px]"
                    style={{ color: comparisonColor(countComparison) }}
                  >
                    {formatComparison(countComparison)}
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <FilterSheet
        visible={filtersVisible}
        onClose={() => setFiltersVisible(false)}
        selectedPeriod={selectedPeriod}
        onSelectPeriod={(period) => setSelectedPeriod(period as ReportPeriod)}
        onClear={() => setSelectedPeriod(DEFAULT_PERIOD)}
        heightRatio={0.4}
        headerFinalTranslateY={0.42}
        showCategory={false}
      />
    </SafeAreaView>
  );
}
