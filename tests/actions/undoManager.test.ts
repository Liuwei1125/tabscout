import { describe, expect, it } from "vitest";
import { createUndoEntry } from "~/actions/undoManager";
import type { NormalizedTab } from "~/shared/types";

describe("createUndoEntry", () => {
  it("stores enough tab metadata for restoration", () => {
    const tabs: NormalizedTab[] = [
      {
        id: 7,
        windowId: 2,
        index: 4,
        title: "Chrome tabs API",
        url: "https://developer.chrome.com/docs/extensions/reference/api/tabs",
        domain: "developer.chrome.com",
        path: "/docs/extensions/reference/api/tabs",
        active: false,
        pinned: true,
        groupId: 3,
        groupTitle: "Docs",
        groupColor: "blue"
      }
    ];

    expect(createUndoEntry("close-selected", tabs)).toMatchObject({
      type: "close-selected",
      tabs: [
        {
          url: "https://developer.chrome.com/docs/extensions/reference/api/tabs",
          title: "Chrome tabs API",
          windowId: 2,
          index: 4,
          pinned: true,
          groupId: 3,
          groupTitle: "Docs",
          groupColor: "blue"
        }
      ]
    });
  });
});
