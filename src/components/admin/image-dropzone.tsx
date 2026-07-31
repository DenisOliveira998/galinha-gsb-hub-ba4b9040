import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Área de upload: clique para abrir o explorador de arquivos ou arraste e
 * solte imagens. As imagens ficam como data URL (mock) — ao conectar o
 * backend real, trocar por upload para storage.
 */
export function ImageDropzone({
  onFiles,
  multiple = true,
  label = "Clique para escolher ou arraste imagens aqui",
}: {
  onFiles: (dataUrls: string[]) => void;
  multiple?: boolean;
  label?: string;
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
      const urls = await Promise.all(files.map(fileToDataUrl));
      onFiles(multiple ? urls : urls.slice(0, 1));
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        void handleFiles(e.dataTransfer.files);
      }}
      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition ${
        dragging
          ? "border-primary bg-primary/10"
          : "border-border bg-background hover:border-primary/60 hover:bg-muted"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => void handleFiles(e.target.files)}
      />
      {busy ? (
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      ) : (
        <ImagePlus className="h-6 w-6 text-primary" />
      )}
      <span className="text-sm font-medium">{label}</span>
      <span className="text-xs text-muted-foreground">PNG, JPG ou WEBP</span>
    </div>
  );
}
