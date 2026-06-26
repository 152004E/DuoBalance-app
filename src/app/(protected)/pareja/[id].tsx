import { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { CoupleDetailHeader } from '@components/couple/couple-detail-header';
import {
  CoupleMenuSheet,
  type CoupleMenuAction,
} from '@components/couple/couple-menu-sheet';
import { AlertModal } from '@/components/ui/alert-modal';

const MOCK_EXPENSES = [
  {
    id: '1',
    name: 'Pizza Hut',
    amount: 80000,
    paidBy: 'Ana',
    date: 'Ayer',
    category: 'ALIMENTACIÓN',
    icon: 'utensils' as const,
    iconBg: '#F97316',
  },
  {
    id: '2',
    name: 'Gasolina',
    amount: 120000,
    paidBy: 'Juan',
    date: 'Hace 2 días',
    category: 'TRANSPORTE',
    icon: 'gas-pump' as const,
    iconBg: '#8B5CF6',
  },
  {
    id: '3',
    name: 'Mercado',
    amount: 350000,
    paidBy: 'Ana',
    date: 'Hace 3 días',
    category: 'HOGAR',
    icon: 'cart-shopping' as const,
    iconBg: '#3B82F6',
  },
] as const;

export default function CoupleDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showToast, setShowToast] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleCopyCode = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const handleMenuAction = (action: CoupleMenuAction) => {
    setMenuVisible(false);
    switch (action) {
      case 'invite':
        setShowInviteModal(true);
        break;
      case 'settings':
      case 'export':
      case 'history':
        setShowComingSoon(true);
        break;
      case 'leave':
        setShowLeaveConfirm(true);
        break;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-28"
        showsVerticalScrollIndicator={false}
      >
        <View className="pt-1">
          <CoupleDetailHeader
            title="Ana Juan"
            subtitle="Creada hace 3 meses"
            onBack={() => router.push('/(protected)/pareja')}
            onMenu={() => setMenuVisible(true)}
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
              $2.450.000
            </Text>
            <Text className="mt-1 text-sm text-[#64748B]">
              Gasto consolidado del periodo actual
            </Text>

            <View className="mt-5 flex-row flex-wrap gap-3">
              <Pressable className="flex-row items-center gap-2 rounded-lg bg-[#006c49] px-4 py-3 active:opacity-80">
                <FontAwesome6 name="plus" size={14} color="#FFFFFF" />
                <Text className="text-sm font-semibold text-white">
                  Registrar gasto
                </Text>
              </Pressable>

              <Pressable className="flex-row items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 active:bg-[#F2F4F6]">
                <FontAwesome6 name="share-nodes" size={14} color="#0F172A" />
                <Text className="text-sm font-semibold text-[#0F172A]">
                  Invitar
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Settlement Status - Alert Card */}
        <View className="mt-4 px-5">
          <View
            className="rounded-xl border border-[#E2E8F0] bg-white p-4"
            style={{
              borderLeftWidth: 4,
              borderLeftColor: '#F59E0B',
              shadowColor: '#0F172A',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 12,
              elevation: 2,
            }}
          >
            <View className="flex-row items-center justify-between">
              <View className="shrink flex-row items-center gap-3">
                <View className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F59E0B]/10">
                  <FontAwesome6
                    name="hand-holding-dollar"
                    size={20}
                    color="#F59E0B"
                  />
                </View>
                <View className="shrink">
                  <Text className="text-[17px] font-bold text-[#0F172A]">
                    Juan debe $150.000
                  </Text>
                  <Text className="text-sm text-[#64748B]">
                    Balance pendiente de este mes
                  </Text>
                </View>
              </View>

              <Pressable className="rounded-lg bg-[#006c49] px-3 py-2 active:opacity-80">
                <Text className="text-xs font-semibold text-white">
                  Marcar como pagado
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Distribución de Gastos - Progress Bar Card */}
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
                style={{ width: '70%' }}
              >
                <Text className="text-xs font-bold text-white">70%</Text>
              </View>
              <View
                className="h-full items-center justify-center bg-[#8B5CF6]"
                style={{ width: '30%' }}
              >
                <Text className="text-xs font-bold text-white">30%</Text>
              </View>
            </View>

            <View className="mt-3">
              <View className="flex-row items-center justify-between rounded-lg p-3">
                <View className="flex-row items-center gap-2">
                  <View className="h-3 w-3 rounded-full bg-[#006c49]" />
                  <Text className="text-[#0F172A]">Ana</Text>
                </View>
                <Text
                  className="font-bold text-[#006c49]"
                  style={{ fontFamily: 'monospace' }}
                >
                  $1.200.000
                </Text>
              </View>

              <View className="flex-row items-center justify-between rounded-lg p-3">
                <View className="flex-row items-center gap-2">
                  <View className="h-3 w-3 rounded-full bg-[#8B5CF6]" />
                  <Text className="text-[#0F172A]">Juan</Text>
                </View>
                <Text
                  className="font-bold text-[#8B5CF6]"
                  style={{ fontFamily: 'monospace' }}
                >
                  $800.000
                </Text>
              </View>
            </View>

            <View className="mt-4 border-t border-[#E2E8F0] pt-4">
              <Pressable className="w-full flex-row items-center justify-center gap-1">
                <Text className="text-sm font-semibold text-[#006c49]">
                  Ajustar porcentaje
                </Text>
                <FontAwesome6 name="gear" size={12} color="#006c49" />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Gastos Recientes - List Card */}
        <View className="mt-4 px-5">
          <View
            className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white"
            style={{
              shadowColor: '#0F172A',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 12,
              elevation: 2,
            }}
          >
            <View className="flex-row items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
              <Text className="text-[17px] font-bold text-[#0F172A]">
                Gastos Recientes
              </Text>
              <Pressable>
                <Text className="text-sm font-semibold text-[#006c49]">
                  Ver todo
                </Text>
              </Pressable>
            </View>

            {MOCK_EXPENSES.map((expense, index) => (
              <View
                key={expense.id}
                className={`flex-row items-center justify-between px-5 py-4 ${
                  index > 0 ? 'border-t border-[#E2E8F0]' : ''
                }`}
              >
                <View className="flex-row items-center gap-4">
                  <View
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${expense.iconBg}1A` }}
                  >
                    <FontAwesome6
                      name={expense.icon}
                      size={16}
                      color={expense.iconBg}
                    />
                  </View>
                  <View>
                    <Text className="font-semibold text-[#0F172A]">
                      {expense.name}
                    </Text>
                    <Text className="text-xs text-[#64748B]">
                      {expense.date} • Pagado por {expense.paidBy}
                    </Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text
                    className="font-bold text-[#0F172A]"
                    style={{ fontFamily: 'monospace' }}
                  >
                    ${expense.amount.toLocaleString('es-CL')}
                  </Text>
                  <Text className="text-[10px] uppercase tracking-tighter text-[#64748B]">
                    {expense.category}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Código de Invitación */}
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
              Código de Invitación
            </Text>

            <View className="mt-4 items-center gap-3 rounded-lg border border-dashed border-[#BBCABF] bg-[#ECEEF0] p-4">
              <Text
                className="text-2xl font-bold uppercase tracking-widest text-[#006c49]"
                style={{ fontFamily: 'monospace' }}
              >
                ABCD-EFGH
              </Text>
              <Text className="text-center text-sm text-[#64748B]">
                Comparte este código para agregar un tercer integrante o
                sincronizar dispositivos.
              </Text>

              <Pressable
                onPress={handleCopyCode}
                className="mt-2 w-full flex-row items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white py-2 active:bg-[#F2F4F6]"
              >
                <FontAwesome6 name="copy" size={14} color="#0F172A" />
                <Text className="text-sm font-semibold text-[#0F172A]">
                  Copiar código
                </Text>
              </Pressable>
            </View>
          </View>
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

        {/* Toast feedback */}
        {showToast && (
          <View className="absolute bottom-8 left-0 right-0 z-50 items-center pointer-events-none">
            <View
              className="flex-row items-center gap-2 rounded-full bg-[#2D3133] px-6 py-3"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <FontAwesome6
                name="circle-check"
                size={16}
                color="#22C55E"
              />
              <Text className="text-sm font-medium text-[#EFF1F3]">
                Copiado al portapapeles
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <CoupleMenuSheet
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onAction={handleMenuAction}
      />

      <AlertModal
        visible={showInviteModal}
        type="info"
        title="Invitar miembro"
        message="Comparte este código con tu pareja:\n\nABCD-EFGH\n\nTambién puedes copiarlo desde la tarjeta de invitación en esta pantalla."
        buttonText="Entendido"
        onClose={() => setShowInviteModal(false)}
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
        buttonText="Sí, salir"
        onClose={() => setShowLeaveConfirm(false)}
      />
    </SafeAreaView>
  );
}
