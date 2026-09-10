import { Text, Pressable } from 'react-native';

interface LoadMoreButtonProps {
  /** Cuántos elementos se están mostrando actualmente */
  visibleCount: number;
  /** Total de elementos disponibles */
  totalCount: number;
  /** Cuántos elementos agrega cada vez que se presiona */
  step?: number;
  /** Texto del botón (por defecto: 'Cargar más movimientos') */
  label?: string;
  /** Recibe el nuevo visibleCount (visibleCount + step) */
  onLoadMore: (newVisibleCount: number) => void;
}

export function LoadMoreButton({
  visibleCount,
  totalCount,
  step = 5,
  label = 'Cargar más movimientos',
  onLoadMore,
}: LoadMoreButtonProps) {
  if (visibleCount >= totalCount) return null;

  return (
    <Pressable
      onPress={() => onLoadMore(visibleCount + step)}
      className="flex-row items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white py-4 active:opacity-80"
    >
      <Text className="font-semibold text-[#0F766E]">
        {label}
      </Text>
      <Text className="text-[#0F766E] opacity-40">›</Text>
    </Pressable>
  );
}
