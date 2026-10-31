import type { BusinessInput, ResolvedAnchor } from "@shared/types";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ABSOLUTE_NORMALIZATION } from "../scoring.js";
import type { ProviderContext } from "../types.js";
import { QlooTasteProvider } from "./index.js";

const BRAND = "brand-1";
const PROXY = "place-1";

const ctx: ProviderContext = {
  signal: new AbortController().signal,
  async trace(_tool, _args, fn) {
    return fn();
  },
  decide() {
    // no-op: these tests don't inspect the decision log
  },
};

const input = { businessType: "cafe", city: "London", anchors: [] } as unknown as BusinessInput;
const resolved = [
  { input: "Yoga", status: "keyword", proxies: [{ id: PROXY, name: "Studio", entityType: "place" }] },
] as unknown as ResolvedAnchor[];

/** Answers Qloo's search and insights calls; `forward`/`reverse` are the entities each returns. */
function stubQloo(forward: unknown[], reverse: unknown[]) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string | URL) => {
      const parsed = new URL(String(url));
      const body = parsed.pathname.endsWith("/search")
        ? { results: [{ entity_id: BRAND, name: "Puma", types: ["urn:entity:brand"] }] }
        : { results: { entities: parsed.searchParams.get("signal.interests.entities") === BRAND ? reverse : forward } };
      return new Response(JSON.stringify(body), { status: 200, headers: { "Content-Type": "application/json" } });
    }),
  );
}

function check() {
  const frozen = { normalization: ABSOLUTE_NORMALIZATION, medianScore: 70 };
  return new QlooTasteProvider().checkPartner(input, resolved, { name: "Puma" }, frozen, ctx);
}

describe("Qloo checkPartner scoring", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("scores one direction with the discount when Qloo returns the entity with no forward affinity", async () => {
    // The real shape for a brand against place-only signals: present, but no affinity field.
    stubQloo([{ entity_id: BRAND, name: "Puma", query: { measurements: { audience_growth: 0 } } }], [{ entity_id: PROXY, name: "Studio", query: { affinity: 0.7 } }]);

    const partner = await check();

    expect(partner?.matchScore).toBe(63);
    expect(partner?.signals.affinityToPartner).toBe(0.7);
    const forward = partner?.evidence.find((item) => item.label === "Affinity to partner");
    expect(forward?.origin).toBe("interpretation");
    expect(forward?.value).toContain("couldn't measure");
  });

  it("uses mutual affinity when both directions are measured", async () => {
    stubQloo([{ entity_id: BRAND, name: "Puma", query: { affinity: 0.9 } }], [{ entity_id: PROXY, name: "Studio", query: { affinity: 0.6 } }]);

    expect((await check())?.matchScore).toBe(72);
  });

  it("returns null rather than a score of 0 when neither direction is measured", async () => {
    stubQloo([{ entity_id: BRAND, name: "Puma", query: { measurements: {} } }], []);

    expect(await check()).toBeNull();
  });
});
