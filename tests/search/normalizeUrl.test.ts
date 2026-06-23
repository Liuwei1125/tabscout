import { describe, expect, it } from "vitest";
import { normalizeUrl } from "~/search/normalizeUrl";

describe("normalizeUrl", () => {
  it("extracts domain and path for https urls", () => {
    expect(normalizeUrl("https://www.github.com/org/repo/pull/123?tab=files#diff")).toMatchObject({
      url: "https://www.github.com/org/repo/pull/123?tab=files#diff",
      domain: "github.com",
      hostname: "www.github.com",
      path: "/org/repo/pull/123",
      searchableUrl: "github.com/org/repo/pull/123?tab=files#diff"
    });
  });

  it("handles localhost with port", () => {
    expect(normalizeUrl("http://localhost:5173/popup.html")).toMatchObject({
      domain: "localhost:5173",
      hostname: "localhost",
      path: "/popup.html"
    });
  });

  it("returns local-files domain for file urls", () => {
    expect(normalizeUrl("file:///Users/demo/report.html")).toMatchObject({
      domain: "local-files",
      path: "/Users/demo/report.html"
    });
  });

  it("marks browser internal urls as internal", () => {
    expect(normalizeUrl("chrome://extensions")).toMatchObject({
      domain: "chrome",
      isInternal: true
    });
  });
});
