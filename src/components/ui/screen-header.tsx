import { View, Text, Pressable } from 'react-native';
import AnimatedReanimated, { FadeInDown } from 'react-native-reanimated';
import { FontAwesome6 } from '@expo/vector-icons';

interface ScreenHeaderProps {
  title: string;
  subtitle: string;
  onBack: () => void;
  onAction?: () => void;
  actionIcon?: string;
  actionColor?: string;
}

export function ScreenHeader({
  title,
  subtitle,
  onBack,
  onAction,
  actionIcon = 'ellipsis-vertical',
  actionColor = '#64748B',
}: ScreenHeaderProps) {
  return (
    <AnimatedReanimated.View entering={FadeInDown.delay(300).duration(400)}>
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

        {onAction && (
          <Pressable
            onPress={onAction}
            className="h-10 w-10 items-center justify-center"
          >
            <FontAwesome6 name={actionIcon} size={18} color={actionColor} />
          </Pressable>
        )}
      </View>
    </AnimatedReanimated.View>
  );
}