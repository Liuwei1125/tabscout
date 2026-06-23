import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckSquare2, Clock3, Globe2, RotateCcw, Trash2 } from "lucide-react";
import { parseQuery } from "~/search/queryParser";
import { rankResults } from "~/search/rankResults";
import { bookmarkResultsFromItems, groupResultsFromTabs, historyResultsFromItems, tabResultsFromTabs } from "~/search/resultFactory";
import type { QueryMode, ScoredSearchResult } from "~/search/types";
import { pickDuplicateTabsToClose, pickSameDomainTabsToClose, pickSelectedTabsToClose } from "~/actions/tabActions";
import { createUndoEntry, isUndoEntryExpired } from "~/actions/undoManager";
import { bookmarksService } from "~/services/bookmarksService";
import { historyService } from "~/services/historyService";
import { permissionsService } from "~/services/permissionsService";
import { storageService } from "~/services/storageService";
import { tabsService } from "~/services/tabsService";
import type { NormalizedTab, UndoEntry } from "~/shared/types";
import { SearchInput } from "~/ui/components/product/SearchInput";
import { ScopeSwitcher } from "~/ui/components/product/ScopeSwitcher";
import { ResultList } from "~/ui/components/product/ResultList";
import { PermissionPrompt } from "~/ui/components/product/PermissionPrompt";
import { UndoToast } from "~/ui/components/product/UndoToast";
import { ActionMenu } from "~/ui/components/product/ActionMenu";
import { SelectionBar } from "~/ui/components/product/SelectionBar";
import { ResultPreview } from "~/ui/components/product/ResultPreview";
import { useTheme } from "~/ui/hooks/useTheme";
import { t } from "~/i18n/t";

type PermissionPromptKind = "history" | "bookmarks" | null;

