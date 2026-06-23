import { Trash2, X } from "lucide-react";
import { t } from "~/i18n/t";

type SelectionBarProps = {
  selectedCount: number;
  skippedPinnedCount: number;
  onClear(): void;
  onCloseSelected(): void;
};

export function SelectionBar({ selectedCount, skippedPinnedCount, onClear, onCloseSelected }: SelectionBarProps) {
  return (
    <div className="selection-bar">
      <div className="min-w-0">
        <div className="truncate text-xs font-medium text-[var(--text-primary)]">
          {t("selectedTabsCount", String(selectedCount))}
        </div>
        {skippedPinnedCount > 0 ? (
          <div className="truncate text-[11px] text-[var(--text-muted)]">
            {t("pinnedTabsSkipped", String(skippedPinnedCount))}
          </div>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button className="footer-action" onClick={onClear}>
          <X className="h-3.5 w-3.5" />
          {t("clearSelection")}
        </button>
        <button className="footer-action danger" onClick={onCloseSelected}>
          <Trash2 className="h-3.5 w-3.5" />
          {t("closeSelectedTabs")}
        </button>
      </div>
    </div>
  );
}
