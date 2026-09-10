import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeroSection } from '@/components/layout/HeroSection';
import { useAuth } from '@/hooks/use-auth';

export default function AdminReportesScreen() {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role !== 'SUPER_ADMIN') {
      router.replace('/perfil');
    }
  }, [user]);

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      <ScrollView className="flex-1" contentContainerClassName="pb-10" showsVerticalScrollIndicator={false}>
        <HeroSection
          variant="page"
          userName={user?.firstName ?? 'Admin'}
          title="Reportes"
          subtitle="Gráficas y analíticas"
          height={220}
        />

        <View className="flex-1 items-center justify-center pt-20 px-5">
          <View className="bg-white p-6 rounded-2xl shadow-sm items-center">
            <Text className="text-[#0F172A] text-lg font-bold mb-2">Reportes Globales</Text>
            <Text className="text-[#64748B] text-center text-sm">
              Pronto podrás ver aquí gráficas avanzadas sobre la actividad de la aplicación.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
