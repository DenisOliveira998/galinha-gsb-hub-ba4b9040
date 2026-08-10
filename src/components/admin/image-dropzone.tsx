import { useRef, useState } from "react";
import { ImagePlus, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/upload";

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/** Comprime antes de enviar ao Vercel Blob: máx 1920px, WebP 78%. */
async function compressImage(file: File): Promise<string> {
  const dataUrl = await fileToDataUrl(file);
  if (typeof document === "undefined") return dataUrl;
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = dataUrl;
    });
    const max = 1920;
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return dataUrl;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const webp = canvas.toDataURL("image/webp", 0.78);
    const out = webp.startsWith("data:image/webp")
      ? webp
      : canvas.toDataURL("image/jpeg", 0.75);
    return out.length < dataUrl.length ? out : dataUrl;
  } catch {
    return dataUrl;
  }
}

export function ImageDropzone({
  onFiles,
  multiple = true,
  label = "Clique para escolher ou arraste imagens aqui",
  variant = "box",
}: {
  onFiles: (urls: string[]) => void;
  multiple?: boolean;
  label?: string;
  variant?: "box" | "plus";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleFiles = async (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const files = Array.from(list).filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;
    setBusy(true);
    try {
      const urls = await Promise.all(
        files.map(async (file) => {
          const base64 = await compressImage(file);
          const result = await uploadImage({ data: { base64, filename: file.name } });
          return result.url;
        }),
      );
      onFiles(multiple ? urls : urls.slice(0, 1));
    } catch (err) {
      toast.error("Erro ao fazer upload da imagem", {
        description: err instanceof Error ? err.message : "Tente novamente.",
      });
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      accept="image/*"
      multiple={multiple}
      className="hidden"
      onChange={(e) => void handleFiles(e.target.files)}
    />
  );

  if (variant === "plus") {
    return (
      <>
        {fileInput}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition hover:brightness-105 disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          {busy ? "Enviando…" : label}
        </button>
      </>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => !busy && inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!busy) inputRef.current?.click();
        }
      }}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); void handleFiles(e.dataTransfer.files); }}
      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition ${
        dragging ? "border-primary bg-primary/10" : "border-border bg-background hover:border-primary/60 hover:bg-muted"
      } ${busy ? "pointer-events-none opacity-60" : ""}`}
    >
      {fileInput}
      {busy ? (
        <>
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-sm font-medium">Enviando para Vercel Blob…</span>
        </>
      ) : (
        <>
          <ImagePlus className="h-6 w-6 text-primary" />
          <span className="text-sm font-medium">{label}</span>
          <span className="text-xs text-muted-foreground">PNG, JPG ou WEBP</span>
        </>
      )}
    </div>
  );
}
