import { scoreSearchResult } from "./score";
import type { ParsedQuery, ScoredSearchResult, SearchResult } from "./types";

const SOURCE_ORDER: Record<SearchResult["source"], number> = {
  tabs: 0,
  groups: 1,
  suggestions: 2,
  bookmarks: 3,
  history: 4
};

export function rankResults(results: SearchResult[], query: ParsedQuery, limit = 80): ScoredSearchResult[] {
  return results
    .map((result, originalIndex) => ({ ...scoreSearchResult(result, query), originalIndex }))
    .filter((result) => Number.isFinite(result.score))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const sourceDelta = SOURCE_ORDER[a.source] - SOURCE_ORDER[b.source];
      if (sourceDelta !== 0) return sourceDelta;
      return a.originalIndex - b.originalIndex;
    })
    .slice(0, limit)
    .map(({ originalIndex: _originalIndex, ...result }) => result);
}
