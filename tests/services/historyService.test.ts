import { describe, expect, it, vi } from "vitest";
import { createHistoryService } from "~/services/historyService";

describe("historyService", () => {
  it("searches and normalizes history when permission exists", async () => {
    const chromeMock = {
      history: {
        search: vi.fn().mockResolvedValue([
          {
            id: "12",
            title: "Chrome History API",
            url: "https://developer.chrome.com/docs/extensions/reference/api/history",
            lastVisitTime: 100,
            visitCount: 3,
            typedCount: 1
          }
        ])
      }
    };
    const permissionService = {
      hasPermission: vi.fn().mockResolvedValue(true),
      requestPermission: vi.fn()
    };
    const service = createHistoryService(chromeMock as never, permissionService);

    await expect(service.searchHistory("history api")).resolves.toEqual([
      {
        id: "12",
        title: "Chrome History API",
        url: "https://developer.chrome.com/docs/extensions/reference/api/history",
        domain: "developer.chrome.com",
        path: "/docs/extensions/reference/api/history",
        lastVisitTime: 100,
        visitCount: 3,
        typedCount: 1
      }
    ]);
    expect(chromeMock.history.search).toHaveBeenCalledWith(expect.objectContaining({ text: "history api", maxResults: 50 }));
  });
});
