import { useEffect, useState, useRef } from 'react';
import { router, usePathname } from 'expo-router';

import { AlertModal } from '@/components/ui/alert-modal';
import { eventEmitter } from '@/utils/event-emitter';

const AUTO_REDIRECT_TIMEOUT = 15000;

const AUTH_PATHS = ['/login', '/register', '/forgot-password'];

function isAuthScreen(pathname: string) {
  return pathname === '/' || AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(p));
}

export function SessionExpiredAlert() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsubscribe = eventEmitter.on('session:expired', () => {
      if (isAuthScreen(pathname)) return;

      setVisible(true);

      timerRef.current = setTimeout(() => {
        setVisible(false);
        router.replace('/login');
      }, AUTO_REDIRECT_TIMEOUT);
    });

    return () => {
      unsubscribe();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname]);

  const handleClose = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
    router.replace('/login');
  };

  return (
    <AlertModal
      visible={visible}
      type="warning"
      title="Sesión expirada"
      message="Tu sesión ha expirado. Serás redirigido a la pantalla de inicio de sesión."
      buttonText="Iniciar sesión"
      onClose={handleClose}
    />
  );
}
