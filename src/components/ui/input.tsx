import { TextInput, View, Text, type TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <View className="gap-1">
      {label && (
        <Text className="text-sm font-medium text-[#64748B]">{label}</Text>
      )}
      <TextInput
        className={`rounded-xl border bg-[#F8FAFC] px-4 py-3 text-[#0F172A] ${error ? 'border-[#EF4444]' : 'border-[#E2E8F0]'} ${className}`}
        placeholderTextColor="#64748B"
        {...props}
      />
      {error && <Text className="text-xs text-[#EF4444]">{error}</Text>}
    </View>
  );
}
