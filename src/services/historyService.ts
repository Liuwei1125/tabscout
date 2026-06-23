import { normalizeUrl } from "~/search/normalizeUrl";
import type { NormalizedHistoryItem } from "~/shared/types";
import type { OptionalPermission, PermissionsService } from "./permissionsService";
import { permissionsService } from "./permissionsService";

type ChromeHistoryApi = Pick<typeof chrome, "history">;

export type HistoryService = {
  searchHistory(query: string, options?: { maxResults?: number; startTime?: number }): Promise<NormalizedHistoryItem[]>;
};

function getChromeApi(): ChromeHistoryApi {
  if (typeof globalThis.chrome !== "undefined" && globalThis.chrome.history) {
    return globalThis.chrome;
  }
  return {
    history: {
      search: async () => []
    } as unknown as typeof chrome.history
  };
}

export function createHistoryService(
  chromeApi: ChromeHistoryApi = getChromeApi(),
  permissions: Pick<PermissionsService, "hasPermission" | "requestPermission"> = permissionsService
): HistoryService {
  return {
    async searchHistory(query, options = {}) {
      if (!(await permissions.hasPermission("history" satisfies OptionalPermission))) return [];
      const items = await chromeApi.history.search({
        text: query,
        maxResults: options.maxResults ?? 50,
        startTime: options.startTime ?? Date.now() - 1000 * 60 * 60 * 24 * 30
      });
      return items.flatMap((item) => {
        if (!item.url) return [];
        const normalizedUrl = normalizeUrl(item.url);
        if (normalizedUrl.isInternal) return [];
        return [{
          id: item.id,
          title: item.title || item.url,
          url: item.url,
          domain: normalizedUrl.domain,
          path: normalizedUrl.path,
          lastVisitTime: item.lastVisitTime,
          visitCount: item.visitCount,
          typedCount: item.typedCount
        } satisfies NormalizedHistoryItem];
      });
    }
  };
}

export const historyService: HistoryService = {
  searchHistory(query, options) {
    return createHistoryService().searchHistory(query, options);
  }
};
