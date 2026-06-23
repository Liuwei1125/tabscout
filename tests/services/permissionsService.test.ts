import { describe, expect, it, vi } from "vitest";
import { createPermissionsService } from "~/services/permissionsService";

describe("permissionsService", () => {
  it("checks and requests optional permissions", async () => {
    const chromeMock = {
      permissions: {
        contains: vi.fn().mockResolvedValue(false),
        request: vi.fn().mockResolvedValue(true)
      }
    };
    const service = createPermissionsService(chromeMock as never);

    await expect(service.hasPermission("history")).resolves.toBe(false);
    await expect(service.requestPermission("history")).resolves.toBe(true);

    expect(chromeMock.permissions.contains).toHaveBeenCalledWith({ permissions: ["history"] });
    expect(chromeMock.permissions.request).toHaveBeenCalledWith({ permissions: ["history"] });
  });
});
