import React, { useState } from 'react';
import { Modal, Pressable, Dimensions, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';

import { useBottomSheet } from '@/hooks/use-bottom-sheet';
import Toast from 'react-native-toast-message';
import { appToastConfig } from '@/components/ui/app-toast';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  beforeClose?: () => boolean | Promise<boolean>;
  children: React.ReactNode;
  header?: React.ReactNode;
  /** @deprecated Ya no se usa. El modal calcula su altura automáticamente. */
  heightRatio?: number;
  /** @deprecated Ya no se usa. */
  headerFinalTranslateY?: number;
  onOpenComplete?: () => void;
  onCloseComplete?: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Límite máximo para que el modal blanco no cubra toda la pantalla, se reduce en 40px a petición
const MAX_HEIGHT = SCREEN_HEIGHT * 0.88 - 100;

export function BottomSheet({
  visible,
  onClose,
  beforeClose,
  children,
  header,
  onOpenComplete,
  onCloseComplete,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const [sheetHeight, setSheetHeight] = useState(0);

  const {
    internalVisible,
    handleClose,
    panGesture,
    sheetAnimatedStyle,
    overlayAnimatedStyle,
    headerAnimatedStyle,
  } = useBottomSheet({
    visible,
    onClose,
    beforeClose,
    onOpenComplete,
    onCloseComplete,
  });

  return (
    <Modal
      visible={internalVisible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={StyleSheet.absoluteFill}>
        {/* Toast en capa Z muy alta para modales */}
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 9999, elevation: 9999 }}>
          <Toast config={appToastConfig} position="top" topOffset={insets.top + 12} visibilityTime={3000} />
        </View>

        {/* Overlay oscuro */}
        <Animated.View
          style={[
            overlayAnimatedStyle,
            StyleSheet.absoluteFill,
            {
              backgroundColor: '#000000',
              zIndex: 10,
            },
          ]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        </Animated.View>

        {/* Header (actúa como fondo de agua y título) */}
        {header && sheetHeight > 0 && (
          <Animated.View
            style={[
              headerAnimatedStyle,
              {
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: sheetHeight + 170,
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
                overflow: 'hidden',
                zIndex: 50,
                pointerEvents: 'box-none',
              },
            ]}
          >
            {React.cloneElement(header as React.ReactElement<any>, {
              sheetHeight,
            })}
          </Animated.View>
        )}

        {/* Modal Blanco Principal */}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              sheetAnimatedStyle,
              {
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                maxHeight: MAX_HEIGHT,
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
                paddingBottom: insets.bottom,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -8 },
                shadowOpacity: 0.12,
                shadowRadius: 24,
                elevation: 24,
                zIndex: 100,
              },
            ]}
            onLayout={(e) => {
              const { height } = e.nativeEvent.layout;
              setSheetHeight(height);
            }}
          >
            <View className="items-center py-3">
              <View className="h-1 w-10 rounded-full bg-[#D1D5DB]" />
            </View>

            <View style={{ flexShrink: 1 }}>{children}</View>
          </Animated.View>
        </GestureDetector>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 9999, elevation: 9999 }} pointerEvents="box-none">
          <Toast config={appToastConfig} position="top" topOffset={insets.top + 12} visibilityTime={3000} />
        </View>
      </View>
    </Modal>
  );
}
