import { useCallback, useState, useMemo, useEffect } from 'react';
import { View, Text, Pressable, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadMoreButton } from '@/components/ui/load-more-button';
import {
  RecentExpensesCard,
  type RecentExpense,
} from '@/components/expenses/recent-expenses-card';
import { FloatingAddButton } from '@/components/dashboard/FloatingAddButton';
import { DestinationSelector } from '@/components/movements/destination-selector';
import { CreateExpenseSheet } from '@/components/movements/create-expense-sheet';
import { FilterSheet } from '@/components/movements/filter-sheet';
import { getExpenses, createExpense } from '@/services/api/expenses';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/hooks/use-auth';
import { useWorkspace } from '@/hooks/use-workspace';
import { useGroups } from '@/hooks/use-groups';
import { getCategoryMeta } from '@/constants/categories';
import type { ExpenseResponse, GroupResponse } from '@/types/api';
import { FontAwesome6 } from '@expo/vector-icons';

function expenseToRecent(e: ExpenseResponse, userId: string): RecentExpense {
  const meta = getCategoryMeta(e.category);
  return {
    id: e.id,
    name: e.description,
    amount: Number(e.amount),
    paidBy: e.paidById === userId ? 'Tú' : 'Otro',
    date: new Date(e.createdAt).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    category: e.category,
    icon: meta.icon,
    iconBg: meta.color,
  };
}

