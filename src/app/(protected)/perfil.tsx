import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '@/hooks/use-auth';

export default function PerfilScreen() {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <View className="flex-1 items-center justify-center bg-[#F8FAFC]">
      <Text className="text-lg font-semibold text-[#0F172A]">Perfil</Text>
      <TouchableOpacity
        onPress={handleLogout}
        className="mt-8 bg-red-500 px-6 py-3 rounded-lg"
      >
        <Text className="text-white font-semibold">Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}
