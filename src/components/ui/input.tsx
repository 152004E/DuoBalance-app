import { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  Pressable,
  type TextInputProps,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  iconLeft?: string;
  iconRight?: string;
  onIconRightPress?: () => void;
  helperText?: string;
}

export function Input({
  label,
  error,
  iconLeft,
  iconRight,
  onIconRightPress,
  helperText,
  className,
  secureTextEntry,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = secureTextEntry === true;
  const resolvedSecureTextEntry = isPassword ? !showPassword : undefined;
  const resolvedIconRight = isPassword
    ? showPassword
      ? 'eye-slash'
      : 'eye'
    : iconRight;

  const borderColor = error ? '#EF4444' : isFocused ? '#10B981' : '#E2E8F0';

  const backgroundColor = isFocused ? '#FFFFFF' : '#F8FAFC';

  const iconColor = error ? '#EF4444' : isFocused ? '#10B981' : '#64748B';

  const handleRightIconPress = isPassword
    ? () => setShowPassword((prev) => !prev)
    : onIconRightPress;

  const leftPadding = iconLeft ? 'pl-11' : 'pl-4';
  const rightPadding = resolvedIconRight ? 'pr-11' : 'pr-4';

  return (
    <View className="gap-1">
      {label && (
        <Text className="text-sm font-medium text-[#64748B]">{label}</Text>
      )}

      <View className="relative">
        {iconLeft && (
          <View className="absolute inset-y-0 left-0 z-10 items-center justify-center pl-4">
            <FontAwesome6 name={iconLeft} size={16} color={iconColor} />
          </View>
        )}

        <TextInput
          className={`rounded-xl border py-3 text-[#0F172A] ${leftPadding} ${rightPadding} ${className ?? ''}`}
          style={{
            borderColor,
            backgroundColor,
          }}
          placeholderTextColor="#94A3B8"
          secureTextEntry={resolvedSecureTextEntry}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />

        {resolvedIconRight && (
          <Pressable
            onPress={handleRightIconPress}
            className="absolute inset-y-0 right-0 z-10 items-center justify-center pr-4"
          >
            <FontAwesome6
              name={resolvedIconRight}
              size={16}
              color={iconColor}
            />
          </Pressable>
        )}
      </View>

      {error && <Text className="text-xs text-[#EF4444]">{error}</Text>}

      {helperText && !error && (
        <Text className="text-xs text-[#64748B]">{helperText}</Text>
      )}
    </View>
  );
}
