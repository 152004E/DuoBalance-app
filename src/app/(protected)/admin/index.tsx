import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Stack, router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { adminService, AdminStats } from '@/services/api/admin';
import { useAuth } from '@/hooks/use-auth';
import { AlertModal } from '@/components/ui/alert-modal';

export default function AdminDashboardScreen() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorModal, setErrorModal] = useState<string | null>(null);

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
      const statsData = await adminService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error(error);
      setErrorModal('Error al cargar datos del panel de control');
    } finally {
      setIsLoading(false);
    }
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
    </View>
  );
}
