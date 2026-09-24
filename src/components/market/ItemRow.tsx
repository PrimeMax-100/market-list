import { AlertTriangle, Check, Pencil, Trash2, X } from "lucide-react";
import { CATEGORIES } from "@/lib/market/categories";
import { useCurrency } from "@/lib/market/CurrencyContext";
import type { CategoryId, EditDraft, Item } from "@/lib/market/types";

interface ItemRowProps {
  item: Item;
  isEditing: boolean;
  editDraft: EditDraft;
  setEditDraft: React.Dispatch<React.SetStateAction<EditDraft>>;
  onToggle: () => void;
  onDelete: () => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
}

export function ItemRow({
  item,
  isEditing,
  editDraft,
  setEditDraft,
  onToggle,
  onDelete,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
}: ItemRowProps) {
  const { convert, format } = useCurrency();
  // Always convert from the canonical stored value in the item's original currency.
  const unitPrice = convert(item.price, item.currency);
  const lineTotal = item.qty * unitPrice;
  const expected = item.expectedPrice ?? 0;
  const expectedDisplay = convert(expected, item.currency);
  const priceJumped = expected > 0 && item.price > expected;
  const priceDiff = priceJumped ? unitPrice - expectedDisplay : 0;

  if (isEditing) {
    return (
      <div className="flex flex-col gap-1.5 rounded-[10px] border border-line-strong bg-card p-2.5">
        <input
          value={editDraft.name}
          onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))}
          aria-label="Item name"
          className="field rounded-md px-2 py-1.5 text-sm"
        />
        <div className="flex gap-1.5">
          <input
            type="number"
            inputMode="decimal"
            value={editDraft.qty}
            onChange={(e) => setEditDraft((d) => ({ ...d, qty: e.target.value }))}
            placeholder="Qty"
            aria-label="Quantity"
            className="field w-1/4 rounded-md px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            inputMode="decimal"
            value={editDraft.price}
            onChange={(e) => setEditDraft((d) => ({ ...d, price: e.target.value }))}
            placeholder="Price paid"
            aria-label="Price paid"
            className="field w-[37.5%] rounded-md px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            inputMode="decimal"
            value={editDraft.expectedPrice}
            onChange={(e) => setEditDraft((d) => ({ ...d, expectedPrice: e.target.value }))}
            placeholder="Expected"
            aria-label="Expected price"
            className="field w-[37.5%] rounded-md px-2 py-1.5 text-sm"
          />
        </div>
        <select
          value={editDraft.category}
          onChange={(e) => setEditDraft((d) => ({ ...d, category: e.target.value as CategoryId }))}
          aria-label="Category"
          className="field rounded-md px-2 py-1.5 text-sm"
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <div className="flex gap-1.5">
          <button
            onClick={onSaveEdit}
            className="min-h-11 flex-1 rounded-md bg-primary py-2 text-[13px] font-semibold text-primary-foreground"
          >
            Save
          </button>
          <button
            onClick={onCancelEdit}
            aria-label="Cancel edit"
            className="grid min-h-11 w-12 place-items-center rounded-md bg-secondary text-subtle"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2.5 rounded-[10px] border bg-card px-3 py-2.5 ${
        priceJumped ? "border-alert-border" : "border-border"
      } ${item.bought ? "opacity-55" : ""}`}
    >
      <button
        onClick={onToggle}
        aria-label={item.bought ? "Mark as not bought" : "Mark as bought"}
        className={`grid size-[22px] shrink-0 place-items-center rounded-full ${
          item.bought ? "bg-primary" : "border-2 border-line-strong"
        }`}
      >
        {item.bought && <Check size={13} className="text-primary-foreground" />}
      </button>

      <div className="min-w-0 flex-1">
        <div className={`truncate text-[15px] font-medium ${item.bought ? "line-through" : ""}`}>{item.name}</div>
        <div className="text-xs text-muted-foreground">
          {item.qty} × {format(unitPrice)}
          {expected > 0 ? <span className="text-faint"> · expected {format(expectedDisplay)}</span> : null}
        </div>
        {priceJumped && (
          <div className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-alert">
            <AlertTriangle size={12} className="shrink-0" /> {format(priceDiff)} more than expected
          </div>
        )}
      </div>

      <div className="shrink-0 whitespace-nowrap text-[15px] font-semibold">{format(lineTotal)}</div>

      {!item.bought && (
        <button onClick={onStartEdit} aria-label="Edit item" className="shrink-0 p-1.5 text-muted-foreground">
          <Pencil size={15} />
        </button>
      )}
      <button onClick={onDelete} aria-label="Delete item" className="shrink-0 p-1.5 text-alert">
        <Trash2 size={15} />
      </button>
    </div>
  );
}
