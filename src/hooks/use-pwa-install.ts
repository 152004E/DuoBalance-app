import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIosPrompt, setIsIosPrompt] = useState(false);

  useEffect(() => {
    // Only run on web environment
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    // Detect if already installed (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) return;

    // Detect iOS Safari for manual prompt instructions
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    if (isIos) {
      setIsIosPrompt(true);
      return;
    }

    // Chrome/Brave/Edge BeforeInstallPrompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault(); // Prevent default automatic prompt
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
    
    // Show the native install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // If they accepted, we don't need to show our banner anymore
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    
    // The deferredPrompt can only be used once
    setDeferredPrompt(null);
  };

  const dismiss = () => {
    setIsInstallable(false);
    setIsIosPrompt(false);
  };

  return { isInstallable, isIosPrompt, promptInstall, dismiss };
}
