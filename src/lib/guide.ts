import type { StepId } from "@shared/types";

export interface Explainer {
  title: string;
  body: string;
  /** Optional "how to use it" line, shown under the body. */
  tip?: string;
}

/** Every in-app explainer lives here so tours, info buttons and the help panel say the same thing. */
export const EXPLAIN = {
  anchors: {
    title: "What are “tastes”?",
    body: "Brands, artists, places or hobbies your customers love. Venn uses them to find other businesses whose customers love the same things.",
    tip: "Swipe through suggestions or type your own. 3 to 6 works best.",
  },
  fineTune: {
    title: "Fine-tune is optional",
    body: "Goals, distance, boldness and an avoid list. They change which kinds of partner are searched and how the top picks are ordered.",
    tip: "They never change a partner’s match score. Skip this on your first try.",
  },
  goals: {
    title: "Collaboration goals",
    body: "What you want from a partnership, like more footfall or a new audience. Venn uses these to break ties and to write a “goal fit” note.",
  },
  reach: {
    title: "How far to look",
    body: "“Just nearby” favours local places. “Local + known brands” also includes brands and artists with no fixed address. “Anywhere” drops the local preference.",
  },
  appetite: {
    title: "Appetite",
    body: "How big a collaboration you want. “Light” favours smaller partners for a quick trial. “Ambitious” favours bigger names.",
  },
  avoid: {
    title: "Avoid list",
    body: "Partner types or names you never want suggested, like “big chains” or a competitor.",
  },
  overlap: {
    title: "Overlap score",
    body: "How much your customers and a partner’s customers like the same things, out of 100. It comes from Qloo’s taste data about groups of people, not individuals.",
    tip: "Higher is better. It is relative to this search, so compare partners with each other.",
  },
  reach_level: {
    title: "How easy to approach",
    body: "Venn’s estimate from distance, size and how reachable the owner is. “Easy to reach” means you can probably just walk in or email. “Warm intro” means ask a mutual contact first. “Long shot” means big or far away.",
  },
  surprise: {
    title: "Safe fits vs wildcards",
    body: "Safe fits are partners that obviously suit you. Wildcards still share your customers’ taste but are less obvious, which can make a more memorable collaboration.",
    tip: "Slide right to bring wildcards to the top of every chart.",
  },
  realistic: {
    title: "Realistic for me",
    body: "Hides the long-shot partners (big brands, far away) so you only see ones you could contact this week.",
  },
  tasteMagnet: {
    title: "Taste magnets",
    body: "Each shared taste is a magnet. Press one and every chart highlights the partners that share it.",
    tip: "Drag a magnet over the orbit to pull those partners towards it. Let go and they snap back.",
  },
  orbit: {
    title: "How to read the orbit",
    body: "You are the coral dot in the middle. Each blue dot is a partner. The closer a dot is to the middle, the more customers you share.",
    tip: "Dots are grouped around the circle by kind (food, music, retail…). Click any dot to select that partner everywhere.",
  },
  picks: {
    title: "Start with these three",
    body: "Venn’s suggested first contacts: a mix of strong overlap and easy to approach, plus one pleasant surprise when the slider allows it.",
    tip: "If you only do one thing, message one of these.",
  },
  selected: {
    title: "The selected partner",
    body: "Everything about the partner you clicked: their overlap score, the tastes you share, and an idea for your first message.",
    tip: "“Draft outreach” writes a one-page pitch and email. “Add to shortlist” saves them for later.",
  },
  scatter: {
    title: "Overlap vs ease",
    body: "Further right means more shared customers. Higher up means easier to approach. The shaded “Message first” corner is where to start.",
    tip: "Move the safe-fits slider and this switches to overlap vs surprise.",
  },
  map: {
    title: "The map",
    body: "Pins show local partners. “Taste lift” shades the areas where people with your customers’ taste over-index, not just where it’s busy.",
    tip: "Brands and artists without a fixed address are listed under the map.",
  },
  flow: {
    title: "Where the overlap comes from",
    body: "Each band links one of your tastes to a partner. A thicker band means more of the match comes from that shared taste.",
  },
  compare: {
    title: "Your crowd vs theirs",
    body: "Your customers’ top tastes, scored for both crowds. Each bar shows what only you like, what you both like, and what only they like.",
  },
  themes: {
    title: "What your crowds have in common",
    body: "The shared tastes that turn up most across your top partners. These are good themes to build a collaboration around.",
  },
  shortlist: {
    title: "The shortlist",
    body: "Pin the partners you actually want to contact. Pinned partners stay at the top and go into the CSV download.",
    tip: "Click any row for the full evidence and to write a pitch.",
  },
  feasibility: {
    title: "Easy, warm intro, long shot",
    body: "How hard Venn thinks it will be to get a reply. It’s an estimate from size, distance and reachability, not a promise.",
  },
  goalFit: {
    title: "Goal fit",
    body: "How well a partner matches the goals you picked in Fine-tune. It only appears if you chose goals, and it never changes the match score.",
  },
  proof: {
    title: "What is Proof?",
    body: "A fairness check. Venn asks Qloo to score its own picks next to the “obvious” choice (like the most popular place) in the same request, so the numbers are directly comparable.",
    tip: "If Venn is ahead, its picks share more of your customers’ taste than the obvious option.",
  },
  checkPartner: {
    title: "Check a partner",
    body: "Have someone in mind already? Type their name and Venn scores them on the same scale, then adds them to the Overview as a dashed “Your pick”.",
  },
  brief: {
    title: "The collaboration brief",
    body: "A one-page pitch: the idea, why it fits (with sources), a first step, a two-week plan and a ready-to-edit email.",
    tip: "It’s a draft. Read and edit it before you send it.",
  },
  askVenn: {
    title: "Ask Venn",
    body: "Ask questions about this search in plain English, like “who should I contact first?”. Answers only use this search’s data, so it says when it doesn’t know.",
  },
  qlooLog: {
    title: "How Venn used Qloo",
    body: "Every request Venn sent to Qloo’s taste database during this search, step by step.",
  },
  qlooFeed: {
    title: "From Qloo",
    body: "The live requests Venn is sending to Qloo, the taste database it uses. Each line shows what was asked and how many results came back.",
  },
  research: {
    title: "What’s happening",
    body: "Venn is an agent: it plans its own searches, checks the results, and searches again if it hasn’t found enough. This usually takes under a minute.",
    tip: "You can cancel at any time. Refreshing the page reconnects to the same search.",
  },
} satisfies Record<string, Explainer>;

