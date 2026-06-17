import { View, type ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  variant?: 'default' | 'highlight';
}

export function Card({
  variant = 'default',
  className,
  children,
  ...props
}: CardProps) {
  return (
    <View
      className={`rounded-2xl p-4 ${variant === 'highlight' ? 'bg-[#0F766E]' : 'bg-white'} shadow-sm ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}
