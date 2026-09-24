import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HISTORY_KEY, STORAGE_KEY, readValue, writeValue } from "@/lib/market/storage";
import { DEFAULT_CURRENCY } from "@/lib/market/currencies";
import type { CategoryId, EditDraft, Item, Money, PriceHistory } from "@/lib/market/types";

function normalizeName(n: string) {
  return n.trim().toLowerCase();
}

function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return String(Date.now() + Math.random());
}

interface SavedShape {
  budget?: number | Money;
  items?: (Item & { currency?: string })[];
}

interface UseMarketListOptions {
  /** Currency new entries are typed in (the active display currency). */
  entryCurrency: string;
  /** Convert an amount stored in `from` into the display currency. */
  convert: (amount: number, from: string) => number;
}

export function useMarketList({ entryCurrency, convert }: UseMarketListOptions) {
  const [loaded, setLoaded] = useState(false);
  const [budget, setBudgetState] = useState<Money>({ amount: 0, currency: DEFAULT_CURRENCY });
  const [items, setItems] = useState<Item[]>([]);
  const [priceHistory, setPriceHistory] = useState<PriceHistory>({});

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showLimitBanner, setShowLimitBanner] = useState(false);
  const prevOverRef = useRef(false);

  // Load persisted state once (async so Capacitor Preferences drops in cleanly).
  useEffect(() => {
    let alive = true;
    (async () => {
      const saved = await readValue<SavedShape | null>(STORAGE_KEY, null);
      const history = await readValue<PriceHistory>(HISTORY_KEY, {});
      if (!alive) return;
      if (saved?.budget != null) {
        setBudgetState(
          typeof saved.budget === "number"
            ? { amount: saved.budget, currency: DEFAULT_CURRENCY }
            : saved.budget,
        );
      }
      if (saved?.items) {
        setItems(saved.items.map((i) => ({ ...i, currency: i.currency || DEFAULT_CURRENCY })));
      }
      setPriceHistory(history);
      setLoaded(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    void writeValue(STORAGE_KEY, { budget, items });
  }, [loaded, budget, items]);

  useEffect(() => {
    if (!loaded) return;
    void writeValue(HISTORY_KEY, priceHistory);
  }, [loaded, priceHistory]);

  // Budget is entered in whatever currency is on screen at the time.
  const setBudget = useCallback(
    (amount: number) => setBudgetState({ amount, currency: entryCurrency }),
    [entryCurrency],
  );

  const activeItems = useMemo(() => items.filter((i) => !i.bought), [items]);
  const boughtItems = useMemo(() => items.filter((i) => i.bought), [items]);

  // Every total is computed by converting each canonical stored value.
  const lineTotal = useCallback((i: Item) => i.qty * convert(i.price, i.currency), [convert]);

  const budgetDisplay = convert(budget.amount, budget.currency);
  const totalAll = items.reduce((sum, i) => sum + lineTotal(i), 0);
  const totalBought = boughtItems.reduce((sum, i) => sum + lineTotal(i), 0);

  const pct = budgetDisplay > 0 ? Math.min((totalAll / budgetDisplay) * 100, 100) : 0;
  const isOver = budgetDisplay > 0 && totalAll > budgetDisplay;
  const isNear = budgetDisplay > 0 && !isOver && totalAll >= budgetDisplay * 0.85;
  const remaining = budgetDisplay - totalAll;

  const itemsOverExpected = items.filter((i) => !!i.expectedPrice && i.price > (i.expectedPrice ?? 0));
  const totalOverage = itemsOverExpected.reduce(
    (sum, i) => sum + convert(i.price - (i.expectedPrice ?? 0), i.currency) * i.qty,
    0,
  );
  const itemsUnderExpected = items.filter((i) => !!i.expectedPrice && i.price < (i.expectedPrice ?? 0));
  const totalUnderage = itemsUnderExpected.reduce(
    (sum, i) => sum + convert((i.expectedPrice ?? 0) - i.price, i.currency) * i.qty,
    0,
  );

  useEffect(() => {
    if (isOver && !prevOverRef.current) setShowLimitBanner(true);
    prevOverRef.current = isOver;
  }, [isOver]);

  const recordPriceHistory = useCallback(
    (itemName: string, paidPrice: number, code: string) => {
      const key = normalizeName(itemName);
      if (!key || !paidPrice) return;
      setPriceHistory((prev) => ({
        ...prev,
        [key]: {
          lastPrice: paidPrice,
          lastCurrency: code,
          lastDate: new Date().toISOString().slice(0, 10),
        },
      }));
    },
    [],
  );

  const lookupPrice = useCallback(
    (rawName: string) => {
      const key = normalizeName(rawName);
      if (!key) return null;
      const record = priceHistory[key];
      if (!record) return null;
      return { ...record, lastCurrency: record.lastCurrency || DEFAULT_CURRENCY };
    },
    [priceHistory],
  );

  const addItem = useCallback(
    (draft: { name: string; qty: string; price: string; expectedPrice: string; category: CategoryId }) => {
      const trimmed = draft.name.trim();
      if (!trimmed) return false;
      const priceNum = parseFloat(draft.price) || 0;
      const expectedNum = parseFloat(draft.expectedPrice) || 0;
      const item: Item = {
        id: newId(),
        name: trimmed,
        qty: parseFloat(draft.qty) || 1,
        price: priceNum,
        expectedPrice: expectedNum || null,
        currency: entryCurrency,
        category: draft.category,
        bought: false,
      };
      setItems((prev) => [...prev, item]);
      recordPriceHistory(trimmed, priceNum, entryCurrency);
      return true;
    },
    [entryCurrency, recordPriceHistory],
  );

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const toggleBought = useCallback((id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, bought: !i.bought } : i)));
  }, []);

  const saveEdit = useCallback(
    (id: string, draft: EditDraft) => {
      setItems((prev) =>
        prev.map((i) => {
          if (i.id !== id) return i;
          const newPrice = parseFloat(draft.price) || 0;
          const newExpected = parseFloat(draft.expectedPrice) || 0;
          const newName = draft.name.trim() || i.name;
          recordPriceHistory(newName, newPrice, entryCurrency);
          return {
            ...i,
            name: newName,
            qty: parseFloat(draft.qty) || i.qty,
            price: newPrice,
            expectedPrice: newExpected || null,
            // Edited values are typed in the currency currently on screen.
            currency: entryCurrency,
            category: draft.category,
          };
        }),
      );
      setEditingId(null);
    },
    [entryCurrency, recordPriceHistory],
  );

  return {
    budget,
    budgetDisplay,
    setBudget,
    items,
    activeItems,
    boughtItems,
    lineTotal,
    totalAll,
    totalBought,
    pct,
    isOver,
    isNear,
    remaining,
    itemsOverExpected,
    totalOverage,
    itemsUnderExpected,
    totalUnderage,
    showLimitBanner,
    setShowLimitBanner,
    editingId,
    setEditingId,
    lookupPrice,
    addItem,
    deleteItem,
    toggleBought,
    saveEdit,
  };
}
