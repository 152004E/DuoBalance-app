import { View, ScrollView, useWindowDimensions } from 'react-native';
import { Button } from '@/components/ui/button';
import { HeroSection } from '@/components/welcome/hero-section';
import { BenefitCard } from '@/components/welcome/benefit-card';

const benefits = [
  {
    icon: 'money-bill-transfer',
    title: 'Gastos compartidos',
    description: 'Registra y divide gastos al instante',
    iconColor: '#F59E0B',
  },
  {
    icon: 'chart-simple',
    title: 'Balances claros',
    description: 'Sabe cuánto le debes a tu pareja sin rodeos',
    iconColor: '#3B82F6',
  },
  {
    icon: 'arrows-rotate',
    title: 'En tiempo real',
    description: 'Ambos ven los mismos números al momento',
    iconColor: '#006C49',
  },
];

export function WelcomeScreen() {
  const { width } = useWindowDimensions();

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      {/* HeroSection con altura FIJA */}
      <HeroSection width={width} />

      <ScrollView
        className="flex-1 px-6"
        contentContainerClassName="gap-3 mt-6"
        contentContainerStyle={{
          paddingBottom: 180,
        }}
      >
        {benefits.map((benefit) => (
          <BenefitCard key={benefit.title} {...benefit} />
        ))}
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-[#F8FAFC] pt-4 pb-6">
        <View className="gap-3 px-6">
          <Button
            text="Iniciar Sesión"
            variant="primary"
            iconLeft="arrow-right-to-bracket"
            className="rounded-full py-4 shadow-md"
            to="/login"
          />
          <Button
            text="Crear Cuenta"
            variant="secondary"
            iconLeft="user-plus"
            className="rounded-full py-4 shadow-md"
            to="/register"
          />
        </View>
      </View>
    </View>
  );
}