export function App() {
  useTheme();
  const [query, setQuery] = useState("");
  const [modeOverride, setModeOverride] = useState<QueryMode>("all");
  const [tabs, setTabs] = useState<NormalizedTab[]>([]);
  const [recentTabIds, setRecentTabIds] = useState<number[]>([]);
  const [results, setResults] = useState<ScoredSearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [permissionPrompt, setPermissionPrompt] = useState<PermissionPromptKind>(null);
  const [undoEntry, setUndoEntry] = useState<UndoEntry | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [historyRange, setHistoryRange] = useState<"day" | "week" | "month">("month");
  const [permissionVersion, setPermissionVersion] = useState(0);
  const [selectionEnabled, setSelectionEnabled] = useState(false);
  const [selectedTabIds, setSelectedTabIds] = useState<Set<number>>(new Set());
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const parsedQuery = useMemo(() => {
    const parsed = parseQuery(query);
    return {
      ...parsed,
      mode: parsed.mode === "all" ? modeOverride : parsed.mode
    };
  }, [modeOverride, query]);

  const refreshTabs = useCallback(async () => {
    const [allTabs, recent] = await Promise.all([
      tabsService.getAllTabs(),
      storageService.getRecentTabs()
    ]);
    setTabs(allTabs);
    setRecentTabIds(recent.map((item) => item.tabId));
  }, []);

  useEffect(() => {
    refreshTabs().catch(console.error);
  }, [refreshTabs]);

  useEffect(() => {
    setSelectedTabIds((current) => {
      const existingTabIds = new Set(tabs.map((tab) => tab.id));
      const next = new Set([...current].filter((id) => existingTabIds.has(id)));
      return next.size === current.size ? current : next;
    });
  }, [tabs]);

  useEffect(() => {
    let cancelled = false;
    async function runSearch() {
      const currentWindowId = tabs.find((tab) => tab.active)?.windowId;
      const tabResults = parsedQuery.mode === "all" || parsedQuery.mode === "tabs"
        ? tabResultsFromTabs(tabs, currentWindowId, recentTabIds)
        : [];
      const groupResults = parsedQuery.mode === "all" || parsedQuery.mode === "groups"
        ? groupResultsFromTabs(tabs)
        : [];

      let extraResults = [];
      setPermissionPrompt(null);

      const text = parsedQuery.terms.join(" ") || parsedQuery.raw.replace(/^(h|his|b|bm|t|tab)\s+/i, "");
      const trimmedText = text.trim();
      const shouldSearchHistory = parsedQuery.mode === "history" || (parsedQuery.mode === "all" && trimmedText.length > 0);
      const shouldSearchBookmarks = parsedQuery.mode === "bookmarks" || (parsedQuery.mode === "all" && trimmedText.length > 0);

      if (shouldSearchHistory) {
        if (await permissionsService.hasPermission("history")) {
          extraResults.push(...historyResultsFromItems(await historyService.searchHistory(text, { startTime: historyStartTime(historyRange) })));
        } else if (parsedQuery.mode === "history") {
          setPermissionPrompt("history");
        }
      }

      if (shouldSearchBookmarks) {
        if (await permissionsService.hasPermission("bookmarks")) {
          extraResults.push(...bookmarkResultsFromItems(await bookmarksService.searchBookmarks(text)));
        } else if (parsedQuery.mode === "bookmarks") {
          setPermissionPrompt("bookmarks");
        }
      }

      if (cancelled) return;
      const ranked = rankResults([...tabResults, ...groupResults, ...extraResults], parsedQuery);
      setResults(ranked);
      setSelectedIndex(0);
      setPreviewIndex(null);
    }

    runSearch().catch(console.error);
    return () => {
      cancelled = true;
    };
  }, [historyRange, parsedQuery, permissionVersion, recentTabIds, tabs]);

  useEffect(() => {
    storageService.getUndoEntry().then((entry) => {
      if (!entry || isUndoEntryExpired(entry)) return;
      setUndoEntry(entry);
      setToastMessage(t("closedTabs", String(entry.tabs.length)));
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (!undoEntry) return undefined;
    const timeoutMs = Math.max(0, undoEntry.expiresAt - Date.now());
    const timeout = window.setTimeout(() => {
      setUndoEntry(null);
      setToastMessage("");
      storageService.clearUndoEntry().catch(console.error);
    }, timeoutMs);
    return () => window.clearTimeout(timeout);
  }, [undoEntry]);

  async function openResult(index = selectedIndex) {
    const result = results[index];
    if (!result) return;
    if (result.source === "tabs") {
      const tab = result.raw as NormalizedTab;
      await tabsService.activateTab(tab.id, tab.windowId);
      window.close();
      return;
    }
    if (result.source === "groups") {
      const group = result.raw as { tabs: NormalizedTab[] };
      const first = group.tabs[0];
      if (first) await tabsService.activateTab(first.id, first.windowId);
      window.close();
      return;
    }
    if (result.url) {
      await chrome.tabs.create({ url: result.url });
      window.close();
    }
  }

  async function closeResult(index = selectedIndex) {
    const result = results[index];
    if (!result || result.source !== "tabs") return;
    const tab = result.raw as NormalizedTab;
    const entry = createUndoEntry("close-selected", [tab]);
    await tabsService.closeTabs([tab.id]);
    await storageService.setUndoEntry(entry);
    setUndoEntry(entry);
    setToastMessage(t("closedTabs", "1"));
    await refreshTabs();
  }

  async function closeSelectedTabs() {
    const { skippedPinnedCount, toClose } = pickSelectedTabsToClose(tabs, selectedTabIds);
    if (toClose.length === 0) return;
    const ok = window.confirm(
      skippedPinnedCount > 0
        ? t("confirmCloseSelectedTabsWithPinned", [String(toClose.length), String(skippedPinnedCount)])
        : t("confirmCloseSelectedTabs", String(toClose.length))
    );
    if (!ok) return;
    const entry = createUndoEntry("close-selected-bulk", toClose);
    await tabsService.closeTabs(toClose.map((tab) => tab.id));
    await storageService.setUndoEntry(entry);
    setUndoEntry(entry);
    setSelectedTabIds(new Set());
    setToastMessage(t("closedTabs", String(toClose.length)));
    await refreshTabs();
  }

  async function closeDuplicates() {
    const toClose = pickDuplicateTabsToClose(tabs);
    if (toClose.length === 0) return;
    const entry = createUndoEntry("close-duplicates", toClose);
    await tabsService.closeTabs(toClose.map((tab) => tab.id));
    await storageService.setUndoEntry(entry);
    setUndoEntry(entry);
    setToastMessage(t("closedTabs", String(toClose.length)));
    await refreshTabs();
  }

  async function closeSameDomain() {
    const selected = results[selectedIndex];
    if (!selected || selected.source !== "tabs") return;
    const toClose = pickSameDomainTabsToClose(tabs, selected.raw as NormalizedTab);
    if (toClose.length === 0) return;
    const ok = window.confirm(t("confirmCloseSameDomain", [String(toClose.length), (selected.raw as NormalizedTab).domain]));
    if (!ok) return;
    const entry = createUndoEntry("close-same-domain", toClose);
    await tabsService.closeTabs(toClose.map((tab) => tab.id));
    await storageService.setUndoEntry(entry);
    setUndoEntry(entry);
    setToastMessage(t("closedTabs", String(toClose.length)));
    await refreshTabs();
  }

  async function closeSearchResults() {
    const toClose = results
      .filter((result): result is ScoredSearchResult & { raw: NormalizedTab } => result.source === "tabs")
      .map((result) => result.raw)
      .filter((tab) => !tab.pinned);
    if (toClose.length === 0) return;
    const ok = window.confirm(t("confirmCloseSearchResults", String(toClose.length)));
    if (!ok) return;
    const entry = createUndoEntry("close-results", toClose);
    await tabsService.closeTabs(toClose.map((tab) => tab.id));
    await storageService.setUndoEntry(entry);
    setUndoEntry(entry);
    setToastMessage(t("closedTabs", String(toClose.length)));
    await refreshTabs();
  }

  async function copySelectedUrl() {
    const result = results[selectedIndex];
    if (!result?.url) return;
    await navigator.clipboard?.writeText(result.url);
    setActionMenuOpen(false);
  }

  async function undo() {
    if (!undoEntry || isUndoEntryExpired(undoEntry)) return;
    try {
      await tabsService.restoreTabs(undoEntry.tabs);
      await storageService.clearUndoEntry();
      setUndoEntry(null);
      setToastMessage("");
      await refreshTabs();
    } catch (error) {
      console.error(error);
      setToastMessage(t("restoreTabsFailed"));
    }
  }

  async function requestPermission(kind: "history" | "bookmarks") {
    const granted = await permissionsService.requestPermission(kind);
    if (granted) {
      setPermissionPrompt(null);
      setPermissionVersion((version) => version + 1);
    }
  }

  function toggleSelection(index = selectedIndex) {
    if (!selectionEnabled) setSelectionEnabled(true);
    const result = results[index];
    if (!result || result.source !== "tabs") return;
    const tab = result.raw as NormalizedTab;
    setSelectedTabIds((current) => {
      const next = new Set(current);
      if (next.has(tab.id)) next.delete(tab.id);
      else next.add(tab.id);
      return next;
    });
  }

  function clearSelection() {
    setSelectedTabIds(new Set());
    setSelectionEnabled(false);
  }

  function selectVisibleTabs() {
    const visibleTabIds = results.flatMap((result) => {
      if (result.source !== "tabs") return [];
      const tab = result.raw as NormalizedTab;
      return [tab.id];
    });
    setSelectedTabIds(new Set(visibleTabIds));
    setSelectionEnabled(true);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((index) => {
        const next = Math.min(results.length - 1, index + 1);
        setPreviewIndex(next);
        return next;
      });
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((index) => {
        const next = Math.max(0, index - 1);
        setPreviewIndex(next);
        return next;
      });
    } else if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      setActionMenuOpen((open) => !open);
    } else if (event.key === " " && selectionEnabled && results[selectedIndex]?.source === "tabs") {
      event.preventDefault();
      toggleSelection();
    } else if (event.key === "Enter") {
      event.preventDefault();
      void openResult();
    } else if (event.key === "Backspace" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      void closeResult();
    } else if (event.key === "Escape") {
      if (actionMenuOpen) {
        setActionMenuOpen(false);
        return;
      }
      if (selectionEnabled) {
        clearSelection();
        return;
      }
      window.close();
    }
  }

  const resultStatusLabel = query.trim()
    ? t("resultCount", String(results.length))
    : parsedQuery.mode === "tabs"
      ? t("openTabsSection")
      : parsedQuery.mode === "history"
        ? t("scopeHistory")
        : parsedQuery.mode === "bookmarks"
          ? t("scopeBookmarks")
          : t("recentTabs");
  const selectedCloseState = pickSelectedTabsToClose(tabs, selectedTabIds);
  const visibleTabCount = results.filter((result) => result.source === "tabs").length;
  const selectionMode = selectionEnabled;

  return (
    <div className="command-panel relative">
      <SearchInput value={query} onChange={setQuery} onKeyDown={handleKeyDown} />
      <div className="panel-filter-row">
        <ScopeSwitcher mode={parsedQuery.mode} onChange={setModeOverride} />
        <div className="flex min-w-0 shrink-0 items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)]">
            <Clock3 className="h-3.5 w-3.5" />
            {resultStatusLabel}
          </span>
          {visibleTabCount > 0 ? (
            <button
              className="mode-action"
              data-active={selectionEnabled}
              onClick={() => {
                if (selectionEnabled) clearSelection();
                else setSelectionEnabled(true);
              }}
            >
              <CheckSquare2 className="h-3.5 w-3.5" />
              {selectionEnabled ? t("doneSelecting") : t("selectTabs")}
            </button>
          ) : null}
          {selectionEnabled && visibleTabCount > 0 ? (
            <button className="mode-action" onClick={selectVisibleTabs}>
              {t("selectVisibleTabs")}
            </button>
          ) : null}
        </div>
      </div>
      {permissionPrompt ? (
        <PermissionPrompt kind={permissionPrompt} onAllow={() => void requestPermission(permissionPrompt)} onDismiss={() => setPermissionPrompt(null)} />
      ) : null}
      {parsedQuery.mode === "history" ? (
        <div className="history-range-row">
          <button className={historyRange === "day" ? "is-active" : ""} onClick={() => setHistoryRange("day")}>{t("lastDay")}</button>
          <button className={historyRange === "week" ? "is-active" : ""} onClick={() => setHistoryRange("week")}>{t("lastWeek")}</button>
          <button className={historyRange === "month" ? "is-active" : ""} onClick={() => setHistoryRange("month")}>{t("lastMonth")}</button>
        </div>
      ) : null}
      <ResultList
        results={results}
        selectedIndex={selectedIndex}
        selectedTabIds={selectedTabIds}
        selectionMode={selectionMode}
        queryTerms={parsedQuery.terms}
        onSelect={(index) => {
          setSelectedIndex(index);
          setPreviewIndex(index);
        }}
        onOpen={(index) => void openResult(index)}
        onClose={(index) => void closeResult(index)}
        onToggleSelection={toggleSelection}
      />
      {previewIndex != null && results[previewIndex] ? (
        <ResultPreview
          result={results[previewIndex]}
        />
      ) : null}
      {selectionMode ? (
        <SelectionBar
          selectedCount={selectedCloseState.selectedCount}
          skippedPinnedCount={selectedCloseState.skippedPinnedCount}
          onClear={clearSelection}
          onCloseSelected={() => void closeSelectedTabs()}
        />
      ) : (
        <div className="command-footer">
          <span className="truncate">{t("keyboardHint")}</span>
          <div className="flex shrink-0 items-center gap-1">
            <button className="footer-action" onClick={() => void closeDuplicates()}>
              <RotateCcw className="h-3.5 w-3.5" />
              {t("closeDuplicates")}
            </button>
            <button className="footer-action danger" onClick={() => void closeSameDomain()}>
              <Globe2 className="h-3.5 w-3.5" />
              {t("closeSameDomain")}
            </button>
            <button className="footer-action danger" onClick={() => void closeSearchResults()}>
              <Trash2 className="h-3.5 w-3.5" />
              {t("closeSearchResults")}
            </button>
          </div>
        </div>
      )}
      {actionMenuOpen ? (
        <ActionMenu
          result={results[selectedIndex]}
          onOpen={() => void openResult()}
          onCloseTab={() => void closeResult()}
          onCloseDuplicates={() => void closeDuplicates()}
          onCloseSameDomain={() => void closeSameDomain()}
          onCloseResults={() => void closeSearchResults()}
          onCopyUrl={() => void copySelectedUrl()}
          onDismiss={() => setActionMenuOpen(false)}
        />
      ) : null}
      {undoEntry ? <UndoToast message={toastMessage} onUndo={() => void undo()} /> : null}
    </div>
  );
}

function historyStartTime(range: "day" | "week" | "month"): number {
  const day = 1000 * 60 * 60 * 24;
  if (range === "day") return Date.now() - day;
  if (range === "week") return Date.now() - day * 7;
  return Date.now() - day * 30;
}
