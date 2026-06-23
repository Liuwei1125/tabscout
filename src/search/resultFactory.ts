import { findDuplicateUrlGroups, countSameDomainTabs } from "~/actions/tabActions";
import { t } from "~/i18n/t";
import type { SearchResult } from "~/search/types";
import type { NormalizedBookmarkItem, NormalizedHistoryItem, NormalizedTab } from "~/shared/types";

export function tabResultsFromTabs(tabs: NormalizedTab[], currentWindowId?: number, recentTabIds: number[] = []): SearchResult[] {
  const duplicateCounts = new Map<string, number>();
  for (const group of findDuplicateUrlGroups(tabs)) duplicateCounts.set(group.url, group.tabs.length);
  const windowLabels = buildWindowLabelMap(tabs);

  return tabs.map((tab) => {
    const badges: SearchResult["badges"] = [
      { id: "window", label: t("windowShortLabel", String(windowLabels.get(tab.windowId) ?? tab.windowId)), tone: tab.windowId === currentWindowId ? "accent" : "neutral" }
    ];
    if (tab.groupTitle) badges.push({ id: "group", label: tab.groupTitle, tone: "accent" });
    if (tab.pinned) badges.push({ id: "pinned", label: t("pinned") });
    const duplicateCount = duplicateCounts.get(tab.url);
    if (duplicateCount && duplicateCount > 1) badges.push({ id: "duplicate", label: t("duplicate", String(duplicateCount)), tone: "warning" });
    const sameDomainCount = countSameDomainTabs(tabs, tab);
    if (sameDomainCount > 1) badges.push({ id: "domain-count", label: t("sameDomainCount", [String(sameDomainCount), tab.domain]) });
    const activatedAt = tab.lastActivatedAt ?? tab.lastAccessed;
    if (activatedAt) badges.push({ id: "recent", label: formatRelativeTime(activatedAt) });

    const recentIndex = recentTabIds.indexOf(tab.id);

    return {
      id: `tab-${tab.id}`,
      source: "tabs",
      title: tab.title,
      url: tab.url,
      domain: tab.domain,
      path: tab.path,
      faviconUrl: tab.faviconUrl,
      score: 0,
      matchedFields: [],
      badges,
      actions: [
        { id: "switch", label: t("switchToTab"), shortcut: t("shortcutEnter") },
        { id: "close", label: t("closeTab"), shortcut: t("shortcutCommandBackspace"), dangerous: true }
      ],
      raw: {
        ...tab,
        currentWindow: tab.windowId === currentWindowId,
        recentBoost: recentIndex >= 0 ? Math.max(1, 8 - recentIndex) : 0,
        pinned: tab.pinned
      }
    };
  });
}

function buildWindowLabelMap(tabs: NormalizedTab[]): Map<number, number> {
  const windowIds = Array.from(new Set(tabs.map((tab) => tab.windowId)));
  return new Map(windowIds.map((windowId, index) => [windowId, index + 1]));
}

export function historyResultsFromItems(items: NormalizedHistoryItem[]): SearchResult[] {
  const now = Date.now();
  return items.map((item) => {
    const ageMs = item.lastVisitTime ? now - item.lastVisitTime : Number.POSITIVE_INFINITY;
    const recentVisitBoost = ageMs < 24 * 60 * 60 * 1000 ? 8 : ageMs < 7 * 24 * 60 * 60 * 1000 ? 4 : 1;
    return {
      id: `history-${item.id}`,
      source: "history",
      title: item.title,
      url: item.url,
      domain: item.domain,
      path: item.path,
      score: 0,
      matchedFields: [],
      badges: [
        { id: "source", label: t("scopeHistory") },
        ...(item.lastVisitTime ? [{ id: "recent", label: formatRelativeTime(item.lastVisitTime) }] : [])
      ],
      actions: [{ id: "open", label: t("openPage"), shortcut: t("shortcutEnter") }],
      raw: { ...item, recentVisitBoost }
    };
  });
}

export function bookmarkResultsFromItems(items: NormalizedBookmarkItem[]): SearchResult[] {
  return items.map((item) => ({
    id: `bookmark-${item.id}`,
    source: "bookmarks",
    title: item.title,
    url: item.url,
    domain: item.domain,
    path: item.path,
    score: 0,
    matchedFields: [],
    badges: [
      { id: "source", label: t("bookmarkBadge") },
      ...(item.dateAdded ? [{ id: "recent", label: formatRelativeTime(item.dateAdded) }] : []),
      ...(item.folderPath.length ? [{ id: "folder", label: item.folderPath.join(" / ") }] : [])
    ],
    actions: [{ id: "open", label: t("openPage"), shortcut: t("shortcutEnter") }],
    raw: {
      ...item,
      bookmarkExactTitle: false
    }
  }));
}

export function groupResultsFromTabs(tabs: NormalizedTab[]): SearchResult[] {
  const groups = new Map<number, NormalizedTab[]>();
  for (const tab of tabs) {
    if (tab.groupId == null || tab.groupId < 0) continue;
    groups.set(tab.groupId, [...(groups.get(tab.groupId) ?? []), tab]);
  }

  return Array.from(groups.entries()).map(([groupId, groupTabs]) => {
    const first = groupTabs[0]!;
    return {
      id: `group-${groupId}`,
      source: "groups",
      title: first.groupTitle || t("groupFallbackTitle", String(groupId)),
      url: first.url,
      domain: first.domain,
      path: first.path,
      faviconUrl: first.faviconUrl,
      score: 0,
      matchedFields: [],
      badges: [
        { id: "source", label: t("groupBadge"), tone: "accent" },
        { id: "count", label: t("tabCount", String(groupTabs.length)) }
      ],
      actions: [{ id: "open", label: t("switchToTab"), shortcut: t("shortcutEnter") }],
      raw: {
        groupId,
        tabs: groupTabs,
        currentWindow: groupTabs.some((tab) => tab.active)
      }
    } satisfies SearchResult;
  });
}

function formatRelativeTime(time: number, now = Date.now()): string {
  const elapsedMs = Math.max(0, now - time);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (elapsedMs < minute) return t("justNow");
  if (elapsedMs < hour) return t("minutesAgo", String(Math.floor(elapsedMs / minute)));
  if (elapsedMs < day) return t("hoursAgo", String(Math.floor(elapsedMs / hour)));
  return t("daysAgo", String(Math.floor(elapsedMs / day)));
}
