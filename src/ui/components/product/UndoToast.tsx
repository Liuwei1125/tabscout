import { t } from "~/i18n/t";

type UndoToastProps = {
  message: string;
  onUndo(): void;
};

export function UndoToast({ message, onUndo }: UndoToastProps) {
  return (
    <div className="toast absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-2 text-sm">
      <span>{message}</span>
      <button className="rounded-md px-2 py-1 text-xs font-medium text-[var(--accent)] hover:bg-[var(--accent-weak)]" onClick={onUndo}>
        {t("undo")}
      </button>
    </div>
  );
}
