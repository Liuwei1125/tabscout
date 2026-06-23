import { useEffect, useState } from "react";
import type { ThemePreference } from "~/shared/types";
import { permissionsService } from "~/services/permissionsService";
import { storageService } from "~/services/storageService";
import { useTheme } from "~/ui/hooks/useTheme";
import { t } from "~/i18n/t";

export function OptionsApp() {
  const { preference, setPreference } = useTheme();
  const [historyGranted, setHistoryGranted] = useState(false);
  const [bookmarksGranted, setBookmarksGranted] = useState(false);
  const [notice, setNotice] = useState("");

  async function refreshPermissions() {
    setHistoryGranted(await permissionsService.hasPermission("history"));
    setBookmarksGranted(await permissionsService.hasPermission("bookmarks"));
  }

  useEffect(() => {
    refreshPermissions().catch(console.error);
  }, []);

  async function requestPermission(kind: "history" | "bookmarks") {
    await permissionsService.requestPermission(kind);
    await refreshPermissions();
  }

  async function clearLocalData() {
    await storageService.clearLocalData();
    setNotice(t("localDataCleared"));
  }

  return (
    <main className="settings-page min-h-screen p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold">{t("optionsTitle")}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">{t("privacyBody")}</p>

        <section className="settings-card mt-6 p-5">
          <h2 className="text-base font-semibold">{t("theme")}</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                className="rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-left text-sm hover:bg-[var(--bg-elevated)]"
                data-active={preference === option.value}
                onClick={() => void setPreference(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <section className="settings-card mt-4 p-5">
          <h2 className="text-base font-semibold">{t("permissions")}</h2>
          <div className="mt-4 space-y-3 text-sm">
            <PermissionRow label={t("requiredTabsPermission")} status={t("required")} />
            <PermissionRow label={t("scopeHistory")} status={historyGranted ? t("granted") : t("notGranted")} action={!historyGranted ? () => void requestPermission("history") : undefined} />
            <PermissionRow label={t("scopeBookmarks")} status={bookmarksGranted ? t("granted") : t("notGranted")} action={!bookmarksGranted ? () => void requestPermission("bookmarks") : undefined} />
          </div>
        </section>

        <section className="settings-card mt-4 p-5">
          <h2 className="text-base font-semibold">{t("keyboard")}</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">{t("shortcutHelp")}</p>
        </section>

        <section className="settings-card mt-4 p-5">
          <h2 className="text-base font-semibold">{t("privacy")}</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{t("privacyBody")}</p>
          <button className="danger-soft mt-4 rounded-md px-3 py-2 text-sm font-medium" onClick={() => void clearLocalData()}>
            {t("clearLocalData")}
          </button>
          {notice ? <p className="mt-3 text-sm text-[var(--accent)]">{notice}</p> : null}
        </section>
      </div>
    </main>
  );
}

function PermissionRow({ label, status, action }: { label: string; status: string; action?: () => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] px-3 py-2">
      <span>{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[var(--text-muted)]">{status}</span>
        {action ? <button className="text-[var(--accent)]" onClick={action}>{t("allow")}</button> : null}
      </div>
    </div>
  );
}

const themeOptions: Array<{ value: ThemePreference; label: string }> = [
  { value: "system", label: t("themeSystem") },
  { value: "command-dark", label: t("themeDark") },
  { value: "command-light", label: t("themeLight") },
  { value: "high-contrast", label: t("themeHighContrast") }
];
