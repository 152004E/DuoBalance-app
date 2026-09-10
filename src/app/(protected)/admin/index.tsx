import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { adminService, AdminStats } from '@/services/api/admin';
import { UserBrief } from '@/types/api';
import { useAuth } from '@/hooks/use-auth';
import { AlertModal } from '@/components/ui/alert-modal';

type AdminUser = UserBrief & { createdAt: string; _count: { members: number; expenses: number } };

export default function AdminDashboardScreen() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [errorModal, setErrorModal] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean;
    user: AdminUser | null;
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
        adminService.getUsers()
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
      setUsers(prev => prev.map(u => u.id === targetUserId ? { ...u, isActive: result.isActive } : u));
    } catch (error: any) {
      setErrorModal(error.response?.data?.message || 'Error al cambiar estado del usuario');
    }
  };

  const requestToggleSuspension = (targetUser: AdminUser) => {
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
    <View className="flex-1 bg-[#F8FAFC]">
      <Stack.Screen
        options={{
          title: 'Panel de Control',
          headerShown: true,
          headerStyle: { backgroundColor: '#0F172A' },
          headerTintColor: '#fff',
        }}
      />
      
      <LinearGradient
        colors={['#0F172A', '#1E293B']}
        className="absolute inset-x-0 top-0 h-48"
      />

      <ScrollView className="flex-1" contentContainerClassName="pb-10 pt-4 px-5">
        <Text className="text-white text-lg font-bold mb-4">Métricas Globales</Text>
        
        <View className="flex-row flex-wrap justify-between">
          {/* Card 1 */}
          <View className="w-[48%] bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <FontAwesome6 name="users" size={20} color="#3B82F6" className="mb-2" />
            <Text className="text-3xl font-bold text-[#0F172A]">{stats.totalUsers}</Text>
            <Text className="text-xs text-[#64748B]">Usuarios Totales</Text>
          </View>
          {/* Card 2 */}
          <View className="w-[48%] bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <FontAwesome6 name="layer-group" size={20} color="#8B5CF6" className="mb-2" />
            <Text className="text-3xl font-bold text-[#0F172A]">{stats.totalGroups}</Text>
            <Text className="text-xs text-[#64748B]">Grupos Creados</Text>
          </View>
          {/* Card 3 */}
          <View className="w-[48%] bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <FontAwesome6 name="receipt" size={20} color="#10B981" className="mb-2" />
            <Text className="text-3xl font-bold text-[#0F172A]">{stats.totalExpensesCount}</Text>
            <Text className="text-xs text-[#64748B]">Gastos Registrados</Text>
          </View>
          {/* Card 4 */}
          <View className="w-[48%] bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <FontAwesome6 name="money-bill-transfer" size={20} color="#F59E0B" className="mb-2" />
            <Text className="text-xl font-bold text-[#0F172A] mt-1 mb-1">
              ${stats.totalAmountMoved.toLocaleString('es-CO')}
            </Text>
            <Text className="text-xs text-[#64748B]">Movimiento Total</Text>
          </View>
        </View>

        <Text className="text-[#0F172A] text-lg font-bold mt-4 mb-3">Lista de Usuarios</Text>
        
        <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {users.map((u, index) => (
            <View 
              key={u.id} 
              className={`flex-row items-center justify-between p-4 ${index !== users.length - 1 ? 'border-b border-[#F1F5F9]' : ''}`}
            >
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text className="text-sm font-bold text-[#0F172A]">{u.firstName} {u.lastName}</Text>
                  {u.role === 'SUPER_ADMIN' && (
                    <FontAwesome6 name="crown" size={12} color="#FBBF24" />
                  )}
                  {!u.isActive && (
                    <View className="bg-red-100 px-1.5 py-0.5 rounded">
                      <Text className="text-[10px] font-bold text-red-600">SUSPENDIDO</Text>
                    </View>
                  )}
                </View>
                <Text className="text-xs text-[#64748B]">{u.email}</Text>
                <Text className="text-[10px] text-[#94A3B8] mt-1">
                  Grupos: {u._count.members} | Gastos: {u._count.expenses}
                </Text>
              </View>

              {user?.id !== u.id && (
                <Pressable
                  onPress={() => requestToggleSuspension(u)}
                  className={`px-3 py-1.5 rounded-full ${u.isActive ? 'bg-red-50' : 'bg-green-50'}`}
                >
                  <Text className={`text-xs font-semibold ${u.isActive ? 'text-red-600' : 'text-green-600'}`}>
                    {u.isActive ? 'Suspender' : 'Restaurar'}
                  </Text>
                </Pressable>
              )}
            </View>
          ))}
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

      {/* Since we don't have a generic ConfirmModal, we can hack it with an absolute view or just add a simple modal here */}
      {confirmModal.visible && confirmModal.user && (
        <View className="absolute inset-0 z-50 items-center justify-center bg-black/50 p-4">
          <View className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
            <View className="mb-4 items-center justify-center">
              <View className={`h-16 w-16 items-center justify-center rounded-full ${confirmModal.user.isActive ? 'bg-red-100' : 'bg-green-100'}`}>
                <FontAwesome6 name={confirmModal.user.isActive ? "ban" : "check"} size={24} color={confirmModal.user.isActive ? "#DC2626" : "#10B981"} />
              </View>
            </View>
            <Text className="mb-2 text-center text-xl font-bold text-[#0F172A]">
              {confirmModal.user.isActive ? 'Suspender Usuario' : 'Restaurar Usuario'}
            </Text>
            <Text className="mb-6 text-center text-base text-[#64748B]">
              ¿Estás seguro de que deseas {confirmModal.user.isActive ? 'suspender' : 'restaurar'} a {confirmModal.user.email}?
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
                className={`flex-1 rounded-xl py-3.5 active:opacity-90 ${confirmModal.user.isActive ? 'bg-red-600' : 'bg-green-600'}`}
              >
                <Text className="text-center text-base font-semibold text-white">
                  Confirmar
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
