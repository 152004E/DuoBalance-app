import { useAuth } from '@/hooks/use-auth';
import { Redirect, Stack } from 'expo-router';

export default function ProtectedLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}