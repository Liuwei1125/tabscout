import { describe, expect, it, vi } from "vitest";
import { createStorageService } from "~/services/storageService";

describe("storageService", () => {
  it("persists and reads theme preference", async () => {
    const store: Record<string, unknown> = {};
    const chromeMock = {
      storage: {
        local: {
          get: vi.fn(async (keys: string[]) => Object.fromEntries(keys.map((key) => [key, store[key]]))),
          set: vi.fn(async (items: Record<string, unknown>) => Object.assign(store, items)),
          remove: vi.fn(async (keys: string[]) => keys.forEach((key) => delete store[key]))
        }
      }
    };
    const service = createStorageService(chromeMock as never);

    await service.setThemePreference("high-contrast");
    await expect(service.getThemePreference()).resolves.toBe("high-contrast");
  });
});
