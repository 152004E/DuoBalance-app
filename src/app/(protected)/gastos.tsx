import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeroSection } from '@/components/layout/HeroSection';
import { useAuth } from '@/hooks/use-auth';

export default function GastosScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}
      >
        <HeroSection
          variant="page"
          userName={user?.firstName ?? 'Usuario'}
          title="Gastos"
          subtitle="Controla tus gastos compartidos"
          height={220}
        />

        <View className="flex-1 items-center justify-center px-5 pt-20">
          <Text className="text-base text-[#64748B]">
            Próximamente...
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
