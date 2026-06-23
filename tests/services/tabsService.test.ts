import { describe, expect, it, vi } from "vitest";
import { createTabsService } from "~/services/tabsService";

describe("tabsService", () => {
  it("normalizes tabs and joins tab group metadata", async () => {
    const chromeMock = {
      tabs: {
        query: vi.fn().mockResolvedValue([
          {
            id: 1,
            windowId: 2,
            index: 3,
            title: "GitHub PR",
            url: "https://github.com/org/repo/pull/1",
            favIconUrl: "chrome://favicon/github",
            active: true,
            pinned: true,
            lastAccessed: 1700000000000,
            groupId: 9
          }
        ])
      },
      tabGroups: {
        query: vi.fn().mockResolvedValue([
          { id: 9, title: "Work", color: "blue", collapsed: false }
        ])
      }
    };
    const service = createTabsService(chromeMock as never);

    await expect(service.getAllTabs()).resolves.toEqual([
      {
        id: 1,
        windowId: 2,
        index: 3,
        title: "GitHub PR",
        url: "https://github.com/org/repo/pull/1",
        domain: "github.com",
        path: "/org/repo/pull/1",
        faviconUrl: "chrome://favicon/github",
        active: true,
        pinned: true,
        lastAccessed: 1700000000000,
        groupId: 9,
        groupTitle: "Work",
        groupColor: "blue",
        groupCollapsed: false
      }
    ]);
  });

  it("activates a tab and focuses its window", async () => {
    const chromeMock = {
      tabs: { update: vi.fn().mockResolvedValue(undefined) },
      windows: { update: vi.fn().mockResolvedValue(undefined) }
    };
    const service = createTabsService(chromeMock as never);

    await service.activateTab(3, 8);

    expect(chromeMock.tabs.update).toHaveBeenCalledWith(3, { active: true });
    expect(chromeMock.windows.update).toHaveBeenCalledWith(8, { focused: true });
  });
});
