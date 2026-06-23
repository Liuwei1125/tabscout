import type { MatchField, ParsedQuery, ScoredSearchResult, SearchResult } from "./types";

type ScoreInputRaw = {
  currentWindow?: boolean;
  recentBoost?: number;
  pinned?: boolean;
  sameGroup?: boolean;
  recentVisitBoost?: number;
  bookmarkExactTitle?: boolean;
};

const SOURCE_BOOST: Record<SearchResult["source"], number> = {
  tabs: 20,
  history: 0,
  bookmarks: 0,
  groups: 12,
  suggestions: 16
};

function getRawBoosts(raw: unknown): ScoreInputRaw {
  if (!raw || typeof raw !== "object") return {};
  return raw as ScoreInputRaw;
}

function scoreField(value: string | undefined, term: string, field: MatchField): number {
  if (!value) return 0;
  const normalized = value.toLowerCase();
  const exactMatch = normalized.includes(term);
  const fuzzyMatch = !exactMatch && isFuzzyMatch(normalized, term);
  if (!exactMatch && !fuzzyMatch) return 0;

  if (field === "title") {
    if (normalized === term) return 140;
    if (normalized.startsWith(term)) return 120;
    if (fuzzyMatch) return 62;
    return 100;
  }
  if (field === "domain") {
    if (normalized === term) return 90;
    if (normalized.startsWith(term)) return 80;
    if (fuzzyMatch) return 42;
    return 70;
  }
  if (field === "path") return fuzzyMatch ? 24 : 45;
  return fuzzyMatch ? 18 : 30;
}

function filterMatches(result: SearchResult, query: ParsedQuery): boolean {
  if (query.filters.site && !result.domain?.toLowerCase().includes(query.filters.site)) return false;
  if (query.filters.title && !result.title.toLowerCase().includes(query.filters.title)) return false;
  if (query.filters.url && !result.url?.toLowerCase().includes(query.filters.url)) return false;
  const raw = getRawBoosts(result.raw);
  if (query.filters.window === "current" && !raw.currentWindow) return false;
  if (query.filters.pinned !== undefined && Boolean(raw.pinned) !== query.filters.pinned) return false;
  return true;
}

function isFuzzyMatch(value: string, term: string): boolean {
  if (term.length < 4) return false;
  const words = value.split(/[^a-z0-9]+/i).filter(Boolean);
  return words.some((word) => {
    if (Math.abs(word.length - term.length) > 2) return false;
    return levenshteinDistance(word.slice(0, Math.max(word.length, term.length)), term) <= 1;
  });
}

function levenshteinDistance(a: string, b: string): number {
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    let diagonal = previous[0]!;
    previous[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const above = previous[j]!;
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      previous[j] = Math.min(
        previous[j]! + 1,
        previous[j - 1]! + 1,
        diagonal + cost
      );
      diagonal = above;
    }
  }
  return previous[b.length]!;
}

export function scoreSearchResult(result: SearchResult, query: ParsedQuery): ScoredSearchResult {
  if (!filterMatches(result, query)) {
    return { ...result, score: Number.NEGATIVE_INFINITY, matchedFields: [] };
  }

  const terms = [
    ...query.terms,
    ...(query.filters.title ? [query.filters.title] : []),
    ...(query.filters.site ? [query.filters.site] : []),
    ...(query.filters.url ? [query.filters.url] : [])
  ].filter(Boolean);

  const matchedFields = new Set<MatchField>();
  let score = SOURCE_BOOST[result.source] ?? 0;

  if (terms.length === 0) {
    score += result.source === "tabs" ? 10 : 0;
  }

  for (const term of terms) {
    const fieldScores: Array<[MatchField, number]> = [
      ["title", scoreField(result.title, term, "title")],
      ["domain", scoreField(result.domain, term, "domain")],
      ["path", scoreField(result.path, term, "path")],
      ["url", scoreField(result.url, term, "url")]
    ];

    const best = fieldScores.reduce((max, current) => current[1] > max[1] ? current : max, ["title", 0] as [MatchField, number]);
    if (best[1] <= 0) {
      return { ...result, score: Number.NEGATIVE_INFINITY, matchedFields: [] };
    }

    for (const [field, fieldScore] of fieldScores) {
      if (fieldScore > 0) matchedFields.add(field);
    }
    score += best[1];
  }

  const raw = getRawBoosts(result.raw);
  if (raw.currentWindow) score += 10;
  if (raw.recentBoost) score += Math.min(raw.recentBoost, 8);
  if (raw.pinned) score += 4;
  if (raw.sameGroup) score += 4;
  if (raw.recentVisitBoost) score += Math.min(raw.recentVisitBoost, 8);
  if (raw.bookmarkExactTitle) score += 8;

  return { ...result, score, matchedFields: Array.from(matchedFields) };
}
