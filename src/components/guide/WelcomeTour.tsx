import { useEffect, useRef, useState, type ReactNode } from "react";
import { AmbientCircles } from "@/components/brand/AmbientCircles";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

interface Slide {
  kicker: string;
  title: string;
  body: string;
  art: ReactNode;
}

function VennArt() {
  return (
    <svg viewBox="0 0 260 120" className="h-full w-full" role="img" aria-label="Two overlapping circles: your customers and a partner's customers, sharing a slice of taste">
      <defs>
        <clipPath id="vg-w-clip">
          <circle cx="100" cy="60" r="50" />
        </clipPath>
      </defs>
      <circle cx="100" cy="60" r="50" fill="#FF6B57" />
      <circle cx="160" cy="60" r="50" fill="#4F5BFF" />
      <circle cx="160" cy="60" r="50" fill="#6B3FA0" clipPath="url(#vg-w-clip)" />
      <text x="72" y="64" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">You</text>
      <text x="188" y="64" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">Partner</text>
      <text x="130" y="64" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">Shared</text>
    </svg>
  );
}

function ChipsArt() {
  const chips = [
    { t: "Aesop", c: "bg-[#FFE8E3]" },
    { t: "Radiohead", c: "bg-[#E7E9FF]" },
    { t: "pilates", c: "bg-[#EDE5F7]" },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-3 px-2">
      <p className="text-sm text-ink">
        I run a <b className="border-b-2 border-ink">café</b> in <b className="border-b-2 border-ink">London</b>.
      </p>
      <p className="text-xs font-bold text-ink-soft">My customers love…</p>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <span key={chip.t} className={cn("rounded-full px-3 py-1.5 text-sm font-bold text-ink", chip.c)}>
            {chip.t}
          </span>
        ))}
      </div>
    </div>
  );
}

function StepsArt() {
  const steps = ["Understand your customers' taste", "Search for candidate partners", "Score how well each fits"];
  return (
    <ol className="flex h-full flex-col justify-center gap-2.5 px-2">
      {steps.map((step, i) => (
        <li key={step} className="flex items-center gap-3 text-sm">
          <span
            className={cn(
              "grid size-7 shrink-0 place-items-center rounded-full border-[1.5px] text-xs font-bold",
              i < 2 ? "border-ink bg-ink text-paper" : "border-ink text-ink",
            )}
          >
            {i < 2 ? "✓" : i + 1}
          </span>
          <span className={i < 2 ? "font-semibold text-ink" : "text-ink-soft"}>{step}</span>
        </li>
      ))}
    </ol>
  );
}

function ResultsArt() {
  const rows = [
    { n: "Rains", k: "Fashion", s: 88 },
    { n: "Tate Modern", k: "Culture", s: 81 },
    { n: "VIU Eyewear", k: "Retail", s: 77 },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-1.5 px-2">
      {rows.map((row, i) => (
        <div key={row.n} className="flex items-center gap-3 rounded-xl border border-line bg-paper px-3 py-1">
          <span className="text-xs font-bold text-ink-soft">{i + 1}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold text-ink">{row.n}</span>
            <span className="block text-xs text-ink-soft">{row.k}</span>
          </span>
          <span className="text-right text-lg font-bold leading-none text-ink">
            {row.s}
            <small className="block text-[10px] font-semibold text-ink-soft">overlap</small>
          </span>
        </div>
      ))}
    </div>
  );
}

const SLIDES: Slide[] = [
  {
    kicker: "Welcome to Venn",
    title: "Find businesses that share your customers",
    body: "If your customers love the same things as another business’s customers, you’re a natural fit for a collaboration. Venn finds those businesses for you.",
    art: <VennArt />,
  },
  {
    kicker: "Step 1 · about 1 minute",
    title: "Tell Venn what your customers love",
    body: "Pick your type of business and city, then add a few brands, artists, places or hobbies your customers love. Swipe through suggestions or type them.",
    art: <ChipsArt />,
  },
  {
    kicker: "Step 2 · under a minute",
    title: "Venn does the research",
    body: "It looks up those tastes in Qloo’s taste database, finds businesses whose customers like the same things, and scores each one. You can watch every step.",
    art: <StepsArt />,
  },
  {
    kicker: "Step 3",
    title: "Get a ranked list and a ready pitch",
    body: "See who overlaps most, who’s easiest to approach, and why. One click drafts a collaboration pitch and email you can edit and send.",
    art: <ResultsArt />,
  },
];

export function WelcomeTour({
  open,
  onClose,
  onTryExample,
}: {
  open: boolean;
  onClose: () => void;
  onTryExample: () => void;
}) {
  const [index, setIndex] = useState(0);
  const primaryRef = useRef<HTMLButtonElement>(null);
  const last = index === SLIDES.length - 1;
  const slide = SLIDES[index]!;

  useEffect(() => {
    if (open) setIndex(0);
  }, [open]);

  useEffect(() => {
    if (open) primaryRef.current?.focus();
  }, [open, index]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") setIndex((i) => Math.min(SLIDES.length - 1, i + 1));
      if (event.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/35 p-4 sm:items-center" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="vg-welcome-title"
        aria-describedby="vg-welcome-body"
        className="relative w-full max-w-lg overflow-hidden rounded-[24px] border border-line bg-paper"
        onClick={(event) => event.stopPropagation()}
      >
        <AmbientCircles subtle className="opacity-90" />
        <div className="relative z-10 max-h-[88dvh] overflow-y-auto p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">{slide.kicker}</p>
            <button type="button" className="min-h-9 text-sm font-semibold text-ink-soft hover:text-ink" onClick={onClose}>
              Skip
            </button>
          </div>

          <div className="mt-4 h-44 overflow-hidden rounded-[20px] border border-line bg-[#F8F8FA] p-3" key={index}>
            <div className="vg-fade h-full">{slide.art}</div>
          </div>

          <h2 id="vg-welcome-title" className="mt-6 text-balance text-[1.75rem] font-bold leading-[1.1] tracking-tight text-ink">
            {slide.title}
          </h2>
          <p id="vg-welcome-body" className="mt-3 text-base leading-relaxed text-ink-soft">
            {slide.body}
          </p>

          <div className="mt-6 flex items-center justify-between gap-3">
            <div className="flex gap-1.5" role="tablist" aria-label="Welcome slides">
              {SLIDES.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Slide ${i + 1} of ${SLIDES.length}`}
                  onClick={() => setIndex(i)}
                  className={cn("h-2 rounded-full transition-all", i === index ? "w-6 bg-ink" : "w-2 bg-line hover:bg-ink-soft")}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              {index > 0 ? (
                <Button type="button" variant="ghost" onClick={() => setIndex(index - 1)}>
                  Back
                </Button>
              ) : null}
              {last ? null : (
                <Button ref={primaryRef} type="button" onClick={() => setIndex(index + 1)}>
                  Next
                </Button>
              )}
            </div>
          </div>

          {last ? (
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              <Button ref={primaryRef} type="button" className="min-h-12" onClick={onTryExample}>
                Try a ready-made example
              </Button>
              <Button type="button" variant="secondary" className="min-h-12" onClick={onClose}>
                Use my own business
              </Button>
              <p className="text-xs leading-relaxed text-ink-soft sm:col-span-2">
                The example fills in a London café so you can see a full result in about a minute. You can reopen this guide from “How it works” at the top.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
