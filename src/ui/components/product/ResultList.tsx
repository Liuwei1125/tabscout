import type { ScoredSearchResult } from "~/search/types";
import { t } from "~/i18n/t";
import { ResultItem } from "./ResultItem";

type ResultListProps = {
  results: ScoredSearchResult[];
  selectedIndex: number;
  selectedTabIds?: Set<number>;
  selectionMode?: boolean;
  queryTerms?: string[];
  onSelect(index: number): void;
  onOpen(index: number): void;
  onClose(index: number): void;
  onToggleSelection?(index: number): void;
};

export function ResultList({
  results,
  selectedIndex,
  selectedTabIds = new Set(),
  selectionMode = false,
  queryTerms = [],
  onSelect,
  onOpen,
  onClose,
  onToggleSelection
}: ResultListProps) {
  if (results.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-[var(--text-muted)]">
        {t("noResults")}
      </div>
    );
  }

  const sections = groupResults(results);

  return (
    <div className="result-list flex-1 overflow-y-auto pb-3" role="listbox">
      {sections.map((section) => (
        <section key={section.key} className="result-section">
          <div className="section-heading">{section.label}</div>
          {section.items.map(({ result, index }) => (
            <ResultItem
              key={result.id}
              result={result}
              selected={selectedIndex === index}
              checked={isSelectedTab(result, selectedTabIds)}
              selectionMode={selectionMode}
              queryTerms={queryTerms}
              onSelect={() => onSelect(index)}
              onOpen={() => onOpen(index)}
              onClose={() => onClose(index)}
              onToggleSelection={onToggleSelection ? () => onToggleSelection(index) : undefined}
            />
          ))}
        </section>
      ))}
    </div>
  );
}

type ResultSection = {
  key: string;
  label: string;
  items: Array<{ result: ScoredSearchResult; index: number }>;
};

function groupResults(results: ScoredSearchResult[]): ResultSection[] {
  const sections = new Map<string, ResultSection>();
  for (const [index, result] of results.entries()) {
    const key = result.source;
    const section = sections.get(key) ?? {
      key,
      label: sourceLabel(result.source),
      items: []
    };
    section.items.push({ result, index });
    sections.set(key, section);
  }
  return Array.from(sections.values());
}

function isSelectedTab(result: ScoredSearchResult, selectedTabIds: Set<number>): boolean {
  if (result.source !== "tabs") return false;
  const raw = result.raw as { id?: unknown };
  return typeof raw.id === "number" && selectedTabIds.has(raw.id);
}

function sourceLabel(source: ScoredSearchResult["source"]): string {
  if (source === "tabs") return t("openTabsSection");
  if (source === "history") return t("scopeHistory");
  if (source === "bookmarks") return t("scopeBookmarks");
  if (source === "groups") return t("scopeGroups");
  return t("suggestions");
}
