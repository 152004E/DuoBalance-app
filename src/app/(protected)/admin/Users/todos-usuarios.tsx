import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TextInput, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadMoreButton } from '@/components/ui/load-more-button';
import { AlertModal } from '@/components/ui/alert-modal';
import { RecentUsersCard, AdminUserItem } from '@/components/admin/recent-users-card';
import { adminService } from '@/services/api/admin';
import { useAuth } from '@/hooks/use-auth';

type FilterStatus = 'ALL' | 'ACTIVE' | 'SUSPENDED';

export default function TodosUsuariosScreen() {
  const { user } = useAuth();
  const [allUsers, setAllUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');

  const [errorModal, setErrorModal] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean;
    user: AdminUserItem | null;
  }>({ visible: false, user: null });

  useFocusEffect(
    useCallback(() => {
      let active = true;
      if (user?.role !== 'SUPER_ADMIN') {
        router.replace('/perfil');
        return;
      }

      setLoading(true);
      adminService
        .getUsers()
        .then((data) => {
          if (active) setAllUsers(data);
        })
        .catch((err) => {
          console.error(err);
          if (active) setErrorModal('Error al cargar lista completa de usuarios');
        })
        .finally(() => {
          if (active) setLoading(false);
        });

      return () => {
        active = false;
      };
    }, [user]),
  );

  const filteredUsers = useMemo(() => {
    let result = allUsers;

    // Filtro por estado
    if (statusFilter === 'ACTIVE') {
      result = result.filter((u) => u.isActive);
    } else if (statusFilter === 'SUSPENDED') {
      result = result.filter((u) => !u.isActive);
    }

    // Filtro por texto (nombre, apellido, email)
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (u) =>
          u.firstName?.toLowerCase().includes(q) ||
          u.lastName?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [allUsers, query, statusFilter]);

  const executeToggleSuspension = async () => {
    if (!confirmModal.user) return;
    const targetUserId = confirmModal.user.id;

    try {
      setConfirmModal({ visible: false, user: null });
      const result = await adminService.toggleUserSuspension(targetUserId);
      setAllUsers((prev) =>
        prev.map((u) =>
          u.id === targetUserId ? { ...u, isActive: result.isActive } : u,
        ),
      );
    } catch (error: any) {
      setErrorModal(
        error.response?.data?.message || 'Error al cambiar estado del usuario',
      );
    }
  };

  const requestToggleSuspension = (targetUser: AdminUserItem) => {
    if (targetUser.role === 'SUPER_ADMIN') {
      setErrorModal('No puedes suspender a otro Super Admin.');
      return;
    }
    setConfirmModal({ visible: true, user: targetUser });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      <ScreenHeader
        title="Todos los Usuarios"
        subtitle="Listado general y gestión"
        onBack={() => router.back()}
      />

      {/* Buscador + Filtros rápidos */}
      <View className="px-5 pb-3 pt-4">
        <View className="flex-row items-center rounded-full bg-white px-4 py-3 shadow-sm border border-[#E2E8F0]">
          <FontAwesome6 name="magnifying-glass" size={16} color="#94A3B8" />
          <TextInput
            placeholder="Buscar por nombre o correo..."
            placeholderTextColor="#94A3B8"
            value={query}
            onChangeText={setQuery}
            className="ml-3 flex-1 text-[15px] text-[#0F172A]"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} className="p-1">
              <FontAwesome6 name="xmark" size={14} color="#94A3B8" />
            </Pressable>
          )}
        </View>

        {/* Chips de estado */}
        <View className="mt-3 flex-row gap-2">
          {(
            [
              { key: 'ALL', label: 'Todos' },
              { key: 'ACTIVE', label: 'Activos' },
              { key: 'SUSPENDED', label: 'Suspendidos' },
            ] as const
          ).map((item) => {
            const active = statusFilter === item.key;
            return (
              <Pressable
                key={item.key}
                onPress={() => setStatusFilter(item.key)}
                className={`rounded-full px-4 py-1.5 active:opacity-80 ${
                  active ? 'bg-[#10B981]' : 'border border-[#E2E8F0] bg-white'
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    active ? 'text-white' : 'text-[#64748B]'
                  }`}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Contenido */}
      {loading ? (
        <Loading message="Cargando usuarios..." />
      ) : filteredUsers.length === 0 ? (
        <View className="flex-1 items-center justify-center px-5">
          <EmptyState
            title="Sin usuarios encontrados"
            description="No hay usuarios que coincidan con la búsqueda o filtro seleccionado."
          />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-32 px-5 pt-2"
          showsVerticalScrollIndicator={false}
        >
          <RecentUsersCard
            title={`Usuarios (${filteredUsers.length})`}
            users={filteredUsers}
            maxItems={visibleCount}
            onToggleSuspension={requestToggleSuspension}
            currentUserId={user?.id}
          />

          <View className="mt-5">
            <LoadMoreButton
              visibleCount={visibleCount}
              totalCount={filteredUsers.length}
              step={10}
              label="Cargar más usuarios"
              onLoadMore={setVisibleCount}
            />
          </View>
        </ScrollView>
      )}

      {/* Modal de Error */}
      {errorModal && (
        <AlertModal
          visible={!!errorModal}
          title="Error"
          message={errorModal}
          type="error"
          onClose={() => setErrorModal(null)}
        />
      )}

      {/* Modal de Confirmación de Suspensión */}
      {confirmModal.visible && confirmModal.user && (
        <View className="absolute inset-0 z-50 items-center justify-center bg-black/50 p-4">
          <View className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
            <View className="mb-4 items-center justify-center">
              <View
                className={`h-16 w-16 items-center justify-center rounded-full ${
                  confirmModal.user.isActive ? 'bg-red-100' : 'bg-green-100'
                }`}
              >
                <FontAwesome6
                  name={confirmModal.user.isActive ? 'ban' : 'check'}
                  size={24}
                  color={confirmModal.user.isActive ? '#DC2626' : '#10B981'}
                />
              </View>
            </View>
            <Text className="mb-2 text-center text-xl font-bold text-[#0F172A]">
              {confirmModal.user.isActive
                ? 'Suspender Usuario'
                : 'Restaurar Usuario'}
            </Text>
            <Text className="mb-6 text-center text-base text-[#64748B]">
              ¿Estás seguro de que deseas{' '}
              {confirmModal.user.isActive ? 'suspender' : 'restaurar'} a{' '}
              {confirmModal.user.email}?
            </Text>
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setConfirmModal({ visible: false, user: null })}
                className="flex-1 rounded-xl bg-[#F1F5F9] py-3.5 active:bg-[#E2E8F0]"
              >
                <Text className="text-center text-base font-semibold text-[#475569]">
                  Cancelar
                </Text>
              </Pressable>
              <Pressable
                onPress={executeToggleSuspension}
                className={`flex-1 rounded-xl py-3.5 active:opacity-90 ${
                  confirmModal.user.isActive ? 'bg-red-600' : 'bg-green-600'
                }`}
              >
                <Text className="text-center text-base font-semibold text-white">
                  Confirmar
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
