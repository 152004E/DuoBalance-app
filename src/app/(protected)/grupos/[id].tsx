import { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import {
  getGroup,
  leaveGroup,
  regenerateInviteCode,
} from '@/services/api/groups';
import { getExpenses } from '@/services/api/expenses';
import { getCategoryMeta } from '@/constants/categories';
import type { GroupResponse, GroupType, ExpenseResponse } from '@/types/api';
import { useAuth } from '@/hooks/use-auth';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import {
  RecentExpensesCard,
  type RecentExpense,
} from '@/components/expenses/recent-expenses-card';
import {
  CoupleMenuSheet,
  type CoupleMenuAction,
} from '@components/couple/couple-menu-sheet';
import { InviteMemberSheet } from '@/components/couple/invite-member-sheet';
import { AlertModal } from '@/components/ui/alert-modal';

const TYPE_CONFIG: Record<
  GroupType,
  { label: string; color: string; bg: string; subtitle: string }
> = {
  PERSONAL: {
    label: 'Personal',
    color: '#64748B',
    bg: '#F1F5F9',
    subtitle: 'Solo tú',
  },
  COUPLE: {
    label: 'Pareja',
    color: '#10B981',
    bg: '#F0FDF4',
    subtitle: '2 miembros',
  },
  GROUP: { label: 'Grupo', color: '#3B82F6', bg: '#EFF6FF', subtitle: '' },
};

function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (diffDays <= 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
}

export default function CoupleDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [group, setGroup] = useState<GroupResponse | null>(null);
  const [expenses, setExpenses] = useState<ExpenseResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [inviteVisible, setInviteVisible] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [leaveSuccess, setLeaveSuccess] = useState(false);
  const [leaveError, setLeaveError] = useState<string | null>(null);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerateError, setRegenerateError] = useState<string | null>(null);
  const [regenerateSuccess, setRegenerateSuccess] = useState(false);
  const lastActionRef = useRef<CoupleMenuAction | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setError(null);
    getGroup(id)
      .then((data) => {
        if (mounted) setGroup(data);
      })
      .catch((err: unknown) => {
        if (mounted) {
          const message =
            err instanceof Error ? err.message : 'Error al cargar el grupo';
          setError(message);
        }
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    let mounted = true;
    getExpenses({ groupId: id })
      .then((data) => {
        if (mounted) setExpenses(data);
      })
      .catch(() => {
        if (mounted) setExpenses([]);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  const groupType: GroupType = group?.type ?? 'COUPLE';
  const typeConfig = TYPE_CONFIG[groupType];
  const memberCount = group?.members.length ?? 0;
  const subtitle = `${typeConfig.label} · ${groupType === 'PERSONAL' ? 'Solo tú' : groupType === 'COUPLE' ? '2 miembros' : `${memberCount} miembros`}`;

  // ── Datos financieros reales ──────────────────────────────────────────
  const totalExpenses = expenses.reduce((acc, e) => acc + Number(e.amount), 0);

  const totalPaidByMe = expenses
    .filter((e) => e.paidById === user?.id)
    .reduce((acc, e) => acc + Number(e.amount), 0);

  const myShare = expenses.reduce((acc, e) => {
    if (e.splitType === 'PERSONAL') {
      return e.paidById === user?.id ? acc + Number(e.amount) : acc;
    }
    const mySplit = e.splits.find((s) => s.userId === user?.id);
    if (mySplit) {
      return acc + (Number(e.amount) * Number(mySplit.percentage)) / 100;
    }
    // EQUAL: divide entre los participantes del gasto
    return acc + Number(e.amount) / Math.max(1, e.splits.length || memberCount);
  }, 0);

  const netBalance = totalPaidByMe - myShare;

  // ── Distribución según tipo de grupo ──────────────────────────────────
  let userPercent: number;
  let partnerPercent: number;

  if (groupType === 'COUPLE') {
    const currentMember = group?.members.find((m) => m.user.id === user?.id);
    const partner = group?.members.find((m) => m.user.id !== user?.id);
    userPercent =
      currentMember?.splitPercentage != null
        ? Number(currentMember.splitPercentage)
        : partner?.splitPercentage != null
          ? 100 - Number(partner.splitPercentage)
          : 50;
    partnerPercent = Math.max(0, 100 - userPercent);
  } else {
    // GROUP: equitativo
    userPercent = memberCount > 0 ? 100 / memberCount : 100;
    partnerPercent = Math.max(0, 100 - userPercent);
  }

  const userAmount = Math.round((totalExpenses * userPercent) / 100);
  const partnerAmount = Math.round((totalExpenses * partnerPercent) / 100);

  const partnerLabel =
    groupType === 'COUPLE'
      ? (group?.members.find((m) => m.user.id !== user?.id)?.user.firstName ??
        'Pareja')
      : 'Grupo';

  const recentExpenses: RecentExpense[] = expenses.map((e) => {
    const payer = group?.members.find((m) => m.user.id === e.paidById)?.user;
    const meta = getCategoryMeta(e.category);
    return {
      id: e.id,
      name: e.description,
      amount: Number(e.amount),
      paidBy: payer ? `${payer.firstName} ${payer.lastName}`.trim() : 'Miembro',
      date: formatRelativeDate(e.createdAt),
      category: e.category,
      icon: meta.icon,
      iconBg: meta.color,
    };
  });

  const fmt = (value: number) =>
    `$${Math.round(value).toLocaleString('es-CL')}`;

  const handleMenuAction = (action: CoupleMenuAction) => {
    if (action === 'settings') {
      lastActionRef.current = 'settings';
      setMenuVisible(false);
    } else {
      lastActionRef.current = action;
      setMenuVisible(false);
    }
  };

  const handleMenuCloseComplete = useCallback(() => {
    const action = lastActionRef.current;
    lastActionRef.current = null;
    switch (action) {
      case 'invite':
        setInviteVisible(true);
        break;
      case 'settings':
        router.push(`/grupos/${id}/configuracion`);
        break;
      case 'export':
      case 'history':
        setShowComingSoon(true);
        break;
      case 'leave':
        setShowLeaveConfirm(true);
        break;
    }
  }, [id]);

  const handleLeaveGroup = useCallback(async () => {
    if (isLeaving) return;
    setIsLeaving(true);
    setLeaveError(null);
    try {
      await leaveGroup(id);
      setShowLeaveConfirm(false);
      setLeaveSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al salir del grupo';
      setShowLeaveConfirm(false);
      setLeaveError(message);
    } finally {
      setIsLeaving(false);
    }
  }, [id, isLeaving]);

  const handleRegenerateCode = useCallback(async () => {
    setIsRegenerating(true);
    setRegenerateError(null);
    try {
      const updated = await regenerateInviteCode(id);
      setGroup(updated);
      setInviteVisible(false);
      setRegenerateSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al regenerar el código';
      setRegenerateError(message);
    } finally {
      setIsRegenerating(false);
    }
  }, [id]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#F8FAFC]">
        <Loading message="Cargando grupo..." />
      </SafeAreaView>
    );
  }

  if (error || !group) {
    return (
      <SafeAreaView className="flex-1 bg-[#F8FAFC]">
        <View className="pt-1">
          <ScreenHeader
            title="Grupo"
            subtitle=""
            onBack={() => router.push('/(protected)/grupos')}
          />
        </View>
        <EmptyState
          title={error ?? 'Grupo no encontrado'}
          description="No se pudo cargar la información del grupo"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-28"
        showsVerticalScrollIndicator={false}
      >
        <View className="pt-1">
          <ScreenHeader
            title={group.name}
            subtitle={subtitle}
            onBack={() => router.push('/(protected)/grupos')}
            onAction={() => setMenuVisible(true)}
            actionIcon="ellipsis-vertical"
            actionColor="#64748B"
          />
        </View>

        {/* Resumen Financiero Total - Hero Card */}
        <View className="mt-4 px-5">
          <View
            className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-5"
            style={{
              shadowColor: '#0F172A',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 12,
              elevation: 2,
            }}
          >
            {/* Decorative wallet background icon */}
            <View className="absolute right-0 top-0 p-5 opacity-10">
              <FontAwesome6 name="wallet" size={80} color="#006c49" />
            </View>

            <Text className="text-[13px] font-semibold uppercase tracking-wider text-[#64748B]">
              Resumen Financiero Total
            </Text>

            <Text className="mt-1 text-[34px] font-bold tracking-tighter text-[#006c49]">
              {fmt(totalExpenses)}
            </Text>
            <Text className="mt-1 text-sm text-[#64748B]">
              {expenses.length === 0
                ? 'Sin gastos registrados este periodo'
                : 'Gasto consolidado del periodo actual'}
            </Text>

            <View className="mt-5 flex-row flex-wrap gap-3">
              <Pressable
                onPress={() => router.push(`/gastos/add?groupId=${id}`)}
                className="flex-row items-center gap-2 rounded-lg bg-[#006c49] px-4 py-3 active:opacity-80"
              >
                <FontAwesome6 name="plus" size={14} color="#FFFFFF" />
                <Text className="text-sm font-semibold text-white">
                  Registrar gasto
                </Text>
              </Pressable>

              {groupType !== 'PERSONAL' && (
                <Pressable
                  onPress={() => setInviteVisible(true)}
                  className="flex-row items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 active:bg-[#F2F4F6]"
                >
                  <FontAwesome6 name="share-nodes" size={14} color="#0F172A" />
                  <Text className="text-sm font-semibold text-[#0F172A]">
                    Invitar
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>

        {/* Settlement Status - Alert Card (solo COUPLE y GROUP) */}
        {groupType !== 'PERSONAL' && (
          <View className="mt-4 px-5">
            <View
              className="rounded-xl border border-[#E2E8F0] bg-white p-4"
              style={{
                borderLeftWidth: 4,
                borderLeftColor:
                  netBalance > 0
                    ? '#F59E0B'
                    : netBalance < 0
                      ? '#EF4444'
                      : '#10B981',
                shadowColor: '#0F172A',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 12,
                elevation: 2,
              }}
            >
              <View className="flex-row items-center justify-between">
                <View className="shrink flex-row items-center gap-3">
                  <View
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${
                      netBalance > 0
                        ? 'bg-[#F59E0B]/10'
                        : netBalance < 0
                          ? 'bg-[#EF4444]/10'
                          : 'bg-[#10B981]/10'
                    }`}
                  >
                    <FontAwesome6
                      name="hand-holding-dollar"
                      size={20}
                      color={
                        netBalance > 0
                          ? '#F59E0B'
                          : netBalance < 0
                            ? '#EF4444'
                            : '#10B981'
                      }
                    />
                  </View>
                  <View className="shrink">
                    <Text className="text-[17px] font-bold text-[#0F172A]">
                      {netBalance > 0
                        ? 'Pendiente de liquidar'
                        : netBalance < 0
                          ? 'Debes dinero'
                          : 'Saldado'}
                    </Text>
                    <Text className="text-sm text-[#64748B]">
                      {netBalance > 0
                        ? `Te deben ${fmt(netBalance)}`
                        : netBalance < 0
                          ? `Debes ${fmt(Math.abs(netBalance))}`
                          : 'No hay deudas pendientes'}
                    </Text>
                  </View>
                </View>

                <Pressable className="rounded-lg bg-[#006c49] px-3 py-2 active:opacity-80">
                  <Text className="text-xs font-semibold text-white">
                    Liquidar
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {/* Distribución de Gastos - Progress Bar Card (solo COUPLE y GROUP) */}
        {groupType !== 'PERSONAL' && (
          <View className="mt-4 px-5">
            <View
              className="rounded-xl border border-[#E2E8F0] bg-white p-5"
              style={{
                shadowColor: '#0F172A',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 12,
                elevation: 2,
              }}
            >
              <Text className="text-[13px] font-semibold uppercase tracking-wider text-[#64748B]">
                Distribución de Gastos
              </Text>

              {/* Progress Bar */}
              <View className="mt-4 h-8 flex-row overflow-hidden rounded-full bg-[#ECEEF0]">
                <View
                  className="h-full items-center justify-center bg-[#006c49]"
                  style={{ width: `${userPercent}%` }}
                >
                  <Text className="text-xs font-bold text-white">
                    {Math.round(userPercent)}%
                  </Text>
                </View>
                <View
                  className="h-full items-center justify-center bg-[#8B5CF6]"
                  style={{ width: `${partnerPercent}%` }}
                >
                  <Text className="text-xs font-bold text-white">
                    {Math.round(partnerPercent)}%
                  </Text>
                </View>
              </View>

              <View className="mt-3">
                <View className="flex-row items-center justify-between rounded-lg p-3">
                  <View className="flex-row items-center gap-2">
                    <View className="h-3 w-3 rounded-full bg-[#006c49]" />
                    <Text className="text-[#0F172A]">
                      {group?.members.find((m) => m.user.id === user?.id)?.user
                        .firstName ?? 'Tú'}
                    </Text>
                  </View>
                  <Text
                    className="font-bold text-[#006c49]"
                    style={{ fontFamily: 'monospace' }}
                  >
                    {fmt(userAmount)}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between rounded-lg p-3">
                  <View className="flex-row items-center gap-2">
                    <View className="h-3 w-3 rounded-full bg-[#8B5CF6]" />
                    <Text className="text-[#0F172A]">{partnerLabel}</Text>
                  </View>
                  <Text
                    className="font-bold text-[#8B5CF6]"
                    style={{ fontFamily: 'monospace' }}
                  >
                    {fmt(partnerAmount)}
                  </Text>
                </View>
              </View>

              <View className="mt-4 border-t border-[#E2E8F0] pt-4">
                <Pressable
                  onPress={() => router.push(`/grupos/${id}/configuracion`)}
                  className="w-full flex-row items-center justify-center gap-1"
                >
                  <Text className="text-sm font-semibold text-[#006c49]">
                    Ajustar porcentaje
                  </Text>
                  <FontAwesome6 name="gear" size={12} color="#006c49" />
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {/* Gastos Recientes - List Card */}
        <View className="mt-4 px-5">
          <RecentExpensesCard
            expenses={recentExpenses}
            onViewAll={() => router.push(`/grupos/${id}/gastos`)}
            onExpensePress={(expense) =>
              router.push(`/gastos/detalle/${expense.id}`)
            }
          />
        </View>

        {/* Mini Analytics Preview */}
        <View className="mt-4 px-5">
          <Pressable className="h-40 overflow-hidden rounded-xl">
            <View className="absolute inset-0 z-10 flex-col items-center justify-center bg-black/40">
              <FontAwesome6 name="chart-line" size={28} color="#FFFFFF" />
              <Text className="mt-1 text-base font-semibold text-white">
                Ver Analytics
              </Text>
            </View>
            {/* Placeholder gradient background */}
            <View className="h-full w-full items-center justify-center bg-[#006c49]/10">
              <FontAwesome6
                name="chart-line"
                size={40}
                color="#006c49"
                style={{ opacity: 0.3 }}
              />
            </View>
          </Pressable>
        </View>
      </ScrollView>

      <CoupleMenuSheet
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onAction={handleMenuAction}
        onCloseComplete={handleMenuCloseComplete}
        heightRatio={0.55}
        headerFinalTranslateY={0.27}
      />

      <InviteMemberSheet
        visible={inviteVisible}
        onClose={() => setInviteVisible(false)}
        invitationCode={group.inviteCode ?? ''}
        onRegenerate={handleRegenerateCode}
        isRegenerating={isRegenerating}
        heightRatio={0.65}
        headerFinalTranslateY={0.17}
      />

      <AlertModal
        visible={showComingSoon}
        type="info"
        title="Próximamente"
        message="Esta funcionalidad estará disponible en una próxima actualización. ¡Estamos trabajando en ello!"
        buttonText="Entendido"
        onClose={() => setShowComingSoon(false)}
      />

      <AlertModal
        visible={showLeaveConfirm}
        type="warning"
        title="Salir del grupo"
        message="¿Estás seguro de que quieres salir del grupo? Perderás acceso a todos los gastos y estadísticas compartidas."
        buttonText={isLeaving ? 'Saliendo...' : 'Sí, salir'}
        cancelText="Cancelar"
        onCancel={() => {
          if (!isLeaving) setShowLeaveConfirm(false);
        }}
        onClose={() => {
          if (!isLeaving) handleLeaveGroup();
        }}
      />

      <AlertModal
        visible={leaveSuccess}
        type="success"
        title="Has salido del grupo"
        message="Ya no tienes acceso a este grupo."
        buttonText="Entendido"
        onClose={() => {
          setLeaveSuccess(false);
          router.replace('/(protected)/grupos');
        }}
      />

      <AlertModal
        visible={leaveError !== null}
        type="error"
        title="Error al salir del grupo"
        message={leaveError ?? ''}
        buttonText="Cerrar"
        onClose={() => setLeaveError(null)}
      />

      <AlertModal
        visible={regenerateSuccess}
        type="success"
        title="Código regenerado"
        message="El código de invitación se ha actualizado. Ahora puedes compartir el nuevo código."
        buttonText="Entendido"
        onClose={() => setRegenerateSuccess(false)}
      />

      <AlertModal
        visible={regenerateError !== null}
        type="error"
        title="Error al regenerar"
        message={regenerateError ?? ''}
        buttonText="Cerrar"
        onClose={() => setRegenerateError(null)}
      />
    </SafeAreaView>
  );
}
