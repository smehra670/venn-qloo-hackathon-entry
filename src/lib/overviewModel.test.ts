import type { Partner } from "@shared/types";
import { describe, expect, it } from "vitest";
import { OVERVIEW_MAX, overviewPartners } from "./overviewModel";

function partner(id: string, matchScore: number, extra: Partial<Partner> = {}): Partner {
  return { id, name: id, kind: "food", matchScore, surprise: 0.2, local: true, ...extra } as Partner;
}

const opts = { kind: "all", realistic: false, surprise: 0 } as const;
const discovered = Array.from({ length: 19 }, (_, i) => partner(`p${i}`, 95 - i));

describe("overviewPartners", () => {
  it("caps the view at OVERVIEW_MAX", () => {
    expect(overviewPartners(discovered, opts)).toHaveLength(OVERVIEW_MAX);
  });

  it("keeps a low-scoring user pick inside the cap", () => {
    const pick = partner("mine", 40, { userAdded: true });
    const shown = overviewPartners([...discovered, pick], opts);
    expect(shown).toHaveLength(OVERVIEW_MAX);
    expect(shown.at(-1)?.id).toBe("mine");
  });

  it("still applies the kind filter to user picks", () => {
    const pick = partner("mine", 40, { userAdded: true, kind: "music" });
    const shown = overviewPartners([...discovered, pick], { ...opts, kind: "food" });
    expect(shown.some((p) => p.id === "mine")).toBe(false);
  });
});
