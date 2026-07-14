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
import { MOCK_EXPENSE_DETAIL, type ExpenseDetail } from '@/types/expenses';

type ScreenState = 'loading' | 'error' | 'empty' | 'data';

export default function ExpenseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [state, setState] = useState<ScreenState>('loading');
  const [expense, setExpense] = useState<ExpenseDetail | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (id === MOCK_EXPENSE_DETAIL.id) {
        setExpense(MOCK_EXPENSE_DETAIL);
        setState('data');
      } else {
        setState('empty');
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [id]);

  if (state === 'loading') {
    return (
      <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
        <ScreenHeader
          title="Detalle del gasto"
          subtitle="Cargando..."
          onBack={() => router.back()}
        />
        <Loading message="Cargando detalle del gasto..." />
      </SafeAreaView>
    );
  }

  if (state === 'error') {
    return (
      <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
        <ScreenHeader
          title="Detalle del gasto"
          subtitle="Error"
          onBack={() => router.back()}
        />
        <EmptyState
          title="Error al cargar"
          description="No se pudo cargar la información del gasto. Intenta de nuevo."
        />
      </SafeAreaView>
    );
  }

  if (state === 'empty' || !expense) {
    return (
      <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
        <ScreenHeader
          title="Detalle del gasto"
          subtitle="Gasto no encontrado"
          onBack={() => router.back()}
        />
        <EmptyState
          title="Gasto no encontrado"
          description={`No existe un gasto con ID "${id}".`}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-10"
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="Detalle del gasto"
          subtitle={expense.name}
          onBack={() => router.back()}
        />

        <View className="mt-5 gap-4">
          <ExpenseHeroCard
            name={expense.name}
            amount={expense.amount}
            category={expense.category}
            categoryIcon={expense.categoryIcon}
            categoryColor={expense.categoryColor}
            date={expense.date}
            groupType={expense.group.type}
            status={expense.status}
          />

          <ExpenseInformation
            description={expense.description}
            groupName={expense.group.name}
            groupType={expense.group.type}
            paidByName={expense.paidBy.name}
            paidByInitials={expense.paidBy.initials}
            createdAt={expense.createdAt}
            updatedAt={expense.updatedAt}
          />

          <ExpenseParticipants
            participants={expense.participants.map(p => ({
              name: p.name,
              initials: p.initials,
              isPayer: p.isPayer,
            }))}
          />

          <ExpenseSplit participants={expense.participants} />

          <ExpenseReceipt receipt={expense.receipt} />

          <ExpenseTimeline
            entries={[
              { label: `Registrado por ${expense.paidBy.name}`, value: expense.createdAt },
              ...(expense.updatedAt
                ? [{ label: 'Última actualización', value: expense.updatedAt }
              ] : []),
            ]}
          />

          <ExpenseActions />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
