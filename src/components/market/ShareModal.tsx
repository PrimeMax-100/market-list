import { useState } from "react";
import { Copy, Share2, X } from "lucide-react";

interface ShareModalProps {
  text: string;
  onClose: () => void;
}

export function ShareModal({ text, onClose }: ShareModalProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [showFallbackLinks, setShowFallbackLinks] = useState(false);
  const encoded = encodeURIComponent(text);

  function legacyCopy() {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "0";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }

  async function handleCopy() {
    let ok = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        ok = true;
      }
    } catch {
      ok = false;
    }
    if (!ok) ok = legacyCopy();
    setCopyState(ok ? "copied" : "failed");
    setTimeout(() => setCopyState("idle"), 2000);
  }

  async function handleNativeShare() {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "Market List", text });
        return;
      } catch (err) {
        if ((err as DOMException)?.name === "AbortError") return;
      }
    }
    setShowFallbackLinks(true);
  }

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Share your list"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/45"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[640px] rounded-t-2xl bg-background p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]"
      >
        <div className="mb-3.5 flex items-center justify-between">
          <h2 className="font-display text-[19px] font-semibold">Share your list</h2>
          <button onClick={onClose} aria-label="Close" className="p-1 text-subtle">
            <X size={20} />
          </button>
        </div>

        <div className="mb-3.5 max-h-[220px] overflow-y-auto rounded-[10px] border border-border bg-card p-3">
          <pre className="m-0 whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-foreground">{text}</pre>
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={handleCopy}
            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg border border-input bg-card px-3 text-sm font-semibold"
          >
            <Copy size={16} />
            {copyState === "copied" ? "Copied!" : copyState === "failed" ? "Couldn't copy" : "Copy text"}
          </button>
          <button
            onClick={handleNativeShare}
            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-ink px-3 text-sm font-semibold text-ink-foreground"
          >
            <Share2 size={16} /> Share…
          </button>
        </div>
        {showFallbackLinks ? (
          <div className="mt-3.5">
            <div className="grid grid-cols-3 gap-2.5">
              <a
                href={`https://wa.me/?text=${encoded}`}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-12 items-center justify-center rounded-lg border border-input bg-card px-2 text-sm font-semibold"
              >
                WhatsApp
              </a>
              <a
                href={`mailto:?subject=Market%20List&body=${encoded}`}
                className="flex min-h-12 items-center justify-center rounded-lg border border-input bg-card px-2 text-sm font-semibold"
              >
                Email
              </a>
              <a
                href={`sms:?&body=${encoded}`}
                className="flex min-h-12 items-center justify-center rounded-lg border border-input bg-card px-2 text-sm font-semibold"
              >
                SMS
              </a>
            </div>
            <p className="mt-2.5 text-center text-xs text-muted-foreground">
              Your phone's own share menu will be used once the app is installed on a phone.
            </p>
          </div>
        ) : (
          <p className="mt-2.5 text-center text-xs text-muted-foreground">
            Sends as plain text — works with WhatsApp, Messages, email, or notes.
          </p>
        )}
      </div>
    </div>
  );
}
