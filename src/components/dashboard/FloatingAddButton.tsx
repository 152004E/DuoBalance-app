import { TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

interface FloatingAddButtonProps {
  onPress?: () => void;
  icon?: string;
  size?: number;
}

export function FloatingAddButton({ onPress, icon = 'plus', size = 28 }: FloatingAddButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="absolute bottom-6 right-6 z-50 h-12 w-12 items-center justify-center rounded-full bg-[#10B981] shadow-lg"
    >
      <FontAwesome6 name={icon as any} size={size} color="white" />
    </TouchableOpacity>
  );
}
