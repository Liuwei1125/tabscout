import { normalizeUrl } from "~/search/normalizeUrl";
import type { NormalizedBookmarkItem } from "~/shared/types";
import type { OptionalPermission, PermissionsService } from "./permissionsService";
import { permissionsService } from "./permissionsService";

type ChromeBookmarksApi = Pick<typeof chrome, "bookmarks">;

export type BookmarksService = {
  searchBookmarks(query: string): Promise<NormalizedBookmarkItem[]>;
  getBookmarks(): Promise<NormalizedBookmarkItem[]>;
};

export function flattenBookmarkTree(
  nodes: chrome.bookmarks.BookmarkTreeNode[],
  folderPath: string[] = []
): NormalizedBookmarkItem[] {
  const items: NormalizedBookmarkItem[] = [];

  for (const node of nodes) {
    if (node.url) {
      const normalizedUrl = normalizeUrl(node.url);
      if (!normalizedUrl.isInternal) {
        items.push({
          id: node.id,
          title: node.title || node.url,
          url: node.url,
          domain: normalizedUrl.domain,
          path: normalizedUrl.path,
          folderPath,
          dateAdded: node.dateAdded
        });
      }
      continue;
    }

    const nextPath = node.title && node.id !== "0" ? [...folderPath, node.title] : folderPath;
    if (node.children) items.push(...flattenBookmarkTree(node.children, nextPath));
  }

  return items;
}

function getChromeApi(): ChromeBookmarksApi {
  if (typeof globalThis.chrome !== "undefined" && globalThis.chrome.bookmarks) {
    return globalThis.chrome;
  }
  return {
    bookmarks: {
      getTree: async () => []
    } as unknown as typeof chrome.bookmarks
  };
}

export function createBookmarksService(
  chromeApi: ChromeBookmarksApi = getChromeApi(),
  permissions: Pick<PermissionsService, "hasPermission" | "requestPermission"> = permissionsService
): BookmarksService {
  async function getBookmarks() {
    if (!(await permissions.hasPermission("bookmarks" satisfies OptionalPermission))) return [];
    return flattenBookmarkTree(await chromeApi.bookmarks.getTree());
  }

  return {
    getBookmarks,
    async searchBookmarks(query) {
      const normalizedQuery = query.trim().toLowerCase();
      const bookmarks = await getBookmarks();
      if (!normalizedQuery) return bookmarks.slice(0, 50);
      return bookmarks
        .filter((bookmark) => {
          const haystack = [
            bookmark.title,
            bookmark.url,
            bookmark.domain,
            bookmark.path,
            bookmark.folderPath.join(" ")
          ].join(" ").toLowerCase();
          return haystack.includes(normalizedQuery);
        })
        .slice(0, 50);
    }
  };
}

export const bookmarksService: BookmarksService = {
  searchBookmarks(query) {
    return createBookmarksService().searchBookmarks(query);
  },
  getBookmarks() {
    return createBookmarksService().getBookmarks();
  }
};
