import { Text } from 'react-native';

interface AmountProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'positive' | 'negative' | 'neutral';
}

const sizeMap = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-2xl font-bold',
};

const colorMap = {
  positive: 'text-[#22C55E]',
  negative: 'text-[#EF4444]',
  neutral: 'text-[#0F172A]',
};

export function Amount({
  value,
  size = 'md',
  variant = 'neutral',
}: AmountProps) {
  return (
    <Text className={`${sizeMap[size]} ${colorMap[variant]}`}>
      ${value.toLocaleString('es-CL')}
    </Text>
  );
}
