import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Check, CircleHelp, PartyPopper, Share2, ShoppingBag, WifiOff, X } from "lucide-react";

import { AddItemForm } from "@/components/market/AddItemForm";
import { BudgetBar } from "@/components/market/BudgetBar";
import { CategorySection } from "@/components/market/CategorySection";
import { CurrencyPicker } from "@/components/market/CurrencyPicker";
import { ItemRow } from "@/components/market/ItemRow";
import { OnboardingTour } from "@/components/market/OnboardingTour";
import { ShareModal } from "@/components/market/ShareModal";
import { TotalBar } from "@/components/market/TotalBar";
import { useMarketList } from "@/hooks/useMarketList";
import { CATEGORIES } from "@/lib/market/categories";
import { CurrencyProvider, useCurrency } from "@/lib/market/CurrencyContext";
import { buildShareText } from "@/lib/market/shareText";
import type { EditDraft, Item } from "@/lib/market/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Market List — Shopping Budget Tracker" },
      {
        name: "description",
        content:
          "Plan your market trip: set a budget, add items with prices, track spending live, and share your list.",
      },
      { property: "og:title", content: "Market List — Shopping Budget Tracker" },
      {
        property: "og:description",
        content:
          "Plan your market trip: set a budget, add items with prices, track spending live, and share your list.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MarketListPage,
});

const emptyDraft: EditDraft = { name: "", qty: "1", price: "", expectedPrice: "", category: "produce" };

