import { Bookmark, Clock3, ExternalLink, Globe2, Layers3 } from "lucide-react";
import type { ScoredSearchResult } from "~/search/types";
import type { NormalizedTab } from "~/shared/types";
import { t } from "~/i18n/t";

type ResultPreviewProps = {
  result: ScoredSearchResult;
};

export function ResultPreview({ result }: ResultPreviewProps) {
  const tab = result.source === "tabs" ? result.raw as NormalizedTab : null;
  const metadata = buildMetadata(result, tab);

  return (
    <div className="result-preview" role="status">
      <div className="preview-visual">
        <div className="preview-orb">
          {result.faviconUrl ? <img alt="" className="preview-favicon" src={result.faviconUrl} /> : <SourceIcon source={result.source} />}
        </div>
        <div className="mt-3 max-w-full truncate text-sm font-semibold text-[var(--text-primary)]">{result.domain || sourceLabel(result.source)}</div>
        <div className="mt-1 max-w-full truncate text-xs text-[var(--text-muted)]">{result.path || result.url}</div>
      </div>
      <div className="preview-body">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-[var(--text-primary)]">{result.title}</div>
            <div className="mt-0.5 truncate text-xs text-[var(--text-muted)]">{sourceLabel(result.source)}</div>
          </div>
          <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-muted)]" />
        </div>
        {metadata.length ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {metadata.map((item) => (
              <span key={item} className="preview-pill">{item}</span>
            ))}
          </div>
        ) : null}
        {result.url ? (
          <div className="preview-url mt-2 break-all text-[11px] leading-4 text-[var(--text-secondary)]">
            {result.url}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SourceIcon({ source }: { source: ScoredSearchResult["source"] }) {
  if (source === "history") return <Clock3 className="h-9 w-9" />;
  if (source === "bookmarks") return <Bookmark className="h-9 w-9" />;
  if (source === "groups") return <Layers3 className="h-9 w-9" />;
  return <Globe2 className="h-9 w-9" />;
}

function sourceLabel(source: ScoredSearchResult["source"]): string {
  if (source === "tabs") return t("scopeTabs");
  if (source === "history") return t("scopeHistory");
  if (source === "bookmarks") return t("scopeBookmarks");
  if (source === "groups") return t("scopeGroups");
  return t("suggestions");
}

function buildMetadata(result: ScoredSearchResult, tab: NormalizedTab | null): string[] {
  if (tab) {
    return [
      tab.active ? t("currentWindow") : "",
      tab.pinned ? t("pinned") : "",
      tab.groupTitle ? tab.groupTitle : ""
    ].filter(Boolean);
  }
  return result.badges
    .filter((badge) => !["source"].includes(badge.id))
    .slice(0, 3)
    .map((badge) => badge.label);
}
