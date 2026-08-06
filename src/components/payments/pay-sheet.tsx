import { useState, useEffect, useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { BottomSheetHeader } from '@/components/ui/bottom-sheet-header';
import { formatAmountInput, parseAmount } from '@/utils/format';
import type { GroupResponse, GroupMember } from '@/types/api';

const formatted = (value: number) =>
  `$${Math.round(value).toLocaleString('es-CL')}`;

interface PaySheetProps {
  visible: boolean;
  onClose: () => void;
  group: GroupResponse;
  currentUserId: string;
  amountDue: number;
  creditorId: string;
  isSubmitting?: boolean;
  onSubmit?: (payload: { amount: number; toUserId: string }) => void;
  heightRatio?: number;
  headerFinalTranslateY?: number;
}

export function PaySheet({
  // eslint-disable-next-line react/no-impure-functions-during-render
  visible,
  onClose,
  group,
  currentUserId,
  amountDue,
  creditorId,
  isSubmitting = false,
  onSubmit,
  heightRatio = 0.55,
  headerFinalTranslateY = 0.27,
}: PaySheetProps) {
  const [amount, setAmount] = useState('');
  const [toUserId, setToUserId] = useState(creditorId);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (visible) {
      setResetKey((prev) => prev + 1);
    }
  }, [visible]);
  // automático. En grupos de 3+ se deja que el usuario elija a quién paga.
  const isCouple = group.type === 'COUPLE' || group.members.length === 2;

  const otherMembers: GroupMember[] = useMemo(
    () => group.members.filter((m) => m.user.id !== currentUserId),
    [group.members, currentUserId],
  );

  const allowed = useMemo(
    () =>
      isCouple
        ? otherMembers.filter((m) => m.user.id === creditorId)
        : otherMembers,
    [isCouple, otherMembers, creditorId],
  );

  useEffect(() => {
    if (visible) {
      // IMPORTANTE: usar user.id (no member.id) — el backend valida contra la tabla User
      setToUserId(allowed[0]?.user.id ?? creditorId);
      setAmount('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey, creditorId, amountDue, allowed]);

  const recipient = group.members.find((m) => m.user.id === toUserId);

  const isFormValid =
    toUserId.length > 0 &&
    parseAmount(amount) > 0 &&
    parseAmount(amount) <= amountDue;

  const header = (
    <BottomSheetHeader
      visible={visible}
      title="Registrar pago"
      subtitle={`Liquida lo que debes en ${group.name}`}
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
        <View className="flex-1 px-5">
          {/* Resumen de la deuda */}
          <View className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <Text className="text-sm text-[#64748B]">Debes en total</Text>
            <Text className="mt-1 text-2xl font-bold text-[#0F172A]">
              {formatted(amountDue)}
            </Text>
          </View>

          <View className="mt-4">
            <Input
              label="Monto a pagar"
              iconLeft="dollar-sign"
              placeholder="$ 0"
              value={amount}
              onChangeText={(t) => setAmount(formatAmountInput(t))}
              keyboardType="number-pad"
              helperText="Puedes pagar en partes (cuotas). El monto pendiente se reduce con cada pago confirmado."
            />
          </View>

          {/* A quién le pagas */}
          {!isCouple && (
            <>
              <Text className="mb-2 mt-5 text-sm font-semibold text-[#0F172A]">
                ¿A quién le pagas?
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {allowed.map((member) => {
                  const isActive = toUserId === member.user.id;
                  return (
                    <Pressable
                      key={member.user.id}
                      onPress={() =>
                        setToUserId(isActive ? '' : member.user.id)
                      }
                      className={`flex-row items-center gap-2 rounded-full px-4 py-2.5 ${
                        isActive
                          ? 'bg-[#10B981]'
                          : 'border border-[#E2E8F0] bg-white'
                      }`}
                    >
                      <FontAwesome6
                        name="user"
                        size={12}
                        color={isActive ? 'white' : '#64748B'}
                      />
                      <Text
                        className={`text-sm font-medium ${
                          isActive ? 'text-white' : 'text-[#0F172A]'
                        }`}
                      >
                        {member.user.firstName}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}

          {isCouple && recipient && (
            <View className="mt-5 flex-row items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3">
              <View className="flex h-10 w-10 items-center justify-center rounded-full bg-[#006c49]/10">
                <FontAwesome6 name="user" size={16} color="#006c49" />
              </View>
              <View>
                <Text className="text-xs text-[#64748B]">Se pagará a</Text>
                <Text className="text-sm font-semibold text-[#0F172A]">
                  {recipient.user.firstName} {recipient.user.lastName}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View className="border-t border-[#E2E8F0] px-5 pb-2 pt-4">
          <Button
            text="Confirmar pago"
            iconRight="check"
            isLoading={isSubmitting}
            loadingText="Registrando..."
            onPress={() => {
              console.log('[pay-sheet] Botón Confirmar pago presionado');
              console.log('[pay-sheet]   amount(display):', amount);
              console.log('[pay-sheet]   amount(parse):', parseAmount(amount));
              console.log('[pay-sheet]   toUserId:', toUserId);
              console.log('[pay-sheet]   isFormValid:', isFormValid);
              if (onSubmit) {
                onSubmit({ amount: parseAmount(amount), toUserId });
              }
            }}
            disabled={!isFormValid}
            className="rounded-full py-4"
          />
        </View>
      </View>
    </BottomSheet>
  );
}
