import { useEffect, useRef } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/hooks/use-auth';
import { joinGroup } from '@/services/api/groups';
import { pendingJoinStorage } from '@/storage/token';

export default function JoinPage() {
  const { code } = useLocalSearchParams<{ code?: string }>();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (isLoading || hasProcessed.current) return;

    const processJoin = async () => {
      hasProcessed.current = true;

      if (!code) {
        router.replace('/');
        return;
      }

      if (!user) {
        // Not logged in -> save code and redirect to login
        await pendingJoinStorage.set(code);
        Toast.show({
          type: 'info',
          text1: 'Inicia sesión primero',
          text2: 'Para unirte al grupo, necesitas una cuenta.',
        });
        router.replace('/login');
        return;
      }

      // Logged in -> try to join directly
      try {
        await joinGroup({ inviteCode: code });
        Toast.show({
          type: 'success',
          text1: '¡Te has unido!',
          text2: 'Ahora formas parte del grupo.',
        });
      } catch (error: any) {
        const msg = error.response?.data?.message || 'Código inválido o ya eres miembro.';
        Toast.show({
          type: 'error',
          text1: 'No pudimos unirte',
          text2: msg,
        });
      } finally {
        router.replace('/(protected)/grupos');
      }
    };

    processJoin();
  }, [code, user, isLoading, router]);

  return (
    <View className="flex-1 items-center justify-center bg-[#F8FAFC]">
      <ActivityIndicator size="large" color="#10B981" />
    </View>
  );
}
