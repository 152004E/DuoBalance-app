import { View, Text, Pressable } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

interface CoupleDetailHeaderProps {
  title: string;
  subtitle: string;
  onBack: () => void;
  onMenu?: () => void;
}

export function CoupleDetailHeader({ title, subtitle, onBack, onMenu }: CoupleDetailHeaderProps) {
  return (
    <View className="mx-4 flex-row items-center rounded-[20px] bg-white px-4"
      style={{ height: 72, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 }}
    >
      <Pressable
        onPress={onBack}
        className="h-10 w-10 items-center justify-center"
      >
        <FontAwesome6 name="arrow-left" size={20} color="#0F766E" />
      </Pressable>

      <View className="flex-1 pl-3">
        <Text className="text-lg font-bold text-[#0F766E]" numberOfLines={1}>
          {title}
        </Text>
        <Text className="text-[13px] text-[#94A3B8]" numberOfLines={1}>
          {subtitle}
        </Text>
      </View>

      {onMenu && (
        <Pressable
          onPress={onMenu}
          className="h-10 w-10 items-center justify-center"
        >
          <FontAwesome6 name="ellipsis-vertical" size={18} color="#64748B" />
        </Pressable>
      )}
    </View>
  );
}
