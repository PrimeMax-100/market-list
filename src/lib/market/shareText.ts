import { CATEGORIES } from "./categories";
import type { Item } from "./types";

export interface ShareTextInput {
  items: Item[];
  budget: number;
  totalAll: number;
  remaining: number;
  isOver: boolean;
  itemsOverExpected: Item[];
  totalOverage: number;
  itemsUnderExpected: Item[];
  totalUnderage: number;
  /** Format an amount already in the display currency. */
  format: (amount: number) => string;
  /** Convert + format an amount stored in another currency. */
  show: (amount: number, from: string) => string;
  /** Convert an amount stored in another currency into display currency. */
  convert: (amount: number, from: string) => number;
}

export function buildShareText(input: ShareTextInput): string {
  const {
    items,
    budget,
    totalAll,
    remaining,
    isOver,
    itemsOverExpected,
    totalOverage,
    itemsUnderExpected,
    totalUnderage,
    format,
    show,
    convert,
  } = input;

  const lines: string[] = ["🛒 Market List", ""];
  if (budget > 0) lines.push(`Budget: ${format(budget)}`, "");

  CATEGORIES.forEach((cat) => {
    const catItems = items.filter((i) => i.category === cat.id);
    if (catItems.length === 0) return;
    lines.push(cat.label.toUpperCase());
    catItems.forEach((i) => {
      const mark = i.bought ? "[x]" : "[ ]";
      lines.push(
        `${mark} ${i.name} — ${i.qty} x ${show(i.price, i.currency)} = ${format(i.qty * convert(i.price, i.currency))}`,
      );
    });
    lines.push("");
  });

  lines.push(`Total: ${format(totalAll)}`);
  if (budget > 0) {
    lines.push(isOver ? `Over budget by ${format(Math.abs(remaining))}` : `${format(remaining)} remaining`);
  }
  if (itemsOverExpected.length > 0) {
    lines.push(
      "",
      `${itemsOverExpected.length} item(s) cost more than expected — total overage ${format(totalOverage)}`,
    );
  }
  if (itemsUnderExpected.length > 0) {
    lines.push(`${itemsUnderExpected.length} item(s) cost less than expected — saved ${format(totalUnderage)}`);
  }
  return lines.join("\n");
}
