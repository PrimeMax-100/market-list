import { PartyPopper } from "lucide-react";
import { useCurrency } from "@/lib/market/CurrencyContext";

interface TotalBarProps {
  count: number;
  totalAll: number;
  showSaved: boolean;
  remaining: number;
}

export function TotalBar({ count, totalAll, showSaved, remaining }: TotalBarProps) {
  const { format } = useCurrency();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-ink px-[18px] pb-[calc(0.875rem+env(safe-area-inset-bottom))] pt-3.5 text-ink-foreground">
      <div className="mx-auto grid max-w-[640px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-medium text-ink-muted">
            Total ({count} item{count !== 1 ? "s" : ""})
          </div>
          <div className="font-display truncate text-[21px] font-semibold">{format(totalAll)}</div>
        </div>
        {showSaved && (
          <div className="flex shrink-0 items-center gap-1.5 text-[13px] text-sage-bright">
            <PartyPopper size={16} /> Saved {format(remaining)}
          </div>
        )}
      </div>
    </div>
  );
}
