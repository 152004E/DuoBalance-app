import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { usePwaInstall } from '@/hooks/use-pwa-install';

export function PwaInstallBanner() {
  const { isInstallable, isIosPrompt, promptInstall, dismiss } = usePwaInstall();

  if (Platform.OS !== 'web') {
    return null;
  }

  if (!isInstallable && !isIosPrompt) {
    return null;
  }

  return (
    <View className="mx-4 mb-6 mt-2 overflow-hidden rounded-2xl border border-blue-100 bg-blue-50 shadow-sm">
      <View className="flex-row items-start p-4">
        <View className="mr-3 mt-1 h-10 w-10 items-center justify-center rounded-full bg-blue-100">
          <FontAwesome6 name="arrow-down" size={16} color="#2563EB" />
        </View>
        <View className="flex-1">
          <Text className="mb-1 text-base font-bold text-blue-900">
            Instala la App DuoBalance
          </Text>
          <Text className="text-sm text-blue-700">
            {isIosPrompt 
              ? "Para instalar la app, toca el botón Compartir y elige 'Agregar a Inicio'. Tendrás acceso más rápido y sin distracciones."
              : "Instala la aplicación en tu pantalla de inicio para acceder rápidamente y sin barras de navegación."}
          </Text>

          <View className="mt-3 flex-row items-center gap-3">
            {isInstallable && (
              <TouchableOpacity
                onPress={promptInstall}
                className="rounded-xl bg-blue-600 px-4 py-2 active:bg-blue-700"
              >
                <Text className="text-sm font-bold text-white">
                  Instalar ahora
                </Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              onPress={dismiss}
              className="rounded-xl px-4 py-2 active:bg-blue-100"
            >
              <Text className="text-sm font-medium text-blue-600">
                Ahora no
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
