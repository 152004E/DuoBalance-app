import { View, Text, Pressable } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import type { ToastConfig } from 'react-native-toast-message';

interface AppToastProps {
  text1?: string;
  text2?: string;
  onPress: () => void;
  type: 'success' | 'error' | 'warning';
}

/** Toast custom: arriba a la derecha, con variantes success (verde), error (rojo) y warning (ámbar). */
function AppToast({ text1, text2, onPress, type }: AppToastProps) {
  const bg = type === 'success' ? '#065238' : type === 'error' ? '#7F1D1D' : '#7C2D12';
  const icon =
    type === 'success'
      ? 'circle-check'
      : type === 'error'
        ? 'circle-xmark'
        : 'circle-exclamation';
  const iconColor =
    type === 'success' ? '#22C55E' : type === 'error' ? '#F87171' : '#FBBF24';

  return (
    <View className="w-full items-end px-4 pt-2">
      <Pressable
        onPress={onPress}
        className="w-[92%] max-w-[360] flex-row items-center gap-3 rounded-2xl px-4 py-3.5"
        style={{
          backgroundColor: bg,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
          elevation: 6,
        }}
      >
        <View className="h-9 w-9 items-center justify-center rounded-full bg-white/10">
          <FontAwesome6 name={icon} size={18} color={iconColor} />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-bold text-white" numberOfLines={1}>
            {text1}
          </Text>
          {text2 ? (
            <Text className="mt-0.5 text-xs text-white/80" numberOfLines={2}>
              {text2}
            </Text>
          ) : null}
        </View>
      </Pressable>
    </View>
  );
}

/** Config para react-native-toast-message: tipos success, error y warning con el mismo layout. */
export const appToastConfig: ToastConfig = {
  success: ({ text1, text2, onPress }) => (
    <AppToast text1={text1} text2={text2} onPress={onPress} type="success" />
  ),
  error: ({ text1, text2, onPress }) => (
    <AppToast text1={text1} text2={text2} onPress={onPress} type="error" />
  ),
  warning: ({ text1, text2, onPress }) => (
    <AppToast text1={text1} text2={text2} onPress={onPress} type="warning" />
  ),
};
