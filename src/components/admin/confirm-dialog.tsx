import type { ReactNode } from "react";
import { AlertTriangle, Check, X } from "lucide-react";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive,
  children,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  children?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-3xl bg-card p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-start gap-3">
          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${destructive ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
            <AlertTriangle className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-lg">{title}</h2>
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
          </div>
        </div>
        {children && (
          <div className="mt-4 max-h-72 overflow-y-auto rounded-2xl bg-muted p-4 text-sm">{children}</div>
        )}
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button type="button" onClick={onCancel} className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold hover:bg-muted">
            <X className="h-4 w-4" /> {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ${destructive ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"}`}
          >
            <Check className="h-4 w-4" /> {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
