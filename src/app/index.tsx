import { Redirect } from 'expo-router';

import { useAuth } from '@/hooks/use-auth';
import { WelcomeScreen } from '@/components/welcome/welcome-screen';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href="/(protected)/dashboard" />;
  }

  return <WelcomeScreen />;
}
