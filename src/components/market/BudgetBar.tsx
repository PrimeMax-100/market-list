import { useEffect, useState } from "react";
import { useCurrency } from "@/lib/market/CurrencyContext";

interface BudgetBarProps {
  budget: number;
  totalAll: number;
  remaining: number;
  pct: number;
  isOver: boolean;
  isNear: boolean;
  onSetBudget: (value: number) => void;
}

export function BudgetBar({ budget, totalAll, remaining, pct, isOver, isNear, onSetBudget }: BudgetBarProps) {
  const { format, display } = useCurrency();
  const [editing, setEditing] = useState(budget <= 0);
  const [input, setInput] = useState(budget ? String(budget) : "");

  useEffect(() => {
    if (budget > 0) setEditing(false);
  }, [budget]);

  const barColor = isOver ? "var(--color-alert)" : isNear ? "var(--color-near)" : "var(--color-primary)";

  if (editing) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSetBudget(parseFloat(input) || 0);
          setEditing(false);
        }}
        className="card-warm mb-[18px] flex items-center gap-2 px-4 py-4"
      >
        <label htmlFor="budget-input" className="shrink-0 text-sm font-medium text-subtle">
          Budget ({display})
        </label>
        <input
          id="budget-input"
          type="number"
          inputMode="decimal"
          min="0"
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="0"
          className="field min-w-0 flex-1 text-base"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Set
        </button>
      </form>
    );
  }

  return (
    <section className="card-warm mb-[18px] px-5 py-[18px]">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
        <div className="min-w-0">
          <div className="text-xs font-medium text-muted-foreground">Budget</div>
          <div className="font-display truncate text-[22px] font-semibold">{format(budget)}</div>
        </div>
        <button
          onClick={() => {
            setInput(String(Math.round(budget * 100) / 100 || ""));
            setEditing(true);
          }}
          className="shrink-0 text-[13px] text-subtle underline"
        >
          Change
        </button>
      </div>

      <div className="mt-2.5 h-2.5 overflow-hidden rounded-md bg-track">
        <div
          className="h-full transition-[width,background-color] duration-300 ease-out"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>

      <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-[13px] text-subtle">
        <span>
          Spent so far: <strong className="text-foreground">{format(totalAll)}</strong>
        </span>
        <span className={isOver ? "font-bold text-alert" : ""}>
          {isOver ? `Over by ${format(Math.abs(remaining))}` : `${format(remaining)} left`}
        </span>
      </div>
    </section>
  );
}
