import { Redirect, useLocalSearchParams } from 'expo-router';

export default function OldExpenseDetailRedirect() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Redirect href={`/gastos/detalle/${id}`} />;
}
