import { describe, expect, it } from "vitest";
import { rankResults } from "~/search/rankResults";
import type { ParsedQuery, SearchResult } from "~/search/types";

const query: ParsedQuery = {
  raw: "github",
  mode: "all",
  terms: ["github"],
  filters: {}
};

function result(partial: Partial<SearchResult>): SearchResult {
  return {
    id: partial.id ?? "id",
    source: partial.source ?? "history",
    title: partial.title ?? "Untitled",
    url: partial.url,
    domain: partial.domain,
    path: partial.path,
    score: 0,
    matchedFields: [],
    badges: [],
    actions: [],
    raw: partial.raw ?? {}
  };
}

describe("rankResults", () => {
  it("places open tab matches ahead of matching history results", () => {
    const ranked = rankResults(
      [
        result({ id: "history", source: "history", title: "GitHub", domain: "github.com" }),
        result({ id: "tab", source: "tabs", title: "GitHub", domain: "github.com" })
      ],
      query
    );

    expect(ranked[0]?.id).toBe("tab");
  });

  it("does not collapse duplicate URLs", () => {
    const ranked = rankResults(
      [
        result({ id: "tab-1", source: "tabs", title: "GitHub PR", domain: "github.com", url: "https://github.com/org/repo/pull/1" }),
        result({ id: "tab-2", source: "tabs", title: "GitHub PR", domain: "github.com", url: "https://github.com/org/repo/pull/1" })
      ],
      query
    );

    expect(ranked).toHaveLength(2);
    expect(ranked.map((item) => item.id)).toEqual(["tab-1", "tab-2"]);
  });
});
