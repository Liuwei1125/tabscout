import type { ParsedQuery, QueryMode } from "./types";

const MODE_PREFIXES: Record<string, QueryMode> = {
  t: "tabs",
  tab: "tabs",
  h: "history",
  his: "history",
  history: "history",
  b: "bookmarks",
  bm: "bookmarks",
  bookmark: "bookmarks",
  bookmarks: "bookmarks",
  g: "groups",
  group: "groups"
};

export function parseQuery(rawInput: string): ParsedQuery {
  const raw = rawInput.trim().replace(/\s+/g, " ");
  const filters: ParsedQuery["filters"] = {};
  if (!raw) return { raw: "", mode: "all", terms: [], filters };

  const tokens = raw.split(" ");
  let mode: QueryMode = "all";

  const firstToken = tokens[0]?.toLowerCase();
  if (firstToken && MODE_PREFIXES[firstToken]) {
    mode = MODE_PREFIXES[firstToken];
    tokens.shift();
  }

  const terms: string[] = [];

  for (const token of tokens) {
    const separatorIndex = token.indexOf(":");
    if (separatorIndex > 0) {
      const key = token.slice(0, separatorIndex).toLowerCase();
      const value = token.slice(separatorIndex + 1);
      if (value) {
        if (key === "site") filters.site = value.toLowerCase();
        else if (key === "title") filters.title = value.toLowerCase();
        else if (key === "url") filters.url = value.toLowerCase();
        else if (key === "window") filters.window = value === "current" ? "current" : value;
        else if (key === "pinned") filters.pinned = value.toLowerCase() === "true";
        else terms.push(token.toLowerCase());
      }
    } else {
      terms.push(token.toLowerCase());
    }
  }

  return { raw, mode, terms, filters };
}