export type ExplainKey = keyof typeof EXPLAIN;

/** Plain-English "why" for each research step, shown under the active step. */
export const STEP_PLAIN: Record<StepId, string> = {
  resolve: "Turning the tastes you named into exact entries in Qloo’s taste database.",
  plan: "Deciding which kinds of business could suit you, like cafés, bands or shops, and where to look.",
  discover: "Asking Qloo which businesses of each kind your customers are most likely to love.",
  score: "Checking the match both ways: do your customers like them, and do their customers like your tastes?",
  enrich: "Adding the tastes you share and how popular each place is locally.",
  adapt: "If too few strong matches came back, Venn widens the search on its own.",
  assemble: "Ranking everyone, judging how easy each is to approach, and picking your top three.",
};

/** Short glossary for the help panel, in reading order. */
export const GLOSSARY: ExplainKey[] = [
  "anchors",
  "overlap",
  "reach_level",
  "surprise",
  "realistic",
  "tasteMagnet",
  "goalFit",
  "proof",
  "brief",
];

export interface TourStep {
  /** CSS selector of the element to spotlight; omitted for a centred step. */
  target?: string;
  title: string;
  body: string;
}

export const RESULTS_TOUR: TourStep[] = [
  {
    title: "Your results are ready",
    body: "This page shows the businesses whose customers like the same things as yours. Here’s a 60-second tour. You can replay it any time from Help.",
  },
  {
    target: ".ov-hero",
    title: "The headline",
    body: "A one-line summary of what Venn found, with four quick numbers: how many partners, the best overlap score, how many are easy to reach, and how many are close by.",
  },
  {
    target: ".ov-filters",
    title: "Filters apply everywhere",
    body: "Pick a kind of partner, slide between safe fits and wildcards, or switch on “Realistic for me” to hide long shots. Every chart below updates together.",
  },
  {
    target: "#c-orbit",
    title: "The orbit",
    body: EXPLAIN.orbit.body,
  },
  {
    target: "#c-picks",
    title: "Start with these three",
    body: "If you only do one thing, contact one of these. Click a name and every chart on the page follows that partner.",
  },
  {
    target: "#c-sel",
    title: "Why they match",
    body: "The tastes you share with the selected partner, an idea for your first message, and buttons to draft a full pitch or save them to your shortlist.",
  },
  {
    target: "#c-quad",
    title: "Who to message first",
    body: "Further right means more shared customers, higher up means easier to approach. Start with the shaded “Message first” corner.",
  },
  {
    target: ".ov-tabs",
    title: "More views",
    body: "Shortlist is a table where you pin partners and download a CSV. Proof checks Venn’s picks against the obvious choice.",
  },
  {
    target: ".ov-bar-r",
    title: "Ask, share, start again",
    body: "Ask Venn questions in plain English, see every Qloo request it made, share a read-only link, or start a new search. Help is here too.",
  },
];

const KEY_PREFIX = "venn.guide.";

export function guideSeen(key: string): boolean {
  try {
    return window.localStorage.getItem(KEY_PREFIX + key) === "1";
  } catch {
    return false;
  }
}

export function markGuideSeen(key: string): void {
  try {
    window.localStorage.setItem(KEY_PREFIX + key, "1");
  } catch {
    // Private mode or blocked storage: the guide simply shows again next time.
  }
}
