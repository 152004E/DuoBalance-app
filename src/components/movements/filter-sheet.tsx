import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { BottomSheetHeader } from '@/components/ui/bottom-sheet-header';
import { MAIN_CATEGORIES, EXTRA_CATEGORIES } from '@/constants/categories';

const PERIOD_FILTERS = [
  'Este mes',
  'Últimos 3 meses',
  'Este año',
  'Todo',
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
  // Expandible "Otros": se abre si el usuario lo toca o si una categoría extra está activa
  const isExtraActive = EXTRA_CATEGORIES.some(
    (c) => c.value === selectedCategory,
  );
  const [manuallyOpen, setManuallyOpen] = useState(false);
  const othersExpanded = manuallyOpen || isExtraActive;

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
    key: string,
  ) => (
    <Pressable
      key={key}
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

  const renderExpandChip = (label: string, isActive: boolean) => (
    <Pressable
      onPress={() => setManuallyOpen((v) => !v)}
      className={`flex-row items-center gap-1.5 rounded-full px-[15px] py-2.5 ${
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
      <FontAwesome6
        name={othersExpanded ? 'chevron-up' : 'chevron-down'}
        size={10}
        color={isActive ? '#FFFFFF' : '#64748B'}
      />
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
              renderChip(
                filter,
                selectedPeriod === filter,
                () => onSelectPeriod(filter),
                filter,
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
                {renderChip(
                  '📋 Todas',
                  selectedCategory === 'all',
                  () => {
                    setManuallyOpen(false);
                    onSelectCategory?.('all');
                  },
                  'all',
                )}
                {MAIN_CATEGORIES.map((cat) =>
                  renderChip(
                    `${cat.emoji} ${cat.label}`,
                    selectedCategory === cat.value,
                    () => {
                      setManuallyOpen(false);
                      onSelectCategory?.(cat.value);
                    },
                    cat.value,
                  ),
                )}
                {renderExpandChip(
                  '📦 Otros',
                  selectedCategory === 'OTHER' || isExtraActive,
                )}
              </View>

              {/* Subcategorías extra (menos conocidas) */}
              {othersExpanded && (
                <View className="mt-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                  <Text className="mb-2 text-xs font-medium text-[#94A3B8]">
                    Más categorías
                  </Text>
                  <View className="flex-row flex-wrap gap-1">
                    {EXTRA_CATEGORIES.map((cat) =>
                      renderChip(
                        `${cat.emoji} ${cat.label}`,
                        selectedCategory === cat.value,
                        () => onSelectCategory?.(cat.value),
                        cat.value,
                      ),
                    )}
                    {renderChip(
                      '📦 Otros',
                      selectedCategory === 'OTHER',
                      () => onSelectCategory?.('OTHER'),
                      'other-fallback',
                    )}
                  </View>
                </View>
              )}
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
