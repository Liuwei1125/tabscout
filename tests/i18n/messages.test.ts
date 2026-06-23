import { describe, expect, it } from "vitest";
import en from "../../public/_locales/en/messages.json";
import zhCN from "../../public/_locales/zh_CN/messages.json";

describe("i18n messages", () => {
  it("keeps English and Chinese message keys in sync", () => {
    expect(Object.keys(zhCN).sort()).toEqual(Object.keys(en).sort());
  });

  it("contains core permission and action strings", () => {
    expect(en.searchHistoryPermissionTitle.message).toBeTruthy();
    expect(en.closeDuplicates.message).toBeTruthy();
    expect(zhCN.searchBookmarksPermissionTitle.message).toBeTruthy();
  });
});
