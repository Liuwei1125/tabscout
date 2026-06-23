import { Lock } from "lucide-react";
import { t } from "~/i18n/t";

type PermissionPromptProps = {
  kind: "history" | "bookmarks";
  onAllow(): void;
  onDismiss(): void;
};

export function PermissionPrompt({ kind, onAllow, onDismiss }: PermissionPromptProps) {
  const title = kind === "history" ? t("searchHistoryPermissionTitle") : t("searchBookmarksPermissionTitle");
  const body = kind === "history" ? t("searchHistoryPermissionBody") : t("searchBookmarksPermissionBody");
  return (
    <div className="mx-4 my-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3">
      <div className="flex gap-3">
        <Lock className="mt-0.5 h-4 w-4 text-[var(--accent)]" />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium">{title}</div>
          <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">{body}</p>
          <div className="mt-3 flex gap-2">
            <button className="rounded-md bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white" onClick={onAllow}>{t("allow")}</button>
            <button className="rounded-md border border-[var(--border-subtle)] px-3 py-1.5 text-xs text-[var(--text-secondary)]" onClick={onDismiss}>{t("notNow")}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
