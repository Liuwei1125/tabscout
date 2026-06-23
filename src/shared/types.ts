export type ThemePreference = "system" | "command-dark" | "command-light" | "high-contrast";

export type ResolvedTheme = Exclude<ThemePreference, "system">;

export type NormalizedTab = {
  id: number;
  windowId: number;
  index: number;
  title: string;
  url: string;
  domain: string;
  path: string;
  faviconUrl?: string;
  active: boolean;
  pinned: boolean;
  audible?: boolean;
  groupId?: number;
  groupTitle?: string;
  groupColor?: `${chrome.tabGroups.Color}` | string;
  groupCollapsed?: boolean;
  lastAccessed?: number;
  lastActivatedAt?: number;
};

export type NormalizedHistoryItem = {
  id: string;
  title: string;
  url: string;
  domain: string;
  path: string;
  lastVisitTime?: number;
  visitCount?: number;
  typedCount?: number;
};

export type NormalizedBookmarkItem = {
  id: string;
  title: string;
  url: string;
  domain: string;
  path: string;
  folderPath: string[];
  dateAdded?: number;
};

export type UndoActionType = "close-selected" | "close-selected-bulk" | "close-duplicates" | "close-same-domain" | "close-results";

export type UndoTabSnapshot = {
  url: string;
  title: string;
  windowId: number;
  index: number;
  pinned: boolean;
  groupId?: number;
  groupTitle?: string;
  groupColor?: `${chrome.tabGroups.Color}` | string;
};

export type UndoEntry = {
  id: string;
  type: UndoActionType;
  createdAt: number;
  expiresAt: number;
  tabs: UndoTabSnapshot[];
};
