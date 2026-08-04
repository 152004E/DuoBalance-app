// ─── Utilidades de formato de montos ────────────────────

/**
 * Formatea el texto de un input de valor mientras el usuario escribe:
 * - Solo permite dígitos (ignora letras/símbolos)
 * - No permite empezar con 0 (el primer dígito nunca puede ser 0)
 * - Separa miles con punto: 2000 → "2.000", 1234567 → "1.234.567"
 */
export function formatAmountInput(raw: string): string {
  // Solo dígitos
  const digits = raw.replace(/\D/g, '');
  // No puede empezar con 0: elimina todos los ceros iniciales (0→'', 05→5)
  const trimmed = digits.replace(/^0+/, '');
  if (!trimmed) return '';
  // Separador de miles con punto
  return trimmed.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** Convierte el texto formateado ("2.000") a número (2000). */
export function parseAmount(text: string): number {
  const digits = text.replace(/\D/g, '');
  return digits ? parseInt(digits, 10) : 0;
}
