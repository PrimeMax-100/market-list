import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { COUNTRY_CURRENCIES, findCountryByCurrency } from "@/lib/market/currencies";
import { useCurrency } from "@/lib/market/CurrencyContext";

export function CurrencyPicker() {
  const { display, setDisplay } = useCurrency();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const active = findCountryByCurrency(display);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COUNTRY_CURRENCIES.filter(
      (c) =>
        !q ||
        c.country.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.currencyName.toLowerCase().includes(q),
    ).sort((a, b) => a.country.localeCompare(b.country));
  }, [query]);

  return (
    <>
      <button
        onClick={() => {
          setQuery("");
          setOpen(true);
        }}
        aria-label={`Change currency, currently ${display}`}
        className="flex shrink-0 items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1.5 text-[13px] font-semibold"
      >
        <span aria-hidden>{active?.flag ?? "🏳️"}</span>
        <span>{display}</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Choose currency"
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[80vh] w-full max-w-[640px] flex-col rounded-t-2xl bg-card pb-[env(safe-area-inset-bottom)]"
          >
            <div className="flex items-center justify-between px-4 pb-2 pt-4">
              <h2 className="font-display text-lg font-semibold">Display currency</h2>
              <button onClick={() => setOpen(false)} aria-label="Close" className="p-1 text-subtle">
                <X size={18} />
              </button>
            </div>

            <div className="relative px-4 pb-3">
              <Search size={16} className="absolute left-7 top-1/2 -translate-y-[60%] text-faint" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search country or currency"
                aria-label="Search country or currency"
                className="field pl-9"
              />
            </div>

            <ul className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
              {results.map((c) => (
                <li key={`${c.country}-${c.code}`}>
                  <button
                    onClick={() => {
                      setDisplay(c.code);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left ${
                      c.code === display ? "bg-chip" : ""
                    }`}
                  >
                    <span className="text-lg" aria-hidden>
                      {c.flag}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px]">{c.country}</span>
                      <span className="block truncate text-xs text-faint">{c.currencyName}</span>
                    </span>
                    <span className="shrink-0 text-[13px] font-semibold text-subtle">{c.code}</span>
                  </button>
                </li>
              ))}
              {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-faint">No matches</li>}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
