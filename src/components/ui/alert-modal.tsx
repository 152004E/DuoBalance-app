import { useEffect, useRef } from 'react';
import { Modal, View, Text, Pressable, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { FontAwesome6 } from '@expo/vector-icons';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertModalProps {
  visible: boolean;
  type: AlertType;
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
  /** Texto del botón secundario (ej. "Cancelar"). Si se pasa junto a onCancel, se muestran dos botones. */
  cancelText?: string;
  onCancel?: () => void;
}

const config = {
  success: {
    icon: 'circle-check',
    color: '#10B981',
  },
  error: {
    icon: 'circle-xmark',
    color: '#EF4444',
  },
  warning: {
    icon: 'triangle-exclamation',
    color: '#F59E0B',
  },
  info: {
    icon: 'circle-info',
    color: '#3B82F6',
  },
} as const;

export function AlertModal({
  visible,
  type,
  title,
  message,
  buttonText = 'Continuar',
  onClose,
  cancelText,
  onCancel,
}: AlertModalProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),

        Animated.spring(scale, {
          toValue: 1,
          damping: 12,
          stiffness: 150,
          mass: 0.8,
          useNativeDriver: true,
        }),

        Animated.spring(translateY, {
          toValue: 0,
          damping: 14,
          stiffness: 140,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      opacity.setValue(0);
      scale.setValue(0.8);
      translateY.setValue(30);
    }
  }, [visible]);

  const { icon, color } = config[type];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onCancel ?? onClose}
    >
      <Animated.View
        style={{
          flex: 1,
          opacity,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
        }}
      >
        <BlurView
          intensity={25}
          tint="dark"
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />

        <Animated.View
          style={{
            width: '100%',
            maxWidth: 360,
            backgroundColor: '#FFFFFF',
            borderRadius: 32,
            paddingHorizontal: 24,
            paddingBottom: 24,
            paddingTop: 56,
            transform: [{ scale }, { translateY }],

            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 12,
            },
            shadowOpacity: 0.15,
            shadowRadius: 24,
            elevation: 12,
          }}
        >
          {/* Icono flotante */}
          <View
            style={{
              position: 'absolute',
              top: -40,
              left: 0,
              right: 0,
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: color,
                justifyContent: 'center',
                alignItems: 'center',

                shadowColor: color,
                shadowOffset: {
                  width: 0,
                  height: 10,
                },
                shadowOpacity: 0.35,
                shadowRadius: 16,
                elevation: 12,
              }}
            >
              <FontAwesome6 name={icon} size={34} color="#FFFFFF" solid />
            </View>
          </View>

          {/* Título */}
          <Text
            style={{
              textAlign: 'center',
              fontSize: 24,
              fontWeight: '700',
              color: '#0F172A',
              marginBottom: 12,
            }}
          >
            {title}
          </Text>

          {/* Mensaje */}
          <Text
            style={{
              textAlign: 'center',
              fontSize: 15,
              lineHeight: 24,
              color: '#64748B',
            }}
          >
            {message}
          </Text>

          {/* Botones */}
          {cancelText && onCancel ? (
            <View style={{ marginTop: 28, flexDirection: 'row', gap: 12 }}>
              <Pressable
                onPress={onCancel}
                style={{
                  flex: 1,
                  paddingVertical: 16,
                  borderRadius: 18,
                  borderWidth: 2,
                  borderColor: '#E2E8F0',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#64748B',
                    fontSize: 16,
                    fontWeight: '700',
                  }}
                >
                  {cancelText}
                </Text>
              </Pressable>

              <Pressable
                onPress={onClose}
                style={{
                  flex: 1,
                  backgroundColor: color,
                  paddingVertical: 16,
                  borderRadius: 18,

                  shadowColor: color,
                  shadowOffset: {
                    width: 0,
                    height: 8,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#FFFFFF',
                    fontSize: 16,
                    fontWeight: '700',
                  }}
                >
                  {buttonText}
                </Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={onClose}
              style={{
                marginTop: 28,
                backgroundColor: color,
                paddingVertical: 16,
                borderRadius: 18,

                shadowColor: color,
                shadowOffset: {
                  width: 0,
                  height: 8,
                },
                shadowOpacity: 0.25,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontWeight: '700',
                }}
              >
                {buttonText}
              </Text>
            </Pressable>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
