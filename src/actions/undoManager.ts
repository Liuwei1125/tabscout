import type { NormalizedTab, UndoActionType, UndoEntry, UndoTabSnapshot } from "~/shared/types";

const UNDO_TTL_MS = 12_000;

export function createUndoEntry(type: UndoActionType, tabs: NormalizedTab[], now = Date.now()): UndoEntry {
  return {
    id: `${type}-${now}-${tabs.map((tab) => tab.id).join("-")}`,
    type,
    createdAt: now,
    expiresAt: now + UNDO_TTL_MS,
    tabs: tabs.map(toUndoSnapshot)
  };
}

export function isUndoEntryExpired(entry: UndoEntry, now = Date.now()): boolean {
  return entry.expiresAt <= now;
}

function toUndoSnapshot(tab: NormalizedTab): UndoTabSnapshot {
  return {
    url: tab.url,
    title: tab.title,
    windowId: tab.windowId,
    index: tab.index,
    pinned: tab.pinned,
    groupId: tab.groupId,
    groupTitle: tab.groupTitle,
    groupColor: tab.groupColor
  };
}
