import { describe, expect, it } from "vitest";
import { pickSameDomainTabsToClose } from "~/actions/tabActions";
import type { NormalizedTab } from "~/shared/types";

const tabs: NormalizedTab[] = [
  { id: 1, windowId: 1, index: 0, title: "Repo", url: "https://github.com/org/repo", domain: "github.com", path: "/org/repo", active: true, pinned: false },
  { id: 2, windowId: 1, index: 1, title: "PR", url: "https://github.com/org/repo/pull/1", domain: "github.com", path: "/org/repo/pull/1", active: false, pinned: false },
  { id: 3, windowId: 1, index: 2, title: "Docs", url: "https://developer.chrome.com/docs", domain: "developer.chrome.com", path: "/docs", active: false, pinned: false }
];

describe("same-domain tab actions", () => {
  it("closes same-domain tabs except the selected tab", () => {
    expect(pickSameDomainTabsToClose(tabs, tabs[0]!).map((tab) => tab.id)).toEqual([2]);
  });

  it("does not close pinned same-domain tabs by default", () => {
    const domainTabs: NormalizedTab[] = [
      { id: 1, windowId: 1, index: 0, title: "Repo", url: "https://github.com/org/repo", domain: "github.com", path: "/org/repo", active: true, pinned: false },
      { id: 2, windowId: 1, index: 1, title: "Pinned PR", url: "https://github.com/org/repo/pull/1", domain: "github.com", path: "/org/repo/pull/1", active: false, pinned: true },
      { id: 3, windowId: 1, index: 2, title: "Issue", url: "https://github.com/org/repo/issues/1", domain: "github.com", path: "/org/repo/issues/1", active: false, pinned: false }
    ];

    expect(pickSameDomainTabsToClose(domainTabs, domainTabs[0]!).map((tab) => tab.id)).toEqual([3]);
  });
});
