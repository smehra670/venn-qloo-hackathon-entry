import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { markGuideSeen, RESULTS_TOUR, type TourStep } from "@/lib/guide";
import { useGuide } from "@/store/useGuide";

const PAD = 8;
const CARD_W = 340;
const EDGE = 12;

type Rect = { top: number; left: number; width: number; height: number };

function reducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/** Spotlight walk-through of the Overview. Steps whose target is not on screen are skipped. */
export function ResultsTour() {
  const open = useGuide((s) => s.tourOpen);
  const endTour = useGuide((s) => s.endTour);
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [cardH, setCardH] = useState(200);
  const cardRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const steps = useMemo<TourStep[]>(
    () => (open ? RESULTS_TOUR.filter((step) => !step.target || document.querySelector(step.target)) : []),
    [open],
  );
  const step = steps[index];
  const last = index === steps.length - 1;

  const finish = useCallback(() => {
    markGuideSeen("results");
    endTour();
  }, [endTour]);

  useEffect(() => {
    if (open) setIndex(0);
  }, [open]);

  const measure = useCallback(() => {
    if (!step?.target) {
      setRect(null);
      return;
    }
    const el = document.querySelector(step.target);
    if (!el) {
      setRect(null);
      return;
    }
    const r = el.getBoundingClientRect();
    setRect({ top: r.top - PAD, left: r.left - PAD, width: r.width + PAD * 2, height: r.height + PAD * 2 });
  }, [step]);

  // Bring the target into view, then measure once the scroll settles.
  useEffect(() => {
    if (!open || !step) return;
    const el = step.target ? document.querySelector(step.target) : null;
    if (el instanceof HTMLElement) {
      el.dataset.in = "1";
      el.scrollIntoView({ block: "center", behavior: reducedMotion() ? "auto" : "smooth" });
    }
    measure();
    const t = window.setTimeout(measure, reducedMotion() ? 0 : 420);
    return () => window.clearTimeout(t);
  }, [open, step, measure]);

  useEffect(() => {
    if (!open) return;
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [open, measure]);

  useLayoutEffect(() => {
    if (cardRef.current) setCardH(cardRef.current.offsetHeight);
  }, [index, open, rect]);

  useEffect(() => {
    if (open) nextRef.current?.focus({ preventScroll: true });
  }, [open, index]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopImmediatePropagation();
        finish();
      } else if (event.key === "ArrowRight") {
        setIndex((i) => Math.min(steps.length - 1, i + 1));
      } else if (event.key === "ArrowLeft") {
        setIndex((i) => Math.max(0, i - 1));
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, finish, steps.length]);

  if (!open || !step) return null;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = Math.min(CARD_W, vw - EDGE * 2);
  const narrow = vw < 640;

  let cardStyle: React.CSSProperties;
  if (!rect || narrow) {
    cardStyle = narrow
      ? { left: EDGE, right: EDGE, bottom: EDGE }
      : { left: (vw - width) / 2, top: Math.max(EDGE, (vh - cardH) / 2), width };
    // On a phone, a target in the bottom half pushes the card to the top instead.
    if (narrow && rect && rect.top + rect.height / 2 > vh / 2) cardStyle = { left: EDGE, right: EDGE, top: EDGE };
  } else {
    const below = rect.top + rect.height + 12;
    const above = rect.top - 12 - cardH;
    const centredLeft = Math.min(Math.max(EDGE, rect.left + rect.width / 2 - width / 2), vw - width - EDGE);
    const sideTop = Math.max(EDGE, Math.min(vh - cardH - EDGE, rect.top + 24));
    if (below + cardH <= vh - EDGE) {
      cardStyle = { left: centredLeft, top: below, width };
    } else if (above >= EDGE) {
      cardStyle = { left: centredLeft, top: above, width };
    } else if (rect.left + rect.width + 12 + width <= vw - EDGE) {
      // Tall target: sit beside it rather than on top of its title.
      cardStyle = { left: rect.left + rect.width + 12, top: sideTop, width };
    } else if (rect.left - 12 - width >= EDGE) {
      cardStyle = { left: rect.left - 12 - width, top: sideTop, width };
    } else {
      cardStyle = { left: vw - width - EDGE, top: vh - cardH - EDGE, width };
    }
  }

  return createPortal(
    <div className="vg-tour" role="presentation">
      <div className="vg-tour-catch" onClick={finish} aria-hidden="true" />
      {rect ? (
        <div
          className="vg-spot"
          aria-hidden="true"
          style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
        />
      ) : (
        <div className="vg-dim" aria-hidden="true" />
      )}
      <div
        ref={cardRef}
        className="vg-tour-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vg-tour-title"
        aria-describedby="vg-tour-body"
        style={cardStyle}
      >
        <div className="vg-tour-top">
          <span>
            {index + 1} of {steps.length}
          </span>
          <button type="button" onClick={finish}>
            Skip tour
          </button>
        </div>
        <h2 id="vg-tour-title">{step.title}</h2>
        <p id="vg-tour-body">{step.body}</p>
        <div className="vg-tour-bar" aria-hidden="true">
          <i style={{ width: `${((index + 1) / steps.length) * 100}%` }} />
        </div>
        <div className="vg-tour-acts">
          {index > 0 ? (
            <button type="button" className="vg-btn is-ghost" onClick={() => setIndex(index - 1)}>
              Back
            </button>
          ) : null}
          <button
            ref={nextRef}
            type="button"
            className="vg-btn"
            onClick={() => (last ? finish() : setIndex(index + 1))}
          >
            {last ? "Got it" : index === 0 ? "Show me around" : "Next"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
