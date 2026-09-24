import { useEffect, useState } from "react";
import { X } from "lucide-react";

const TOUR_COMPLETED_KEY = "market-list-tour-completed-v1";

const STEPS = [
  {
    target: "budget",
    title: "Set your spending limit",
    description: "Enter your market budget, then tap Set to start tracking.",
  },
  {
    target: "item-form",
    title: "Build your list",
    description: "Add the item name, quantity, price, and category here.",
  },
  {
    target: "currency",
    title: "Choose your currency",
    description: "Tap here to search for a country and change displayed prices.",
  },
  {
    target: "list",
    title: "Keep track as you shop",
    description: "Your added items appear here, ready to check off or edit.",
  },
] as const;

interface HighlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface OnboardingTourProps {
  replayToken: number;
  onClose: () => void;
}

export function OnboardingTour({ replayToken, onClose }: OnboardingTourProps) {
  const [open, setOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [highlight, setHighlight] = useState<HighlightRect | null>(null);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(TOUR_COMPLETED_KEY) !== "true") setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    if (replayToken <= 0) return;
    setHighlight(null);
    setStepIndex(0);
    setOpen(true);
  }, [replayToken]);

  useEffect(() => {
    if (!open) return;

    const activeStep = STEPS[stepIndex];
    if (!activeStep) return;

    const target = document.querySelector<HTMLElement>(`[data-tour="${activeStep.target}"]`);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "center" });

    const updateHighlight = () => {
      const rect = target.getBoundingClientRect();
      const inset = 6;
      setHighlight({
        top: Math.max(8, rect.top - inset),
        left: Math.max(8, rect.left - inset),
        width: Math.min(window.innerWidth - 16, rect.width + inset * 2),
        height: rect.height + inset * 2,
      });
    };

    const timer = window.setTimeout(updateHighlight, 280);
    updateHighlight();
    window.addEventListener("resize", updateHighlight);
    window.addEventListener("scroll", updateHighlight, true);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", updateHighlight);
      window.removeEventListener("scroll", updateHighlight, true);
    };
  }, [open, stepIndex]);

  function finish() {
    try {
      window.localStorage.setItem(TOUR_COMPLETED_KEY, "true");
    } catch {
      // The tour can still close if browser storage is unavailable.
    }
    setOpen(false);
    onClose();
  }

  function goToStep(nextStep: number) {
    setHighlight(null);
    setStepIndex(nextStep);
  }

  if (!open || !highlight) return null;

  const step = STEPS[stepIndex];
  if (!step) return null;
  const panelHeight = 206;
  const spaceBelow = window.innerHeight - (highlight.top + highlight.height);
  const placeBelow = spaceBelow >= panelHeight + 16;
  const panelTop = placeBelow
    ? Math.min(highlight.top + highlight.height + 12, window.innerHeight - panelHeight - 12)
    : Math.max(12, highlight.top - panelHeight - 12);

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Market List tour">
      <div
        aria-hidden="true"
        className="tour-spotlight pointer-events-none fixed rounded-xl border-2 border-card transition-all duration-300"
        style={highlight}
      />

      <section
        className="fixed left-4 right-4 mx-auto max-w-[420px] rounded-xl border border-border bg-card p-4 shadow-lg motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2"
        style={{ top: panelTop }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase text-primary">Step {stepIndex + 1} of {STEPS.length}</p>
            <h2 className="font-display text-xl font-semibold">{step.title}</h2>
          </div>
          <button onClick={finish} aria-label="Skip tour" className="shrink-0 rounded-lg p-1.5 text-subtle">
            <X size={18} />
          </button>
        </div>

        <p className="mt-2 text-sm leading-5 text-subtle">{step.description}</p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5" aria-label={`${stepIndex + 1} of ${STEPS.length} steps`}>
            {STEPS.map((tourStep, index) => (
              <span
                key={tourStep.target}
                className={`size-2 rounded-full ${index === stepIndex ? "bg-primary" : "bg-track"}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={finish} className="px-2 py-2 text-sm font-semibold text-subtle">
              Skip
            </button>
            <button
              onClick={() => goToStep(Math.max(0, stepIndex - 1))}
              disabled={stepIndex === 0}
              className="rounded-lg border border-border px-3 py-2 text-sm font-semibold disabled:opacity-40"
            >
              Back
            </button>
            <button
              onClick={() => {
                if (stepIndex === STEPS.length - 1) finish();
                else goToStep(stepIndex + 1);
              }}
              className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-ink-foreground"
            >
              {stepIndex === STEPS.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}