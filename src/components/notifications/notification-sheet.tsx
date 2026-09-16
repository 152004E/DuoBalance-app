import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { BottomSheetHeader } from '@/components/ui/bottom-sheet-header';
import { FontAwesome6 } from '@expo/vector-icons';
import type { SettlementDue } from '@/hooks/use-settlement-suggestions';
import type { PendingIncomingPayment } from '@/hooks/use-pending-incoming-payments';

interface NotificationSheetProps {
  visible: boolean;
  onClose: () => void;
  dues: SettlementDue[];
  incomingPayments: PendingIncomingPayment[];
}

export function NotificationSheet({
  visible,
  onClose,
  dues,
  incomingPayments,
}: NotificationSheetProps) {
  const header = (
    <BottomSheetHeader
      visible={visible}
      title="Notificaciones"
      subtitle="Tus tareas pendientes"
      onClose={onClose}
      gradientPaddingBottom={600}
      logo={require('@/assets/images/logo-white-green-bg-without.png')}
    />
  );

  const hasNotifications = dues.length > 0 || incomingPayments.length > 0;

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      header={header}
      heightRatio={0.65}
    >
      <ScrollView
        className="flex-1 px-5 pb-8 pt-2"
        showsVerticalScrollIndicator={false}
      >
        {!hasNotifications ? (
          <View className="items-center justify-center py-10">
            <FontAwesome6 name="bell-slash" size={48} color="#E2E8F0" />
            <Text className="mt-4 text-center text-base text-[#64748B]">
              No tienes notificaciones pendientes.
            </Text>
          </View>
        ) : (
          <View className="space-y-6">
            {incomingPayments.length > 0 && (
              <View>
                <Text className="mb-3 text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Pagos por confirmar
                </Text>
                <View className="space-y-3">
                  {incomingPayments.map((payment) => (
                    <TouchableOpacity
                      key={payment.id || `${payment.groupId}-${payment.fromUserId}`}
                      onPress={() => {
                        onClose();
                        router.push(`/grupos/${payment.groupId}?liquidar=1`);
                      }}
                      className="flex-row items-center gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-4 active:bg-[#F8FAFC]"
                    >
                      <View className="h-10 w-10 items-center justify-center rounded-full bg-green-100">
                        <FontAwesome6
                          name="check-to-slot"
                          size={16}
                          color="#059669"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-[#0F172A]">
                          {payment.fromFirstName} te pagó
                        </Text>
                        <Text className="text-sm text-[#64748B]">
                          En {payment.groupName}
                        </Text>
                      </View>
                      <Text className="text-base font-bold text-[#059669]">
                        ${Number(payment.amount).toLocaleString('es-CL')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {dues.length > 0 && (
              <View>
                <Text className="mb-3 text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Deudas pendientes
                </Text>
                <View className="space-y-3">
                  {dues.map((due, idx) => (
                    <TouchableOpacity
                      key={`${due.groupId}-${idx}`}
                      onPress={() => {
                        onClose();
                        router.push(`/grupos/${due.groupId}?liquidar=1`);
                      }}
                      className="flex-row items-center gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-4 active:bg-[#F8FAFC]"
                    >
                      <View className="h-10 w-10 items-center justify-center rounded-full bg-red-100">
                        <FontAwesome6
                          name="arrow-trend-down"
                          size={16}
                          color="#DC2626"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-[#0F172A]">
                          Le debes a {due.toFirstName}
                        </Text>
                        <Text className="text-sm text-[#64748B]">
                          En {due.groupName}
                        </Text>
                      </View>
                      <Text className="text-base font-bold text-[#DC2626]">
                        ${Number(due.amount).toLocaleString('es-CL')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </BottomSheet>
  );
}