function MarketListPage() {
  return (
    <CurrencyProvider>
      <MarketListView />
    </CurrencyProvider>
  );
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function MarketListView() {
  const { display, convert, format, show, stale, dismissStale } = useCurrency();
  const list = useMarketList({ entryCurrency: display, convert });
  const [editDraft, setEditDraft] = useState<EditDraft>(emptyDraft);
  const [showShare, setShowShare] = useState(false);
  const [tourReplayToken, setTourReplayToken] = useState(0);

  function startEdit(item: Item) {
    list.setEditingId(item.id);
    setEditDraft({
      name: item.name,
      qty: String(item.qty),
      // Edit in the currency currently on screen, converted from the stored original.
      price: String(round2(convert(item.price, item.currency))),
      expectedPrice: item.expectedPrice ? String(round2(convert(item.expectedPrice, item.currency))) : "",
      category: item.category,
    });
  }

  const rowProps = (item: Item) => ({
    item,
    isEditing: list.editingId === item.id,
    editDraft,
    setEditDraft,
    onToggle: () => list.toggleBought(item.id),
    onDelete: () => list.deleteItem(item.id),
    onStartEdit: () => startEdit(item),
    onSaveEdit: () => list.saveEdit(item.id, editDraft),
    onCancelEdit: () => list.setEditingId(null),
  });

  const shareText = buildShareText({
    items: list.items,
    budget: list.budgetDisplay,
    totalAll: list.totalAll,
    remaining: list.remaining,
    isOver: list.isOver,
    itemsOverExpected: list.itemsOverExpected,
    totalOverage: list.totalOverage,
    itemsUnderExpected: list.itemsUnderExpected,
    totalUnderage: list.totalUnderage,
    format,
    show,
    convert,
  });

  const showEstimates = list.itemsOverExpected.length > 0 || list.itemsUnderExpected.length > 0;

  return (
    <main className="min-h-dvh bg-background">
      <div className="mx-auto w-full max-w-[640px] px-[18px] pb-6 pt-7">
        <header className="mb-[22px] grid shrink-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5">
          <span className="grid size-[34px] shrink-0 place-items-center rounded-lg bg-primary">
            <ShoppingBag size={18} className="text-primary-foreground" />
          </span>
          <h1 className="font-display truncate text-[26px] font-semibold tracking-tight">Market List</h1>
          <div className="flex shrink-0 items-center gap-1.5">
            {list.items.length > 0 && (
              <button
                onClick={() => setShowShare(true)}
                aria-label="Share list"
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-[13px] font-semibold"
              >
                <Share2 size={15} /> Share
              </button>
            )}
            <button
              onClick={() => setTourReplayToken((token) => token + 1)}
              aria-label="Show tour again"
              title="Show tour again"
              className="grid size-8 shrink-0 place-items-center rounded-lg border border-border bg-card text-subtle"
            >
              <CircleHelp size={17} />
            </button>
            <div data-tour="currency">
              <CurrencyPicker />
            </div>
          </div>
        </header>

        {stale && (
          <div
            role="status"
            className="mb-[18px] flex shrink-0 items-start gap-2.5 rounded-xl border border-border bg-chip px-3.5 py-3"
          >
            <WifiOff size={16} className="mt-0.5 shrink-0 text-subtle" />
            <p className="flex-1 text-[13px] text-subtle">
              Conversion rates may be outdated — connect to the internet to update them.
            </p>
            <button onClick={dismissStale} aria-label="Dismiss rates notice" className="shrink-0 p-0.5 text-subtle">
              <X size={15} />
            </button>
          </div>
        )}

        <div data-tour="budget" className="shrink-0">
          <BudgetBar
            budget={list.budgetDisplay}
            totalAll={list.totalAll}
            remaining={list.remaining}
            pct={list.pct}
            isOver={list.isOver}
            isNear={list.isNear}
            onSetBudget={list.setBudget}
          />
        </div>

        {showEstimates && (
          <section className="card-warm mb-[18px] shrink-0 px-4 py-3.5">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              How your estimates held up
            </h2>
            {list.itemsOverExpected.length > 0 && (
              <div className="flex items-start gap-2 text-sm text-alert">
                <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                <span>
                  <strong>{list.itemsOverExpected.length}</strong> item
                  {list.itemsOverExpected.length !== 1 ? "s" : ""} cost more than expected —{" "}
                  <strong>{format(list.totalOverage)}</strong> over
                </span>
              </div>
            )}
            {list.itemsUnderExpected.length > 0 && (
              <div
                className={`flex items-start gap-2 text-sm text-primary ${
                  list.itemsOverExpected.length > 0 ? "mt-1.5" : ""
                }`}
              >
                <PartyPopper size={15} className="mt-0.5 shrink-0" />
                <span>
                  <strong>{list.itemsUnderExpected.length}</strong> item
                  {list.itemsUnderExpected.length !== 1 ? "s" : ""} cost less than expected —{" "}
                  <strong>{format(list.totalUnderage)}</strong> saved
                </span>
              </div>
            )}
          </section>
        )}

        {list.showLimitBanner && (
          <div
            role="alert"
            className="mb-[18px] flex shrink-0 items-start gap-2.5 rounded-xl border border-alert-border bg-alert-bg px-3.5 py-3"
          >
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-alert" />
            <p className="flex-1 text-sm text-alert-foreground">
              <strong>You've reached your budget limit.</strong> Consider removing an item or raising your budget.
            </p>
            <button
              onClick={() => list.setShowLimitBanner(false)}
              aria-label="Dismiss warning"
              className="shrink-0 p-0.5 text-alert"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div data-tour="item-form" className="shrink-0">
          <AddItemForm lookupPrice={list.lookupPrice} onAdd={list.addItem} />
        </div>

        <div data-tour="list" className={list.items.length > 0 ? "pb-24" : ""}>
          {list.items.length === 0 && (
            <div className="px-5 py-10 text-center text-faint">
              <ShoppingBag size={32} className="mx-auto mb-2.5 opacity-50" />
              <p className="text-[15px]">Your list is empty. Add the first thing you need.</p>
            </div>
          )}

          {CATEGORIES.map((cat) => {
            const catItems = list.activeItems.filter((i) => i.category === cat.id);
            if (catItems.length === 0) return null;
            return (
              <CategorySection key={cat.id} label={cat.label} dotColor={cat.dotVar}>
                {catItems.map((item) => (
                  <ItemRow key={item.id} {...rowProps(item)} />
                ))}
              </CategorySection>
            );
          })}

          {list.boughtItems.length > 0 && (
            <CategorySection
              className="mt-6"
              labelClassName="text-sage"
              icon={<Check size={14} className="shrink-0 text-sage" />}
              label={`Bought (${list.boughtItems.length}) · ${format(list.totalBought)}`}
            >
              {list.boughtItems.map((item) => (
                <ItemRow key={item.id} {...rowProps(item)} />
              ))}
            </CategorySection>
          )}
        </div>
      </div>

      {showShare && <ShareModal text={shareText} onClose={() => setShowShare(false)} />}
      <OnboardingTour replayToken={tourReplayToken} onClose={() => undefined} />

      {list.items.length > 0 && (
        <TotalBar
          count={list.items.length}
          totalAll={list.totalAll}
          remaining={list.remaining}
          showSaved={
            list.budgetDisplay > 0 && list.activeItems.length === 0 && list.boughtItems.length > 0 && !list.isOver
          }
        />
      )}
    </main>
  );
}
