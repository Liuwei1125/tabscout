import { normalizeUrl } from "~/search/normalizeUrl";
import type { NormalizedTab, UndoTabSnapshot } from "~/shared/types";

type ChromeTabsApi = Pick<typeof chrome, "tabs" | "windows" | "tabGroups">;

export type TabsService = {
  getAllTabs(): Promise<NormalizedTab[]>;
  getCurrentWindowTabs(): Promise<NormalizedTab[]>;
  activateTab(tabId: number, windowId: number): Promise<void>;
  closeTabs(tabIds: number[]): Promise<void>;
  restoreTabs(snapshots: UndoTabSnapshot[]): Promise<chrome.tabs.Tab[]>;
};

function getChromeApi(): ChromeTabsApi {
  if (typeof globalThis.chrome !== "undefined" && globalThis.chrome.tabs) {
    return globalThis.chrome;
  }
  return {
    tabs: {
      query: async () => [],
      update: async () => undefined,
      remove: async () => undefined,
      create: async (properties: chrome.tabs.CreateProperties) => ({ ...properties, id: -1 } as chrome.tabs.Tab)
    } as unknown as typeof chrome.tabs,
    windows: {
      update: async () => undefined
    } as unknown as typeof chrome.windows,
    tabGroups: {
      query: async () => []
    } as unknown as typeof chrome.tabGroups
  };
}

export function createTabsService(chromeApi: ChromeTabsApi = getChromeApi()): TabsService {
  async function getGroupMap(): Promise<Map<number, chrome.tabGroups.TabGroup>> {
    if (!chromeApi.tabGroups?.query) return new Map();
    const groups = await chromeApi.tabGroups.query({});
    return new Map(groups.map((group) => [group.id, group]));
  }

  async function normalizeTabs(tabs: chrome.tabs.Tab[]): Promise<NormalizedTab[]> {
    const groups = await getGroupMap();
    return tabs.flatMap((tab) => {
      if (tab.id == null || tab.windowId == null || !tab.url) return [];
      const normalizedUrl = normalizeUrl(tab.url);
      if (normalizedUrl.isInternal) return [];
      const group = tab.groupId != null && tab.groupId >= 0 ? groups.get(tab.groupId) : undefined;
      return [{
        id: tab.id,
        windowId: tab.windowId,
        index: tab.index,
        title: tab.title || tab.url,
        url: tab.url,
        domain: normalizedUrl.domain,
        path: normalizedUrl.path,
        faviconUrl: tab.favIconUrl,
        active: Boolean(tab.active),
        pinned: Boolean(tab.pinned),
        audible: tab.audible,
        groupId: group?.id,
        groupTitle: group?.title,
        groupColor: group?.color,
        groupCollapsed: group?.collapsed,
        lastAccessed: tab.lastAccessed
      } satisfies NormalizedTab];
    });
  }

  return {
    async getAllTabs() {
      const tabs = await chromeApi.tabs.query({});
      return normalizeTabs(tabs);
    },
    async getCurrentWindowTabs() {
      const tabs = await chromeApi.tabs.query({ currentWindow: true });
      return normalizeTabs(tabs);
    },
    async activateTab(tabId, windowId) {
      await chromeApi.tabs.update(tabId, { active: true });
      await chromeApi.windows.update(windowId, { focused: true });
    },
    async closeTabs(tabIds) {
      if (tabIds.length === 0) return;
      await chromeApi.tabs.remove(tabIds);
    },
    async restoreTabs(snapshots) {
      const restored: chrome.tabs.Tab[] = [];
      for (const snapshot of snapshots) {
        const tab = await chromeApi.tabs.create({
          url: snapshot.url,
          windowId: snapshot.windowId,
          index: snapshot.index,
          pinned: snapshot.pinned,
          active: false
        });
        restored.push(tab);
      }
      return restored;
    }
  };
}

export const tabsService: TabsService = {
  getAllTabs() {
    return createTabsService().getAllTabs();
  },
  getCurrentWindowTabs() {
    return createTabsService().getCurrentWindowTabs();
  },
  activateTab(tabId, windowId) {
    return createTabsService().activateTab(tabId, windowId);
  },
  closeTabs(tabIds) {
    return createTabsService().closeTabs(tabIds);
  },
  restoreTabs(snapshots) {
    return createTabsService().restoreTabs(snapshots);
  }
};
