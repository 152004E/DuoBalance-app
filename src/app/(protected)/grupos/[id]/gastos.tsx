import { Redirect, useLocalSearchParams } from 'expo-router';

export default function GroupExpensesRedirect() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Redirect href={`/gastos/Movimientos?groupId=${id}`} />;
}
