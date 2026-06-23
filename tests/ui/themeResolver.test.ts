import { describe, expect, it } from "vitest";
import { resolveTheme } from "~/ui/themes/theme";

describe("resolveTheme", () => {
  it("resolves system theme from media preference", () => {
    expect(resolveTheme("system", true)).toBe("command-dark");
    expect(resolveTheme("system", false)).toBe("command-light");
  });

  it("passes explicit themes through", () => {
    expect(resolveTheme("high-contrast", false)).toBe("high-contrast");
  });
});
