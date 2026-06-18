import { useAuth } from '@/hooks/use-auth';
import { Redirect, Tabs } from 'expo-router';
import BottomTab from '@/components/layout/bottom-tab';

export default function ProtectedLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomTab {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="gastos" />
      <Tabs.Screen name="pareja" />
      <Tabs.Screen name="reportes" />
      <Tabs.Screen name="perfil" />
    </Tabs>
  );
}
