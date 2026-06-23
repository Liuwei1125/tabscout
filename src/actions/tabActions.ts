import { sameRegistrableDomain } from "~/search/normalizeUrl";
import type { NormalizedTab } from "~/shared/types";

export type DuplicateUrlGroup = {
  url: string;
  tabs: NormalizedTab[];
};

export function findDuplicateUrlGroups(tabs: NormalizedTab[]): DuplicateUrlGroup[] {
  const byUrl = new Map<string, NormalizedTab[]>();
  for (const tab of tabs) {
    if (!tab.url) continue;
    const group = byUrl.get(tab.url) ?? [];
    group.push(tab);
    byUrl.set(tab.url, group);
  }

  return Array.from(byUrl.entries())
    .filter(([, group]) => group.length > 1)
    .map(([url, group]) => ({ url, tabs: group }));
}

export function pickDuplicateTabsToClose(tabs: NormalizedTab[]): NormalizedTab[] {
  const toClose: NormalizedTab[] = [];
  for (const group of findDuplicateUrlGroups(tabs)) {
    const keep = group.tabs.find((tab) => tab.active) ?? group.tabs.find((tab) => tab.pinned) ?? group.tabs[0];
    for (const tab of group.tabs) {
      if (keep && tab.id !== keep.id && !tab.pinned) toClose.push(tab);
    }
  }
  return toClose;
}

export function pickSameDomainTabsToClose(tabs: NormalizedTab[], selected: NormalizedTab): NormalizedTab[] {
  return tabs.filter((tab) => tab.id !== selected.id && !tab.pinned && sameRegistrableDomain(tab.domain, selected.domain));
}

export function countSameDomainTabs(tabs: NormalizedTab[], selected: NormalizedTab): number {
  return tabs.filter((tab) => sameRegistrableDomain(tab.domain, selected.domain)).length;
}

export function pickSelectedTabsToClose(tabs: NormalizedTab[], selectedTabIds: Set<number>): {
  selectedCount: number;
  skippedPinnedCount: number;
  toClose: NormalizedTab[];
} {
  const selectedTabs = tabs.filter((tab) => selectedTabIds.has(tab.id));
  const toClose = selectedTabs.filter((tab) => !tab.pinned);
  return {
    selectedCount: selectedTabs.length,
    skippedPinnedCount: selectedTabs.length - toClose.length,
    toClose
  };
}
