import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import type { GroupResponse } from '@/types/api';
import { Button } from './button';
import { AlertModal } from './alert-modal';

interface GroupSummary {
  count: number;
  total: number;
}

interface SplitSegment {
  label: string;
  percent: number;
  color: string;
}

interface GroupCardProps {
  group: GroupResponse;
  summary?: GroupSummary;
  showMenu?: boolean;
  onPress?: () => void;
  onMenu?: () => void;
  currentUserId?: string;
}

export function GroupCard({
  group,
  summary,
  showMenu = false,
  onPress,
  onMenu,
  currentUserId,
}: GroupCardProps) {
  const [showAddAlert, setShowAddAlert] = useState(false);

  const total = summary?.total ?? 0;
  const transactionCount = summary?.count ?? 0;
  const membersCount = group.members.length;
  const isCouple = group.type === 'COUPLE';
  const isPersonal = group.type === 'PERSONAL';

  // ── Lógica de reparto según tipo de grupo ─────────────────────────────
  let segments: SplitSegment[] = [];
  const plural = transactionCount === 1 ? 'transacción' : 'transacciones';

  if (isPersonal) {
    // Sin división: 100% tú
    segments = [{ label: 'Tú', percent: 100, color: '#10B981' }];
  } else if (isCouple) {
    const currentMember = group.members.find(
      (m) => m.user.id === currentUserId,
    );
    const partner = group.members.find((m) => m.user.id !== currentUserId);

    // Porcentaje real desde la BD (si falta, default 50/50)
    const userPercent =
      currentMember?.splitPercentage != null
        ? Number(currentMember.splitPercentage)
        : partner?.splitPercentage != null
          ? 100 - Number(partner.splitPercentage)
          : 50;
    const partnerPercent = Math.max(0, 100 - userPercent);

    segments = [
      {
        label: currentMember?.user.firstName ?? 'Tú',
        percent: userPercent,
        color: '#006c49',
      },
      {
        label: partner?.user.firstName ?? 'Pareja',
        percent: partnerPercent,
        color: '#8B5CF6',
      },
    ];
  } else {
    // Grupo: equitativo, todos pagan lo mismo
    const perMember = membersCount > 0 ? 100 / membersCount : 100;
    const currentMember = group.members.find(
      (m) => m.user.id === currentUserId,
    );
    const othersCount = Math.max(0, membersCount - 1);

    segments = [
      {
        label: currentMember?.user.firstName ?? 'Tú',
        percent: perMember,
        color: '#006c49',
      },
      ...(othersCount > 0
        ? [
            {
              label: `Grupo (${othersCount})`,
              percent: perMember * othersCount,
              color: '#8B5CF6',
            },
          ]
        : []),
    ];
  }

  const fmt = (value: number) =>
    `$${Math.round(value).toLocaleString('es-CL')}`;

  return (
    <Pressable
      onPress={onPress}
      className="w-full overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm active:opacity-80"
      style={{
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
      }}
    >
      <View className="p-5">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="flex h-12 w-12 items-center justify-center rounded-full bg-[#10B981]/10">
              <FontAwesome6 name="heart" size={18} color="#10B981" solid />
            </View>
            <View>
              <Text className="text-lg font-bold text-[#0F172A]">
                {group.name.length > 15
                  ? group.name.slice(0, 15) + '...'
                  : group.name}
              </Text>
              <Text className="text-sm text-[#64748B]">
                {transactionCount} {plural} este mes
              </Text>
            </View>
          </View>

          <View className="items-end">
            <Text
              className="text-lg font-bold text-[#006c49]"
              style={{ fontFamily: 'JetBrains Mono' }}
            >
              {fmt(total)}
            </Text>
            <Text className="text-xs text-[#64748B]">Total</Text>
          </View>
        </View>

        {!isPersonal && (
          <View className="mt-4">
            <View className="h-3 flex-row overflow-hidden rounded-full bg-[#ECEEF0]">
              {segments.map((seg) => (
                <View
                  key={seg.label}
                  className={
                    seg.percent >= 100 ? 'h-full rounded-full' : 'h-full'
                  }
                  style={{
                    width: `${seg.percent}%`,
                    backgroundColor: seg.color,
                  }}
                />
              ))}
            </View>
            <View className="mt-2 flex-row flex-wrap justify-between gap-y-1">
              {segments.map((seg) => (
                <View key={seg.label} className="flex-row items-center gap-1.5">
                  <View
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: seg.color }}
                  />
                  <Text className="text-xs text-[#64748B]">
                    {seg.label}: {fmt((total * seg.percent) / 100)} (
                    {Math.round(seg.percent)}%)
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {isPersonal && (
          <View className="mt-4 flex-row items-center justify-between rounded-lg bg-[#F8FAFC] px-3 py-2.5">
            <View className="flex-row items-center gap-1.5">
              <View className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
              <Text className="text-xs text-[#64748B]">
                Tú · 100% (gastos personales)
              </Text>
            </View>
            <Text className="text-xs font-semibold text-[#10B981]">
              {fmt(total)}
            </Text>
          </View>
        )}
      </View>

      {showMenu && onMenu && (
        <View className="flex-row items-center justify-between border-t border-[#E2E8F0] px-5 py-3">
          <Pressable onPress={(e) => e.stopPropagation()}>
            <Button
              text="Agregar gasto"
              iconLeft="money-bill"
              style={{ paddingVertical: 8, paddingHorizontal: 28 }}
              onPress={() => setShowAddAlert(true)}
            />
          </Pressable>

          <Pressable
            onPress={onMenu}
            className="h-10 w-10 items-center justify-center"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <FontAwesome6 name="ellipsis-vertical" size={18} color="#64748B" />
          </Pressable>
        </View>
      )}

      <AlertModal
        visible={showAddAlert}
        type="info"
        title="Función no disponible"
        message="Próximamente podrás agregar gastos desde aquí."
        onClose={() => setShowAddAlert(false)}
      />
    </Pressable>
  );
}
