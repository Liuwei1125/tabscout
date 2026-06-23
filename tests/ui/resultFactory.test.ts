import { describe, expect, it } from "vitest";
import { bookmarkResultsFromItems, historyResultsFromItems, tabResultsFromTabs } from "~/search/resultFactory";
import type { NormalizedTab } from "~/shared/types";

describe("tabResultsFromTabs", () => {
  it("adds duplicate and group badges", () => {
    const tabs: NormalizedTab[] = [
      { id: 1, windowId: 1, index: 0, title: "One", url: "https://github.com/a", domain: "github.com", path: "/a", active: true, pinned: false, groupTitle: "Work" },
      { id: 2, windowId: 1, index: 1, title: "Two", url: "https://github.com/a", domain: "github.com", path: "/a", active: false, pinned: false }
    ];

    const result = tabResultsFromTabs(tabs, 1)[0]!;

    expect(result.badges.map((badge) => badge.id)).toContain("duplicate");
    expect(result.badges.map((badge) => badge.id)).toContain("group");
  });

  it("uses only existing tab favicons and does not synthesize favicon URLs", () => {
    const tabs: NormalizedTab[] = [
      { id: 1, windowId: 1, index: 0, title: "One", url: "https://github.com/a", domain: "github.com", path: "/a", active: true, pinned: false, faviconUrl: "chrome://favicon/github" },
      { id: 2, windowId: 1, index: 1, title: "Two", url: "https://example.com", domain: "example.com", path: "/", active: false, pinned: false }
    ];

    const results = tabResultsFromTabs(tabs, 1);

    expect(results[0]?.faviconUrl).toBe("chrome://favicon/github");
    expect(results[1]?.faviconUrl).toBeUndefined();
  });

  it("does not add favicon URLs to history or bookmark results", () => {
    expect(historyResultsFromItems([
      { id: "h1", title: "History", url: "https://example.com", domain: "example.com", path: "/" }
    ])[0]?.faviconUrl).toBeUndefined();

    expect(bookmarkResultsFromItems([
      { id: "b1", title: "Bookmark", url: "https://example.com", domain: "example.com", path: "/", folderPath: [] }
    ])[0]?.faviconUrl).toBeUndefined();
  });
});
