import { Search } from "lucide-react";
import { t } from "~/i18n/t";

type SearchInputProps = {
  value: string;
  onChange(value: string): void;
  onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void;
};

export function SearchInput({ value, onChange, onKeyDown }: SearchInputProps) {
  return (
    <div className="search-header">
      <label className="relative flex h-full items-center">
        <Search className="pointer-events-none h-4 w-4 shrink-0 text-[var(--text-muted)]" />
        <input
          autoFocus
          className="search-input ml-3 h-full min-w-0 flex-1 text-sm font-medium"
          placeholder={t("searchPlaceholder")}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
        />
        <span className="shortcut-hint ml-3 shrink-0 text-xs font-medium text-[var(--text-muted)]">{t("shortcutEnter")}</span>
      </label>
    </div>
  );
}
