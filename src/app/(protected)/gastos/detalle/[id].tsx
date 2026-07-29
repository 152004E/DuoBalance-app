import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { ExpenseHeroCard } from '@/components/expenses/expense-hero-card';
import { ExpenseInformation } from '@/components/expenses/expense-information';
import { ExpenseParticipants } from '@/components/expenses/expense-participants';
import { ExpenseSplit } from '@/components/expenses/expense-split';
import { ExpenseReceipt } from '@/components/expenses/expense-receipt';
import { ExpenseTimeline } from '@/components/expenses/expense-timeline';
import { ExpenseActions } from '@/components/expenses/expense-actions';
import { getExpense, deleteExpense } from '@/services/api/expenses';
import { getGroup } from '@/services/api/groups';
import { useAuth } from '@/hooks/use-auth';
import type { ExpenseResponse, GroupResponse } from '@/types/api';

const CATEGORY_CONFIG: Record<string, { icon: string; color: string }> = {
  ALIMENTACIÓN: { icon: 'basket-shopping', color: '#F97316' },
  TRANSPORTE: { icon: 'car', color: '#8B5CF6' },
  VIVIENDA: { icon: 'house', color: '#3B82F6' },
  SERVICIOS: { icon: 'bolt', color: '#F59E0B' },
  ENTRETENCIÓN: { icon: 'film', color: '#06B6D4' },
  OTROS: { icon: 'tag', color: '#64748B' },
};

type ScreenState = 'loading' | 'error' | 'empty' | 'data';

export default function ExpenseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [state, setState] = useState<ScreenState>('loading');
  const [expense, setExpense] = useState<ExpenseResponse | null>(null);
  const [group, setGroup] = useState<GroupResponse | null>(null);

  useEffect(() => {
    if (!id) return;
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const expenseData = await getExpense(id!);
      setExpense(expenseData);
      const groupData = await getGroup(expenseData.groupId);
      setGroup(groupData);
      setState('data');
    } catch {
      setState('error');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar gasto',
      '¿Estás seguro de eliminar este gasto? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExpense(id!);
              router.back();
            } catch {
              Alert.alert('Error', 'No se pudo eliminar el gasto.');
            }
          },
        },
      ],
    );
  };

  if (!user) return null;

  if (state === 'loading') {
    return renderLayout(
      'Detalle del gasto',
      'Cargando...',
      <Loading message="Cargando detalle del gasto..." />,
    );
  }

  if (state === 'error') {
    return renderLayout(
      'Detalle del gasto',
      'Error',
      <EmptyState
        title="Error al cargar"
        description="No se pudo cargar la información del gasto. Intenta de nuevo."
      />,
    );
  }

  if (!expense || !group) {
    return renderLayout(
      'Detalle del gasto',
      'Gasto no encontrado',
      <EmptyState
        title="Gasto no encontrado"
        description={`No existe un gasto con ID "${id}".`}
      />,
    );
  }

  const catConfig = CATEGORY_CONFIG[expense.category] ?? {
    icon: 'tag',
    color: '#64748B',
  };

  const memberMap = new Map(group.members.map((m) => [m.user.id, m.user]));
  const paidByUser = memberMap.get(expense.paidById);
  const paidByName = paidByUser
    ? paidByUser.id === user.id
      ? 'Tú'
      : paidByUser.firstName
    : 'Desconocido';
  const paidByInitials = paidByUser
    ? (paidByUser.firstName[0] + (paidByUser.lastName?.[0] ?? '')).toUpperCase()
    : '?';

  const participants = (expense.splits ?? []).map((s) => {
    const member = memberMap.get(s.userId);
    const name = member
      ? member.id === user.id
        ? 'Tú'
        : member.firstName
      : 'Usuario';
    const initials = member
      ? (member.firstName[0] + (member.lastName?.[0] ?? '')).toUpperCase()
      : '?';
    const isPayer = s.userId === expense.paidById;
    return {
      name,
      initials,
      amount: (expense.amount * s.percentage) / 100,
      percentage: s.percentage,
      isPayer,
    };
  });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-10"
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="Detalle del gasto"
          subtitle={expense.description}
          onBack={() => router.back()}
        />

        <View className="mt-5 gap-4">
          <ExpenseHeroCard
            name={expense.description}
            amount={expense.amount}
            category={expense.category}
            categoryIcon={catConfig.icon}
            categoryColor={catConfig.color}
            date={formatDate(expense.createdAt)}
            groupType={group.type}
            status={expense.splitType === 'PERSONAL' ? 'personal' : 'shared'}
          />

          <ExpenseInformation
            description={expense.description}
            groupName={group.name}
            groupType={group.type}
            paidByName={paidByName}
            paidByInitials={paidByInitials}
            createdAt={formatDateTime(expense.createdAt)}
            updatedAt={
              expense.updatedAt ? formatDateTime(expense.updatedAt) : undefined
            }
          />

          <ExpenseParticipants
            participants={participants.map((p) => ({
              name: p.name,
              initials: p.initials,
              isPayer: p.isPayer,
            }))}
          />

          <ExpenseSplit participants={participants} />

          <ExpenseReceipt />

          <ExpenseTimeline
            entries={[
              {
                label: `Registrado por ${paidByName}`,
                value: formatDateTime(expense.createdAt),
              },
              ...(expense.updatedAt
                ? [
                    {
                      label: 'Última actualización',
                      value: formatDateTime(expense.updatedAt),
                    },
                  ]
                : []),
            ]}
          />

          <ExpenseActions onDelete={handleDelete} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function renderLayout(
  title: string,
  subtitle: string,
  content: React.ReactNode,
) {
  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      <ScreenHeader
        title={title}
        subtitle={subtitle}
        onBack={() => router.back()}
      />
      {content}
    </SafeAreaView>
  );
}
