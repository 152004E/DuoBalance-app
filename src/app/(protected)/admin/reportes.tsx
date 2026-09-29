import { getUserDisplayName } from '@/utils/user';
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
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-10"
        showsVerticalScrollIndicator={false}
      >
        <HeroSection
          variant="page"
          userName={getUserDisplayName(user)}
          title="Reportes"
          subtitle="Gráficas y analíticas"
          height={220}
        />

        <View className="flex-1 items-center justify-center px-5 pt-20">
          <View className="items-center rounded-2xl bg-white p-6 shadow-sm">
            <Text className="mb-2 text-lg font-bold text-[#0F172A]">
              Reportes Globales
            </Text>
            <Text className="text-center text-sm text-[#64748B]">
              Pronto podrás ver aquí gráficas avanzadas sobre la actividad de la
              aplicación.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
