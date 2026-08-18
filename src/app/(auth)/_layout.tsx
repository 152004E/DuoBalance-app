import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="restablecer-contrasena" />
      <Stack.Screen name="verificar-correo" />
      <Stack.Screen name="verify-email" />
    </Stack>
  );
}
