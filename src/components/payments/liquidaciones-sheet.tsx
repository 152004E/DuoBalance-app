import { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { BottomSheetHeader } from '@/components/ui/bottom-sheet-header';
import { formatRelativeDate } from '@/utils/date';
import type { PaymentResponse } from '@/types/api';

interface LiquidacionesSheetProps {
  visible: boolean;
  onClose: () => void;
  currentUserId: string;
  pendingToConfirm: PaymentResponse[];
  history: PaymentResponse[];
  onConfirm?: (payment: PaymentResponse) => void;
  onReject?: (payment: PaymentResponse) => void;
  isMutating?: boolean;
  heightRatio?: number;
  headerFinalTranslateY?: number;
}

type Tab = 'pending' | 'history';

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

export function LiquidacionesSheet({
  visible,
  onClose,
  currentUserId,
  pendingToConfirm,
  history,
  onConfirm,
  onReject,
  isMutating = false,
  heightRatio = 0.8,
  headerFinalTranslateY = 0.1,
}: LiquidacionesSheetProps) {
  const [tab, setTab] = useState<Tab>('pending');

  const fmt = (value: number) =>
    `$${Math.round(value).toLocaleString('es-CL')}`;

  const pendingCount = pendingToConfirm.length;

  const renderPending = () => {
    if (pendingCount === 0) {
      return (
        <View className="items-center justify-center px-6 py-14">
          <View className="flex h-14 w-14 items-center justify-center rounded-full bg-[#10B981]/10">
            <FontAwesome6 name="check-double" size={22} color="#10B981" />
          </View>
          <Text className="mt-3 text-center text-base font-semibold text-[#0F172A]">
            Sin pagos por confirmar
          </Text>
          <Text className="mt-1 text-center text-sm text-[#64748B]">
            Cuando te registren un pago pendiente, aparecerá aquí para que lo
            confirmes o rechaces.
          </Text>
        </View>
      );
    }

    return (
      <View className="gap-3">
        {pendingToConfirm.map((payment) => {
          const isFromMe = payment.fromUserId === currentUserId;
          const fromUser = isFromMe
            ? { id: currentUserId, firstName: 'Tú', lastName: '' }
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
                  onPress={() => onConfirm?.(payment)}
                  disabled={isMutating}
                  className="flex-1 flex-row items-center justify-center gap-2 rounded-lg bg-[#10B981] py-2.5 active:opacity-80 disabled:opacity-50"
                >
                  <FontAwesome6 name="check" size={12} color="#FFFFFF" />
                  <Text className="text-sm font-semibold text-white">
                    Aceptar
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => onReject?.(payment)}
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
    );
  };

  const renderHistory = () => {
    if (history.length === 0) {
      return (
        <View className="items-center justify-center px-6 py-14">
          <View className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F1F5F9]">
            <FontAwesome6 name="clock-rotate-left" size={22} color="#64748B" />
          </View>
          <Text className="mt-3 text-center text-base font-semibold text-[#0F172A]">
            Sin liquidaciones aún
          </Text>
          <Text className="mt-1 text-center text-sm text-[#64748B]">
            Los pagos confirmados o rechazados aparecerán aquí.
          </Text>
        </View>
      );
    }

    return (
      <View className="gap-2">
        {history.map((payment) => {
          const isConfirmed = payment.status === 'CONFIRMED';
          const fromUser = payment.fromUser;
          const toUser = payment.toUser;
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
                  <UserName user={fromUser} fallback="Miembro" />
                  <FontAwesome6 name="arrow-right" size={10} color="#94A3B8" />
                  <UserName user={toUser} fallback="Miembro" />
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

  const header = (
    <BottomSheetHeader
      visible={visible}
      title="Liquidaciones"
      subtitle="Confirma pagos pendientes y revisa el historial"
      onClose={onClose}
      gradientPaddingBottom={600}
      logo={require('@/assets/images/logo-white-green-bg-without.png')}
    />
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      header={header}
      heightRatio={heightRatio}
      headerFinalTranslateY={headerFinalTranslateY}
    >
      <View className="flex-1">
        {/* Tabs */}
        <View className="flex-row gap-2 px-5 pb-3">
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
            {pendingCount > 0 && (
              <View className="rounded-full bg-[#EF4444] px-2 py-0.5">
                <Text className="text-xs font-bold text-white">
                  {pendingCount}
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
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-4"
        >
          {tab === 'pending' ? renderPending() : renderHistory()}
        </ScrollView>
      </View>
    </BottomSheet>
  );
}
