import { TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

interface FloatingAddButtonProps {
  onPress?: () => void;
}

export function FloatingAddButton({ onPress }: FloatingAddButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="absolute bottom-6 right-6 z-50 h-12 w-12 items-center justify-center rounded-full bg-[#10B981] shadow-lg"
    >
      <FontAwesome6 name="plus" size={28} color="white" />
    </TouchableOpacity>
  );
}
