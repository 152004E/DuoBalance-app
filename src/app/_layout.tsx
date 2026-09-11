import '../global.css';

import { LogBox, Platform } from 'react-native';
import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useFonts } from 'expo-font';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import { AuthProvider } from '@/features/auth/auth.context';
import { SessionExpiredAlert } from '@/components/auth/session-expired-alert';
import { appToastConfig } from '@/components/ui/app-toast';
import { SeoHead } from '@/components/common/seo-head';

LogBox.ignoreLogs([
  'props.pointerEvents is deprecated',
  '"shadow*" style props are deprecated',
]);

// Silenciar warnings deprecados de React Native Web en la consola del navegador
if (Platform.OS === 'web' && typeof console !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    const msg = typeof args[0] === 'string' ? args[0] : '';
    if (
      msg.includes('props.pointerEvents is deprecated') ||
      msg.includes('"shadow*" style props are deprecated')
    ) {
      return;
    }
    originalWarn(...args);
  };
}

// Prevenir retención de foco en elementos interactivos al navegar o abrir modales en Web (WAI-ARIA)
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  // 1. Interceptar setAttribute('aria-hidden', 'true') para desenfocar el elemento activo
  // antes de que el motor de Chromium evalúe la condición y emita el bloqueo en consola.
  const originalSetAttribute = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function (name: string, value: string) {
    if (
      name === 'aria-hidden' &&
      (value === 'true' || value === '') &&
      document.activeElement instanceof HTMLElement &&
      document.activeElement !== document.body &&
      this.contains(document.activeElement)
    ) {
      document.activeElement.blur();
    }
    return originalSetAttribute.apply(this, arguments as any);
  };

  const desc = Object.getOwnPropertyDescriptor(Element.prototype, 'ariaHidden');
  if (desc && desc.set) {
    const originalSet = desc.set;
    Object.defineProperty(Element.prototype, 'ariaHidden', {
      ...desc,
      set(val: any) {
        if (
          (val === 'true' || val === true) &&
          document.activeElement instanceof HTMLElement &&
          document.activeElement !== document.body &&
          this.contains(document.activeElement)
        ) {
          document.activeElement.blur();
        }
        return originalSet.call(this, val);
      },
    });
  }

  // 2. Desenfocar en eventos de interacción de usuario tempranos (pointerup, click, popstate)
  const blurNonInputs = (event: Event) => {
    const target = event.target as HTMLElement | null;
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target?.isContentEditable
    ) {
      return;
    }

    if (
      document.activeElement instanceof HTMLElement &&
      document.activeElement !== document.body &&
      !(document.activeElement instanceof HTMLInputElement) &&
      !(document.activeElement instanceof HTMLTextAreaElement)
    ) {
      document.activeElement.blur();
    }
  };

  window.addEventListener('pointerup', blurNonInputs, { capture: true });
  window.addEventListener('click', blurNonInputs, { capture: true });
  window.addEventListener('popstate', blurNonInputs);
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    ...FontAwesome6.font,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <SeoHead />
      <Stack screenOptions={{ headerShown: false }} />
      <Toast
        config={appToastConfig}
        position="top"
        topOffset={12}
        visibilityTime={3000}
        autoHide
      />
      <SessionExpiredAlert />
    </AuthProvider>
  );
}
