import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { CATEGORIES } from "@/lib/market/categories";
import { useCurrency } from "@/lib/market/CurrencyContext";
import type { CategoryId, PriceRecord } from "@/lib/market/types";

interface AddItemFormProps {
  lookupPrice: (name: string) => PriceRecord | null;
  onAdd: (draft: {
    name: string;
    qty: string;
    price: string;
    expectedPrice: string;
    category: CategoryId;
  }) => boolean;
}

export function AddItemForm({ lookupPrice, onAdd }: AddItemFormProps) {
  const [name, setName] = useState("");
  const [qty, setQty] = useState("1");
  const [price, setPrice] = useState("");
  const [expectedPrice, setExpectedPrice] = useState("");
  const [category, setCategory] = useState<CategoryId>("produce");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { convert, format } = useCurrency();

  const lastPriceMatch = lookupPrice(name);
  const lastPriceConverted = lastPriceMatch
    ? Math.round(convert(lastPriceMatch.lastPrice, lastPriceMatch.lastCurrency) * 100) / 100
    : 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!onAdd({ name, qty, price, expectedPrice, category })) return;
        setName("");
        setQty("1");
        setPrice("");
        setExpectedPrice("");
        nameInputRef.current?.focus();
      }}
      className="card-warm mb-[22px] grid gap-2.5 p-4"
    >
      <input
        ref={nameInputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Item name (e.g. Rice, 5kg bag)"
        aria-label="Item name"
        className="field"
      />

      {lastPriceMatch && !price && (
        <button
          type="button"
          onClick={() => setPrice(String(lastPriceConverted))}
          className="flex items-center justify-between gap-2 rounded-lg border border-dashed border-line-strong bg-chip px-3 py-2 text-left text-[13px] text-subtle"
        >
          <span className="min-w-0 truncate">
            Last time: <strong className="text-foreground">{format(lastPriceConverted)}</strong>
            <span className="text-faint"> ({lastPriceMatch.lastDate})</span>
          </span>
          <span className="shrink-0 font-semibold text-primary">Use this</span>
        </button>
      )}

      <div className="grid grid-cols-[1fr_1.3fr_1.3fr] gap-2">
        <input
          type="number"
          inputMode="decimal"
          min="0"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          placeholder="Qty"
          aria-label="Quantity"
          className="field px-2"
        />
        <input
          type="number"
          inputMode="decimal"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price each"
          aria-label="Price each"
          className="field px-2"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as CategoryId)}
          aria-label="Category"
          className="field px-2 text-sm"
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <input
        type="number"
        inputMode="decimal"
        min="0"
        value={expectedPrice}
        onChange={(e) => setExpectedPrice(e.target.value)}
        placeholder="Expected price (optional — what you budgeted for this)"
        aria-label="Expected price"
        className="field text-sm"
      />

      <button
        type="submit"
        className="flex min-h-12 items-center justify-center gap-1.5 rounded-lg bg-ink text-[15px] font-semibold text-ink-foreground"
      >
        <Plus size={17} /> Add to list
      </button>
    </form>
  );
}
