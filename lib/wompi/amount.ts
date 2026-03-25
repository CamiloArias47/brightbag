/**
 * Wompi espera el monto en centavos (1 COP = 100 centavos).
 * Ej.: $95.000 COP → 9.500.000
 */
export function copToAmountInCents(cop: number): number {
  return Math.round(Number(cop) * 100);
}
