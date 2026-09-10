import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Stack, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/hooks/use-auth';

export default function AdminReportesScreen() {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role !== 'SUPER_ADMIN') {
      router.replace('/perfil');
    }
  }, [user]);

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <Stack.Screen
        options={{
          title: 'Reportes Globales',
          headerShown: true,
          headerStyle: { backgroundColor: '#0F172A' },
          headerTintColor: '#fff',
        }}
      />
      
      <LinearGradient
        colors={['#0F172A', '#1E293B']}
        className="absolute inset-x-0 top-0 h-48"
      />

      <View className="flex-1 items-center justify-center pt-20 px-5">
        <View className="bg-white p-6 rounded-2xl shadow-sm items-center">
          <Text className="text-[#0F172A] text-lg font-bold mb-2">Reportes Globales</Text>
          <Text className="text-[#64748B] text-center text-sm">
            Pronto podrás ver aquí gráficas avanzadas sobre la actividad de la aplicación.
          </Text>
        </View>
      </View>
    </View>
  );
}
