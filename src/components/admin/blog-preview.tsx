import type { BlogBlock } from "@/lib/mock-store";

/** Pré-visualização ao vivo do post, no mesmo formato da página pública. */
export function BlogPreview({
  title,
  excerpt,
  content,
  coverImage,
  images,
  blocks,
}: {
  title?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  images?: string[];
  blocks?: BlogBlock[];
}) {
  const safeImages = Array.isArray(images) ? images.filter((image): image is string => typeof image === "string" && image.length > 0) : [];
  const safeBlocks = Array.isArray(blocks) ? blocks.filter((block): block is BlogBlock => Boolean(block && typeof block.id === "string")) : [];
  return (
    <div className="rounded-2xl bg-card p-4 text-left shadow-[var(--shadow-soft)]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-lg">Pré-visualização</h3>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          ao vivo
        </span>
      </div>

      {coverImage ? (
        <img src={coverImage} alt="" className="aspect-[16/9] w-full rounded-xl object-cover" />
      ) : (
        <div className="grid aspect-[16/9] w-full place-items-center rounded-xl bg-muted text-xs text-muted-foreground">
          Sem capa
        </div>
      )}

      {title ? (
        <h4
          className="mt-3 font-display text-base text-foreground"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      ) : (
        <h4 className="mt-3 font-display text-base text-muted-foreground">Título do post</h4>
      )}

      {excerpt && (
        <div
          className="prose prose-sm mt-1 max-w-none text-muted-foreground [&_*]:text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: excerpt }}
        />
      )}

      {content && (
        <div
          className="prose prose-sm mt-3 max-w-none text-foreground/90 [&_*]:color-inherit"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}

      {safeBlocks.length > 0 && (
        <div className="mt-4 space-y-4">
          {safeBlocks.map((b) =>
            b.type === "text" ? (
              b.text ? (
                <div
                  key={b.id}
                  className="prose prose-sm max-w-none text-foreground/90"
                  dangerouslySetInnerHTML={{ __html: b.text }}
                />
              ) : null
            ) : b.image ? (
              <img key={b.id} src={b.image} alt="" className="aspect-[16/9] w-full rounded-xl object-cover" />
            ) : null,
          )}
        </div>
      )}

      {safeImages.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {safeImages.map((img, i) => (
            <img key={i} src={img} alt="" className="aspect-[4/3] w-full rounded-xl object-cover" />
          ))}
        </div>
      )}

      {/* Estilos para tabelas do TipTap dentro da preview */}
      <style>{`
        .prose table{border-collapse:collapse;width:100%;margin:.5rem 0}
        .prose th,.prose td{border:1px solid var(--color-border);padding:.4rem .6rem;text-align:left;font-size:.85rem}
        .prose th{background:var(--color-muted);font-weight:600}
        .prose a{color:var(--color-primary)}
        .prose img{border-radius:.75rem}
      `}</style>
    </div>
  );
}
