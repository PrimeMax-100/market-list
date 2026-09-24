/**
 * Persistence layer.
 *
 * Async on purpose: swapping in Capacitor's Preferences plugin later only
 * means changing the two functions below, no call-site changes.
 *
 *   import { Preferences } from "@capacitor/preferences";
 *   await Preferences.set({ key, value });
 *   const { value } = await Preferences.get({ key });
 */

export const STORAGE_KEY = "market-list-v1";
export const HISTORY_KEY = "market-price-history-v1";

export async function readValue<T>(key: string, fallback: T): Promise<T> {
  try {
    if (typeof window === "undefined") return fallback;
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeValue(key: string, value: unknown): Promise<void> {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode / sandbox) — fail silently */
  }
}
