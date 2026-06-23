import type { ResolvedTheme, ThemePreference } from "~/shared/types";

export function resolveTheme(preference: ThemePreference, systemPrefersDark: boolean): ResolvedTheme {
  if (preference === "system") return systemPrefersDark ? "command-dark" : "command-light";
  return preference;
}
