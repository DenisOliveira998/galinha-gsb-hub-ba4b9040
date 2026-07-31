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
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  images: string[];
  blocks: BlogBlock[];
}) {
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

      <h4 className="mt-3 font-display text-base">{title || "Título do post"}</h4>
      {excerpt && <p className="mt-1 text-sm text-muted-foreground">{excerpt}</p>}
      {content && (
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/90">{content}</p>
      )}

      {blocks.length > 0 && (
        <div className="mt-4 space-y-4">
          {blocks.map((b) =>
            b.type === "text" ? (
              b.text ? (
                <p key={b.id} className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                  {b.text}
                </p>
              ) : null
            ) : b.image ? (
              <img key={b.id} src={b.image} alt="" className="aspect-[16/9] w-full rounded-xl object-cover" />
            ) : null,
          )}
        </div>
      )}

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {images.map((img, i) => (
            <img key={i} src={img} alt="" className="aspect-[4/3] w-full rounded-xl object-cover" />
          ))}
        </div>
      )}
    </div>
  );
}