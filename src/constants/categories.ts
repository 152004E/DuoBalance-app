// ─── Catálogo central de categorías ────────────────────────────
// Fuente única de verdad para labels, emojis, iconos y colores.
// Las categorías "extra" se muestran dentro del expandible "Otros"
// del filtro (categorías menos conocidas pero válidas en la BD).

export interface CategoryMeta {
  value: string;
  label: string;
  emoji: string;
  icon: string; // FontAwesome6
  color: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    value: 'FOOD',
    label: 'Comida',
    emoji: '🍔',
    icon: 'utensils',
    color: '#F97316',
  },
  {
    value: 'TRANSPORT',
    label: 'Transporte',
    emoji: '🚗',
    icon: 'car',
    color: '#8B5CF6',
  },
  {
    value: 'RENT',
    label: 'Vivienda',
    emoji: '🏠',
    icon: 'house',
    color: '#3B82F6',
  },
  {
    value: 'SERVICES',
    label: 'Servicios',
    emoji: '💡',
    icon: 'bolt',
    color: '#F59E0B',
  },
  {
    value: 'ENTERTAINMENT',
    label: 'Entretención',
    emoji: '🎉',
    icon: 'film',
    color: '#06B6D4',
  },
  // Categorías menos conocidas → aparecen al expandir "Otros"
  {
    value: 'HEALTH',
    label: 'Salud',
    emoji: '💊',
    icon: 'heart-pulse',
    color: '#EF4444',
  },
  {
    value: 'EDUCATION',
    label: 'Educación',
    emoji: '📚',
    icon: 'graduation-cap',
    color: '#6366F1',
  },
  {
    value: 'SHOPPING',
    label: 'Compras',
    emoji: '🛍️',
    icon: 'bag-shopping',
    color: '#EC4899',
  },
  {
    value: 'SUBSCRIPTIONS',
    label: 'Suscripciones',
    emoji: '📺',
    icon: 'play',
    color: '#14B8A6',
  },
  {
    value: 'PETS',
    label: 'Mascotas',
    emoji: '🐾',
    icon: 'paw',
    color: '#A855F7',
  },
  {
    value: 'GIFTS',
    label: 'Regalos',
    emoji: '🎁',
    icon: 'gift',
    color: '#F43F5E',
  },
  {
    value: 'TRAVEL',
    label: 'Viajes',
    emoji: '✈️',
    icon: 'plane',
    color: '#0EA5E9',
  },
  {
    value: 'OTHER',
    label: 'Otros',
    emoji: '📦',
    icon: 'tag',
    color: '#64748B',
  },
];

// Categorías "principales" que se muestran siempre en el filtro
export const MAIN_CATEGORIES: CategoryMeta[] = CATEGORIES.filter((c) =>
  ['FOOD', 'TRANSPORT', 'RENT', 'SERVICES', 'ENTERTAINMENT'].includes(c.value),
);

// Categorías "extra" que aparecen al expandir "Otros"
export const EXTRA_CATEGORIES: CategoryMeta[] = CATEGORIES.filter((c) =>
  [
    'HEALTH',
    'EDUCATION',
    'SHOPPING',
    'SUBSCRIPTIONS',
    'PETS',
    'GIFTS',
    'TRAVEL',
  ].includes(c.value),
);

const FALLBACK: CategoryMeta = {
  value: 'OTHER',
  label: 'Otros',
  emoji: '📦',
  icon: 'tag',
  color: '#64748B',
};

export function getCategoryMeta(value?: string | null): CategoryMeta {
  return CATEGORIES.find((c) => c.value === value) ?? FALLBACK;
}

// Mapas derivados para compatibilidad con los consumidores existentes
export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c.label]),
);
export const CATEGORY_ICONS: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c.icon]),
);
export const CATEGORY_COLORS: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c.color]),
);
