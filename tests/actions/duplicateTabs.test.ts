import { describe, expect, it } from "vitest";
import { findDuplicateUrlGroups, pickDuplicateTabsToClose } from "~/actions/tabActions";
import type { NormalizedTab } from "~/shared/types";

const tabs: NormalizedTab[] = [
  { id: 1, windowId: 1, index: 0, title: "A", url: "https://a.com/page", domain: "a.com", path: "/page", active: false, pinned: false },
  { id: 2, windowId: 1, index: 1, title: "A copy", url: "https://a.com/page", domain: "a.com", path: "/page", active: true, pinned: false },
  { id: 3, windowId: 1, index: 2, title: "B", url: "https://b.com/page", domain: "b.com", path: "/page", active: false, pinned: false }
];

describe("duplicate tab actions", () => {
  it("finds exact URL duplicates", () => {
    expect(findDuplicateUrlGroups(tabs)).toEqual([
      {
        url: "https://a.com/page",
        tabs: [tabs[0], tabs[1]]
      }
    ]);
  });

  it("keeps the active tab when closing duplicates", () => {
    expect(pickDuplicateTabsToClose(tabs).map((tab) => tab.id)).toEqual([1]);
  });

  it("does not close pinned duplicate tabs by default", () => {
    const duplicateTabs: NormalizedTab[] = [
      { id: 1, windowId: 1, index: 0, title: "A", url: "https://a.com/page", domain: "a.com", path: "/page", active: false, pinned: true },
      { id: 2, windowId: 1, index: 1, title: "A copy", url: "https://a.com/page", domain: "a.com", path: "/page", active: false, pinned: false },
      { id: 3, windowId: 1, index: 2, title: "A copy 2", url: "https://a.com/page", domain: "a.com", path: "/page", active: true, pinned: false }
    ];

    expect(pickDuplicateTabsToClose(duplicateTabs).map((tab) => tab.id)).toEqual([2]);
  });
});
