import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Modal } from 'react-native';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenHeader } from '@/components/ui/screen-header';
import { AlertModal } from '@/components/ui/alert-modal';
import { adminService } from '@/services/api/admin';
import { useAuth } from '@/hooks/use-auth';
import { extractErrorMessage } from '@/utils/errors';

type UserDetail = {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
    role: string;
    isActive: boolean;
    createdAt: string;
    emailVerifiedAt: string | null;
  };
  stats: {
    totalExpensesCount: number;
    totalPaymentsCount: number;
    totalGroupsCount: number;
  };
  groups: {
    id: string;
    name: string;
    type: string;
    role: string;
    joinedAt: string;
  }[];
};

export default function AdminUserDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const [data, setData] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [alertModal, setAlertModal] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: 'success' | 'error';
    onClose?: () => void;
  }>({ visible: false, title: '', message: '', type: 'error' });

  const [confirmSuspend, setConfirmSuspend] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getUserDetail(id as string);
      setData(res);
    } catch (error) {
      setAlertModal({
        visible: true,
        title: 'Error',
        message: 'No se pudo cargar la información del usuario.',
        type: 'error',
        onClose: () => router.back(),
      });
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleToggleSuspend = async () => {
    if (!data) return;
    setIsProcessing(true);
    try {
      const result = await adminService.toggleUserSuspension(data.user.id);
      setData((prev) =>
        prev
          ? {
              ...prev,
              user: { ...prev.user, isActive: result.isActive },
            }
          : prev
      );
      setConfirmSuspend(false);
    } catch (error) {
      setAlertModal({
        visible: true,
        title: 'Error',
        message: extractErrorMessage(error, 'Error al cambiar estado'),
        type: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!data) return;
    setIsProcessing(true);
    try {
      await adminService.deleteUser(data.user.id);
      setConfirmDelete(false);
      setAlertModal({
        visible: true,
        title: 'Usuario Eliminado',
        message: 'El usuario ha sido eliminado (anonimizado) correctamente.',
        type: 'success',
        onClose: () => router.back(),
      });
    } catch (error) {
      setConfirmDelete(false);
      setAlertModal({
        visible: true,
        title: 'Error al eliminar',
        message: extractErrorMessage(error, 'No se pudo eliminar al usuario.'),
        type: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading || !data) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8FAFC]">
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  const { user, stats, groups } = data;
  const isMe = currentUser?.id === user.id;

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#E8E4F0', '#F4F2F7', '#F8FAFC']}
        locations={[0, 0.5, 1]}
        className="absolute inset-0"
      />
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScreenHeader
          title="Detalle del Usuario"
          subtitle="Información y administración"
          onBack={() => router.back()}
        />

        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-10 px-5 pt-4"
          showsVerticalScrollIndicator={false}
        >
          {/* Tarjeta de Perfil */}
          <View className="rounded-3xl bg-white p-5 shadow-sm">
            <View className="flex-row items-center gap-4">
              <View
                className="h-16 w-16 items-center justify-center rounded-full"
                style={{
                  backgroundColor:
                    user.role === 'SUPER_ADMIN' ? '#FEF3C7' : '#10B9811A',
                }}
              >
                <FontAwesome6
                  name={user.role === 'SUPER_ADMIN' ? 'crown' : 'user'}
                  size={24}
                  color={user.role === 'SUPER_ADMIN' ? '#D97706' : '#10B981'}
                />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-[#0F172A]" numberOfLines={1}>
                  {user.firstName} {user.lastName}
                </Text>
                <Text className="text-sm text-[#64748B] mb-1" numberOfLines={1}>
                  {user.email}
                </Text>
                <View className="flex-row gap-2 flex-wrap mt-1">
                  {user.role === 'SUPER_ADMIN' && (
                    <View className="rounded bg-[#FEF3C7] px-2 py-0.5 border border-[#FDE68A]">
                      <Text className="text-[10px] font-bold text-[#D97706]">SUPER ADMIN</Text>
                    </View>
                  )}
                  <View
                    className={`rounded px-2 py-0.5 border ${
                      user.isActive
                        ? 'bg-[#ECFDF5] border-[#A7F3D0]'
                        : 'bg-[#FEF2F2] border-[#FECACA]'
                    }`}
                  >
                    <Text
                      className={`text-[10px] font-bold ${
                        user.isActive ? 'text-[#059669]' : 'text-[#DC2626]'
                      }`}
                    >
                      {user.isActive ? 'ACTIVO' : 'SUSPENDIDO'}
                    </Text>
                  </View>
                  {user.emailVerifiedAt && (
                    <View className="rounded bg-[#EFF6FF] px-2 py-0.5 border border-[#BFDBFE]">
                      <Text className="text-[10px] font-bold text-[#2563EB]">VERIFICADO</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
            
            <View className="mt-4 pt-4 border-t border-[#F1F5F9] flex-row justify-between items-center">
              <Text className="text-xs text-[#94A3B8]">Registrado el:</Text>
              <Text className="text-xs font-medium text-[#475569]">
                {new Date(user.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {/* Estadísticas */}
          <Text className="mt-8 mb-3 ml-1 text-sm font-bold uppercase tracking-wider text-[#64748B]">
            Métricas de Actividad
          </Text>
          <View className="flex-row gap-3">
            <View className="flex-1 rounded-2xl bg-white p-4 shadow-sm items-center">
              <FontAwesome6 name="users" size={20} color="#3B82F6" className="mb-2" />
              <Text className="text-2xl font-bold text-[#0F172A]">{stats.totalGroupsCount}</Text>
              <Text className="text-xs text-[#64748B] text-center mt-1">Grupos</Text>
            </View>
            <View className="flex-1 rounded-2xl bg-white p-4 shadow-sm items-center">
              <FontAwesome6 name="money-bill-wave" size={20} color="#10B981" className="mb-2" />
              <Text className="text-2xl font-bold text-[#0F172A]">{stats.totalExpensesCount}</Text>
              <Text className="text-xs text-[#64748B] text-center mt-1">Gastos Creados</Text>
            </View>
            <View className="flex-1 rounded-2xl bg-white p-4 shadow-sm items-center">
              <FontAwesome6 name="hand-holding-dollar" size={20} color="#8B5CF6" className="mb-2" />
              <Text className="text-2xl font-bold text-[#0F172A]">{stats.totalPaymentsCount}</Text>
              <Text className="text-xs text-[#64748B] text-center mt-1">Pagos Hechos</Text>
            </View>
          </View>

          {/* Grupos Asociados */}
          <Text className="mt-8 mb-3 ml-1 text-sm font-bold uppercase tracking-wider text-[#64748B]">
            Grupos Asociados ({groups.length})
          </Text>
          <View className="rounded-2xl bg-white shadow-sm overflow-hidden">
            {groups.length === 0 ? (
              <View className="p-6 items-center">
                <Text className="text-sm text-[#94A3B8]">Este usuario no pertenece a ningún grupo.</Text>
              </View>
            ) : (
              groups.map((group, index) => (
                <View
                  key={group.id}
                  className={`flex-row items-center justify-between p-4 ${
                    index > 0 ? 'border-t border-[#F1F5F9]' : ''
                  }`}
                >
                  <View className="flex-1 flex-row items-center gap-3">
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-[#F1F5F9]">
                      <FontAwesome6
                        name={group.type === 'COUPLE' ? 'heart' : 'people-group'}
                        size={14}
                        color="#64748B"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-[#0F172A]" numberOfLines={1}>
                        {group.name}
                      </Text>
                      <Text className="text-xs text-[#64748B]">
                        Unido: {new Date(group.joinedAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <View
                    className={`rounded-full px-2 py-1 ${
                      group.role === 'OWNER' ? 'bg-[#FEF3C7]' : 'bg-[#F1F5F9]'
                    }`}
                  >
                    <Text
                      className={`text-[10px] font-bold ${
                        group.role === 'OWNER' ? 'text-[#D97706]' : 'text-[#64748B]'
                      }`}
                    >
                      {group.role === 'OWNER' ? 'DUEÑO' : 'MIEMBRO'}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Acciones */}
          {!isMe && user.role !== 'SUPER_ADMIN' && (
            <>
              <Text className="mt-8 mb-3 ml-1 text-sm font-bold uppercase tracking-wider text-[#EF4444]">
                Zona de Peligro
              </Text>
              <View className="rounded-2xl border border-[#FCA5A5]/40 bg-[#FEF2F2]/60 p-4 shadow-sm">
                
                {/* Suspender */}
                <Pressable
                  onPress={() => setConfirmSuspend(true)}
                  className={`flex-row items-center justify-center gap-2 rounded-xl py-3.5 mb-3 ${
                    user.isActive ? 'bg-[#F59E0B]' : 'bg-[#10B981]'
                  } active:opacity-80`}
                >
                  <FontAwesome6
                    name={user.isActive ? 'ban' : 'check'}
                    size={16}
                    color="#FFFFFF"
                  />
                  <Text className="text-sm font-bold text-white">
                    {user.isActive ? 'Suspender Usuario' : 'Restaurar Usuario'}
                  </Text>
                </Pressable>

                <Text className="text-xs text-[#7F1D1D] mb-4 text-center px-2">
                  Suspender previene el acceso, pero conserva sus datos.
                </Text>

                <View className="h-px bg-[#FCA5A5]/40 mb-4" />

                {/* Eliminar */}
                <Pressable
                  onPress={() => setConfirmDelete(true)}
                  className="flex-row items-center justify-center gap-2 rounded-xl py-3.5 bg-[#EF4444] active:bg-[#DC2626]"
                >
                  <FontAwesome6 name="trash-can" size={16} color="#FFFFFF" />
                  <Text className="text-sm font-bold text-white">
                    Eliminar Permanentemente
                  </Text>
                </Pressable>
                
                <Text className="text-xs text-[#7F1D1D] mt-3 text-center px-2 leading-tight">
                  La eliminación es irreversible. Sus gastos se conservarán anonimizados para no afectar grupos activos.
                </Text>
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Alertas */}
      {alertModal.visible && (
        <AlertModal
          visible
          type={alertModal.type}
          title={alertModal.title}
          message={alertModal.message}
          onClose={() => {
            setAlertModal((prev) => ({ ...prev, visible: false }));
            alertModal.onClose?.();
          }}
        />
      )}

      {/* Modal de Confirmar Suspensión */}
      <Modal visible={confirmSuspend} transparent animationType="fade">
        <View className="absolute inset-0 z-50 items-center justify-center bg-black/50 p-4">
          <View className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
            <Text className="mb-2 text-center text-xl font-bold text-[#0F172A]">
              {user.isActive ? 'Suspender Usuario' : 'Restaurar Usuario'}
            </Text>
            <Text className="mb-6 text-center text-base text-[#64748B]">
              ¿Estás seguro de que deseas {user.isActive ? 'suspender' : 'restaurar'} a {user.email}?
            </Text>
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setConfirmSuspend(false)}
                disabled={isProcessing}
                className="flex-1 rounded-xl bg-[#F1F5F9] py-3.5 active:bg-[#E2E8F0]"
              >
                <Text className="text-center text-base font-semibold text-[#475569]">Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={handleToggleSuspend}
                disabled={isProcessing}
                className={`flex-1 rounded-xl py-3.5 ${
                  user.isActive ? 'bg-[#F59E0B]' : 'bg-[#10B981]'
                }`}
              >
                <Text className="text-center text-base font-semibold text-white">
                  {isProcessing ? 'Procesando...' : 'Confirmar'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Confirmar Eliminación */}
      <Modal visible={confirmDelete} transparent animationType="fade">
        <View className="absolute inset-0 z-50 items-center justify-center bg-black/60 p-4">
          <View className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
            <View className="mb-4 h-14 w-14 items-center justify-center self-center rounded-full bg-[#FEE2E2]">
              <FontAwesome6 name="triangle-exclamation" size={24} color="#EF4444" />
            </View>
            <Text className="mb-2 text-center text-xl font-bold text-[#0F172A]">
              Eliminar Usuario
            </Text>
            <Text className="mb-4 text-center text-sm text-[#64748B] leading-tight">
              ¿Estás completamente seguro? Esta acción <Text className="font-bold text-[#0F172A]">NO se puede deshacer</Text>.
            </Text>
            <Text className="mb-6 text-center text-xs text-[#EF4444] leading-tight bg-[#FEF2F2] p-2 rounded-lg border border-[#FCA5A5]">
              El usuario perderá todo acceso y será anonimizado en sus grupos actuales. Si es el único dueño de un grupo con más miembros, no podrá ser eliminado.
            </Text>
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setConfirmDelete(false)}
                disabled={isProcessing}
                className="flex-1 rounded-xl border border-[#CBD5E1] bg-white py-3.5 active:bg-[#F8FAFC]"
              >
                <Text className="text-center text-base font-semibold text-[#475569]">Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={handleDelete}
                disabled={isProcessing}
                className="flex-1 rounded-xl py-3.5 bg-[#EF4444] active:bg-[#DC2626]"
              >
                <Text className="text-center text-base font-semibold text-white">
                  {isProcessing ? 'Eliminando...' : 'Sí, Eliminar'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
