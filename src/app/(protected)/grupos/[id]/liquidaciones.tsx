import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { getGroup } from '@/services/api/groups';
import { confirmPayment, rejectPayment } from '@/services/api/payments';
import { formatRelativeDate } from '@/utils/date';
import type { GroupResponse, PaymentResponse } from '@/types/api';
import { useAuth } from '@/hooks/use-auth';
import { useGroupPayments } from '@/hooks/use-group-payments';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { AlertModal } from '@/components/ui/alert-modal';

type Tab = 'pending' | 'history';

const fmt = (value: number) => `$${Math.round(value).toLocaleString('es-CL')}`;

function UserName({
  user,
  fallback,
}: {
  user?: { id: string; firstName: string; lastName: string };
  fallback: string;
}) {
  return (
    <Text className="font-semibold text-[#0F172A]">
      {user ? `${user.firstName} ${user.lastName}` : fallback}
    </Text>
  );
}

export default function LiquidacionesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [group, setGroup] = useState<GroupResponse | null>(null);
  const [groupLoading, setGroupLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('pending');
  const [isMutating, setIsMutating] = useState(false);
  const [feedback, setFeedback] = useState<{
    title: string;
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const { pendingToConfirm, sentPending, history, isLoading, refetch } =
    useGroupPayments({
      groupId: id,
      userId: user?.id,
    });

  useEffect(() => {
    let mounted = true;
    getGroup(id)
      .then((data) => {
        if (mounted) setGroup(data);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setGroupLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleConfirm = useCallback(
    async (payment: PaymentResponse) => {
      setIsMutating(true);
      try {
        await confirmPayment(payment.id);
        await refetch();
        setFeedback({
          title: 'Pago aceptado',
          message: `Has confirmado el pago de ${fmt(payment.amount)}. El saldo se ha actualizado.`,
          type: 'success',
        });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Error al confirmar';
        setFeedback({ title: 'Error', message, type: 'error' });
      } finally {
        setIsMutating(false);
      }
    },
    [refetch],
  );

  const handleReject = useCallback(
    async (payment: PaymentResponse) => {
      setIsMutating(true);
      try {
        await rejectPayment(payment.id);
        await refetch();
        setFeedback({
          title: 'Pago rechazado',
          message: 'El pago ha sido rechazado. No se descuenta nada del saldo.',
          type: 'success',
        });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Error al rechazar';
        setFeedback({ title: 'Error', message, type: 'error' });
      } finally {
        setIsMutating(false);
      }
    },
    [refetch],
  );

  const renderPending = () => {
    const hasAnyPending = pendingToConfirm.length + sentPending.length > 0;
    if (!hasAnyPending) {
      return (
        <EmptyState
          title="Sin pagos por confirmar"
          description="Cuando te registren un pago pendiente, aparecerá aquí para que lo confirmes o rechaces."
        />
      );
    }
    return (
      <View className="gap-4">
        {/* Pagos que me llegan — puedo aceptar o rechazar */}
        {pendingToConfirm.length > 0 && (
          <View className="gap-3">
            {pendingToConfirm.map((payment) => {
              const isFromMe = payment.fromUserId === user?.id;
              const fromUser = isFromMe
                ? { id: user!.id, firstName: 'Tú', lastName: '' }
                : payment.fromUser;
              return (
                <View
                  key={payment.id}
                  className="rounded-xl border border-[#E2E8F0] bg-white p-4"
                >
                  <View className="flex-row items-center gap-3">
                    <View className="flex h-11 w-11 items-center justify-center rounded-full bg-[#006c49]/10">
                      <FontAwesome6
                        name="money-bill-transfer"
                        size={16}
                        color="#006c49"
                      />
                    </View>
                    <View className="flex-1 shrink">
                      <Text className="text-sm font-semibold text-[#0F172A]">
                        {fromUser
                          ? `${fromUser.firstName} ${fromUser.lastName}`
                          : 'Alguien'}{' '}
                        dice que te pagó
                      </Text>
                      <Text className="mt-0.5 text-xs text-[#64748B]">
                        {formatRelativeDate(payment.createdAt)}
                      </Text>
                    </View>
                    <Text className="text-base font-bold text-[#10B981]">
                      {fmt(payment.amount)}
                    </Text>
                  </View>

                  <View className="mt-4 flex-row gap-2">
                    <Pressable
                      onPress={() => handleConfirm(payment)}
                      disabled={isMutating}
                      className="flex-1 flex-row items-center justify-center gap-2 rounded-lg bg-[#10B981] py-2.5 active:opacity-80 disabled:opacity-50"
                    >
                      <FontAwesome6 name="check" size={12} color="#FFFFFF" />
                      <Text className="text-sm font-semibold text-white">
                        Aceptar
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleReject(payment)}
                      disabled={isMutating}
                      className="flex-1 flex-row items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white py-2.5 active:bg-[#F2F4F6] disabled:opacity-50"
                    >
                      <FontAwesome6 name="xmark" size={12} color="#EF4444" />
                      <Text className="text-sm font-semibold text-[#EF4444]">
                        Rechazar
                      </Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Pagos que yo envié — esperando confirmación del otro */}
        {sentPending.length > 0 && (
          <View className="gap-3">
            {sentPending.map((payment) => {
              const toUser = payment.toUser;
              return (
                <View
                  key={payment.id}
                  className="rounded-xl border border-[#F59E0B]/30 bg-[#FFFBEB] p-4"
                >
                  <View className="flex-row items-center gap-3">
                    <View className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F59E0B]/10">
                      <FontAwesome6 name="clock" size={16} color="#F59E0B" />
                    </View>
                    <View className="flex-1 shrink">
                      <Text className="text-sm font-semibold text-[#0F172A]">
                        {'Enviaste pago a '}
                        {toUser
                          ? `${toUser.firstName} ${toUser.lastName}`
                          : 'un miembro'}
                      </Text>
                      <Text className="mt-0.5 text-xs text-[#92400E]">
                        Esperando confirmación ·{' '}
                        {formatRelativeDate(payment.createdAt)}
                      </Text>
                    </View>
                    <Text className="text-base font-bold text-[#F59E0B]">
                      {fmt(payment.amount)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  const renderHistory = () => {
    if (history.length === 0) {
      return (
        <EmptyState
          title="Sin liquidaciones aún"
          description="Los pagos confirmados o rechazados aparecerán aquí."
        />
      );
    }
    return (
      <View className="gap-2">
        {history.map((payment) => {
          const isConfirmed = payment.status === 'CONFIRMED';
          return (
            <View
              key={payment.id}
              className="flex-row items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3"
            >
              <View
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  isConfirmed ? 'bg-[#10B981]/10' : 'bg-[#EF4444]/10'
                }`}
              >
                <FontAwesome6
                  name={isConfirmed ? 'check' : 'xmark'}
                  size={14}
                  color={isConfirmed ? '#10B981' : '#EF4444'}
                />
              </View>
              <View className="flex-1 shrink">
                <View className="flex-row flex-wrap items-center gap-1">
                  <UserName user={payment.fromUser} fallback="Miembro" />
                  <FontAwesome6 name="arrow-right" size={10} color="#94A3B8" />
                  <UserName user={payment.toUser} fallback="Miembro" />
                </View>
                <Text className="mt-0.5 text-xs text-[#64748B]">
                  {formatRelativeDate(payment.confirmedAt ?? payment.createdAt)}
                  {' · '}
                  {isConfirmed ? 'Confirmado' : 'Rechazado'}
                </Text>
              </View>
              <Text
                className={`text-base font-bold ${
                  isConfirmed ? 'text-[#10B981]' : 'text-[#EF4444]'
                }`}
              >
                {fmt(payment.amount)}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      <View className="pt-1">
        <ScreenHeader
          title={group?.name ?? 'Liquidaciones'}
          subtitle="Historial de pagos del grupo"
          onBack={() => router.push(`/grupos/${id}`)}
        />
      </View>

      {isLoading || groupLoading ? (
        <Loading message="Cargando liquidaciones..." />
      ) : (
        <View className="flex-1 px-5 pt-5">
          <View className="flex-row gap-2 pb-4">
            <Pressable
              onPress={() => setTab('pending')}
              className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl border py-3 ${
                tab === 'pending'
                  ? 'border-[#10B981] bg-[#F0FDF4]'
                  : 'border-[#E2E8F0] bg-white'
              }`}
            >
              <FontAwesome6
                name="clock"
                size={13}
                color={tab === 'pending' ? '#10B981' : '#64748B'}
              />
              <Text
                className={`text-sm font-semibold ${
                  tab === 'pending' ? 'text-[#10B981]' : 'text-[#64748B]'
                }`}
              >
                Por confirmar
              </Text>
              {pendingToConfirm.length + sentPending.length > 0 && (
                <View className="rounded-full bg-[#EF4444] px-2 py-0.5">
                  <Text className="text-xs font-bold text-white">
                    {pendingToConfirm.length + sentPending.length}
                  </Text>
                </View>
              )}
            </Pressable>

            <Pressable
              onPress={() => setTab('history')}
              className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl border py-3 ${
                tab === 'history'
                  ? 'border-[#10B981] bg-[#F0FDF4]'
                  : 'border-[#E2E8F0] bg-white'
              }`}
            >
              <FontAwesome6
                name="clock-rotate-left"
                size={13}
                color={tab === 'history' ? '#10B981' : '#64748B'}
              />
              <Text
                className={`text-sm font-semibold ${
                  tab === 'history' ? 'text-[#10B981]' : 'text-[#64748B]'
                }`}
              >
                Historial
              </Text>
            </Pressable>
          </View>

          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerClassName="pb-8"
          >
            {tab === 'pending' ? renderPending() : renderHistory()}
          </ScrollView>
        </View>
      )}

      <AlertModal
        visible={feedback !== null}
        type={feedback?.type === 'success' ? 'success' : 'error'}
        title={feedback?.title ?? ''}
        message={feedback?.message ?? ''}
        buttonText="Entendido"
        onClose={() => setFeedback(null)}
      />
    </SafeAreaView>
  );
}
