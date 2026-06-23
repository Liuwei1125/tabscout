import { defineConfig } from "wxt";

export default defineConfig({
  srcDir: "src",
  manifestVersion: 3,
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "__MSG_extensionName__",
    short_name: "__MSG_extensionShortName__",
    description: "__MSG_extensionDescription__",
    default_locale: "en",
    version: "0.1.0",
    permissions: ["tabs", "storage", "tabGroups"],
    optional_permissions: ["history", "bookmarks"],
    action: {
      default_title: "__MSG_extensionName__",
      default_icon: {
        "16": "icons/icon-16.png",
        "32": "icons/icon-32.png"
      }
    },
    options_ui: {
      page: "options.html",
      open_in_tab: true
    },
    icons: {
      "16": "icons/icon-16.png",
      "32": "icons/icon-32.png",
      "48": "icons/icon-48.png",
      "128": "icons/icon-128.png"
    },
    commands: {
      _execute_action: {
        suggested_key: {
          default: "Ctrl+Shift+Space",
          mac: "Command+Shift+Space"
        },
        description: "__MSG_openCommandCenter__"
      }
    }
  },
  vite: () => ({})
});
