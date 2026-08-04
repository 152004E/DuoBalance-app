import { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { FontAwesome6 } from '@expo/vector-icons';
import { Input } from '@/components/ui/input';
import { ScreenHeader } from '@/components/ui/screen-header';
import { DistributionBar } from '@/components/ui/distribution-bar';
import { AlertModal } from '@/components/ui/alert-modal';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { BottomSheetHeader } from '@/components/ui/bottom-sheet-header';
import { useStaggeredEntrance } from '@/hooks/use-staggered-entrance';
import { Loading } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import {
  getGroup,
  updateGroup,
  deleteGroup,
  archiveGroup,
  updateMemberSplit,
  regenerateInviteCode,
} from '@/services/api/groups';
import { InviteMemberSheet } from '@/components/couple/invite-member-sheet';
import type { GroupResponse, GroupMember } from '@/types/api';

export default function ConfiguracionGrupoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [focusCount, setFocusCount] = useState(0);
  const [group, setGroup] = useState<GroupResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [editNameVisible, setEditNameVisible] = useState(false);
  const [editNameValue, setEditNameValue] = useState('');
  const [editNameLoading, setEditNameLoading] = useState(false);
  const [adjustPercentageVisible, setAdjustPercentageVisible] = useState(false);
  const [adjustYourPercentage, setAdjustYourPercentage] = useState(50);
  const [archiveVisible, setArchiveVisible] = useState(false);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [inviteVisible, setInviteVisible] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const [toggleStates, setToggleStates] = useState({
    newExpense: true,
    weeklyEmail: false,
    settlementReminders: true,
  });

  // Staggered entrance animations - MUST be at top level
  const style0 = useStaggeredEntrance(0, { trigger: focusCount });
  const style1 = useStaggeredEntrance(1, { trigger: focusCount });
  const style2 = useStaggeredEntrance(2, { trigger: focusCount });
  const style3 = useStaggeredEntrance(3, { trigger: focusCount });
  const style4 = useStaggeredEntrance(4, { trigger: focusCount });
  const style5 = useStaggeredEntrance(5, { trigger: focusCount });

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    getGroup(id)
      .then((data) => {
        if (mounted) {
          setGroup(data);
          setEditNameValue(data.name);
          const mySplit = data.members[0]?.splitPercentage;
          if (mySplit != null) {
            setAdjustYourPercentage(Number(mySplit));
          }
        }
      })
      .catch(() => {
        if (mounted) router.back();
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  const currentMember = group?.members.find(
    (m) => m.role === 'OWNER' || m.role === 'ADMIN',
  );
  const myMembership = group?.members[0];
  const yourPercentage = adjustYourPercentage;
  const partnerPercentage = 100 - yourPercentage;

  useFocusEffect(
    useCallback(() => {
      setFocusCount((c) => c + 1);
    }, []),
  );

  const handleCopyCode = async () => {
    if (!group?.inviteCode) return;
    await Clipboard.setStringAsync(group.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveName = async () => {
    if (!group || !editNameValue.trim()) return;
    setEditNameLoading(true);
    try {
      const updated = await updateGroup(id, { name: editNameValue.trim() });
      setGroup(updated);
      setEditNameVisible(false);
      setSuccessMessage('Nombre actualizado');
      setTimeout(() => setSuccessMessage(null), 2500);
    } catch {
      setSuccessMessage('Error al actualizar el nombre');
      setTimeout(() => setSuccessMessage(null), 2500);
    } finally {
      setEditNameLoading(false);
    }
  };

  const handleSavePercentage = async () => {
    if (!group || !myMembership) return;
    try {
      await updateMemberSplit(group.id, myMembership.id, yourPercentage);
      setAdjustPercentageVisible(false);
      setSuccessMessage('Porcentaje actualizado');
      setTimeout(() => setSuccessMessage(null), 2500);
    } catch {
      setSuccessMessage('Error al actualizar el porcentaje');
      setTimeout(() => setSuccessMessage(null), 2500);
    }
  };

  const handleArchive = async () => {
    setArchiveLoading(true);
    try {
      await archiveGroup(id);
      setArchiveVisible(false);
      setSuccessMessage('Grupo archivado');
      setTimeout(() => router.back(), 1500);
    } catch {
      setSuccessMessage('Error al archivar el grupo');
      setTimeout(() => setSuccessMessage(null), 2500);
    } finally {
      setArchiveLoading(false);
    }
  };

  const handleRegenerateCode = useCallback(async () => {
    if (!group) return;
    setIsRegenerating(true);
    try {
      const updated = await regenerateInviteCode(id);
      setGroup(updated);
      setSuccessMessage('Código regenerado');
      setTimeout(() => setSuccessMessage(null), 2500);
    } catch {
      setSuccessMessage('Error al regenerar el código');
      setTimeout(() => setSuccessMessage(null), 2500);
    } finally {
      setIsRegenerating(false);
    }
  }, [id, group]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await deleteGroup(id);
      setDeleteVisible(false);
      setDeleteSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al eliminar el grupo';
      setDeleteVisible(false);
      setDeleteError(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleNotification = (key: keyof typeof toggleStates) => {
    setToggleStates((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#F8FAFC]">
        <Loading message="Cargando configuración..." />
      </SafeAreaView>
    );
  }

  if (!group) {
    return (
      <SafeAreaView className="flex-1 bg-[#F8FAFC]">
        <View className="pt-1">
          <ScreenHeader
            title="Configuración"
            subtitle=""
            onBack={() => router.back()}
          />
        </View>
        <View className="flex-1 items-center justify-center px-5">
          <Text className="text-base text-[#64748B]">Grupo no encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <Animated.View style={style0}>
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
                <Pressable
                  onPress={() => setEditNameVisible(true)}
                  className="flex-row items-center justify-between active:opacity-70"
                >
                  <View className="flex-1">
                    <Text className="text-sm text-[#64748B]">
                      Nombre del grupo
                    </Text>
                    <Text className="mt-1 text-base font-semibold text-[#0F172A]">
                      {group.name}
                    </Text>
                  </View>
                  <FontAwesome6
                    name="pen-to-square"
                    size={18}
                    color="#64748B"
                  />
                </Pressable>

                <View className="flex-row items-center justify-between border-t border-[#E2E8F0] pt-4">
                  <View>
                    <Text className="text-sm text-[#64748B]">Creada</Text>
                    <Text className="mt-1 text-base font-medium text-[#64748B]">
                      {new Date(group.createdAt).toLocaleDateString('es-CL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>
                </View>

                <View className="mt-4 flex-row items-center justify-center gap-3">
                  {group.members.map((m, i) => (
                    <View key={m.id} className={i > 0 ? '-ml-4' : ''}>
                      <View className="h-12 w-12 overflow-hidden rounded-full border-2 border-white bg-[#E2E8F0]">
                        <Text className="text-center text-xl font-bold leading-[48px] text-[#64748B]">
                          {m.user.firstName[0]}
                          {m.user.lastName[0]}
                        </Text>
                      </View>
                    </View>
                  ))}
                  <Pressable className="ml-2 h-8 w-8 items-center justify-center rounded-full bg-[#10B981]">
                    <FontAwesome6 name="camera" size={14} color="#FFFFFF" />
                  </Pressable>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Distribución */}
          <Animated.View style={style1}>
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
                    <Text
                      className="font-bold text-[#10B981]"
                      style={{ fontFamily: 'monospace' }}
                    >
                      {adjustYourPercentage}%
                    </Text>
                    <Text
                      className="font-bold text-[#0F172A]"
                      style={{ fontFamily: 'monospace' }}
                    >
                      {yourPercentage}%
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center justify-between rounded-lg p-3">
                  <View className="flex-row items-center gap-2">
                    <View className="h-3 w-3 rounded-full bg-[#8B5CF6]" />
                    <Text className="text-[#0F172A]">Tu grupo</Text>
                  </View>
                  <View className="items-end">
                    <Text
                      className="font-bold text-[#8B5CF6]"
                      style={{ fontFamily: 'monospace' }}
                    >
                      {100 - adjustYourPercentage}%
                    </Text>
                    <Text
                      className="font-bold text-[#0F172A]"
                      style={{ fontFamily: 'monospace' }}
                    >
                      {partnerPercentage}%
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
          <Animated.View style={style2}>
            <View className="mt-4 flex-row items-center justify-between px-1">
              <Text className="text-[13px] font-semibold uppercase tracking-wider text-[#64748B]">
                Miembros
              </Text>
              <View className="rounded-full bg-[#10B981]/10 px-2.5 py-1 text-[10px] font-bold text-[#10B981]">
                {group.members.length}
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
              {group.members.map((member, index) => (
                <View
                  key={member.id}
                  className={`flex-row items-center justify-between px-5 py-4 ${index > 0 ? 'border-t border-[#E2E8F0]' : ''
                    }`}
                >
                  <View className="flex-row items-center gap-4">
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-[#E2E8F0]">
                      <Text className="text-base font-bold text-[#64748B]">
                        {member.user.firstName[0]}
                        {member.user.lastName[0]}
                      </Text>
                    </View>
                    <View>
                      <View className="flex-row items-center gap-2">
                        <Text className="text-sm font-semibold text-[#0F172A]">
                          {member.user.firstName} {member.user.lastName}
                        </Text>
                        <View className="rounded-full bg-[#10B981]/10 px-2 py-0.5">
                          <Text className="text-[10px] font-bold uppercase text-[#10B981]">
                            {member.role}
                          </Text>
                        </View>
                      </View>
                      <Text className="text-xs text-[#94A3B8]">
                        {member.user.email}
                      </Text>
                    </View>
                  </View>
                  {member.role !== 'OWNER' && member.role !== 'ADMIN' && (
                    <Pressable
                      className="flex-row items-center justify-between"
                      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                    >
                      <FontAwesome6
                        name="ellipsis-vertical"
                        size={18}
                        color="#64748B"
                      />
                    </Pressable>
                  )}
                </View>
              ))}

              <Pressable
                onPress={() => setInviteVisible(true)}
                className="w-full flex-row items-center justify-center gap-2 border-t border-dashed border-[#E2E8F0] px-5 py-4 active:opacity-80"
              >
                <FontAwesome6 name="user-plus" size={16} color="#10B981" />
                <Text className="text-sm font-semibold text-[#10B981]">
                  Invitar nuevo miembro
                </Text>
              </Pressable>
            </View>
          </Animated.View>

          {/* Código invitación */}
          <Animated.View style={style3}>
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
              <Text className="mb-2 text-center text-sm text-[#64748B]">
                Comparte este código para que otros se unan
              </Text>

              <View className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-3">
                <Text className="text-center text-2xl font-bold tracking-[0.3em] text-[#10B981]">
                  {group.inviteCode ?? '------'}
                </Text>
              </View>

              <Pressable
                onPress={handleCopyCode}
                className="mt-3 w-full flex-row items-center justify-center gap-2 rounded-xl bg-[#10B981] py-4 active:opacity-80"
              >
                <FontAwesome6
                  name={copied ? 'circle-check' : 'copy'}
                  size={16}
                  color="#FFFFFF"
                />
                <Text className="text-base font-semibold text-white">
                  {copied ? '¡Copiado!' : 'Copiar código'}
                </Text>
              </Pressable>

              <View className="mt-3 flex-row items-center justify-center">
                <Pressable className="flex-row items-center gap-1 active:opacity-80">
                  <FontAwesome6 name="qrcode" size={16} color="#006c49" />
                  <Text className="text-sm font-semibold text-[#006c49]">
                    Ver código QR
                  </Text>
                </Pressable>
              </View>
            </View>
          </Animated.View>

          {/* Notificaciones */}
          <Animated.View style={style4}>
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
                {
                  key: 'newExpense',
                  title: 'Notificar nuevos gastos',
                  desc: 'Push y alertas en tiempo real',
                  value: toggleStates.newExpense,
                },
                {
                  key: 'weeklyEmail',
                  title: 'Resumen semanal email',
                  desc: 'Informe detallado los lunes',
                  value: toggleStates.weeklyEmail,
                },
                {
                  key: 'settlementReminders',
                  title: 'Recordatorios liquidación',
                  desc: 'Aviso de cierre de mes',
                  value: toggleStates.settlementReminders,
                },
              ].map((item, index) => (
                <Pressable
                  key={item.key}
                  onPress={() =>
                    toggleNotification(item.key as keyof typeof toggleStates)
                  }
                  className={`flex-row items-center justify-between px-5 py-4 ${index > 0 ? 'border-t border-[#E2E8F0]' : ''} active:bg-[#F8FAFC]`}
                >
                  <View>
                    <Text className="text-base font-semibold text-[#0F172A]">
                      {item.title}
                    </Text>
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
          <Animated.View style={style5}>
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
                <Text className="text-base font-semibold text-[#0F172A]">
                  Archivar grupo
                </Text>
              </Pressable>

              <View className="border-t border-[#E2E8F0]" />

              <Pressable
                onPress={() => setDeleteVisible(true)}
                className="w-full flex-row items-center gap-3 px-5 py-4 active:bg-[#FEF2F2]"
              >
                <FontAwesome6 name="trash" size={20} color="#EF4444" />
                <Text className="text-base font-semibold text-[#EF4444]">
                  Eliminar grupo
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Invitar miembro */}
      <InviteMemberSheet
        visible={inviteVisible}
        onClose={() => setInviteVisible(false)}
        invitationCode={group?.inviteCode ?? ''}
        onRegenerate={handleRegenerateCode}
        isRegenerating={isRegenerating}
        heightRatio={0.65}
        headerFinalTranslateY={0.17}
      />

      {/* Modals */}
      <AlertModal
        visible={archiveVisible}
        type="warning"
        title="¿Archivar grupo?"
        message="Podrás restaurarlo más tarde desde ajustes."
        buttonText={archiveLoading ? 'Archivando...' : 'Archivar'}
        onClose={() => {
          setArchiveVisible(false);
          if (!archiveLoading) handleArchive();
        }}
      />

      <AlertModal
        visible={deleteVisible}
        type="warning"
        title="Eliminar grupo"
        message="Esta acción no se puede deshacer. Se eliminarán todos los gastos, liquidaciones e historial del grupo."
        buttonText={
          deleteLoading ? 'Eliminando...' : 'Eliminar definitivamente'
        }
        cancelText="Cancelar"
        onCancel={() => {
          if (!deleteLoading) setDeleteVisible(false);
        }}
        onClose={() => {
          setDeleteVisible(false);
          if (!deleteLoading) handleDelete();
        }}
      />

      <AlertModal
        visible={deleteSuccess}
        type="success"
        title="Grupo eliminado"
        message="El grupo y todo su historial fueron eliminados correctamente."
        buttonText="Entendido"
        onClose={() => {
          setDeleteSuccess(false);
          router.replace('/(protected)/grupos');
        }}
      />

      <AlertModal
        visible={deleteError !== null}
        type="error"
        title="Error al eliminar el grupo"
        message={deleteError ?? ''}
        buttonText="Cerrar"
        onClose={() => setDeleteError(null)}
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
          <Input
            iconLeft="pen"
            placeholder="Nombre del grupo"
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
            gradientPaddingBottom={500}
            logo={require('@/assets/images/logo-white-green-bg-without.png')}
          />
        }
        heightRatio={0.45}
        headerFinalTranslateY={0.38}
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
              <Text className="text-2xl font-extrabold text-[#10B981]">
                {adjustYourPercentage}%
              </Text>
            </View>

            <View className="flex-1 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <View className="mb-3 flex-row items-center gap-2">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-[#0F766E]/10">
                  <FontAwesome6 name="user-group" size={14} color="#0F766E" />
                </View>
                <Text className="text-sm font-medium text-[#0F172A]">
                  Tu grupo
                </Text>
              </View>
              <Text className="text-2xl font-extrabold text-[#0F766E]">
                {100 - adjustYourPercentage}%
              </Text>
            </View>
          </View>

          <View className="mt-6">
            <View className="mt-1 flex-row items-center justify-center gap-4">
              <Pressable
                onPress={() =>
                  setAdjustYourPercentage(Math.max(0, adjustYourPercentage - 5))
                }
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

              <Text className="text-3xl font-extrabold text-[#10B981]">
                {adjustYourPercentage}%
              </Text>

              <Pressable
                onPress={() =>
                  setAdjustYourPercentage(
                    Math.min(100, adjustYourPercentage + 5),
                  )
                }
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

      {successMessage && (
        <View className="pointer-events-none absolute bottom-8 left-0 right-0 z-50 items-center">
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
              name={
                successMessage.includes('Error')
                  ? 'circle-xmark'
                  : 'circle-check'
              }
              size={16}
              color={successMessage.includes('Error') ? '#EF4444' : '#22C55E'}
            />
            <Text className="text-sm font-medium text-[#EFF1F3]">
              {successMessage}
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
