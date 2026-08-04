import { Stack } from 'expo-router';

export default function PerfilLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="editar" />
      <Stack.Screen name="notificaciones" />
      <Stack.Screen name="seguridad" />
      <Stack.Screen name="acerca" />
    </Stack>
  );
}
