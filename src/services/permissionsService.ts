export type OptionalPermission = "history" | "bookmarks";

type ChromeWithPermissions = Pick<typeof chrome, "permissions">;

export type PermissionsService = {
  hasPermission(permission: OptionalPermission): Promise<boolean>;
  requestPermission(permission: OptionalPermission): Promise<boolean>;
};

function getChromeApi(): ChromeWithPermissions {
  if (typeof globalThis.chrome !== "undefined" && globalThis.chrome.permissions) {
    return globalThis.chrome;
  }
  return {
    permissions: {
      contains: async () => false,
      request: async () => false
    } as unknown as typeof chrome.permissions
  };
}

export function createPermissionsService(chromeApi: ChromeWithPermissions = getChromeApi()): PermissionsService {
  return {
    hasPermission(permission) {
      return chromeApi.permissions.contains({ permissions: [permission] });
    },
    requestPermission(permission) {
      return chromeApi.permissions.request({ permissions: [permission] });
    }
  };
}

export const permissionsService: PermissionsService = {
  hasPermission(permission) {
    return createPermissionsService().hasPermission(permission);
  },
  requestPermission(permission) {
    return createPermissionsService().requestPermission(permission);
  }
};
