import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeroSection } from '@/components/layout/HeroSection';
import { router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { adminService, AdminStats } from '@/services/api/admin';
import { RecentUsersCard, AdminUserItem } from '@/components/admin/recent-users-card';
import { useAuth } from '@/hooks/use-auth';
import { AlertModal } from '@/components/ui/alert-modal';

export default function AdminDashboardScreen() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorModal, setErrorModal] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean;
    user: AdminUserItem | null;
  }>({ visible: false, user: null });

  useEffect(() => {
    if (user?.role !== 'SUPER_ADMIN') {
      router.replace('/perfil');
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [statsData, usersData] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(),
      ]);
      setStats(statsData);
      setUsers(usersData);
    } catch (error) {
      console.error(error);
      setErrorModal('Error al cargar datos del panel de control');
    } finally {
      setIsLoading(false);
    }
  };

  const executeToggleSuspension = async () => {
    if (!confirmModal.user) return;
    const targetUserId = confirmModal.user.id;

    try {
      setConfirmModal({ visible: false, user: null });
      const result = await adminService.toggleUserSuspension(targetUserId);
      setUsers((prev) =>
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

  if (isLoading || !stats) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8FAFC]">
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}
      >
        <HeroSection
          variant="page"
          userName={user?.firstName ?? 'Admin'}
          title="Panel de Control"
          subtitle="Métricas globales"
          height={220}
        />

        <View className="mt-6 px-5">
          {/* Métricas Cards Grid */}
          <View className="flex-row flex-wrap justify-between">
            {/* Card 1 */}
            <View className="mb-4 w-[48%] rounded-2xl bg-white p-4 shadow-sm border border-[#E2E8F0]/80">
              <FontAwesome6
                name="users"
                size={20}
                color="#3B82F6"
                className="mb-2"
              />
              <Text className="text-3xl font-bold text-[#0F172A]">
                {stats.totalUsers}
              </Text>
              <Text className="text-xs text-[#64748B]">Usuarios Totales</Text>
            </View>

            {/* Card 2 */}
            <View className="mb-4 w-[48%] rounded-2xl bg-white p-4 shadow-sm border border-[#E2E8F0]/80">
              <FontAwesome6
                name="layer-group"
                size={20}
                color="#8B5CF6"
                className="mb-2"
              />
              <Text className="text-3xl font-bold text-[#0F172A]">
                {stats.totalGroups}
              </Text>
              <Text className="text-xs text-[#64748B]">Grupos Creados</Text>
            </View>

            {/* Card 3 */}
            <View className="mb-4 w-[48%] rounded-2xl bg-white p-4 shadow-sm border border-[#E2E8F0]/80">
              <FontAwesome6
                name="receipt"
                size={20}
                color="#10B981"
                className="mb-2"
              />
              <Text className="text-3xl font-bold text-[#0F172A]">
                {stats.totalExpensesCount}
              </Text>
              <Text className="text-xs text-[#64748B]">Gastos Registrados</Text>
            </View>

            {/* Card 4 */}
            <View className="mb-4 w-[48%] rounded-2xl bg-white p-4 shadow-sm border border-[#E2E8F0]/80">
              <FontAwesome6
                name="money-bill-transfer"
                size={20}
                color="#F59E0B"
                className="mb-2"
              />
              <Text className="mb-1 mt-1 text-xl font-bold text-[#0F172A]">
                ${stats.totalAmountMoved.toLocaleString('es-CO')}
              </Text>
              <Text className="text-xs text-[#64748B]">Movimiento Total</Text>
            </View>
          </View>

          {/* Sección Últimos Usuarios (Máximo 3) */}
          <View className="mt-4">
            <RecentUsersCard
              title="Últimos Usuarios"
              users={users}
              maxItems={3}
              onViewAll={() => router.push('/admin/Users/todos-usuarios')}
              onToggleSuspension={requestToggleSuspension}
              currentUserId={user?.id}
            />
          </View>
        </View>
      </ScrollView>

      {errorModal && (
        <AlertModal
          visible={!!errorModal}
          title="Error"
          message={errorModal}
          type="error"
          onClose={() => setErrorModal(null)}
        />
      )}

      {/* ConfirmModal */}
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
