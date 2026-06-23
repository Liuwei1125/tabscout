import { Copy, ExternalLink, Layers, Trash2, XCircle } from "lucide-react";
import type { ScoredSearchResult } from "~/search/types";
import { t } from "~/i18n/t";

type ActionMenuProps = {
  result: ScoredSearchResult | undefined;
  onOpen(): void;
  onCloseTab(): void;
  onCloseDuplicates(): void;
  onCloseSameDomain(): void;
  onCloseResults(): void;
  onCopyUrl(): void;
  onDismiss(): void;
};

export function ActionMenu({
  result,
  onOpen,
  onCloseTab,
  onCloseDuplicates,
  onCloseSameDomain,
  onCloseResults,
  onCopyUrl,
  onDismiss
}: ActionMenuProps) {
  if (!result) return null;
  const isTab = result.source === "tabs";

  return (
    <div className="absolute bottom-10 right-3 z-10 w-72 overflow-hidden rounded-lg border border-[var(--border-strong)] bg-[var(--bg-elevated)] shadow-[var(--shadow-panel)]">
      <div className="border-b border-[var(--border-subtle)] px-3 py-2 text-xs font-medium text-[var(--text-muted)]">
        {result.title}
      </div>
      <ActionButton icon={<ExternalLink className="h-4 w-4" />} label={isTab ? t("switchToTab") : t("openPage")} shortcut={t("shortcutEnter")} onClick={onOpen} />
      {isTab ? <ActionButton icon={<Trash2 className="h-4 w-4" />} label={t("closeTab")} shortcut={t("shortcutCommandBackspace")} danger onClick={onCloseTab} /> : null}
      <ActionButton icon={<XCircle className="h-4 w-4" />} label={t("closeDuplicates")} shortcut={t("shortcutCommandEnter")} onClick={onCloseDuplicates} />
      {isTab ? <ActionButton icon={<Layers className="h-4 w-4" />} label={t("closeSameDomain")} danger onClick={onCloseSameDomain} /> : null}
      <ActionButton icon={<Trash2 className="h-4 w-4" />} label={t("closeSearchResults")} danger onClick={onCloseResults} />
      {result.url ? <ActionButton icon={<Copy className="h-4 w-4" />} label={t("copyUrl")} onClick={onCopyUrl} /> : null}
      <button className="w-full px-3 py-2 text-left text-xs text-[var(--text-muted)] hover:bg-[var(--bg-selected)]" onClick={onDismiss}>{t("shortcutEsc")}</button>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  shortcut,
  danger,
  onClick
}: {
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  danger?: boolean;
  onClick(): void;
}) {
  return (
    <button className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-[var(--bg-selected)]" onClick={onClick}>
      <span className={danger ? "danger" : "text-[var(--text-secondary)]"}>{icon}</span>
      <span className={danger ? "danger flex-1" : "flex-1"}>{label}</span>
      {shortcut ? <span className="text-xs text-[var(--text-muted)]">{shortcut}</span> : null}
    </button>
  );
}
