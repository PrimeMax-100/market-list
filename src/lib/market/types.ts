export type CategoryId = "produce" | "pantry" | "toiletries" | "household" | "other";

/** Canonical stored money: the original amount in the currency it was entered in. */
export interface Money {
  amount: number;
  currency: string;
}

export interface Item {
  id: string;
  name: string;
  qty: number;
  /** Original price per unit, in `currency`. Never rewritten on display-currency change. */
  price: number;
  expectedPrice: number | null;
  /** Currency the price/expectedPrice were originally entered in. */
  currency: string;
  category: CategoryId;
  bought: boolean;
}

export interface PriceRecord {
  lastPrice: number;
  lastCurrency: string;
  lastDate: string;
}

export type PriceHistory = Record<string, PriceRecord>;

export interface EditDraft {
  name: string;
  qty: string;
  price: string;
  expectedPrice: string;
  category: CategoryId;
}
