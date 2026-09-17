import { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { api } from '@/services/api/client';
import Toast from 'react-native-toast-message';

// Utility to convert Base64 URL safe VAPID key to Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const [isSubscribing, setIsSubscribing] = useState(false);

  const requestSubscription = useCallback(async () => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return null;
    }

    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      Toast.show({
        type: 'error',
        text1: 'No soportado',
        text2: 'Tu navegador no soporta notificaciones push.',
      });
      return null;
    }

    setIsSubscribing(true);
    try {
      // 1. Pedir permiso al navegador
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        Toast.show({
          type: 'info',
          text1: 'Permiso denegado',
          text2: 'Debes permitir las notificaciones en tu navegador.',
        });
        return null;
      }

      // 2. Registrar el service worker si no existe
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      await navigator.serviceWorker.ready;

      // 3. Obtener suscripción existente o crear una nueva
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        const vapidPublicKey = process.env.EXPO_PUBLIC_VAPID_KEY;
        console.log('VAPID Key from env:', vapidPublicKey);
        
        if (!vapidPublicKey) {
          throw new Error('No VAPID key found');
        }

        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
        console.log('Converted key length:', convertedVapidKey.length);
        console.log('Converted key starts with 0x04:', convertedVapidKey[0] === 0x04);

        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        });
      }

      // 4. Enviar suscripción al backend
      await api.post('/notifications/subscribe', subscription.toJSON());
      
      Toast.show({
        type: 'success',
        text1: 'Notificaciones activadas',
        text2: 'Recibirás alertas de nuevos gastos y pagos.',
      });
      
      return subscription;
    } catch (error) {
      console.error('Error al suscribir notificaciones:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Hubo un problema activando las notificaciones.',
      });
      return null;
    } finally {
      setIsSubscribing(false);
    }
  }, []);

  return {
    isSubscribing,
    requestSubscription,
  };
}
