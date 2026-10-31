import { Compass, X } from "lucide-react";
import { useEffect } from "react";
import { EXPLAIN, GLOSSARY } from "@/lib/guide";
import { useGuide } from "@/store/useGuide";
import { useVenn, type ResultsView } from "@/store/useVenn";

const VIEWS: { view: ResultsView; name: string; body: string }[] = [
  {
    view: "overview",
    name: "Overview",
    body: "Charts of every partner Venn found. Click any partner and every chart follows it.",
  },
  {
    view: "shortlist",
    name: "Shortlist",
    body: "The same partners as a table. Pin the ones you want to contact and download a CSV.",
  },
  {
    view: "proof",
    name: "Proof",
    body: "Checks Venn’s picks against the obvious choice, scored side by side by Qloo.",
  },
];

/** Results help: replay the tour, what each tab is for, and a short glossary. */
export function HelpPanel() {
  const open = useGuide((s) => s.helpOpen);
  const close = useGuide((s) => s.closeHelp);
  const startTour = useGuide((s) => s.startTour);
  const view = useVenn((s) => s.view);
  const setView = useVenn((s) => s.setView);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopImmediatePropagation();
      close();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, close]);

  if (!open) return null;

  const tour = () => {
    if (view !== "overview") setView("overview");
    // Let the Overview mount before the tour looks for its targets.
    window.setTimeout(startTour, view === "overview" ? 0 : 120);
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-ink/25" aria-hidden="true" onClick={close} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-panel-title"
        className="fixed inset-x-0 bottom-0 z-40 flex max-h-[85dvh] flex-col overflow-hidden rounded-t-[12px] border border-line bg-paper md:inset-y-0 md:right-0 md:left-auto md:max-h-none md:w-[26rem] md:rounded-none md:border-y-0 md:border-r-0"
      >
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2 id="help-panel-title" className="font-bold text-lg tracking-tight">
              How to use these results
            </h2>
            <p className="text-xs text-ink-soft">Plain-English help for every part of this page</p>
          </div>
          <button type="button" aria-label="Close help" onClick={close} className="min-h-11 min-w-11 rounded-full p-2 hover:bg-paper-2">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          <button
            type="button"
            onClick={tour}
            className="flex w-full items-center gap-3 rounded-2xl bg-ink px-4 py-3.5 text-left text-paper hover:bg-ink/90"
          >
            <Compass size={20} aria-hidden="true" />
            <span>
              <span className="block font-bold">Take the 60-second tour</span>
              <span className="block text-xs text-paper/75">A guided walk through each chart</span>
            </span>
          </button>

          <section>
            <h3 className="text-sm font-bold text-ink">In three steps</h3>
            <ol className="mt-2 space-y-2 text-sm leading-relaxed text-ink-soft">
              <li>
                <b className="text-ink">1. Look at &ldquo;Start with these three&rdquo;.</b> They&apos;re Venn&apos;s best first contacts.
              </li>
              <li>
                <b className="text-ink">2. Click a partner</b> to see why you match and an idea for a first message.
              </li>
              <li>
                <b className="text-ink">3. Press &ldquo;Draft outreach&rdquo;</b> for a ready pitch and email you can edit and send.
              </li>
            </ol>
          </section>

          <section>
            <h3 className="text-sm font-bold text-ink">The three views</h3>
            <ul className="mt-2 space-y-2">
              {VIEWS.map((item) => (
                <li key={item.view}>
                  <button
                    type="button"
                    onClick={() => {
                      setView(item.view);
                      close();
                    }}
                    className="w-full rounded-2xl border border-line px-3.5 py-2.5 text-left hover:border-ink"
                  >
                    <span className="flex items-center justify-between text-sm font-bold text-ink">
                      {item.name}
                      {view === item.view ? <span className="text-xs font-semibold text-ink-soft">You are here</span> : null}
                    </span>
                    <span className="mt-0.5 block text-sm leading-snug text-ink-soft">{item.body}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-bold text-ink">Words you&apos;ll see</h3>
            <dl className="mt-2 divide-y divide-line">
              {GLOSSARY.map((key) => {
                const item = EXPLAIN[key];
                return (
                  <div key={key} className="py-2.5">
                    <dt className="text-sm font-bold text-ink">{item.title}</dt>
                    <dd className="mt-0.5 text-sm leading-relaxed text-ink-soft">{item.body}</dd>
                  </div>
                );
              })}
            </dl>
          </section>

          <p className="rounded-2xl bg-[#F4F5F7] px-3.5 py-3 text-xs leading-relaxed text-ink-soft">
            Scores describe groups of people with similar taste, not individuals. Venn never uses your customer data.
            Look for the <span className="vg-info vg-info-inline" aria-hidden="true">i</span> buttons next to each
            section for more detail.
          </p>
        </div>
      </aside>
    </>
  );
}
