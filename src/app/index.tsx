import { Redirect } from 'expo-router';

import { useAuth } from '@/hooks/use-auth';
import { WelcomeScreen } from '@/components/welcome/welcome-screen';
import { SeoHead } from '@/components/common/seo-head';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <SeoHead />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(protected)" />;
  }

  return (
    <>
      <SeoHead />
      <WelcomeScreen />
    </>
  );
}
