import { useEffect } from "react";
import { Images, X } from "lucide-react";
import { useStore } from "@/lib/mock-store";
import { PreviewBoundary, SafeImagePreview } from "./preview-boundary";

/**
 * Popup com a grade do Estoque de imagens. O admin clica numa imagem e ela é
 * aplicada diretamente no campo que abriu o popup.
 */
export function MediaPickerDialog({
  open,
  onClose,
  onSelect,
  title = "Estoque de imagens",
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (image: string) => void;
  title?: string;
}) {
  const library = useStore((s) => s.mediaLibrary) ?? [];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative z-10 flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)]"
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="flex items-center gap-2 font-display text-lg">
            <Images className="h-4 w-4" /> {title}
          </h2>
          <button type="button" onClick={onClose} aria-label="Fechar" className="rounded-lg border p-1.5">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-y-auto p-5">
          {library.length === 0 ? (
            <p className="rounded-xl bg-muted p-6 text-center text-sm text-muted-foreground">
              Nenhuma imagem no estoque ainda. Envie imagens em “Mídia do Site”.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {library.map((img) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => {
                    onSelect(img);
                    onClose();
                  }}
                  className="overflow-hidden rounded-xl border transition hover:ring-2 hover:ring-primary"
                  title="Usar esta imagem"
                >
                  <PreviewBoundary>
                    <SafeImagePreview src={img} alt="Imagem do estoque" className="h-24 w-full object-cover" />
                    <span hidden className="h-24 w-full bg-muted p-2 text-xs text-muted-foreground">Imagem indisponível</span>
                  </PreviewBoundary>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}