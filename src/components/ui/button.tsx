import { useRef, useEffect } from 'react';
import { Pressable, Text, View, ActivityIndicator, Animated } from 'react-native';
import { Link } from 'expo-router';

type LoadingType = 'spinner' | 'dots' | 'pulse';
type ButtonVariant = 'primary' | 'success' | 'error' | 'secondary';

interface ButtonProps {
  to?: string;
  text: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
  loadingType?: LoadingType;
  loadingText?: string;
  variant?: ButtonVariant;
}

function LoadingDots() {
  const opacity1 = useRef(new Animated.Value(0)).current;
  const opacity2 = useRef(new Animated.Value(0)).current;
  const opacity3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = (opacity: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        ])
      );

    const anims = [anim(opacity1, 0), anim(opacity2, 150), anim(opacity3, 300)];
    anims.forEach((a) => a.start());
    return () => anims.forEach((a) => a.stop());
  }, []);

  return (
    <View className="flex-row gap-1">
      {[opacity1, opacity2, opacity3].map((opacity, i) => (
        <Animated.View
          key={i}
          style={{ opacity }}
          className="h-2 w-2 rounded-full bg-white"
        />
      ))}
    </View>
  );
}

function LoadingPulse() {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.3, duration: 750, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 750, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <View className="flex-row gap-1">
      {[0, 1, 2].map((_, i) => (
        <Animated.View
          key={i}
          style={{ opacity }}
          className="h-2 w-2 rounded-full bg-white"
        />
      ))}
    </View>
  );
}

const variantStyles: Record<ButtonVariant, { bg: string; text: string }> = {
  primary: { bg: 'bg-[#10B981]', text: 'text-white' },
  success: { bg: 'bg-[#22C55E]', text: 'text-[#0F172A]' },
  error: { bg: 'bg-[#EF4444]', text: 'text-white' },
  secondary: { bg: 'bg-[#0F766E]', text: 'text-white' },
};

export function Button({
  to,
  text,
  iconLeft,
  iconRight,
  onPress,
  disabled,
  className,
  isLoading = false,
  loadingType = 'spinner',
  loadingText,
  variant = 'primary',
}: ButtonProps) {
  const isDisabled = disabled || isLoading;
  const { bg, text: textColor } = variantStyles[variant];

  const renderLoading = () => {
    switch (loadingType) {
      case 'dots':
        return <LoadingDots />;
      case 'pulse':
        return <LoadingPulse />;
      default:
        return <ActivityIndicator size="small" color={variant === 'success' ? '#0F172A' : 'white'} />;
    }
  };

  const content = (
    <View className="flex-row items-center justify-center gap-2">
      {isLoading ? (
        <>
          {renderLoading()}
          <Text className={`text-base font-semibold ${textColor}`}>
            {loadingText || 'Cargando...'}
          </Text>
        </>
      ) : (
        <>
          {iconLeft}
          <Text className={`text-base font-semibold ${textColor}`}>{text}</Text>
          {iconRight}
        </>
      )}
    </View>
  );

  const pressableClasses = `items-center justify-center rounded-xl px-6 py-3 ${bg} ${isDisabled ? 'opacity-50' : ''} ${className ?? ''}`;

  if (to && !isLoading) {
    return (
      <Link href={to} asChild>
        <Pressable disabled={isDisabled} className={pressableClasses}>
          {content}
        </Pressable>
      </Link>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={pressableClasses}
    >
      {content}
    </Pressable>
  );
}
