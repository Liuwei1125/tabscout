import { describe, expect, it } from "vitest";
import { pickSelectedTabsToClose } from "~/actions/tabActions";
import type { NormalizedTab } from "~/shared/types";

const tabs: NormalizedTab[] = [
  { id: 1, windowId: 1, index: 0, title: "GitHub", url: "https://github.com", domain: "github.com", path: "/", active: false, pinned: false },
  { id: 2, windowId: 1, index: 1, title: "Pinned Docs", url: "https://developer.chrome.com", domain: "developer.chrome.com", path: "/", active: false, pinned: true },
  { id: 3, windowId: 1, index: 2, title: "Linear", url: "https://linear.app", domain: "linear.app", path: "/", active: false, pinned: false }
];

describe("bulk tab selection actions", () => {
  it("closes selected existing tabs while skipping pinned tabs", () => {
    const result = pickSelectedTabsToClose(tabs, new Set([1, 2, 999]));

    expect(result.toClose.map((tab) => tab.id)).toEqual([1]);
    expect(result.selectedCount).toBe(2);
    expect(result.skippedPinnedCount).toBe(1);
  });
});
