import { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
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
import {
  ExpenseMenuSheet,
  type ExpenseMenuAction,
} from '@/components/expenses/expense-menu-sheet';
import { AlertModal } from '@/components/ui/alert-modal';
import { CreateExpenseSheet } from '@/components/movements/create-expense-sheet';
import {
  getExpense,
  deleteExpense,
  updateExpense,
} from '@/services/api/expenses';
import { getGroup } from '@/services/api/groups';
import { useAuth } from '@/hooks/use-auth';
import type {
  ExpenseResponse,
  GroupResponse,
  UpdateExpensePayload,
} from '@/types/api';

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
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [editError, setEditError] = useState(false);

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

  const handleConfirmDelete = async () => {
    if (deleteLoading) return;
    setDeleteLoading(true);
    try {
      await deleteExpense(id!);
      setDeleteVisible(false);
      router.back();
    } catch {
      setDeleteLoading(false);
      setDeleteVisible(false);
      setDeleteError(true);
    }
  };

  const handleMenuAction = (action: ExpenseMenuAction) => {
    setMenuVisible(false);
    if (action === 'edit') {
      setEditVisible(true);
    } else if (action === 'delete') {
      setDeleteVisible(true);
    }
  };

  const handleUpdateExpense = async (payload: UpdateExpensePayload) => {
    try {
      await updateExpense(id!, payload);
      setEditVisible(false);
      loadData();
      setEditSuccess(true);
    } catch (error) {
      console.error('Error al actualizar gasto:', error);
      setEditVisible(false);
      setEditError(true);
    }
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

  // El gasto se considera editado si la fecha de actualización difiere de la de creación
  const wasEdited =
    !!expense.updatedAt &&
    new Date(expense.updatedAt).getTime() -
      new Date(expense.createdAt).getTime() >
      1000;

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
          onAction={() => setMenuVisible(true)}
          actionIcon="ellipsis-vertical"
          actionColor="#64748B"
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

          {group.type !== 'PERSONAL' && expense.splitType !== 'PERSONAL' && (
            <ExpenseParticipants
              participants={participants.map((p) => ({
                name: p.name,
                initials: p.initials,
                isPayer: p.isPayer,
              }))}
            />
          )}

          {group.type !== 'PERSONAL' && expense.splitType !== 'PERSONAL' && (
            <ExpenseSplit participants={participants} />
          )}

          <ExpenseReceipt />

          <ExpenseTimeline
            entries={[
              {
                label: `Registrado por ${paidByName}`,
                value: formatDateTime(expense.createdAt),
              },
              ...(wasEdited
                ? [
                    {
                      label: 'Última actualización',
                      value: formatDateTime(expense.updatedAt),
                    },
                  ]
                : []),
            ]}
          />

          <ExpenseActions
            onEdit={() => setEditVisible(true)}
            onDelete={() => setDeleteVisible(true)}
          />
        </View>
      </ScrollView>

      {/* Confirmación de eliminación */}
      <AlertModal
        visible={deleteVisible}
        type="warning"
        title="¿Eliminar gasto?"
        message="¿Estás seguro de eliminar este gasto? Esta acción no se puede deshacer."
        buttonText={deleteLoading ? 'Eliminando...' : 'Sí, eliminar'}
        cancelText="Cancelar"
        onCancel={() => {
          if (!deleteLoading) setDeleteVisible(false);
        }}
        onClose={handleConfirmDelete}
      />

      {/* Error al eliminar */}
      <AlertModal
        visible={deleteError}
        type="error"
        title="Error"
        message="No se pudo eliminar el gasto. Intenta de nuevo."
        buttonText="Entendido"
        onClose={() => setDeleteError(false)}
      />

      {/* Menú de opciones */}
      <ExpenseMenuSheet
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onAction={handleMenuAction}
        heightRatio={0.1}
        headerFinalTranslateY={0.53}
      />

      {/* Editar gasto */}
      {group && (
        <CreateExpenseSheet
          visible={editVisible}
          onClose={() => setEditVisible(false)}
          group={group}
          members={group.members.map((m) => ({
            id: m.user.id,
            name: m.user.firstName,
          }))}
          initialExpense={expense}
          heightRatio={0.63}
          headerFinalTranslateY={0.19}
          onUpdateExpense={handleUpdateExpense}
        />
      )}

      {/* Éxito al editar */}
      <AlertModal
        visible={editSuccess}
        type="success"
        title="Gasto actualizado"
        message="El gasto se actualizó correctamente."
        buttonText="Entendido"
        onClose={() => setEditSuccess(false)}
      />

      {/* Error al editar */}
      <AlertModal
        visible={editError}
        type="error"
        title="Error"
        message="No se pudo actualizar el gasto. Intenta de nuevo."
        buttonText="Entendido"
        onClose={() => setEditError(false)}
      />
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