export default function MovimientosScreen() {
  const { user } = useAuth();
  const { workspace } = useWorkspace();
  const { groups, personalGroups, coupleGroups, sharedGroups } = useGroups();
  const { groupId } = useLocalSearchParams<{ groupId?: string }>();

  const isGroupMode = !!groupId;
  const groupModeGroup = isGroupMode
    ? groups.find((g) => g.id === groupId)
    : undefined;

  const [allExpenses, setAllExpenses] = useState<ExpenseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);
  const [query, setQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Todo');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [destSelectorVisible, setDestSelectorVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [creatingExpenseGroup, setCreatingExpenseGroup] = useState<{
    group: GroupResponse;
    members: { id: string; name: string }[];
  } | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      getExpenses()
        .then((data) => {
          if (active) setAllExpenses(data);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
    }, []),
  );

  // Grupos objetivo: modo grupo → solo ese grupo; modo global → filtro por workspace
  const filteredGroups = useMemo(() => {
    if (isGroupMode) {
      return groupModeGroup ? [groupModeGroup] : [];
    }
    return groups.filter((g) => {
      if (workspace.category === 'all') return true;
      if (workspace.category === 'personal' && g.type === 'PERSONAL')
        return true;
      if (workspace.category === 'couple' && g.type === 'COUPLE') {
        return workspace.groupId ? g.id === workspace.groupId : true;
      }
      if (workspace.category === 'group' && g.type === 'GROUP') {
        return workspace.groupId ? g.id === workspace.groupId : true;
      }
      return false;
    });
  }, [isGroupMode, groupModeGroup, groups, workspace]);

  const filteredGroupIds = useMemo(
    () => new Set(filteredGroups.map((g) => g.id)),
    [filteredGroups],
  );

  // Filtro por grupo + buscador + período + categoría
  const filteredExpenses = useMemo(() => {
    const q = query.trim().toLowerCase();

    const now = new Date();
    let periodStart: Date | null = null;
    if (selectedPeriod === 'Este mes') {
      periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (selectedPeriod === 'Últimos 3 meses') {
      periodStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    } else if (selectedPeriod === 'Este año') {
      periodStart = new Date(now.getFullYear(), 0, 1);
    }

    return allExpenses.filter((e) => {
      if (!filteredGroupIds.has(e.groupId)) return false;
      if (q && !e.description.toLowerCase().includes(q)) return false;
      if (selectedCategory !== 'all' && e.category !== selectedCategory)
        return false;
      if (periodStart && new Date(e.createdAt) < periodStart) return false;
      return true;
    });
  }, [allExpenses, filteredGroupIds, query, selectedPeriod, selectedCategory]);

  const recentExpenses = filteredExpenses.map((e) =>
    expenseToRecent(e, user?.id ?? ''),
  );

  const activeFilterCount =
    (selectedPeriod !== 'Todo' ? 1 : 0) + (selectedCategory !== 'all' ? 1 : 0);

  const handleClearFilters = useCallback(() => {
    setSelectedPeriod('Todo');
    setSelectedCategory('all');
  }, []);

  // Al cambiar filtro/workspace/grupo, reiniciar el número visible
  useEffect(() => {
    setVisibleCount(10);
  }, [workspace, groupId, selectedPeriod, selectedCategory]);

  // FAB: mismo patrón que Gastos — si hay grupo específico abre el sheet, si no, selector
  const handleCreateExpense = useCallback(() => {
    const targetGroupId = groupId ?? workspace.groupId;
    if (targetGroupId) {
      const group = groups.find((g) => g.id === targetGroupId);
      if (!group) {
        setDestSelectorVisible(true);
        return;
      }
      const members = group.members.map((m) => ({
        id: m.user.id,
        name: m.user.id === user?.id ? 'Tú' : m.user.firstName,
      }));
      setCreatingExpenseGroup({ group, members });
    } else {
      setDestSelectorVisible(true);
    }
  }, [groupId, workspace.groupId, groups, user?.id]);

  const handleDestSelect = useCallback(
    (group: GroupResponse) => {
      setDestSelectorVisible(false);
      const members = group.members.map((m) => ({
        id: m.user.id,
        name: m.user.id === user?.id ? 'Tú' : m.user.firstName,
      }));
      setCreatingExpenseGroup({ group, members });
    },
    [user?.id],
  );

  const handleCloseCreateSheet = useCallback(() => {
    setCreatingExpenseGroup(null);
  }, []);

  const title = isGroupMode
    ? (groupModeGroup?.name ?? 'Movimientos')
    : 'Movimientos';
  const subtitle = isGroupMode
    ? 'Todos los gastos del grupo'
    : 'Historial de tu actividad financiera';

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      <ScreenHeader
        title={title}
        subtitle={subtitle}
        onBack={() => router.back()}
      />

      {/* Buscador + Filtros */}
      <View className="px-5 pb-5 pt-4">
        <View className="flex-row items-center gap-3">
          <View className="flex-1 flex-row items-center rounded-full bg-white px-4 py-3">
            <FontAwesome6 name="magnifying-glass" size={16} color="#94A3B8" />
            <TextInput
              placeholder="Buscar movimientos..."
              placeholderTextColor="#94A3B8"
              value={query}
              onChangeText={setQuery}
              className="ml-3 flex-1 text-[15px] text-[#0F172A]"
            />
          </View>

          <Pressable
            onPress={() => setFiltersVisible(true)}
            className="flex-row items-center gap-2 rounded-full bg-[#10B981] px-4 py-3 active:opacity-80"
          >
            <FontAwesome6 name="sliders" size={16} color="#FFFFFF" />
            <Text className="text-sm font-semibold text-white">Filtros</Text>
            {activeFilterCount > 0 && (
              <View className="h-5 min-w-5 items-center justify-center rounded-full bg-[#10B981] px-1.5">
                <Text className="text-xs font-bold text-white">
                  {activeFilterCount}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      {loading ? (
        <Loading message="Cargando movimientos..." />
      ) : recentExpenses.length === 0 ? (
        <View className="flex-1 items-center justify-center px-5">
          <EmptyState
            title="Sin movimientos aún"
            description="Cuando registres gastos aparecerán aquí"
          />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-32"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-5 pt-4">
            <RecentExpensesCard
              expenses={recentExpenses}
              maxItems={visibleCount}
              onExpensePress={(expense) =>
                router.push(`/gastos/detalle/${expense.id}`)
              }
            />
            {/* Load More Button */}
            <View className="mt-5">
              <LoadMoreButton
                visibleCount={visibleCount}
                totalCount={filteredExpenses.length}
                step={10}
                onLoadMore={setVisibleCount}
              />
            </View>
          </View>
        </ScrollView>
      )}

      <FloatingAddButton onPress={handleCreateExpense} />

      <FilterSheet
        visible={filtersVisible}
        onClose={() => setFiltersVisible(false)}
        selectedPeriod={selectedPeriod}
        selectedCategory={selectedCategory}
        onSelectPeriod={setSelectedPeriod}
        onSelectCategory={setSelectedCategory}
        onClear={handleClearFilters}
        heightRatio={0.48}
        headerFinalTranslateY={0.35}
      />

      <DestinationSelector
        visible={destSelectorVisible}
        onClose={() => setDestSelectorVisible(false)}
        filter={workspace}
        personalGroups={personalGroups}
        coupleGroups={coupleGroups}
        sharedGroups={sharedGroups}
        onSelect={handleDestSelect}
        heightRatio={0.35}
        headerFinalTranslateY={0.45}
      />

      {creatingExpenseGroup && (
        <CreateExpenseSheet
          visible={!!creatingExpenseGroup}
          onClose={handleCloseCreateSheet}
          group={creatingExpenseGroup.group}
          members={creatingExpenseGroup.members}
          heightRatio={0.65}
          headerFinalTranslateY={0.19}
          onCreateExpense={async (payload) => {
            try {
              await createExpense(payload);
              handleCloseCreateSheet();
              getExpenses().then(setAllExpenses);
              Toast.show({
                type: 'success',
                text1: 'Gasto registrado',
                text2: `${payload.description} · $${payload.amount.toLocaleString(
                  'es-CL',
                )}`,
              });
            } catch (error) {
              console.error('Error al crear gasto:', error);
              Toast.show({
                type: 'error',
                text1: 'No se pudo registrar el gasto',
                text2: 'Revisa tu conexión e intenta de nuevo.',
              });
            }
          }}
        />
      )}
    </SafeAreaView>
  );
}
