import type { FaqItem } from "@/lib/mock-store";

/** Pré-visualização ao vivo do anúncio, no mesmo formato da página pública. */
export function PostPreview({
  title,
  categoryLabel,
  description,
  price,
  status,
  images,
  faq,
}: {
  title?: string;
  categoryLabel?: string;
  description?: string;
  price?: string;
  status?: string;
  images?: string[];
  faq?: FaqItem[];
}) {
  const safeImages = Array.isArray(images) ? images.filter((image): image is string => typeof image === "string" && image.length > 0) : [];
  const safeFaq = Array.isArray(faq) ? faq.filter((item): item is FaqItem => Boolean(item && typeof item.question === "string" && typeof item.answer === "string")) : [];
  const cover = safeImages[0];
  const rest = safeImages.slice(1);
  const priceNum = price ? Number.parseFloat(price) : undefined;

  return (
    <div className="rounded-2xl bg-card p-4 text-left shadow-[var(--shadow-soft)]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-lg">Pré-visualização</h3>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          ao vivo
        </span>
      </div>

      {cover ? (
        <img src={cover} alt="" className="aspect-[4/3] w-full rounded-xl object-cover" />
      ) : (
        <div className="grid aspect-[4/3] w-full place-items-center rounded-xl bg-muted text-xs text-muted-foreground">
          Imagem da categoria será usada
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-secondary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-secondary-foreground">
          {categoryLabel || "Sem categoria"}
        </span>
        <span className="rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {status === "PUBLISHED" ? "Publicado" : status === "SOLD" ? "Vendido" : "Rascunho"}
        </span>
      </div>

      <h4 className="mt-2 line-clamp-2 font-display text-base">{title || "Título do anúncio"}</h4>
      {priceNum !== undefined && !Number.isNaN(priceNum) && (
        <p className="mt-1 text-sm font-semibold text-primary">
          {priceNum.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </p>
      )}
      {description && (
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
          {description}
        </p>
      )}

      {rest.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {rest.map((img, i) => (
            <img key={i} src={img} alt="" className="aspect-square w-full rounded-lg object-cover" />
          ))}
        </div>
      )}

      {safeFaq.some((f) => f.question.trim() || f.answer.trim()) && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Perguntas e respostas
          </p>
          {safeFaq
            .filter((f) => f.question.trim() || f.answer.trim())
            .map((f) => (
              <div key={f.id} className="rounded-xl bg-muted p-3">
                <p className="text-sm font-semibold">{f.question || "—"}</p>
                {f.answer && <p className="mt-1 text-sm text-muted-foreground">{f.answer}</p>}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}