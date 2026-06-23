import type { LucideIcon } from "lucide-react";
import { Bookmark, History, ListFilter, PanelTop } from "lucide-react";
import type { QueryMode } from "~/search/types";
import { t } from "~/i18n/t";

const scopes: Array<{ mode: QueryMode; label: string; Icon: LucideIcon }> = [
  { mode: "all", label: t("scopeAll"), Icon: ListFilter },
  { mode: "tabs", label: t("scopeTabs"), Icon: PanelTop },
  { mode: "history", label: t("scopeHistory"), Icon: History },
  { mode: "bookmarks", label: t("scopeBookmarks"), Icon: Bookmark }
];

type ScopeSwitcherProps = {
  mode: QueryMode;
  onChange(mode: QueryMode): void;
};

export function ScopeSwitcher({ mode, onChange }: ScopeSwitcherProps) {
  return (
    <div className="flex min-w-0 gap-1.5">
      {scopes.map((scope) => (
        <button
          key={scope.mode}
          className="scope-chip inline-flex h-7 items-center gap-1.5 px-2.5 text-xs"
          data-active={mode === scope.mode}
          onClick={() => onChange(scope.mode)}
        >
          <scope.Icon className="h-3.5 w-3.5" />
          {scope.label}
        </button>
      ))}
    </div>
  );
}
