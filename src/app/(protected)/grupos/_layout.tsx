import { Stack } from 'expo-router';

export default function ParejaLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="[id]/configuracion" />
    </Stack>
  );
}
