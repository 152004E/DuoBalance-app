import { Pressable, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type Provider = 'google' | 'apple';

interface SocialLoginButtonProps {
  provider: Provider;
  onPress?: () => void;
}

function GoogleIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.86 16.79 15.69 17.57V20.34H19.26C21.35 18.42 22.56 15.6 22.56 12.25Z"
        fill="#4285F4"
      />
      <Path
        d="M12 23C14.97 23 17.46 22.02 19.26 20.34L15.69 17.57C14.71 18.23 13.46 18.63 12 18.63C9.17 18.63 6.77 16.72 5.88 14.16H2.2V17.02C4.01 20.61 7.72 23 12 23Z"
        fill="#34A853"
      />
      <Path
        d="M5.88 14.16C5.65 13.48 5.52 12.76 5.52 12C5.52 11.24 5.65 10.52 5.88 9.84V6.98H2.2C1.46 8.46 1.04 10.18 1.04 12C1.04 13.82 1.46 15.54 2.2 17.02L5.88 14.16Z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.03L19.34 3.9C17.45 2.14 14.97 1.04 12 1.04C7.72 1.04 4.01 3.39 2.2 6.98L5.88 9.84C6.77 7.28 9.17 5.38 12 5.38Z"
        fill="#EA4335"
      />
    </Svg>
  );
}

function AppleIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16.1425 4.385C17.1513 3.16125 17.8225 1.45875 17.6363 0C16.425 0.05 14.6188 0.82375 13.585 2.025C12.6563 3.09 11.8388 4.82125 12.0488 6.5C13.4 6.605 15.1113 5.6325 16.1425 4.385ZM17.4725 15.6987C17.4425 12.5937 20.0075 11.135 20.125 11.0662C18.665 8.9225 16.425 8.60875 15.6663 8.58C13.7388 8.385 11.8488 9.72125 10.8613 9.72125C9.87375 9.72125 8.31875 8.60875 6.72125 8.63625C4.64625 8.66625 2.74875 9.775 1.68875 11.6263C-0.4575 15.3525 1.1475 20.8712 3.235 23.8825C4.25625 25.3587 5.46625 27.0113 7.0375 26.9537C8.5513 26.895 9.12375 25.9737 10.96 25.9737C12.7963 25.9737 13.3138 26.9537 14.885 26.925C16.5163 26.895 17.5375 25.4187 18.5563 23.945C19.725 22.235 20.2063 20.5737 20.2375 20.485C20.1988 20.4687 17.5025 19.4587 17.4725 15.6987Z"
        fill="white"
      />
    </Svg>
  );
}

const providerConfig = {
  google: {
    label: 'Continuar con Google',
    bg: 'bg-white',
    textColor: 'text-[#0F172A]',
    border: true,
    Icon: GoogleIcon,
  },
  apple: {
    label: 'Continuar con Apple',
    bg: 'bg-[#000000]',
    textColor: 'text-white',
    border: false,
    Icon: AppleIcon,
  },
};

export function SocialLoginButton({ provider, onPress }: SocialLoginButtonProps) {
  const config = providerConfig[provider];
  const { Icon } = config;

  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center justify-center gap-3 rounded-full py-3.5 shadow-sm ${config.bg} ${config.border ? 'border border-[#E2E8F0]' : ''}`}
    >
      <Icon />
      <Text className={`text-base font-semibold ${config.textColor}`}>
        {config.label}
      </Text>
    </Pressable>
  );
}