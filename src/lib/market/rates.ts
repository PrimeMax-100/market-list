import { readValue, writeValue } from "./storage";

export const RATES_KEY = "market-rates-v1";
export const STALE_AFTER_MS = 7 * 24 * 60 * 60 * 1000;

export interface RatesCache {
  base: string; // always "USD"
  rates: Record<string, number>; // 1 USD = rate units of currency
  fetchedAt: number; // epoch ms
}

// Offline seed so conversions work before the first successful fetch.
export const FALLBACK_RATES: RatesCache = {
  base: "USD",
  fetchedAt: 0,
  rates: {
    USD: 1, NGN: 1550, EUR: 0.92, GBP: 0.78, JPY: 152, CNY: 7.2, INR: 83.4,
    CAD: 1.36, AUD: 1.52, NZD: 1.64, CHF: 0.88, SEK: 10.5, NOK: 10.7, DKK: 6.9,
    PLN: 3.95, CZK: 23.2, HUF: 360, RON: 4.57, TRY: 32.5, ZAR: 18.6, GHS: 14.5,
    KES: 130, TZS: 2600, UGX: 3800, RWF: 1300, ZMW: 26, EGP: 48, MAD: 9.9,
    TND: 3.1, XOF: 603, XAF: 603, ETB: 57, AED: 3.67, SAR: 3.75, QAR: 3.64,
    KWD: 0.31, JOD: 0.71, ILS: 3.7, PKR: 278, BDT: 117, IDR: 15800, MYR: 4.7,
    SGD: 1.34, HKD: 7.8, KRW: 1340, THB: 36, PHP: 56, VND: 25000, BRL: 5.4,
    ARS: 900, CLP: 950, COP: 3900, MXN: 17.5, PEN: 3.75,
  },
};

export async function readCachedRates(): Promise<RatesCache> {
  const cached = await readValue<RatesCache | null>(RATES_KEY, null);
  if (cached?.rates && Object.keys(cached.rates).length > 0) return cached;
  return FALLBACK_RATES;
}

export async function fetchRates(): Promise<RatesCache | null> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    if (!res.ok) return null;
    const json = (await res.json()) as { result?: string; rates?: Record<string, number> };
    if (json.result !== "success" || !json.rates) return null;
    const fresh: RatesCache = { base: "USD", rates: json.rates, fetchedAt: Date.now() };
    await writeValue(RATES_KEY, fresh);
    return fresh;
  } catch {
    return null;
  }
}

export function isStale(cache: RatesCache): boolean {
  return Date.now() - cache.fetchedAt > STALE_AFTER_MS;
}

/** Convert an amount from its original currency into the target currency. */
export function convertAmount(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number>,
): number {
  if (!amount) return 0;
  if (from === to) return amount;
  const fromRate = rates[from];
  const toRate = rates[to];
  if (!fromRate || !toRate) return amount;
  return (amount / fromRate) * toRate;
}
