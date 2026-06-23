import { useEffect, useRef } from "react";
import { Bookmark, Check, Clock3, Globe2, Layers3, Pin, X } from "lucide-react";
import type { ScoredSearchResult } from "~/search/types";
import { IconButton } from "~/ui/components/primitives/IconButton";
import { t } from "~/i18n/t";

type ResultItemProps = {
  result: ScoredSearchResult;
  selected: boolean;
  checked?: boolean;
  selectionMode?: boolean;
  queryTerms?: string[];
  onSelect(): void;
  onOpen(): void;
  onClose?(): void;
  onToggleSelection?(): void;
};

function SourceIcon({ source }: { source: ScoredSearchResult["source"] }) {
  if (source === "history") return <Clock3 className="h-4 w-4" />;
  if (source === "bookmarks") return <Bookmark className="h-4 w-4" />;
  if (source === "groups") return <Layers3 className="h-4 w-4" />;
  return <Globe2 className="h-4 w-4" />;
}

function MetaPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap">
      <span className="text-[var(--text-muted)]">·</span>
      <span>{children}</span>
    </span>
  );
}

export function ResultItem({
  result,
  selected,
  checked = false,
  selectionMode = false,
  queryTerms = [],
  onSelect,
  onOpen,
  onClose,
  onToggleSelection
}: ResultItemProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const isTab = result.source === "tabs";
  const primaryBadges = result.badges
    .filter((badge) => !["window", "domain-count", "recent"].includes(badge.id))
    .slice(0, 2);
  const recentBadge = result.badges.find((badge) => badge.id === "recent");
  const domainCountBadge = result.badges.find((badge) => badge.id === "domain-count");

  useEffect(() => {
    if (!selected) return;
    rowRef.current?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  return (
    <div
      ref={rowRef}
      className="result-row group flex min-h-[56px] cursor-default items-center gap-3 px-4 py-1.5"
      data-selected={selected}
      role="option"
      aria-selected={selected}
      onMouseEnter={onSelect}
      onDoubleClick={onOpen}
    >
      {isTab && selectionMode && onToggleSelection ? (
        <button
          aria-label={checked ? t("deselectTab") : t("selectTab")}
          aria-pressed={checked}
          className="selection-checkbox"
          onClick={(event) => {
            event.stopPropagation();
            onToggleSelection();
          }}
        >
          {checked ? <Check className="h-3.5 w-3.5" /> : null}
        </button>
      ) : null}
      <div className="favicon-tile flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden text-[var(--text-secondary)]">
        {result.faviconUrl ? <img alt="" className="h-4 w-4" src={result.faviconUrl} /> : <SourceIcon source={result.source} />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium leading-5">{highlightText(result.title, result.matchedFields.includes("title") ? queryTerms : [])}</div>
        <div className="result-subtitle flex min-w-0 items-center gap-1 overflow-hidden text-xs leading-4">
          <span className="min-w-0 shrink truncate">
            {result.domain ? highlightText(result.domain, result.matchedFields.includes("domain") ? queryTerms : []) : null}
            {result.path && result.path !== "/" ? (
              <>
                <span className="mx-1 text-[var(--text-muted)]">·</span>
                {highlightText(result.path, result.matchedFields.includes("path") ? queryTerms : [])}
              </>
            ) : null}
          </span>
          {recentBadge ? <MetaPill>{recentBadge.label}</MetaPill> : null}
          {domainCountBadge ? <MetaPill>{domainCountBadge.label}</MetaPill> : null}
        </div>
        {primaryBadges.length ? (
          <div className="mt-0.5 flex flex-wrap gap-1.5">
            {primaryBadges.map((badge) => (
              <span key={badge.id} className="inline-flex text-[10px] font-medium text-[var(--text-muted)]">
                {badge.label}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {result.raw && typeof result.raw === "object" && "pinned" in result.raw && Boolean((result.raw as { pinned?: boolean }).pinned) ? (
          <Pin className="h-3.5 w-3.5 text-[var(--text-muted)]" />
        ) : null}
        {onClose && result.source === "tabs" ? (
          <div className={selected ? "opacity-100" : "opacity-0 transition-opacity group-hover:opacity-100"}>
            <IconButton label={t("closeTab")} onClick={(event) => { event.stopPropagation(); onClose(); }}>
              <X className="h-4 w-4" />
            </IconButton>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function highlightText(text: string, terms: string[]) {
  const term = terms.find((item) => item && text.toLowerCase().includes(item.toLowerCase()));
  if (!term) return text;
  const index = text.toLowerCase().indexOf(term.toLowerCase());
  if (index < 0) return text;
  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded bg-[var(--accent-weak)] px-0.5 text-[var(--text-primary)]">{text.slice(index, index + term.length)}</mark>
      {text.slice(index + term.length)}
    </>
  );
}
