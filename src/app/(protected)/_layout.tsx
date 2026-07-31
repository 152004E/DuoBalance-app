import { useAuth } from '@/hooks/use-auth';
import { Redirect, Tabs } from 'expo-router';
import BottomTab from '@/components/layout/bottom-tab';
import { WorkspaceProvider } from '@/features/workspace/workspace.context';

export default function ProtectedLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <WorkspaceProvider>
      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <BottomTab {...props} />}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="gastos" />
        <Tabs.Screen name="grupos" />
        <Tabs.Screen name="reportes" />
        <Tabs.Screen name="perfil" />
      </Tabs>
    </WorkspaceProvider>
  );
}
