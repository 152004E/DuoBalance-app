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
  inAppNotifications?: Array<{
    id: string;
    title: string;
    body: string;
    isRead: boolean;
    url?: string;
  }>;
  pendingExpenses?: any[];
  onApproveExpense?: (id: string) => Promise<void>;
  onRejectExpense?: (id: string) => Promise<void>;
  markAsRead?: (id: string) => void;
}

export function NotificationSheet({
  visible,
  onClose,
  dues,
  incomingPayments,
  inAppNotifications = [],
  pendingExpenses = [],
  onApproveExpense,
  onRejectExpense,
  markAsRead,
}: NotificationSheetProps) {
  const header = (
    <BottomSheetHeader
      visible={visible}
      title="Notificaciones"
      subtitle="Tus tareas pendientes"
      onClose={onClose}
      logo={require('@/assets/images/logo-white-green-bg-without.png')}
    />
  );

  const hasNotifications = dues.length > 0 || incomingPayments.length > 0 || inAppNotifications.length > 0 || pendingExpenses.length > 0;

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      header={header}
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
            {pendingExpenses.length > 0 && (
              <View>
                <Text className="mb-3 text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Gastos por confirmar
                </Text>
                <View className="space-y-3">
                  {pendingExpenses.map((expense) => (
                    <View
                      key={expense.id}
                      className="flex-col gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-4"
                    >
                      <View className="flex-row items-center gap-4">
                        <View className="h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                          <FontAwesome6
                            name="receipt"
                            size={16}
                            color="#F97316"
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="text-base font-semibold text-[#0F172A]">
                            Alguien dice que pagaste
                          </Text>
                          <Text className="text-sm text-[#64748B]">
                            {expense.description}
                          </Text>
                        </View>
                        <Text className="text-base font-bold text-[#F97316]">
                          ${Number(expense.amount).toLocaleString('es-CL')}
                        </Text>
                      </View>
                      
                      <View className="flex-row gap-2 mt-1">
                        <TouchableOpacity
                          onPress={() => onRejectExpense?.(expense.id)}
                          className="flex-1 rounded-xl border border-red-200 bg-red-50 py-2.5"
                        >
                          <Text className="text-center font-bold text-red-600">Rechazar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => onApproveExpense?.(expense.id)}
                          className="flex-1 rounded-xl bg-[#059669] py-2.5"
                        >
                          <Text className="text-center font-bold text-white">Aceptar</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {incomingPayments.length > 0 && (
              <View>
                <Text className="mb-3 text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Pagos por confirmar
                </Text>
                <View className="space-y-3">
                  {incomingPayments.map((payment) => (
                    <TouchableOpacity
                      key={(payment as any).id || `${payment.groupId}-${payment.fromUserId}`}
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

            {inAppNotifications.length > 0 && (
              <View>
                <Text className="mb-3 text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Actividad Reciente
                </Text>
                <View className="space-y-3">
                  {inAppNotifications.map((notif) => (
                    <TouchableOpacity
                      key={notif.id}
                      onPress={() => {
                        if (!notif.isRead && markAsRead) {
                          markAsRead(notif.id);
                        }
                        onClose();
                        if (notif.url) {
                          router.push(notif.url as any);
                        }
                      }}
                      className={`flex-row items-center gap-4 rounded-2xl border p-4 active:bg-[#F8FAFC] ${
                        notif.isRead ? 'border-[#E2E8F0] bg-white opacity-80' : 'border-[#059669]/20 bg-[#F0FDF4]'
                      }`}
                    >
                      <View className={`h-10 w-10 items-center justify-center rounded-full ${notif.isRead ? 'bg-gray-100' : 'bg-green-100'}`}>
                        <FontAwesome6
                          name="bell"
                          size={16}
                          color={notif.isRead ? '#64748B' : '#059669'}
                        />
                      </View>
                      <View className="flex-1">
                        <Text className={`text-base ${notif.isRead ? 'font-medium text-[#475569]' : 'font-bold text-[#0F172A]'}`}>
                          {notif.title}
                        </Text>
                        <Text className="text-sm text-[#64748B]">
                          {notif.body}
                        </Text>
                      </View>
                      {!notif.isRead && (
                        <View className="h-2 w-2 rounded-full bg-red-500" />
                      )}
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
