import type { FilterCategory, FilterState } from '@/types/filter';

// El workspace representa el "espacio de trabajo" actual de la aplicación:
// sobre qué categoría de grupos (o grupo específico) el usuario está operando.
// Es exactamente el mismo dato que FilterState, con un nombre que refleja el dominio:
// no es un filtro visual, es el contexto global desde el que trabaja toda la app.

export type WorkspaceCategory = FilterCategory;
export type WorkspaceState = FilterState;
