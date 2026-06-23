export type SearchSource = "tabs" | "history" | "bookmarks" | "groups" | "suggestions";

export type QueryMode = "all" | "tabs" | "history" | "bookmarks" | "groups";

export type MatchField = "title" | "domain" | "path" | "url";

export type ParsedQuery = {
  raw: string;
  mode: QueryMode;
  terms: string[];
  filters: {
    site?: string;
    title?: string;
    url?: string;
    window?: "current" | string;
    pinned?: boolean;
  };
};

export type ResultBadge = {
  id: string;
  label: string;
  tone?: "neutral" | "accent" | "warning" | "danger" | "success";
};

export type ResultAction = {
  id: string;
  label: string;
  shortcut?: string;
  dangerous?: boolean;
};

export type SearchResult = {
  id: string;
  source: SearchSource;
  title: string;
  url?: string;
  domain?: string;
  path?: string;
  faviconUrl?: string;
  score: number;
  matchedFields: MatchField[];
  badges: ResultBadge[];
  actions: ResultAction[];
  raw: unknown;
};

export type ScoredSearchResult = SearchResult & {
  score: number;
  matchedFields: MatchField[];
};

export type NormalizedUrl = {
  url: string;
  domain: string;
  hostname: string;
  path: string;
  searchableUrl: string;
  isInternal: boolean;
};
