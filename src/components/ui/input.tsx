import { useState } from 'react';
import { TextInput, View, Text, type TextInputProps } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  iconLeft?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  iconLeft,
  helperText,
  className,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error
    ? '#EF4444'
    : isFocused
      ? '#10B981'
      : '#E2E8F0';

  const backgroundColor = isFocused
    ? '#FFFFFF'
    : '#F8FAFC';

  const iconColor = error
    ? '#EF4444'
    : isFocused
      ? '#10B981'
      : '#64748B';

  return (
    <View className="gap-1">
      {label && (
        <Text className="text-sm font-medium text-[#64748B]">
          {label}
        </Text>
      )}

      <View className="relative">
        {iconLeft && (
          <View className="absolute inset-y-0 left-0 z-10 items-center justify-center pl-4">
            <FontAwesome6
              name={iconLeft}
              size={16}
              color={iconColor}
            />
          </View>
        )}

        <TextInput
          className={`rounded-xl border py-3 text-[#0F172A] ${
            iconLeft ? 'pl-11 pr-4' : 'px-4'
          } ${className ?? ''}`}
          style={{
            borderColor,
            backgroundColor,
          }}
          placeholderTextColor="#94A3B8"
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
      </View>

      {error && (
        <Text className="text-xs text-[#EF4444]">
          {error}
        </Text>
      )}

      {helperText && !error && (
        <Text className="text-xs text-[#64748B]">
          {helperText}
        </Text>
      )}
    </View>
  );
}