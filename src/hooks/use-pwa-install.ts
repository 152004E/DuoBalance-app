import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIosPrompt, setIsIosPrompt] = useState(false);

  useEffect(() => {
    // Solo correr en web
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    // 1. Si está usando la app standalone, no hacer nada
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) return;

    // 2. Verificar si se descartó hace menos de 7 días
    const dismissedAt = localStorage.getItem('pwa_prompt_dismissed_at');
    if (dismissedAt) {
      const timePassed = Date.now() - parseInt(dismissedAt, 10);
      if (timePassed < SEVEN_DAYS_MS) {
        return; // Aún no pasa la semana
      }
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    
    // 3. Si no es móvil, no mostrar banner (Ocultar en PC)
    const isMobile = /mobile|android|iphone|ipad|ipod/.test(userAgent);
    if (!isMobile) return;

    // 4. Si es iOS Safari
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    if (isIos) {
      setIsIosPrompt(true);
      return;
    }

    // 5. Android Chrome/Brave
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault(); // Prevenir prompt automático
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    
    setDeferredPrompt(null);
  };

  const dismiss = () => {
    setIsInstallable(false);
    setIsIosPrompt(false);
    localStorage.setItem('pwa_prompt_dismissed_at', Date.now().toString());
  };

  return { isInstallable, isIosPrompt, promptInstall, dismiss };
}
