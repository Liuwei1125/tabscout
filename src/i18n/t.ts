type MessageName = keyof typeof import("../../public/_locales/en/messages.json");

export function t(name: MessageName, substitutions?: string | string[]): string {
  if (typeof chrome !== "undefined" && chrome.i18n?.getMessage) {
    const message = chrome.i18n.getMessage(name, substitutions);
    if (message) return message;
  }
  return applyFallbackSubstitutions(fallbackMessages[name] ?? String(name), substitutions);
}

function applyFallbackSubstitutions(message: string, substitutions?: string | string[]): string {
  if (!substitutions) return message;
  const values = Array.isArray(substitutions) ? substitutions : [substitutions];
  return values.reduce((next, value, index) => next.replaceAll(`$${index + 1}`, value), message);
}

const fallbackMessages: Record<string, string> = {
  extensionName: "TabScout",
  searchPlaceholder: "Search tabs, history, bookmarks...",
  scopeAll: "All",
  scopeTabs: "Tabs",
  scopeHistory: "History",
  scopeBookmarks: "Bookmarks",
  scopeGroups: "Groups",
  openTabsSection: "Open Tabs",
  recentTabs: "Recent Tabs",
  suggestions: "Suggestions",
  noResults: "No results",
  resultCount: "$1 results",
  switchToTab: "Switch to Tab",
  openPage: "Open Page",
  closeTab: "Close Tab",
  selectTab: "Select Tab",
  deselectTab: "Deselect Tab",
  selectTabs: "Select Tabs",
  doneSelecting: "Done",
  selectVisibleTabs: "Select Visible",
  selectedTabsCount: "$1 tab(s) selected",
  clearSelection: "Clear Selection",
  closeSelectedTabs: "Close Selected",
  closeDuplicates: "Close Duplicates",
  closeSameDomain: "Close Same-domain Tabs",
  closeSearchResults: "Close Search Results",
  copyUrl: "Copy URL",
  lastDay: "Last day",
  lastWeek: "Last week",
  lastMonth: "Last month",
  keyboardHint: "↑↓ Select · Enter Open · ⌘/Ctrl↵ Actions",
  shortcutEnter: "Enter",
  shortcutEsc: "Esc",
  shortcutCommandBackspace: "Cmd/Ctrl+Backspace",
  shortcutCommandEnter: "Cmd/Ctrl+Enter",
  undo: "Undo",
  closedTabs: "Closed $1 tab(s)",
  restoreTabsFailed: "Could not restore tabs",
  confirmCloseSameDomain: "Close $1 other $2 tabs?",
  confirmCloseSearchResults: "Close $1 matching tab(s)? Pinned tabs are skipped.",
  confirmCloseSelectedTabs: "Close $1 selected tab(s)?",
  confirmCloseSelectedTabsWithPinned: "Close $1 selected tab(s)? $2 pinned tab(s) will be skipped.",
  pinnedTabsSkipped: "$1 pinned tab(s) skipped",
  searchHistoryPermissionTitle: "Search Chrome history?",
  searchHistoryPermissionBody: "We only read history title and URL locally to show matching results. Nothing is uploaded.",
  searchBookmarksPermissionTitle: "Search bookmarks?",
  searchBookmarksPermissionBody: "We only read bookmark title, URL, and folder path locally. Nothing is uploaded.",
  allow: "Allow",
  notNow: "Not now",
  optionsTitle: "TabScout Settings",
  theme: "Theme",
  themeSystem: "System",
  themeDark: "Command Dark",
  themeLight: "Command Light",
  themeHighContrast: "High Contrast",
  permissions: "Permissions",
  requiredTabsPermission: "Tabs / Tab Groups",
  required: "Required",
  granted: "Granted",
  notGranted: "Not granted",
  privacy: "Privacy",
  privacyBody: "All search and ranking happens locally. No AI, no cloud sync, no page-body indexing, no analytics, and no external services.",
  keyboard: "Keyboard",
  shortcutHelp: "Change the shortcut at chrome://extensions/shortcuts.",
  clearLocalData: "Clear Local Data",
  localDataCleared: "Local data cleared",
  windowLabel: "Window $1",
  windowShortLabel: "W$1",
  pinned: "Pinned",
  duplicate: "Duplicate x$1",
  sameDomainCount: "$1 on $2",
  justNow: "just now",
  minutesAgo: "$1 min ago",
  hoursAgo: "$1 hr ago",
  daysAgo: "$1 d ago",
  bookmarkBadge: "Bookmark",
  groupBadge: "Group",
  groupFallbackTitle: "Group $1",
  tabCount: "$1 tabs",
  currentWindow: "Current Window"
};
