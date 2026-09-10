import { useAuth } from '@/hooks/use-auth';
import { Redirect, Tabs } from 'expo-router';
import BottomTab from '@/components/layout/bottom-tab';
import { WorkspaceProvider } from '@/features/workspace/workspace.context';
import { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { joinGroup } from '@/services/api/groups';
import { pendingJoinStorage } from '@/storage/token';

export default function ProtectedLayout() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!user || isLoading) return;

    const checkPendingJoin = async () => {
      try {
        const code = await pendingJoinStorage.get();
        if (code) {
          await pendingJoinStorage.remove();
          try {
            await joinGroup({ inviteCode: code });
            Toast.show({
              type: 'success',
              text1: '¡Te has unido al grupo!',
              text2: 'El enlace de invitación funcionó correctamente.',
            });
          } catch (error: any) {
            const msg = error.response?.data?.message || 'El código expiró o es inválido.';
            Toast.show({
              type: 'error',
              text1: 'No pudimos unirte',
              text2: msg,
            });
          }
        }
      } catch (e) {
        // Ignorar errores de storage
      }
    };

    checkPendingJoin();
  }, [user, isLoading]);

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  const isAdmin = user.role === 'SUPER_ADMIN';

  return (
    <WorkspaceProvider>
      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <BottomTab {...props} />}
      >
        {/* Pestañas Admin */}
        <Tabs.Screen
          name="admin/index"
          options={{ href: isAdmin ? undefined : null }}
        />
        <Tabs.Screen
          name="admin/Users/users"
          options={{ href: isAdmin ? undefined : null }}
        />
        <Tabs.Screen
          name="admin/reportes"
          options={{ href: isAdmin ? undefined : null }}
        />
        <Tabs.Screen
          name="admin/Users/todos-usuarios"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="admin/Users/index"
          options={{ href: null }}
        />

        {/* Pestañas Usuario Normal */}
        <Tabs.Screen
          name="index"
          options={{ href: isAdmin ? null : undefined }}
        />
        <Tabs.Screen
          name="gastos"
          options={{ href: isAdmin ? null : undefined }}
        />
        <Tabs.Screen
          name="grupos"
          options={{ href: isAdmin ? null : undefined }}
        />
        <Tabs.Screen
          name="reportes"
          options={{ href: isAdmin ? null : undefined }}
        />

        {/* Pestaña Común */}
        <Tabs.Screen name="perfil" />
      </Tabs>
    </WorkspaceProvider>
  );
}
