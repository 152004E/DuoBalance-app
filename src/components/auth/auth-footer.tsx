import { Text, View } from 'react-native';
import { Link, type Href } from 'expo-router';

interface AuthFooterProps {
  question: string;
  action: string;
  href: Href;
}

export function AuthFooter({ question, action, href }: AuthFooterProps) {
  return (
    <View className="mt-auto flex-row justify-center pb-4 pt-8">
      <Text className="text-base text-[#0F172A]">
        {question}{' '}
        <Link href={href} className="font-semibold text-[#10B981]">
          {action}
        </Link>
      </Text>
    </View>
  );
}
