import { Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

interface CoupleSelectorProps {
  coupleName: string;
  onPress?: () => void;
}

export function CoupleSelector({ coupleName, onPress }: CoupleSelectorProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="mt-6 flex-row items-center gap-2 rounded-full bg-white px-6 py-2 shadow-sm"
    >
      <Text className="text-base font-medium text-[#0F172A]">{coupleName}</Text>
      <FontAwesome6 name="chevron-down" size={14} color="#64748B" />
    </TouchableOpacity>
  );
}
