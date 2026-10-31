import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { EXPLAIN, type ExplainKey } from "@/lib/guide";
import { cn } from "@/lib/cn";

const POP_W = 288;
const GAP = 8;
const EDGE = 12;

/** A small "i" button that opens a plain-language explainer from `EXPLAIN`. */
export function InfoButton({ topic, className, label }: { topic: ExplainKey; className?: string; label?: string }) {
  const item = EXPLAIN[topic];
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number; above: boolean } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const id = useId();

  const place = useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const width = Math.min(POP_W, window.innerWidth - EDGE * 2);
    const left = Math.min(Math.max(EDGE, r.left + r.width / 2 - width / 2), window.innerWidth - width - EDGE);
    const popH = popRef.current?.offsetHeight ?? 160;
    const above = r.bottom + GAP + popH > window.innerHeight - EDGE && r.top - GAP - popH > EDGE;
    setPos({ left, top: above ? r.top - GAP - popH : r.bottom + GAP, above });
  }, []);

  useLayoutEffect(() => {
    if (open) place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (popRef.current?.contains(target) || btnRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      // Close only this popover, not the drawer or dialog it sits in.
      event.stopImmediatePropagation();
      setOpen(false);
      btnRef.current?.focus();
    };
    const onMove = () => place();
    document.addEventListener("pointerdown", onDown, true);
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("resize", onMove);
    window.addEventListener("scroll", onMove, true);
    return () => {
      document.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("resize", onMove);
      window.removeEventListener("scroll", onMove, true);
    };
  }, [open, place]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className={cn("vg-info", open && "on", className)}
        aria-label={label ?? `What is this? ${item.title}`}
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={(event) => {
          // Info buttons sit inside clickable cards and labels; never trigger those.
          event.preventDefault();
          event.stopPropagation();
          setOpen((value) => !value);
        }}
      >
        <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="4.2" r="1.25" fill="currentColor" />
          <path d="M8 7v5.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      {open
        ? createPortal(
            <div
              ref={popRef}
              id={id}
              role="dialog"
              aria-label={item.title}
              className="vg-pop"
              style={{
                left: pos?.left ?? -9999,
                top: pos?.top ?? -9999,
                width: Math.min(POP_W, window.innerWidth - EDGE * 2),
              }}
            >
              <p className="vg-pop-t">{item.title}</p>
              <p className="vg-pop-b">{item.body}</p>
              {"tip" in item && item.tip ? <p className="vg-pop-tip">{item.tip}</p> : null}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
