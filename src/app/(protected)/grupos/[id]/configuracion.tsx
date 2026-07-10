import { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { FontAwesome6 } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ui/screen-header';
import { DistributionBar } from '@/components/ui/distribution-bar';
import { AlertModal } from '@/components/ui/alert-modal';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { BottomSheetHeader } from '@/components/ui/bottom-sheet-header';
import { useStaggeredEntrance } from '@/hooks/use-staggered-entrance';
import { Button } from '@/components/ui/button';

const MOCK_CONFIG = {
  name: 'Ana Juan',
  createdAt: 'hace 3 meses',
  yourPercentage: 70,
  partnerPercentage: 30,
  totalSpent: 2450000,
  inviteCode: 'ABCD-EFGH',
  members: [
    { id: 'me', name: 'Andrea', email: 'andrea@duobalance.app', role: 'owner', initials: 'A' },
    { id: 'partner', name: 'Juan', email: 'juan@duobalance.app', role: 'member', initials: 'J' },
  ],
  notifications: { newExpense: true, weeklyEmail: false, settlementReminders: true },
};

export default function ConfiguracionGrupoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [focusCount, setFocusCount] = useState(0);

  const [editNameVisible, setEditNameVisible] = useState(false);
  const [editNameValue, setEditNameValue] = useState(MOCK_CONFIG.name);
  const [adjustPercentageVisible, setAdjustPercentageVisible] = useState(false);
  const [adjustYourPercentage, setAdjustYourPercentage] = useState(MOCK_CONFIG.yourPercentage);
  const [archiveVisible, setArchiveVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const notifications = {
    newExpense: MOCK_CONFIG.notifications.newExpense,
    weeklyEmail: MOCK_CONFIG.notifications.weeklyEmail,
    settlementReminders: MOCK_CONFIG.notifications.settlementReminders,
  };
  const [toggleStates, setToggleStates] = useState({
    newExpense: MOCK_CONFIG.notifications.newExpense,
    weeklyEmail: MOCK_CONFIG.notifications.weeklyEmail,
    settlementReminders: MOCK_CONFIG.notifications.settlementReminders,
  });

  const yourAmount = Math.round((MOCK_CONFIG.totalSpent * adjustYourPercentage) / 100);
  const partnerAmount = MOCK_CONFIG.totalSpent - yourAmount;

  useFocusEffect(
    useCallback(() => {
      setFocusCount(c => c + 1);
    }, [])
  );

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(MOCK_CONFIG.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveName = () => {
    setEditNameVisible(false);
    setTimeout(() => {
      setEditNameVisible(false);
    }, 100);
  };

  const handleSavePercentage = () => {
    setAdjustPercentageVisible(false);
  };

  const toggleNotification = (key: keyof typeof toggleStates) => {
    setToggleStates(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const animatedStyle = (index: number) => useStaggeredEntrance(index, { trigger: focusCount });

  return (
    <SafeAreaView className="relative flex-1 bg-[#F8FAFC]" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-24"
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="Configuración del grupo"
          subtitle="Personaliza cómo funciona tu grupo"
          onBack={() => router.back()}
        />

        <View className="px-5 pt-2">
          {/* Info del grupo */}
          <Animated.View style={animatedStyle(0)}>
            <View
              className="rounded-2xl border border-[#E2E8F0] bg-white p-5"
              style={{
                shadowColor: '#0F172A',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 12,
                elevation: 2,
              }}
            >
              <Text className="text-[13px] font-semibold uppercase tracking-wider text-[#64748B]">
                Información del grupo
              </Text>

              <View className="mt-4 space-y-4">
                <Pressable className="flex-row items-center justify-between" style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}>
                  <View className="flex-1">
                    <Text className="text-sm text-[#64748B]">Nombre del grupo</Text>
                    <Text className="mt-1 text-base font-semibold text-[#0F172A]">{MOCK_CONFIG.name}</Text>
                  </View>
                  <FontAwesome6 name="pen-to-square" size={18} color="#64748B" />
                </Pressable>

                <View className="flex-row items-center justify-between border-t border-[#E2E8F0] pt-4">
                  <View>
                    <Text className="text-sm text-[#64748B]">Creada</Text>
                    <Text className="mt-1 text-base font-medium text-[#64748B]">{MOCK_CONFIG.createdAt}</Text>
                  </View>
                </View>

                <View className="mt-4 flex-row items-center justify-center gap-3">
                  <View className="relative">
                    <View className="h-12 w-12 rounded-full border-2 border-white bg-[#E2E8F0] overflow-hidden">
                      <Text className="text-xl font-bold text-[#64748B] text-center leading-[48px]">A</Text>
                    </View>
                  </View>
                  <View className="relative -ml-4">
                    <View className="h-12 w-12 rounded-full border-2 border-white bg-[#E2E8F0] overflow-hidden">
                      <Text className="text-xl font-bold text-[#64748B] text-center leading-[48px]">J</Text>
                    </View>
                  </View>
                  <Pressable className="ml-2 h-8 w-8 items-center justify-center rounded-full bg-[#10B981]">
                    <FontAwesome6 name="camera" size={14} color="#FFFFFF" />
                  </Pressable>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Distribución */}
          <Animated.View style={animatedStyle(1)}>
            <View
              className="mt-4 rounded-2xl border border-[#E2E8F0] bg-white p-5"
              style={{
                shadowColor: '#0F172A',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 12,
                elevation: 2,
              }}
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-[13px] font-semibold uppercase tracking-wider text-[#64748B]">
                  Distribución de gastos
                </Text>
              </View>
              <Text className="mt-1 text-sm text-[#64748B]">
                Define cómo se reparten los gastos del grupo
              </Text>

              <View className="mt-4">
                <DistributionBar
                  yourPercentage={adjustYourPercentage}
                  partnerPercentage={100 - adjustYourPercentage}
                />
              </View>

              <View className="mt-4 space-y-3">
                <View className="flex-row items-center justify-between rounded-lg p-3">
                  <View className="flex-row items-center gap-2">
                    <View className="h-3 w-3 rounded-full bg-[#10B981]" />
                    <Text className="text-[#0F172A]">Tú</Text>
                  </View>
                  <View className="items-end">
                    <Text className="font-bold text-[#10B981]" style={{ fontFamily: 'monospace' }}>
                      {adjustYourPercentage}%
                    </Text>
                    <Text className="font-bold text-[#0F172A]" style={{ fontFamily: 'monospace' }}>
                      ${yourAmount.toLocaleString('es-CL')}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center justify-between rounded-lg p-3">
                  <View className="flex-row items-center gap-2">
                    <View className="h-3 w-3 rounded-full bg-[#8B5CF6]" />
                    <Text className="text-[#0F172A]">Tu grupo</Text>
                  </View>
                  <View className="items-end">
                    <Text className="font-bold text-[#8B5CF6]" style={{ fontFamily: 'monospace' }}>
                      {100 - adjustYourPercentage}%
                    </Text>
                    <Text className="font-bold text-[#0F172A]" style={{ fontFamily: 'monospace' }}>
                      ${partnerAmount.toLocaleString('es-CL')}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="mt-4 border-t border-[#E2E8F0] pt-4">
                <Pressable
                  onPress={() => setAdjustPercentageVisible(true)}
                  className="w-full flex-row items-center justify-center gap-1 active:opacity-80"
                >
                  <Text className="text-sm font-semibold text-[#006c49]">
                    Ajustar porcentaje
                  </Text>
                  <FontAwesome6 name="gear" size={12} color="#006c49" />
                </Pressable>
              </View>
            </View>
          </Animated.View>

          {/* Miembros */}
          <Animated.View style={animatedStyle(2)}>
            <View className="mt-4 flex-row items-center justify-between px-1">
              <Text className="text-[13px] font-semibold uppercase tracking-wider text-[#64748B]">
                Miembros
              </Text>
              <View className="bg-[#10B981]/10 text-[#10B981] text-[10px] font-bold px-2.5 py-1 rounded-full">
                {MOCK_CONFIG.members.length}
              </View>
            </View>

            <View
              className="mt-2 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white"
              style={{
                shadowColor: '#0F172A',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 12,
                elevation: 2,
              }}
            >
              {MOCK_CONFIG.members.map((member, index) => (
                <Pressable
                  key={member.id}
                  className={`flex-row items-center justify-between px-5 py-4 ${index > 0 ? 'border-t border-[#E2E8F0]' : ''
                    } active:bg-[#F8FAFC]`}
                >
                  <View className="flex-row items-center gap-4">
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-[#E2E8F0]">
                      <Text className="text-base font-bold text-[#64748B]">{member.initials}</Text>
                    </View>
                    <View>
                      <View className="rounded-full bg-[#10B981]/10 px-2.5 py-1">
  <Text className="text-[10px] font-bold text-[#10B981]">
    {MOCK_CONFIG.members.length}
  </Text>
</View>
                      <Text className="text-xs text-[#94A3B8]">{member.email}</Text>
                    </View>
                  </View>
                  {member.role !== 'owner' && (
                    <Pressable className="flex-row items-center justify-between" style={({ pressed }) => [
                      {
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}>
                      <FontAwesome6 name="ellipsis-vertical" size={18} color="#64748B" />
                    </Pressable>
                  )}
                </Pressable>
              ))}

              <Pressable className="w-full flex-row items-center justify-center gap-2 border-t border-dashed border-[#E2E8F0] px-5 py-4 active:opacity-80">
                <FontAwesome6 name="user-plus" size={16} color="#10B981" />
                <Text className="text-sm font-semibold text-[#10B981]">Invitar nuevo miembro</Text>
              </Pressable>
            </View>
          </Animated.View>

          {/* Código invitación */}
          <Animated.View style={animatedStyle(3)}>
            <View className="mt-4 flex-row items-center justify-between px-1">
              <Text className="text-[13px] font-semibold uppercase tracking-wider text-[#64748B]">
                Código invitación
              </Text>
            </View>

            <View
              className="mt-2 rounded-2xl border border-[#E2E8F0] bg-white p-5"
              style={{
                shadowColor: '#0F172A',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 12,
                elevation: 2,
              }}
            >
              <Text className="text-sm text-[#64748B] text-center mb-2">
                Comparte este código para que otros se unan
              </Text>

              <View className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-3">
                <Text className="text-2xl font-bold tracking-[0.3em] text-[#10B981] text-center">
                  {MOCK_CONFIG.inviteCode}
                </Text>
              </View>

              <Pressable
                onPress={handleCopyCode}
                className="mt-3 w-full flex-row items-center justify-center gap-2 rounded-xl bg-[#10B981] py-4 active:opacity-80"
              >
                <FontAwesome6 name={copied ? 'circle-check' : 'copy'} size={16} color="#FFFFFF" />
                <Text className="text-base font-semibold text-white">
                  {copied ? '¡Copiado!' : 'Copiar código'}
                </Text>
              </Pressable>

              <View className="mt-3 flex-row items-center justify-center">
                <Pressable className="flex-row items-center gap-1 active:opacity-80">
                  <FontAwesome6 name="qrcode" size={16} color="#006c49" />
                  <Text className="text-sm font-semibold text-[#006c49]">Ver código QR</Text>
                </Pressable>
              </View>
            </View>
          </Animated.View>

          {/* Notificaciones */}
          <Animated.View style={animatedStyle(4)}>
            <View className="mt-4 flex-row items-center justify-between px-1">
              <Text className="text-[13px] font-semibold uppercase tracking-wider text-[#64748B]">
                Notificaciones
              </Text>
            </View>

            <View
              className="mt-2 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white"
              style={{
                shadowColor: '#0F172A',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 12,
                elevation: 2,
              }}
            >
              {[
                { key: 'newExpense', title: 'Notificar nuevos gastos', desc: 'Push y alertas en tiempo real', value: toggleStates.newExpense },
                { key: 'weeklyEmail', title: 'Resumen semanal email', desc: 'Informe detallado los lunes', value: toggleStates.weeklyEmail },
                { key: 'settlementReminders', title: 'Recordatorios liquidación', desc: 'Aviso de cierre de mes', value: toggleStates.settlementReminders },
              ].map((item, index) => (
                <Pressable
                  key={item.key}
                  onPress={() => toggleNotification(item.key as keyof typeof toggleStates)}
                  className={`flex-row items-center justify-between px-5 py-4 ${index > 0 ? 'border-t border-[#E2E8F0]' : ''} active:bg-[#F8FAFC]`}
                >
                  <View>
                    <Text className="text-base font-semibold text-[#0F172A]">{item.title}</Text>
                    <Text className="text-sm text-[#64748B]">{item.desc}</Text>
                  </View>
                  <Animated.View
                    style={[
                      {
                        width: 44,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: item.value ? '#10B981' : '#E2E8F0',
                      },
                    ]}
                  >
                    <Animated.View
                      style={[
                        {
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          backgroundColor: '#FFFFFF',
                          transform: [{ translateX: item.value ? 20 : 0 }],
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.1,
                          shadowRadius: 2,
                          elevation: 2,
                        },
                      ]}
                    />
                  </Animated.View>
                </Pressable>
              ))}
            </View>
          </Animated.View>

          {/* Zona peligrosa */}
          <Animated.View style={animatedStyle(5)}>
            <View className="mt-4 flex-row items-center justify-between px-1">
              <Text className="text-[13px] font-semibold uppercase tracking-wider text-[#64748B]">
                Zona peligrosa
              </Text>
            </View>

            <View
              className="mt-2 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white"
              style={{
                borderLeftWidth: 4,
                borderLeftColor: '#EF4444',
                shadowColor: '#0F172A',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 12,
                elevation: 2,
              }}
            >
              <Pressable
                onPress={() => setArchiveVisible(true)}
                className="w-full flex-row items-center gap-3 px-5 py-4 active:bg-[#F8FAFC]"
              >
                <FontAwesome6 name="box-archive" size={20} color="#64748B" />
                <Text className="text-base font-semibold text-[#0F172A]">Archivar grupo</Text>
              </Pressable>

              <View className="border-t border-[#E2E8F0]" />

              <Pressable
                onPress={() => setDeleteVisible(true)}
                className="w-full flex-row items-center gap-3 px-5 py-4 active:bg-[#FEF2F2]"
              >
                <FontAwesome6 name="trash" size={20} color="#EF4444" />
                <Text className="text-base font-semibold text-[#EF4444]">Eliminar grupo</Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Modals */}
      <AlertModal
        visible={archiveVisible}
        type="warning"
        title="¿Archivar grupo?"
        message="Podrás restaurarlo más tarde desde ajustes."
        buttonText="Archivar"
        onClose={() => setArchiveVisible(false)}
      />

      <AlertModal
        visible={deleteVisible}
        type="warning"
        title="Eliminar grupo"
        message="Esta acción no se puede deshacer. Se eliminarán todos los gastos, liquidaciones e historial del grupo."
        buttonText="Eliminar definitivamente"
        onClose={() => setDeleteVisible(false)}
      />

      {/* Bottom Sheet: Editar nombre */}
      <BottomSheet
        visible={editNameVisible}
        onClose={() => setEditNameVisible(false)}
        header={
          <BottomSheetHeader
            visible={editNameVisible}
            title="Editar nombre del grupo"
            subtitle="Este nombre será visible para ambos"
            onClose={() => setEditNameVisible(false)}
          />
        }
        heightRatio={0.4}
        headerFinalTranslateY={0.15}
      >
        <View className="flex-1 px-5 pt-4">
          <TextInput
            className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-3.5 text-base text-[#0F172A] shadow-sm"
            placeholder="Nombre del grupo"
            placeholderTextColor="#94A3B8"
            value={editNameValue}
            onChangeText={setEditNameValue}
            autoFocus
          />
          <View className="mt-4">
            <Button
              text="Guardar cambios"
              iconRight="check"
              onPress={handleSaveName}
              className="rounded-full py-4"
            />
          </View>
        </View>
      </BottomSheet>

      {/* Bottom Sheet: Ajustar porcentaje */}
      <BottomSheet
        visible={adjustPercentageVisible}
        onClose={() => setAdjustPercentageVisible(false)}
        header={
          <BottomSheetHeader
            visible={adjustPercentageVisible}
            title="Ajustar porcentaje"
            subtitle="Define cómo se reparten los gastos"
            onClose={() => setAdjustPercentageVisible(false)}
          />
        }
        heightRatio={0.7}
        headerFinalTranslateY={0.17}
      >
        <View className="flex-1 px-5 pt-4">
          <View className="flex-row gap-3">
            <View className="flex-1 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <View className="mb-3 flex-row items-center gap-2">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-[#10B981]/10">
                  <FontAwesome6 name="user" size={14} color="#10B981" />
                </View>
                <Text className="text-sm font-medium text-[#0F172A]">Tú</Text>
              </View>
              <Text className="text-2xl font-extrabold text-[#10B981]">{adjustYourPercentage}%</Text>
            </View>

            <View className="flex-1 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <View className="mb-3 flex-row items-center gap-2">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-[#0F766E]/10">
                  <FontAwesome6 name="user-group" size={14} color="#0F766E" />
                </View>
                <Text className="text-sm font-medium text-[#0F172A]">Tu grupo</Text>
              </View>
              <Text className="text-2xl font-extrabold text-[#0F766E]">{100 - adjustYourPercentage}%</Text>
            </View>
          </View>

          <View className="mt-6">
            <View className="mt-1 flex-row items-center justify-center gap-4">
              <Pressable
                onPress={() => setAdjustYourPercentage(Math.max(0, adjustYourPercentage - 5))}
                className="h-12 w-12 items-center justify-center rounded-full bg-[#10B981]"
                style={{
                  shadowColor: '#10B981',
                  shadowOpacity: 0.25,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <Text className="text-xl font-bold text-white">−</Text>
              </Pressable>

              <Text className="text-3xl font-extrabold text-[#10B981]">{adjustYourPercentage}%</Text>

              <Pressable
                onPress={() => setAdjustYourPercentage(Math.min(100, adjustYourPercentage + 5))}
                className="h-12 w-12 items-center justify-center rounded-full bg-[#10B981]"
                style={{
                  shadowColor: '#10B981',
                  shadowOpacity: 0.25,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <Text className="text-xl font-bold text-white">+</Text>
              </Pressable>
            </View>
          </View>

          <View className="mt-5">
            <DistributionBar
              yourPercentage={adjustYourPercentage}
              partnerPercentage={100 - adjustYourPercentage}
            />
          </View>

          <View className="mt-6">
            <Button
              text="Guardar cambios"
              iconRight="check"
              onPress={handleSavePercentage}
              className="rounded-full py-4"
            />
          </View>
        </View>
      </BottomSheet>

      {/*
      <BottomSheet
        visible={adjustPercentageVisible}
        onClose={() => setAdjustPercentageVisible(false)}
        header={
          <BottomSheetHeader
            visible={adjustPercentageVisible}
            title="Ajustar porcentaje"
            subtitle="Define cómo se reparten los gastos"
            onClose={() => setAdjustPercentageVisible(false)}
          />
        }
        heightRatio={0.7}
        headerFinalTranslateY={0.17}
      >
        <View className="flex-1 px-5 pt-4">
          <View className="flex-row gap-3">
            <View className="flex-1 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <View className="mb-3 flex-row items-center gap-2">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-[#10B981]/10">
                  <FontAwesome6 name="user" size={14} color="#10B981" />
                </View>
                <Text className="text-sm font-medium text-[#0F172A]">Tú</Text>
              </View>
              <Text className="text-2xl font-extrabold text-[#10B981]">{adjustYourPercentage}%</Text>
            </View>

            <View className="flex-1 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <View className="mb-3 flex-row items-center gap-2">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-[#0F766E]/10">
                  <FontAwesome6 name="user-group" size={14} color="#0F766E" />
                </View>
                <Text className="text-sm font-medium text-[#0F172A]">Tu grupo</Text>
              </View>
              <Text className="text-2xl font-extrabold text-[#0F766E]">{100 - adjustYourPercentage}%</Text>
            </View>
          </View>

          <View className="mt-6">
            <View className="mt-1 flex-row items-center justify-center gap-4">
              <Pressable
                onPress={() => setAdjustYourPercentage(Math.max(0, adjustYourPercentage - 5))}
                className="h-12 w-12 items-center justify-center rounded-full bg-[#10B981]"
                style={{
                  shadowColor: '#10B981',
                  shadowOpacity: 0.25,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <Text className="text-xl font-bold text-white">−</Text>
              </Pressable>

              <Text className="text-3xl font-extrabold text-[#10B981]">{adjustYourPercentage}%</Text>

              <Pressable
                onPress={() => setAdjustYourPercentage(Math.min(100, adjustYourPercentage + 5))}
                className="h-12 w-12 items-center justify-center rounded-full bg-[#10B981]"
                style={{
                  shadowColor: '#10B981',
                  shadowOpacity: 0.25,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <Text className="text-xl font-bold text-white">+</Text>
              </Pressable>
            </View>
          </View>

          <View className="mt-5">
            <DistributionBar
              yourPercentage={adjustYourPercentage}
              partnerPercentage={100 - adjustYourPercentage}
            />
          </View>

          <View className="mt-6">
            <Button
              text="Guardar cambios"
              iconRight="check"
              onPress={handleSavePercentage}
              className="rounded-full py-4"
            />
          </View>
        </View>
      </BottomSheet>
      */}
    </SafeAreaView>
  );
}