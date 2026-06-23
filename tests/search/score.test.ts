import { describe, expect, it } from "vitest";
import { scoreSearchResult } from "~/search/score";
import type { ParsedQuery, SearchResult } from "~/search/types";

const query: ParsedQuery = {
  raw: "github",
  mode: "all",
  terms: ["github"],
  filters: {}
};

describe("scoreSearchResult", () => {
  function result(partial: Partial<SearchResult>): SearchResult {
    return {
      id: partial.id ?? "id",
      source: partial.source ?? "tabs",
      title: partial.title ?? "Untitled",
      url: partial.url,
      domain: partial.domain,
      path: partial.path,
      score: 0,
      matchedFields: [],
      badges: partial.badges ?? [],
      actions: partial.actions ?? [],
      raw: partial.raw ?? {}
    };
  }

  it("weights title matches above domain matches", () => {
    const titleScore = scoreSearchResult(
      result({
        id: "1",
        source: "tabs",
        title: "GitHub permissions discussion",
        url: "https://example.com/thread",
        domain: "example.com",
        path: "/thread",
        badges: [],
        actions: [],
        raw: {}
      }),
      query
    );
    const domainScore = scoreSearchResult(
      result({
        id: "2",
        source: "tabs",
        title: "Permissions discussion",
        url: "https://github.com/org/repo",
        domain: "github.com",
        path: "/org/repo",
        badges: [],
        actions: [],
        raw: {}
      }),
      query
    );

    expect(titleScore.score).toBeGreaterThan(domainScore.score);
    expect(titleScore.matchedFields).toContain("title");
    expect(domainScore.matchedFields).toContain("domain");
  });

  it("adds small boosts for current window, recency, and pinned tabs", () => {
    const base = scoreSearchResult(
      result({
        id: "1",
        source: "tabs",
        title: "GitHub",
        domain: "github.com",
        path: "/",
        badges: [],
        actions: [],
        raw: { currentWindow: false, recentBoost: 0, pinned: false }
      }),
      query
    );
    const boosted = scoreSearchResult(
      result({
        id: "2",
        source: "tabs",
        title: "GitHub",
        domain: "github.com",
        path: "/",
        badges: [],
        actions: [],
        raw: { currentWindow: true, recentBoost: 8, pinned: true }
      }),
      query
    );

    expect(boosted.score).toBeGreaterThan(base.score);
  });

  it("matches small typos with fuzzy scoring", () => {
    const scored = scoreSearchResult(
      result({
        id: "1",
        source: "tabs",
        title: "GitHub Pull Requests",
        domain: "github.com",
        path: "/pulls"
      }),
      {
        raw: "githb",
        mode: "all",
        terms: ["githb"],
        filters: {}
      }
    );

    expect(Number.isFinite(scored.score)).toBe(true);
    expect(scored.matchedFields).toContain("title");
  });

  it("filters to current window when window:current is used", () => {
    const current = scoreSearchResult(
      result({
        title: "GitHub",
        domain: "github.com",
        raw: { currentWindow: true }
      }),
      {
        raw: "github window:current",
        mode: "all",
        terms: ["github"],
        filters: { window: "current" }
      }
    );
    const otherWindow = scoreSearchResult(
      result({
        title: "GitHub",
        domain: "github.com",
        raw: { currentWindow: false }
      }),
      {
        raw: "github window:current",
        mode: "all",
        terms: ["github"],
        filters: { window: "current" }
      }
    );

    expect(Number.isFinite(current.score)).toBe(true);
    expect(otherWindow.score).toBe(Number.NEGATIVE_INFINITY);
  });
});
