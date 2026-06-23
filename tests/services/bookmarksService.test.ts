import { describe, expect, it, vi } from "vitest";
import { createBookmarksService, flattenBookmarkTree } from "~/services/bookmarksService";

describe("bookmarksService", () => {
  it("flattens bookmark tree with folder paths", () => {
    const tree = [
      {
        id: "0",
        title: "root",
        children: [
          {
            id: "1",
            title: "Work",
            children: [
              {
                id: "2",
                title: "Chrome APIs",
                url: "https://developer.chrome.com/docs/extensions",
                dateAdded: 100
              }
            ]
          }
        ]
      }
    ] as chrome.bookmarks.BookmarkTreeNode[];

    expect(flattenBookmarkTree(tree)).toEqual([
      {
        id: "2",
        title: "Chrome APIs",
        url: "https://developer.chrome.com/docs/extensions",
        domain: "developer.chrome.com",
        path: "/docs/extensions",
        folderPath: ["Work"],
        dateAdded: 100
      }
    ]);
  });

  it("searches bookmarks after permission check", async () => {
    const chromeMock = {
      bookmarks: {
        getTree: vi.fn().mockResolvedValue([
          { id: "0", title: "root", children: [{ id: "1", title: "GitHub", url: "https://github.com" }] }
        ])
      }
    };
    const permissionService = {
      hasPermission: vi.fn().mockResolvedValue(true),
      requestPermission: vi.fn()
    };
    const service = createBookmarksService(chromeMock as never, permissionService);

    const results = await service.searchBookmarks("github");

    expect(permissionService.hasPermission).toHaveBeenCalledWith("bookmarks");
    expect(results[0]?.title).toBe("GitHub");
  });
});
