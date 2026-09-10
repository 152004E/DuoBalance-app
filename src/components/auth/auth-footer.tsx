import { Text, View, Platform } from 'react-native';
import { Link, type Href } from 'expo-router';

interface AuthFooterProps {
  question: string;
  action: string;
  href: Href;
}

export function AuthFooter({ question, action, href }: AuthFooterProps) {
  const handlePress = () => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      if (
        document.activeElement instanceof HTMLElement &&
        document.activeElement !== document.body
      ) {
        document.activeElement.blur();
      }
    }
  };

  return (
    <View className="mt-auto flex-row justify-center pb-4 pt-8">
      <Text className="text-base text-[#0F172A]">
        {question}{' '}
        <Link
          href={href}
          className="font-semibold text-[#10B981]"
          onPress={handlePress}
        >
          {action}
        </Link>
      </Text>
    </View>
  );
}
