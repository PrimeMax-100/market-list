// Single place for currency formatting.
export const CURRENCY_LOCALE = "en";
export const DEFAULT_CURRENCY_CODE = "NGN";

const cache = new Map<string, Intl.NumberFormat>();

function formatterFor(code: string): Intl.NumberFormat {
  const existing = cache.get(code);
  if (existing) return existing;
  let fmt: Intl.NumberFormat;
  try {
    // Intl supplies the right symbol and the right number of decimals per currency.
    fmt = new Intl.NumberFormat(CURRENCY_LOCALE, { style: "currency", currency: code });
  } catch {
    fmt = new Intl.NumberFormat(CURRENCY_LOCALE, { style: "currency", currency: "USD" });
  }
  cache.set(code, fmt);
  return fmt;
}

/** Format an amount already expressed in `code`. */
export function formatMoney(n: number | null | undefined, code: string = DEFAULT_CURRENCY_CODE): string {
  return formatterFor(code).format(n || 0);
}

/** Back-compat helper: formats in the default currency. */
export function currency(n: number | null | undefined): string {
  return formatMoney(n, DEFAULT_CURRENCY_CODE);
}
