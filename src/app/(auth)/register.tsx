import { View, Text } from 'react-native';
import { Button } from '@/components/ui/button';

export default function RegisterScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-[#F8FAFC] px-6">
      <Text className="text-2xl font-bold text-[#0F172A]">Crear Cuenta</Text>
      <Button text="Registrarse" variant="primary" />
    </View>
  );
}
