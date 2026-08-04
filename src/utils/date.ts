// ─── Utilidades de fecha ─────────────────────────────────

/** Fecha relativa en español: Hoy / Ayer / Hace N días / dd mmm */
export function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (diffDays <= 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return date.toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
  });
}
