import { describe, expect, it } from "vitest";
import { parseQuery } from "~/search/queryParser";

describe("parseQuery", () => {
  it("keeps plain text in all mode", () => {
    expect(parseQuery("github react pr")).toEqual({
      raw: "github react pr",
      mode: "all",
      terms: ["github", "react", "pr"],
      filters: {}
    });
  });

  it("recognizes tab prefixes", () => {
    expect(parseQuery("t github")).toMatchObject({
      mode: "tabs",
      terms: ["github"]
    });
    expect(parseQuery("tab chrome api")).toMatchObject({
      mode: "tabs",
      terms: ["chrome", "api"]
    });
  });

  it("recognizes history and bookmark prefixes", () => {
    expect(parseQuery("h stripe webhook")).toMatchObject({
      mode: "history",
      terms: ["stripe", "webhook"]
    });
    expect(parseQuery("bm notion roadmap")).toMatchObject({
      mode: "bookmarks",
      terms: ["notion", "roadmap"]
    });
  });

  it("extracts supported filters", () => {
    expect(parseQuery("site:github.com title:react url:pull window:current pinned:true")).toEqual({
      raw: "site:github.com title:react url:pull window:current pinned:true",
      mode: "all",
      terms: [],
      filters: {
        site: "github.com",
        title: "react",
        url: "pull",
        window: "current",
        pinned: true
      }
    });
  });
});
