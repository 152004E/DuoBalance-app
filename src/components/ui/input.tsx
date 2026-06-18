import { TextInput, View, Text, type TextInputProps } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  iconLeft?: string;
  helperText?: string;
}

export function Input({ label, error, iconLeft, helperText, className, ...props }: InputProps) {
  return (
    <View className="gap-1">
      {label && (
        <Text className="text-sm font-medium text-[#64748B]">{label}</Text>
      )}
      <View className="relative">
        {iconLeft && (
          <View className="absolute inset-y-0 left-0 z-10 items-center justify-center pl-4">
            <FontAwesome6
              name={iconLeft}
              size={16}
              color="#64748B"
            />
          </View>
        )}
        <TextInput
          className={`rounded-xl border bg-[#F8FAFC] py-3 text-[#0F172A] ${iconLeft ? 'pl-11' : 'px-4'} ${error ? 'border-[#EF4444]' : 'border-[#E2E8F0]'} ${className}`}
          placeholderTextColor="#94A3B8"
          {...props}
        />
      </View>
      {error && <Text className="text-xs text-[#EF4444]">{error}</Text>}
      {helperText && !error && (
        <Text className="text-xs text-[#64748B]">{helperText}</Text>
      )}
    </View>
  );
}
