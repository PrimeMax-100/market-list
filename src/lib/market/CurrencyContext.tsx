import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { readValue, writeValue } from "./storage";
import { DEFAULT_CURRENCY } from "./currencies";
import { formatMoney } from "./currency";
import { convertAmount, fetchRates, isStale, readCachedRates, type RatesCache } from "./rates";
import { FALLBACK_RATES } from "./rates";

const DISPLAY_KEY = "market-display-currency-v1";

interface CurrencyContextValue {
  display: string;
  setDisplay: (code: string) => void;
  rates: Record<string, number>;
  /** Convert an amount stored in `from` into the active display currency. */
  convert: (amount: number, from: string) => number;
  /** Convert + format an amount stored in `from` for the active display currency. */
  show: (amount: number, from: string) => string;
  /** Format an amount already expressed in the display currency. */
  format: (amount: number) => string;
  stale: boolean;
  dismissStale: () => void;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [display, setDisplayState] = useState(DEFAULT_CURRENCY);
  const [cache, setCache] = useState<RatesCache>(FALLBACK_RATES);
  const [dismissed, setDismissed] = useState(false);

  // Load saved preference + cached rates, then refresh in the background.
  useEffect(() => {
    let alive = true;
    (async () => {
      const saved = await readValue<string | null>(DISPLAY_KEY, null);
      const cached = await readCachedRates();
      if (!alive) return;
      if (saved) setDisplayState(saved);
      setCache(cached);

      const fresh = await fetchRates();
      if (alive && fresh) {
        setCache(fresh);
        setDismissed(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Retry silently whenever the device comes back online.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onOnline = async () => {
      const fresh = await fetchRates();
      if (fresh) {
        setCache(fresh);
        setDismissed(false);
      }
    };
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, []);

  const setDisplay = useCallback((code: string) => {
    setDisplayState(code);
    void writeValue(DISPLAY_KEY, code);
  }, []);

  const value = useMemo<CurrencyContextValue>(() => {
    const convert = (amount: number, from: string) => convertAmount(amount, from, display, cache.rates);
    return {
      display,
      setDisplay,
      rates: cache.rates,
      convert,
      show: (amount: number, from: string) => formatMoney(convert(amount, from), display),
      format: (amount: number) => formatMoney(amount, display),
      stale: !dismissed && isStale(cache),
      dismissStale: () => setDismissed(true),
    };
  }, [display, cache, dismissed, setDisplay]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used inside CurrencyProvider");
  return ctx;
}
