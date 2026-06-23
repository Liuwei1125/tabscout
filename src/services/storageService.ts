import type { ThemePreference, UndoEntry } from "~/shared/types";

type ChromeStorageApi = Pick<typeof chrome, "storage">;

const THEME_KEY = "themePreference";
const RECENT_TABS_KEY = "recentTabs";
const UNDO_ENTRY_KEY = "undoEntry";

export type RecentTabRecord = {
  tabId: number;
  windowId: number;
  activatedAt: number;
};

export type StorageService = {
  getThemePreference(): Promise<ThemePreference>;
  setThemePreference(theme: ThemePreference): Promise<void>;
  getRecentTabs(): Promise<RecentTabRecord[]>;
  setRecentTabs(records: RecentTabRecord[]): Promise<void>;
  getUndoEntry(): Promise<UndoEntry | undefined>;
  setUndoEntry(entry: UndoEntry): Promise<void>;
  clearUndoEntry(): Promise<void>;
  clearLocalData(): Promise<void>;
};

function getChromeApi(): ChromeStorageApi {
  if (typeof globalThis.chrome !== "undefined" && globalThis.chrome.storage) {
    return globalThis.chrome;
  }
  const memory = new Map<string, unknown>();
  return {
    storage: {
      local: {
        get: async (keys?: string | string[] | Record<string, unknown> | null) => {
          if (Array.isArray(keys)) return Object.fromEntries(keys.map((key) => [key, memory.get(key)]));
          if (typeof keys === "string") return { [keys]: memory.get(keys) };
          if (keys && typeof keys === "object") {
            return Object.fromEntries(Object.keys(keys).map((key) => [key, memory.get(key) ?? keys[key]]));
          }
          return Object.fromEntries(memory.entries());
        },
        set: async (items: Record<string, unknown>) => {
          for (const [key, value] of Object.entries(items)) memory.set(key, value);
        },
        remove: async (keys: string | string[]) => {
          for (const key of Array.isArray(keys) ? keys : [keys]) memory.delete(key);
        }
      }
    } as unknown as typeof chrome.storage
  };
}

export function createStorageService(chromeApi: ChromeStorageApi = getChromeApi()): StorageService {
  return {
    async getThemePreference() {
      const result = await chromeApi.storage.local.get([THEME_KEY]);
      return (result[THEME_KEY] as ThemePreference | undefined) ?? "system";
    },
    async setThemePreference(theme) {
      await chromeApi.storage.local.set({ [THEME_KEY]: theme });
    },
    async getRecentTabs() {
      const result = await chromeApi.storage.local.get([RECENT_TABS_KEY]);
      return (result[RECENT_TABS_KEY] as RecentTabRecord[] | undefined) ?? [];
    },
    async setRecentTabs(records) {
      await chromeApi.storage.local.set({ [RECENT_TABS_KEY]: records.slice(0, 50) });
    },
    async getUndoEntry() {
      const result = await chromeApi.storage.local.get([UNDO_ENTRY_KEY]);
      return result[UNDO_ENTRY_KEY] as UndoEntry | undefined;
    },
    async setUndoEntry(entry) {
      await chromeApi.storage.local.set({ [UNDO_ENTRY_KEY]: entry });
    },
    async clearUndoEntry() {
      await chromeApi.storage.local.remove([UNDO_ENTRY_KEY]);
    },
    async clearLocalData() {
      await chromeApi.storage.local.remove([THEME_KEY, RECENT_TABS_KEY, UNDO_ENTRY_KEY]);
    }
  };
}

export const storageService: StorageService = {
  getThemePreference() {
    return createStorageService().getThemePreference();
  },
  setThemePreference(theme) {
    return createStorageService().setThemePreference(theme);
  },
  getRecentTabs() {
    return createStorageService().getRecentTabs();
  },
  setRecentTabs(records) {
    return createStorageService().setRecentTabs(records);
  },
  getUndoEntry() {
    return createStorageService().getUndoEntry();
  },
  setUndoEntry(entry) {
    return createStorageService().setUndoEntry(entry);
  },
  clearUndoEntry() {
    return createStorageService().clearUndoEntry();
  },
  clearLocalData() {
    return createStorageService().clearLocalData();
  }
};
