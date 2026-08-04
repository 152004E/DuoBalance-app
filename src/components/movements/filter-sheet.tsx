import { View, Text, Pressable, ScrollView } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { BottomSheetHeader } from '@/components/ui/bottom-sheet-header';

const PERIOD_FILTERS = [
  'Este mes',
  'Últimos 3 meses',
  'Este año',
  'Todo',
] as const;

const CATEGORY_FILTERS = [
  { label: '📋 Todas', value: 'all' },
  { label: '🍔 Comida', value: 'FOOD' },
  { label: '🚗 Transporte', value: 'TRANSPORT' },
  { label: '🏠 Vivienda', value: 'RENT' },
  { label: '💡 Servicios', value: 'SERVICES' },
  { label: '🎉 Entretención', value: 'ENTERTAINMENT' },
  { label: '📦 Otros', value: 'OTHER' },
] as const;

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedPeriod: string;
  selectedCategory?: string;
  onSelectPeriod: (period: string) => void;
  onSelectCategory?: (category: string) => void;
  onClear: () => void;
  heightRatio?: number;
  headerFinalTranslateY?: number;
  showCategory?: boolean;
}

export function FilterSheet({
  visible,
  onClose,
  selectedPeriod,
  selectedCategory,
  onSelectPeriod,
  onSelectCategory,
  onClear,
  heightRatio = 0.55,
  headerFinalTranslateY = 0.28,
  showCategory = true,
}: FilterSheetProps) {
  const header = (
    <BottomSheetHeader
      visible={visible}
      title="Filtros"
      subtitle={
        showCategory
          ? 'Filtra los movimientos por período y categoría.'
          : 'Selecciona el período del reporte.'
      }
      onClose={onClose}
      gradientPaddingBottom={500}
      logo={require('@/assets/images/logo-white-green-bg-without.png')}
    />
  );

  const renderChip = (
    label: string,
    isActive: boolean,
    onPress: () => void,
  ) => (
    <Pressable
      key={label}
      onPress={onPress}
      className={`rounded-full px-[15px] py-2.5 ${
        isActive ? 'bg-[#10B981]' : 'border border-[#E2E8F0] bg-white'
      }`}
    >
      <Text
        className={`text-sm font-medium ${
          isActive ? 'text-white' : 'text-[#64748B]'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      header={header}
      heightRatio={heightRatio}
      headerFinalTranslateY={headerFinalTranslateY}
    >
      <View className="flex-1 px-5 pt-2">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-2"
        >
          {/* Período */}
          <Text className="mb-1 text-sm font-semibold text-[#64748B]">
            Período
          </Text>
          <View className="flex-row flex-wrap gap-1">
            {PERIOD_FILTERS.map((filter) =>
              renderChip(filter, selectedPeriod === filter, () =>
                onSelectPeriod(filter),
              ),
            )}
          </View>

          {/* Categoría */}
          {showCategory && (
            <>
              <Text className="mb-1 mt-4 text-sm font-semibold text-[#64748B]">
                Categoría
              </Text>
              <View className="flex-row flex-wrap gap-1">
                {CATEGORY_FILTERS.map((filter) =>
                  renderChip(
                    filter.label,
                    selectedCategory === filter.value,
                    () => onSelectCategory?.(filter.value),
                  ),
                )}
              </View>
            </>
          )}
        </ScrollView>

        {/* Limpiar filtros */}
        <View className="border-t border-[#E2E8F0] py-4">
          <Pressable
            onPress={onClear}
            className="flex-row items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white py-3 active:opacity-80"
          >
            <FontAwesome6 name="rotate-left" size={14} color="#0F766E" />
            <Text className="font-semibold text-[#0F766E]">
              Limpiar filtros
            </Text>
          </Pressable>
        </View>
      </View>
    </BottomSheet>
  );
}
