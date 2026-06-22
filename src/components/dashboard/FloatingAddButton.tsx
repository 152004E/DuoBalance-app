import { TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

interface FloatingAddButtonProps {
  onPress?: () => void;
  icon?: string;
  size?: number;
}

export function FloatingAddButton({ onPress, icon = 'plus', size = 48 }: FloatingAddButtonProps) {
  const iconSize = Math.round(size * 0.58);

  return (
    <TouchableOpacity
      onPress={onPress}
      className="absolute bottom-6 right-6 z-50 items-center justify-center rounded-full bg-[#10B981] shadow-lg"
      style={{ width: size, height: size }}
    >
      <FontAwesome6 name={icon as any} size={iconSize} color="white" />
    </TouchableOpacity>
  );
}
