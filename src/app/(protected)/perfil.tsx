import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAuth } from '@/hooks/use-auth';
import { Loading } from '@/components/ui/loading';
import { useRef } from 'react';
import { useScrollToTop } from 'expo-router';

const menuItems = [
  { icon: 'pen-to-square', label: 'Editar Perfil' },
  { icon: 'bell', label: 'Notificaciones' },
  { icon: 'shield-halved', label: 'Seguridad' },
] as const;

export default function PerfilScreen() {
  const { user, signOut, isLoading } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
        <Loading message="Cargando perfil..." />
      </SafeAreaView>
    );
  }

  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#E8E4F0', '#F4F2F7', '#F8FAFC']}
        locations={[0, 0.5, 1]}
        className="absolute inset-0"
      />
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerClassName="pb-8"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Text className="mt-6 text-center text-2xl font-bold text-[#0F172A]">
            Perfil
          </Text>

          {/* Avatar + User Info */}
          <View className="mt-10 items-center">
            <View className="h-[120px] w-[120px] items-center justify-center rounded-full bg-[#E2E8F0] border-[4px] border-[#10B981]">
              <FontAwesome6 name="user" size={44} color="#94A3B8" />
            </View>
            <Text className="mt-4 text-2xl font-bold text-[#0F172A]">
              {user?.firstName} {user?.lastName}
            </Text>
            <Text className="mt-1 text-sm text-[#64748B]">
              {user?.email}
            </Text>
          </View>

          {/* Menu Options Card */}
          <View className="mx-5 mt-10 rounded-2xl bg-white shadow-sm">
            {menuItems.map((item, index) => (
              <Pressable
                key={item.label}
                className="flex-row items-center justify-between px-4 py-4 active:bg-[#F8FAFC]"
              >
                <View className="flex-row items-center gap-4">
                  <View
                    className="h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: '#10B98126' }}
                  >
                    <FontAwesome6 name={item.icon} size={16} color="#10B981" />
                  </View>
                  <Text className="text-base font-semibold text-[#0F172A]">
                    {item.label}
                  </Text>
                </View>
                <FontAwesome6 name="chevron-right" size={14} color="#CBD5E1" />
              </Pressable>
            ))}
          </View>

          {/* Logout Card */}
          <View className="mx-5 mt-4 rounded-2xl bg-white shadow-sm">
            <Pressable
              onPress={handleLogout}
              className="flex-row items-center justify-center gap-3 px-4 py-4 active:bg-[#F8FAFC]"
            >
              <FontAwesome6 name="right-from-bracket" size={16} color="#EF4444" />
              <Text className="text-base font-semibold text-[#EF4444]">
                Cerrar sesión
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
