import { defineBackground } from "wxt/utils/define-background";
import { storageService, type RecentTabRecord } from "~/services/storageService";

const MAX_RECENT_TABS = 50;

export default defineBackground(() => {
  chrome.tabs.onActivated.addListener((activeInfo) => {
    recordActivatedTab(activeInfo.tabId, activeInfo.windowId).catch(console.error);
  });

  chrome.tabs.onRemoved.addListener((tabId) => {
    removeRecentTab(tabId).catch(console.error);
  });
});

async function recordActivatedTab(tabId: number, windowId: number) {
  const records = await storageService.getRecentTabs();
  const next: RecentTabRecord[] = [
    { tabId, windowId, activatedAt: Date.now() },
    ...records.filter((record) => record.tabId !== tabId)
  ].slice(0, MAX_RECENT_TABS);
  await storageService.setRecentTabs(next);
}

async function removeRecentTab(tabId: number) {
  const records = await storageService.getRecentTabs();
  await storageService.setRecentTabs(records.filter((record) => record.tabId !== tabId));
}
