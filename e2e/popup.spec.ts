import { expect, test } from "@playwright/test";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";

let server: http.Server;
let baseUrl: string;

test.beforeAll(async () => {
  const root = path.resolve(".output/chrome-mv3");
  server = http.createServer((request, response) => {
    const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
    const pathname = requestUrl.pathname === "/" ? "/popup.html" : requestUrl.pathname;
    const filePath = path.join(root, pathname);
    if (!filePath.startsWith(root) || !fs.existsSync(filePath)) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    const ext = path.extname(filePath);
    const contentType = ext === ".js" ? "text/javascript" : ext === ".css" ? "text/css" : ext === ".html" ? "text/html" : "application/octet-stream";
    response.writeHead(200, { "content-type": contentType });
    response.end(fs.readFileSync(filePath));
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Could not start test server");
  baseUrl = `http://127.0.0.1:${address.port}`;
});

test.afterAll(async () => {
  await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test("built popup renders command center shell", async ({ page }) => {
  await page.goto(`${baseUrl}/popup.html`);
  await expect(page.getByPlaceholder("Search tabs, history, bookmarks...")).toBeVisible();
  await expect(page.getByRole("button", { name: "Tabs", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Close Duplicates" })).toBeVisible();
});

test("history and bookmark scopes show content without a query", async ({ page }) => {
  await page.addInitScript(() => {
    globalThis.chrome = {
      i18n: { getMessage: () => "" },
      tabs: {
        query: async () => [],
        update: async () => undefined,
        remove: async () => undefined,
        create: async (properties: chrome.tabs.CreateProperties) => ({ ...properties, id: 1 })
      },
      windows: { update: async () => undefined },
      tabGroups: { query: async () => [] },
      storage: { local: { get: async () => ({ recentTabs: [] }), set: async () => undefined, remove: async () => undefined } },
      permissions: { contains: async () => true, request: async () => true },
      history: {
        search: async () => [{ id: "h1", title: "Recent History Item", url: "https://history.example.com/page", lastVisitTime: Date.now() }]
      },
      bookmarks: {
        getTree: async () => [{ id: "0", title: "", children: [{ id: "b1", title: "Saved Bookmark Item", url: "https://bookmark.example.com/doc" }] }]
      }
    } as unknown as typeof chrome;
  });

  await page.goto(`${baseUrl}/popup.html`);
  await page.getByRole("button", { name: /History/ }).click();
  await expect(page.getByText("Recent History Item")).toBeVisible();

  await page.getByRole("button", { name: /Bookmarks/ }).click();
  await expect(page.getByText("Saved Bookmark Item")).toBeVisible();
});

test("history scope refreshes immediately after optional permission is granted", async ({ page }) => {
  await page.addInitScript(() => {
    let historyGranted = false;
    globalThis.chrome = {
      i18n: { getMessage: () => "" },
      tabs: {
        query: async () => [],
        update: async () => undefined,
        remove: async () => undefined,
        create: async (properties: chrome.tabs.CreateProperties) => ({ ...properties, id: 1 })
      },
      windows: { update: async () => undefined },
      tabGroups: { query: async () => [] },
      storage: { local: { get: async () => ({ recentTabs: [] }), set: async () => undefined, remove: async () => undefined } },
      permissions: {
        contains: async () => historyGranted,
        request: async () => {
          historyGranted = true;
          return true;
        }
      },
      history: {
        search: async () => [{ id: "h1", title: "Granted History Item", url: "https://history.example.com/granted", lastVisitTime: Date.now() }]
      },
      bookmarks: { getTree: async () => [] }
    } as unknown as typeof chrome;
  });

  await page.goto(`${baseUrl}/popup.html`);
  await page.getByRole("button", { name: /History/ }).click();
  await expect(page.getByText("Search Chrome history?")).toBeVisible();
  await page.getByRole("button", { name: "Allow" }).click();
  await expect(page.getByRole("option").filter({ hasText: "Granted History Item" })).toBeVisible();
});

test("bookmark scope refreshes immediately after optional permission is granted", async ({ page }) => {
  await page.addInitScript(() => {
    let bookmarksGranted = false;
    globalThis.chrome = {
      i18n: { getMessage: () => "" },
      tabs: {
        query: async () => [],
        update: async () => undefined,
        remove: async () => undefined,
        create: async (properties: chrome.tabs.CreateProperties) => ({ ...properties, id: 1 })
      },
      windows: { update: async () => undefined },
      tabGroups: { query: async () => [] },
      storage: { local: { get: async () => ({ recentTabs: [] }), set: async () => undefined, remove: async () => undefined } },
      permissions: {
        contains: async () => bookmarksGranted,
        request: async () => {
          bookmarksGranted = true;
          return true;
        }
      },
      history: { search: async () => [] },
      bookmarks: {
        getTree: async () => [{ id: "0", title: "", children: [{ id: "b1", title: "Granted Bookmark Item", url: "https://bookmark.example.com/granted" }] }]
      }
    } as unknown as typeof chrome;
  });

  await page.goto(`${baseUrl}/popup.html`);
  await page.getByRole("button", { name: /Bookmarks/ }).click();
  await expect(page.getByText("Search bookmarks?")).toBeVisible();
  await page.getByRole("button", { name: "Allow" }).click();
  await expect(page.getByRole("option").filter({ hasText: "Granted Bookmark Item" })).toBeVisible();
});

test("tab results can be selected and closed in bulk while pinned tabs are skipped", async ({ page }) => {
  await page.clock.install();
  await page.addInitScript(() => {
    const removedTabIds: number[] = [];
    const removedStorageKeys: unknown[] = [];
    globalThis.chrome = {
      i18n: { getMessage: () => "" },
      tabs: {
        query: async () => [
          { id: 11, windowId: 1, index: 0, title: "GitHub Repo", url: "https://github.com/acme/repo", active: true, pinned: false, favIconUrl: "data:image/gif;base64,R0lGODlhAQABAAAAACw=" },
          { id: 12, windowId: 1, index: 1, title: "Pinned GitHub PR", url: "https://github.com/acme/repo/pull/1", active: false, pinned: true, favIconUrl: "" },
          { id: 13, windowId: 1, index: 2, title: "Linear Issue", url: "https://linear.app/acme/issue", active: false, pinned: false, favIconUrl: "" }
        ],
        update: async () => undefined,
        remove: async (tabIds: number | number[]) => {
          removedTabIds.push(...(Array.isArray(tabIds) ? tabIds : [tabIds]));
        },
        create: async (properties: chrome.tabs.CreateProperties) => ({ ...properties, id: 1 })
      },
      windows: { update: async () => undefined },
      tabGroups: { query: async () => [] },
      storage: {
        local: {
          get: async () => ({ recentTabs: [] }),
          set: async (value: unknown) => {
            (globalThis as typeof globalThis & { __lastStorageSet?: unknown }).__lastStorageSet = value;
          },
          remove: async (keys: unknown) => {
            removedStorageKeys.push(keys);
          }
        }
      },
      permissions: { contains: async () => true, request: async () => true },
      history: {
        search: async () => [{ id: "h1", title: "GitHub History", url: "https://history.example.com/github", lastVisitTime: Date.now() }]
      },
      bookmarks: { getTree: async () => [] }
    } as unknown as typeof chrome;
    (globalThis as typeof globalThis & { __removedTabIds?: number[] }).__removedTabIds = removedTabIds;
    (globalThis as typeof globalThis & { __removedStorageKeys?: unknown[] }).__removedStorageKeys = removedStorageKeys;
  });

  page.on("dialog", async (dialog) => {
    expect(dialog.message()).toContain("1 pinned tab(s) will be skipped");
    await dialog.accept();
  });

  await page.goto(`${baseUrl}/popup.html`);
  await page.getByPlaceholder("Search tabs, history, bookmarks...").fill("github");
  await page.getByText("GitHub Repo").hover();
  await expect(page.locator(".result-preview")).toContainText("https://github.com/acme/repo");
  await expect(page.locator(".result-preview")).toContainText("Tab");
  await expect(page.locator(".result-preview .preview-favicon")).toBeVisible();
  await expect(page.getByRole("button", { name: "Select Tab", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Select Tabs" }).click();
  await expect(page.getByRole("button", { name: "Select Visible" })).toBeVisible();
  await page.getByRole("button", { name: "Select Tab", exact: true }).first().click();
  await page.getByRole("button", { name: "Select Tab", exact: true }).first().click();
  await expect(page.getByText("2 tab(s) selected")).toBeVisible();
  await expect(page.getByRole("button", { name: "Deselect Tab", exact: true })).toHaveCount(2);

  await page.getByRole("button", { name: "Close Selected" }).click();

  await expect.poll(async () => page.evaluate(() => (globalThis as typeof globalThis & { __removedTabIds?: number[] }).__removedTabIds)).toEqual([11]);
  await expect(page.getByText("Closed 1 tab(s)")).toBeVisible();
  await page.clock.fastForward(12_100);
  await expect(page.getByText("Closed 1 tab(s)")).toHaveCount(0);
  await expect.poll(async () => page.evaluate(() => (globalThis as typeof globalThis & { __removedStorageKeys?: unknown[] }).__removedStorageKeys)).toEqual([["undoEntry"]]);
});

test("built options page renders privacy and theme settings", async ({ page }) => {
  await page.goto(`${baseUrl}/options.html`);
  await expect(page.getByText("TabScout Settings")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Theme" })).toBeVisible();
  await expect(page.getByText("All search and ranking happens locally").first()).toBeVisible();
});
