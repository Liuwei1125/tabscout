import { useEffect, useState } from "react";
import { storageService } from "~/services/storageService";
import type { ResolvedTheme, ThemePreference } from "~/shared/types";
import { resolveTheme } from "~/ui/themes/theme";

function systemPrefersDark(): boolean {
  return globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches ?? true;
}

export function useTheme() {
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolveTheme("system", systemPrefersDark()));

  useEffect(() => {
    let mounted = true;
    storageService.getThemePreference().then((stored) => {
      if (!mounted) return;
      setPreferenceState(stored);
      setResolvedTheme(resolveTheme(stored, systemPrefersDark()));
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme;
  }, [resolvedTheme]);

  async function setPreference(next: ThemePreference) {
    setPreferenceState(next);
    setResolvedTheme(resolveTheme(next, systemPrefersDark()));
    await storageService.setThemePreference(next);
  }

  return { preference, resolvedTheme, setPreference };
}
